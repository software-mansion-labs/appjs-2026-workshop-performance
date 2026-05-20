import Foundation

final class EngagementSessionTracker {
  private final class SessionClock {
    var accumulatedMs: Int64 = 0
    var currentStartMs: Int64? = nil
  }

  private var activeSessions: [String: Int] = [:]
  private var sessionClocks: [String: SessionClock] = [:]
  private var tracking: Bool = false

  private let clock: () -> Int64

  init(clock: @escaping () -> Int64 = { Int64(Date().timeIntervalSince1970 * 1000) }) {
    self.clock = clock
  }

  func startSession(_ postId: String) {
    activeSessions[postId, default: 0] += 1
    if sessionClocks[postId] == nil {
      sessionClocks[postId] = SessionClock()
    }
    if tracking && sessionClocks[postId]!.currentStartMs == nil {
      sessionClocks[postId]!.currentStartMs = clock()
    }
  }

  func stopSession(_ postId: String) {
    guard let current = activeSessions[postId] else { return }
    if current <= 1 {
      activeSessions.removeValue(forKey: postId)
      if let sc = sessionClocks[postId], let start = sc.currentStartMs {
        sc.accumulatedMs += clock() - start
        sc.currentStartMs = nil
      }
    } else {
      activeSessions[postId] = current - 1
    }
  }

  func isActive(_ postId: String) -> Bool {
    return activeSessions[postId] != nil
  }

  func activePostIds() -> Set<String> {
    return Set(activeSessions.keys)
  }

  func snapshotTimeMs(_ postId: String) -> Int64 {
    guard let sc = sessionClocks[postId] else { return 0 }
    let activeMs: Int64 = sc.currentStartMs.map { clock() - $0 } ?? 0
    return sc.accumulatedMs + activeMs
  }

  func pauseAll() {
    tracking = false
    let now = clock()
    for sc in sessionClocks.values {
      if let start = sc.currentStartMs {
        sc.accumulatedMs += now - start
        sc.currentStartMs = nil
      }
    }
  }

  func resumeAll() {
    tracking = true
    let now = clock()
    for postId in activeSessions.keys {
      if sessionClocks[postId] == nil {
        sessionClocks[postId] = SessionClock()
      }
      if sessionClocks[postId]!.currentStartMs == nil {
        sessionClocks[postId]!.currentStartMs = now
      }
    }
  }

  func seed(_ postId: String, accumulatedMs: Int64) {
    if sessionClocks[postId] == nil {
      sessionClocks[postId] = SessionClock()
    }
    sessionClocks[postId]!.accumulatedMs = accumulatedMs
  }

  func resetAccumulated() {
    let now = clock()
    for sc in sessionClocks.values {
      sc.accumulatedMs = 0
      if sc.currentStartMs != nil {
        sc.currentStartMs = now
      }
    }
  }

  func clear() {
    activeSessions.removeAll()
    sessionClocks.removeAll()
  }
}
