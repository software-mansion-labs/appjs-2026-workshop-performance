import CoreMotion
import Foundation

final class EngagementActivitySource {
  private let activityManager = CMMotionActivityManager()
  private var active = false

  #if targetEnvironment(simulator)
  private var fakeTimer: DispatchSourceTimer?
  private static let fakeRotation: [ActivityType] = [
    .walking, .cycling, .stationary, .running, .automotive
  ]
  private static let fakePhaseDurationMs: Int64 = 10_000
  #endif

  func start(onSample: @escaping (EngagementSample) -> Void) {
    if active { return }

    #if targetEnvironment(simulator)
    active = true
    EngagementLog.info("Simulator detected — motion activity will be faked (rotating walking/cycling/stationary/running/automotive every \(Self.fakePhaseDurationMs / 1000)s)")
    let timer = DispatchSource.makeTimerSource(queue: .main)
    let interval = DispatchTimeInterval.milliseconds(Int(Config.activityUpdateIntervalMs))
    timer.schedule(deadline: .now() + interval, repeating: interval)
    timer.setEventHandler {
      let nowMs = Int64(Date().timeIntervalSince1970 * 1000)
      let phase = Int(nowMs / Self.fakePhaseDurationMs % Int64(Self.fakeRotation.count))
      let sample = EngagementSample(
        timestampMs: nowMs,
        activity: Self.fakeRotation[phase],
        confidence: .high,
        scrollVelocity: 0
      )
      onSample(sample)
    }
    timer.resume()
    fakeTimer = timer
    #else
    guard CMMotionActivityManager.isActivityAvailable() else { return }
    active = true

    activityManager.startActivityUpdates(to: .main) { activity in
      guard let activity = activity else { return }
      let sample = EngagementSample(
        timestampMs: Int64(Date().timeIntervalSince1970 * 1000),
        activity: Self.mapActivity(activity),
        confidence: Self.mapConfidence(activity.confidence),
        scrollVelocity: 0
      )
      onSample(sample)
    }
    #endif
  }

  func stop() {
    if !active { return }
    #if targetEnvironment(simulator)
    fakeTimer?.cancel()
    fakeTimer = nil
    #else
    activityManager.stopActivityUpdates()
    #endif
    active = false
  }

  private static func mapActivity(_ activity: CMMotionActivity) -> ActivityType {
    if activity.stationary { return .stationary }
    if activity.walking { return .walking }
    if activity.running { return .running }
    if activity.automotive { return .automotive }
    if activity.cycling { return .cycling }
    return .unknown
  }

  private static func mapConfidence(_ value: CMMotionActivityConfidence) -> Confidence {
    switch value {
    case .low: return .low
    case .medium: return .medium
    case .high: return .high
    @unknown default: return .low
    }
  }
}
