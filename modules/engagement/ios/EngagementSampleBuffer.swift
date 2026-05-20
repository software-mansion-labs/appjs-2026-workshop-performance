import Foundation

final class EngagementSampleBuffer {
  private var store: [String: [EngagementSample]] = [:]

  func ensureKey(_ postId: String) {
    if store[postId] == nil {
      store[postId] = []
    }
  }

  func append(_ postId: String, _ sample: EngagementSample) {
    if store[postId] == nil {
      store[postId] = []
    }
    store[postId]?.append(sample)
  }

  func appendToAll(_ postIds: Set<String>, _ sample: EngagementSample) {
    for postId in postIds {
      append(postId, sample)
    }
  }

  func snapshot() -> [String: [EngagementSample]] {
    return store
  }

  func clearFor(_ postId: String) {
    store.removeValue(forKey: postId)
  }

  func clearAll() {
    store.removeAll()
  }
}
