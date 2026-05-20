package expo.modules.engagement

import android.Manifest
import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.content.pm.PackageManager
import android.os.Build
import androidx.core.content.ContextCompat
import com.google.android.gms.location.ActivityRecognition
import com.google.android.gms.location.ActivityRecognitionResult
import com.google.android.gms.location.DetectedActivity
import java.util.concurrent.Executors
import java.util.concurrent.ScheduledExecutorService
import java.util.concurrent.TimeUnit

class EngagementActivitySource(
  private val contextProvider: () -> Context?
) {
  private var receiver: BroadcastReceiver? = null
  private var pendingIntent: PendingIntent? = null
  private var fakeExecutor: ScheduledExecutorService? = null

  fun start(onSample: (EngagementSample) -> Unit) {
    if (Environment.isEmulator) {
      startFakeSource(onSample)
      return
    }
    val ctx = contextProvider() ?: return
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
      val granted = ContextCompat.checkSelfPermission(
        ctx, Manifest.permission.ACTIVITY_RECOGNITION
      ) == PackageManager.PERMISSION_GRANTED
      if (!granted) return
    }
    if (pendingIntent != null) return

    val rcv = object : BroadcastReceiver() {
      override fun onReceive(context: Context, intent: Intent) {
        if (!ActivityRecognitionResult.hasResult(intent)) return
        val result = ActivityRecognitionResult.extractResult(intent) ?: return
        val detected = result.mostProbableActivity
        val sample = EngagementSample(
          timestampMs = System.currentTimeMillis(),
          activity = mapDetectedActivity(detected.type),
          confidence = Confidence.fromPercent(detected.confidence),
          scrollVelocity = 0f
        )
        onSample(sample)
      }
    }
    val filter = IntentFilter(INTENT_ACTION)
    val flags = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
      Context.RECEIVER_NOT_EXPORTED
    } else {
      0
    }
    ctx.registerReceiver(rcv, filter, flags)
    receiver = rcv

    val intent = Intent(INTENT_ACTION).setPackage(ctx.packageName)
    val piFlags = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
      PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_MUTABLE
    } else {
      PendingIntent.FLAG_UPDATE_CURRENT
    }
    val pi = PendingIntent.getBroadcast(ctx, 0, intent, piFlags)
    pendingIntent = pi

    runCatching {
      ActivityRecognition.getClient(ctx)
        .requestActivityUpdates(Config.ACTIVITY_UPDATE_INTERVAL_MS, pi)
    }
  }

  fun stop() {
    fakeExecutor?.shutdownNow()
    fakeExecutor = null
    val ctx = contextProvider()
    pendingIntent?.let { pi ->
      if (ctx != null) {
        runCatching { ActivityRecognition.getClient(ctx).removeActivityUpdates(pi) }
      }
    }
    pendingIntent = null
    receiver?.let { rcv ->
      if (ctx != null) {
        runCatching { ctx.unregisterReceiver(rcv) }
      }
    }
    receiver = null
  }

  private fun startFakeSource(onSample: (EngagementSample) -> Unit) {
    if (fakeExecutor != null) return
    EngagementLog.info(
      "Emulator detected — motion activity will be faked (rotating walking/cycling/stationary/running/automotive every ${FAKE_PHASE_DURATION_MS / 1000}s)"
    )
    val executor = Executors.newSingleThreadScheduledExecutor { r ->
      Thread(r, "Engagement-fake-activity")
    }
    executor.scheduleAtFixedRate({
      val phase = (System.currentTimeMillis() / FAKE_PHASE_DURATION_MS % FAKE_ROTATION.size).toInt()
      val sample = EngagementSample(
        timestampMs = System.currentTimeMillis(),
        activity = FAKE_ROTATION[phase],
        confidence = Confidence.HIGH,
        scrollVelocity = 0f
      )
      onSample(sample)
    }, Config.ACTIVITY_UPDATE_INTERVAL_MS, Config.ACTIVITY_UPDATE_INTERVAL_MS, TimeUnit.MILLISECONDS)
    fakeExecutor = executor
  }

  private fun mapDetectedActivity(type: Int): ActivityType = when (type) {
    DetectedActivity.STILL -> ActivityType.STATIONARY
    DetectedActivity.WALKING, DetectedActivity.ON_FOOT -> ActivityType.WALKING
    DetectedActivity.RUNNING -> ActivityType.RUNNING
    DetectedActivity.IN_VEHICLE -> ActivityType.AUTOMOTIVE
    DetectedActivity.ON_BICYCLE -> ActivityType.CYCLING
    else -> ActivityType.UNKNOWN
  }

  companion object {
    private const val INTENT_ACTION = "expo.modules.engagement.ACTIVITY_DETECTED"
    private const val FAKE_PHASE_DURATION_MS = 10_000L
    private val FAKE_ROTATION = listOf(
      ActivityType.WALKING,
      ActivityType.CYCLING,
      ActivityType.STATIONARY,
      ActivityType.RUNNING,
      ActivityType.AUTOMOTIVE
    )
  }
}
