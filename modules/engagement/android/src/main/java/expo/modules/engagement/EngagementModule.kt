package expo.modules.engagement

import android.content.Context
import expo.modules.kotlin.Promise
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.util.concurrent.Executors
import java.util.concurrent.ScheduledExecutorService
import java.util.concurrent.ScheduledFuture
import java.util.concurrent.TimeUnit

class EngagementModule : Module() {

  private val sampleBuffer = EngagementSampleBuffer()
  private val sessionTracker = EngagementSessionTracker()
  private var persistence: EngagementPersistence? = null
  private var enabled = false

  private val workExecutor = Executors.newSingleThreadExecutor { r ->
    Thread(r, "Engagement-work")
  }
  private val scheduler: ScheduledExecutorService = Executors.newSingleThreadScheduledExecutor { r ->
    Thread(r, "Engagement-flush")
  }
  private var flushTask: ScheduledFuture<*>? = null

  private val permissions = EngagementPermissions { appContext.permissions }
  private val activitySource = EngagementActivitySource {
    appContext.reactContext?.applicationContext
  }

  private val context: Context
    get() = appContext.reactContext
      ?: throw IllegalStateException("Engagement: react context unavailable")

  override fun definition() = ModuleDefinition {
    Name("Engagement")

    OnCreate {
      workExecutor.execute {
        val store = EngagementPersistence(context.applicationContext)
        store.load()
        persistence = store

        for ((postId, aggregate) in store.all()) {
          sessionTracker.seed(postId, aggregate.totalTimeMs)
        }

        enabled = store.isEnabled()
        if (enabled) resumeCollection()
      }
    }

    OnDestroy {
      activitySource.stop()
      stopFlushLoop()
      workExecutor.execute {
        persistence?.writeToDisk()
        sampleBuffer.clearAll()
        sessionTracker.clear()
      }
      scheduler.shutdown()
      workExecutor.shutdown()
    }

    OnActivityEntersBackground {
      workExecutor.execute { pauseCollection() }
    }

    OnActivityEntersForeground {
      workExecutor.execute { resumeCollection() }
    }

    AsyncFunction("setEnabled") { value: Boolean, promise: Promise ->
      workExecutor.execute {
        if (value == enabled) {
          promise.resolve(null)
          return@execute
        }
        if (value) {
          permissions.ensureGranted { granted ->
            workExecutor.execute {
              if (!granted) {
                promise.reject("permission_denied", "Activity recognition permission denied", null)
                return@execute
              }
              enabled = true
              persistence?.setEnabled(true)
              startCollection()
              EngagementLog.info("setEnabled(true) — active sessions: ${sessionTracker.activePostIds()}")
              promise.resolve(null)
            }
          }
        } else {
          EngagementLog.info("setEnabled(false) — collection paused, data preserved (${sessionTracker.activePostIds().size} session(s) tracked)")
          disableCollection()
          promise.resolve(null)
        }
      }
    }

    AsyncFunction("isEnabled") { promise: Promise ->
      workExecutor.execute {
        promise.resolve(enabled)
      }
    }

    Function("startSession") { postId: String, source: String ->
      workExecutor.execute {
        EngagementLog.info("startSession[$source] $postId")
        sessionTracker.startSession(postId)
        sampleBuffer.ensureKey(postId)
      }
    }

    Function("stopSession") { postId: String, source: String ->
      workExecutor.execute {
        EngagementLog.info("stopSession[$source]  $postId")
        sessionTracker.stopSession(postId)
      }
    }

    Function("recordScrollSample") { postId: String, velocity: Double ->
      workExecutor.execute {
        if (!enabled) return@execute
        if (!sessionTracker.isActive(postId)) return@execute
        val sample = EngagementSample(
          timestampMs = System.currentTimeMillis(),
          activity = ActivityType.UNKNOWN,
          confidence = Confidence.LOW,
          scrollVelocity = velocity.toFloat()
        )
        sampleBuffer.append(postId, sample)
      }
    }

    AsyncFunction("getTopPosts") { limit: Int, promise: Promise ->
      workExecutor.execute {
        val store = persistence
        if (store == null) {
          promise.resolve(emptyList<Map<String, Any>>())
          return@execute
        }
        val sorted = store.all().values
          .sortedByDescending { it.totalTimeMs }
          .take(limit.coerceAtLeast(0))
          .map { EngagementPersistence.toJsMap(it) }
        promise.resolve(sorted)
      }
    }

    AsyncFunction("getStats") { postId: String, promise: Promise ->
      workExecutor.execute {
        val aggregate = persistence?.get(postId)
        promise.resolve(aggregate?.let { EngagementPersistence.toJsMap(it) })
      }
    }

    AsyncFunction("getAllStats") { promise: Promise ->
      workExecutor.execute {
        val store = persistence
        if (store == null) {
          promise.resolve(emptyList<Map<String, Any>>())
          return@execute
        }
        val all = store.all().values.map { EngagementPersistence.toJsMap(it) }
        promise.resolve(all)
      }
    }

    AsyncFunction("clearStats") { promise: Promise ->
      workExecutor.execute {
        sampleBuffer.clearAll()
        sessionTracker.resetAccumulated()
        persistence?.clear()
        promise.resolve(null)
      }
    }
  }

  private fun beginActivityCollection() {
    activitySource.start { sample ->
      workExecutor.execute {
        sampleBuffer.appendToAll(sessionTracker.activePostIds(), sample)
      }
    }
  }

  private fun startCollection() {
    sessionTracker.resumeAll()
    beginActivityCollection()
    startFlushLoop()
  }

  private fun stopCollection() {
    flush()
    sessionTracker.pauseAll()
    activitySource.stop()
    stopFlushLoop()
  }

  private fun disableCollection() {
    stopCollection()
    enabled = false
    persistence?.setEnabled(false)
    sampleBuffer.clearAll()
  }

  private fun pauseCollection() {
    if (!enabled) return
    EngagementLog.info("pauseCollection (app background) — clocks frozen, data preserved")
    stopCollection()
  }

  private fun resumeCollection() {
    if (!enabled) return
    if (!permissions.isGranted()) {
      EngagementLog.info("resumeCollection — permission revoked while in background, disabling")
      disableCollection()
      return
    }
    EngagementLog.info("resumeCollection (app foreground) — restarting clocks for ${sessionTracker.activePostIds().size} session(s)")
    startCollection()
  }

  private fun startFlushLoop() {
    if (flushTask != null) return
    flushTask = scheduler.scheduleAtFixedRate(
      { workExecutor.execute { flush() } },
      Config.FLUSH_INTERVAL_MS,
      Config.FLUSH_INTERVAL_MS,
      TimeUnit.MILLISECONDS
    )
  }

  private fun stopFlushLoop() {
    flushTask?.cancel(false)
    flushTask = null
  }

  private fun flush() {
    val store = persistence ?: return
    val snapshot = sampleBuffer.snapshot()
    for ((postId, samples) in snapshot) {
      val totalTimeMs = sessionTracker.snapshotTimeMs(postId)
      val partial = EngagementAggregator.aggregate(postId, samples, totalTimeMs) ?: continue
      val merged = EngagementAggregator.merge(store.get(postId), partial)
      store.put(postId, merged)
    }
    store.writeToDisk()
  }
}
