import ExpoModulesCore

public class EngagementModule: Module {

  private let sampleBuffer = EngagementSampleBuffer()
  private let sessionTracker = EngagementSessionTracker()
  private var persistence: EngagementPersistence?
  private var enabled: Bool = false

  private let workQueue = DispatchQueue(
    label: "com.engagement.work",
    qos: .userInitiated
  )

  private let permissions = EngagementPermissions()
  private let activitySource = EngagementActivitySource()

  private var flushTimer: DispatchSourceTimer?

  public func definition() -> ModuleDefinition {
    Name("Engagement")

    OnCreate {
      self.workQueue.async {
        let store = EngagementPersistence()
        store.load()
        self.persistence = store

        for (postId, aggregate) in store.all() {
          self.sessionTracker.seed(postId, accumulatedMs: aggregate.totalTimeMs)
        }

        self.enabled = store.isEnabled()
        if self.enabled { self.resumeCollection() }
      }
    }

    OnDestroy {
      self.activitySource.stop()
      self.stopFlushLoop()
      self.workQueue.async {
        self.persistence?.writeToDisk()
        self.sampleBuffer.clearAll()
        self.sessionTracker.clear()
      }
    }

    OnAppEntersBackground {
      self.workQueue.async { self.pauseCollection() }
    }

    OnAppEntersForeground {
      self.workQueue.async { self.resumeCollection() }
    }

    AsyncFunction("setEnabled") { (value: Bool, promise: Promise) in
      self.workQueue.async {
        if value == self.enabled {
          promise.resolve(nil)
          return
        }
        if value {
          self.permissions.ensureGranted { granted in
            self.workQueue.async {
              if !granted {
                promise.reject("permission_denied", "Motion permission denied")
                return
              }
              self.enabled = true
              self.persistence?.setEnabled(true)
              self.startCollection()
              EngagementLog.info("setEnabled(true) — active sessions: \(self.sessionTracker.activePostIds())")
              promise.resolve(nil)
            }
          }
        } else {
          EngagementLog.info("setEnabled(false) — collection paused, data preserved (\(self.sessionTracker.activePostIds().count) session(s) tracked)")
          self.disableCollection()
          promise.resolve(nil)
        }
      }
    }

    AsyncFunction("isEnabled") { (promise: Promise) in
      self.workQueue.async {
        promise.resolve(self.enabled)
      }
    }

    Function("startSession") { (postId: String, source: String) -> Void in
      self.workQueue.async {
        EngagementLog.info("startSession[\(source)] \(postId)")
        self.sessionTracker.startSession(postId)
        self.sampleBuffer.ensureKey(postId)
      }
    }

    Function("stopSession") { (postId: String, source: String) -> Void in
      self.workQueue.async {
        EngagementLog.info("stopSession[\(source)]  \(postId)")
        self.sessionTracker.stopSession(postId)
      }
    }

    Function("recordScrollSample") { (postId: String, velocity: Double) -> Void in
      self.workQueue.async {
        guard self.enabled else { return }
        guard self.sessionTracker.isActive(postId) else { return }
        let sample = EngagementSample(
          timestampMs: Int64(Date().timeIntervalSince1970 * 1000),
          activity: .unknown,
          confidence: .low,
          scrollVelocity: Float(velocity)
        )
        self.sampleBuffer.append(postId, sample)
      }
    }

    AsyncFunction("getTopPosts") { (limit: Int, promise: Promise) in
      self.workQueue.async {
        guard let store = self.persistence else {
          promise.resolve([])
          return
        }
        let sorted = store.all().values
          .sorted { $0.totalTimeMs > $1.totalTimeMs }
          .prefix(max(0, limit))
          .map { EngagementPersistence.toJsMap($0) }
        promise.resolve(Array(sorted))
      }
    }

    AsyncFunction("getStats") { (postId: String, promise: Promise) in
      self.workQueue.async {
        let aggregate = self.persistence?.get(postId)
        promise.resolve(aggregate.map { EngagementPersistence.toJsMap($0) })
      }
    }

    AsyncFunction("getAllStats") { (promise: Promise) in
      self.workQueue.async {
        guard let store = self.persistence else {
          promise.resolve([])
          return
        }
        let all = store.all().values.map { EngagementPersistence.toJsMap($0) }
        promise.resolve(all)
      }
    }

    AsyncFunction("clearStats") { (promise: Promise) in
      self.workQueue.async {
        self.sampleBuffer.clearAll()
        self.sessionTracker.resetAccumulated()
        self.persistence?.clear()
        promise.resolve(nil)
      }
    }
  }

  private func beginActivityCollection() {
    self.activitySource.start { [weak self] sample in
      guard let self = self else { return }
      self.workQueue.async {
        self.sampleBuffer.appendToAll(self.sessionTracker.activePostIds(), sample)
      }
    }
  }

  private func startCollection() {
    self.sessionTracker.resumeAll()
    self.beginActivityCollection()
    self.startFlushLoop()
  }

  private func stopCollection() {
    self.flush()
    self.sessionTracker.pauseAll()
    self.activitySource.stop()
    self.stopFlushLoop()
  }

  private func disableCollection() {
    self.stopCollection()
    self.enabled = false
    self.persistence?.setEnabled(false)
    self.sampleBuffer.clearAll()
  }

  private func pauseCollection() {
    guard self.enabled else { return }
    EngagementLog.info("pauseCollection (app background) — clocks frozen, data preserved")
    self.stopCollection()
  }

  private func resumeCollection() {
    guard self.enabled else { return }
    guard self.permissions.isGranted() else {
      EngagementLog.info("resumeCollection — permission revoked while in background, disabling")
      self.disableCollection()
      return
    }
    EngagementLog.info("resumeCollection (app foreground) — restarting clocks for \(self.sessionTracker.activePostIds().count) session(s)")
    self.startCollection()
  }

  private func startFlushLoop() {
    if flushTimer != nil { return }
    let timer = DispatchSource.makeTimerSource(queue: workQueue)
    let interval = DispatchTimeInterval.milliseconds(Int(Config.flushIntervalMs))
    timer.schedule(deadline: .now() + interval, repeating: interval)
    timer.setEventHandler { [weak self] in
      self?.flush()
    }
    timer.resume()
    flushTimer = timer
  }

  private func stopFlushLoop() {
    flushTimer?.cancel()
    flushTimer = nil
  }

  private func flush() {
    guard let store = persistence else { return }
    for (postId, samples) in sampleBuffer.snapshot() {
      let totalTimeMs = sessionTracker.snapshotTimeMs(postId)
      guard let partial = EngagementAggregator.aggregate(postId: postId, samples: samples, totalTimeMs: totalTimeMs) else { continue }
      let merged = EngagementAggregator.merge(store.get(postId), partial)
      store.put(postId, merged)
    }
    sampleBuffer.clearAll()
    store.writeToDisk()
  }
}
