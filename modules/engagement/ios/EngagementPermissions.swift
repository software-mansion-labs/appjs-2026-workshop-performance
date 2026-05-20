import CoreMotion
import Foundation

final class EngagementPermissions {
  private let probeManager = CMMotionActivityManager()

  func isGranted() -> Bool {
    #if targetEnvironment(simulator)
    return true
    #else
    return CMMotionActivityManager.authorizationStatus() == .authorized
    #endif
  }

  func ensureGranted(completion: @escaping (Bool) -> Void) {
    #if targetEnvironment(simulator)
    completion(true)
    return
    #else
    guard CMMotionActivityManager.isActivityAvailable() else {
      completion(false)
      return
    }
    let status = CMMotionActivityManager.authorizationStatus()
    switch status {
    case .authorized:
      completion(true)
    case .denied, .restricted:
      completion(false)
    case .notDetermined:
      let now = Date()
      probeManager.queryActivityStarting(
        from: now.addingTimeInterval(-1),
        to: now,
        to: .main
      ) { _, _ in
        completion(CMMotionActivityManager.authorizationStatus() == .authorized)
      }
    @unknown default:
      completion(false)
    }
    #endif
  }
}
