import Foundation

final class EngagementPersistence {

  private let defaults: UserDefaults
  private var aggregates: [String: PostEngagementAggregate] = [:]

  init() {
    self.defaults = UserDefaults(suiteName: Config.userDefaultsSuiteName) ?? .standard
  }

  func load() {
    aggregates.removeAll()
    guard let data = defaults.data(forKey: Config.keyAggregates) else { return }
    if let decoded = try? JSONDecoder().decode([String: PostEngagementAggregate].self, from: data) {
      aggregates = decoded
    }
  }

  func all() -> [String: PostEngagementAggregate] {
    return aggregates
  }

  func get(_ postId: String) -> PostEngagementAggregate? {
    return aggregates[postId]
  }

  func put(_ postId: String, _ aggregate: PostEngagementAggregate) {
    aggregates[postId] = aggregate
  }

  func isEnabled() -> Bool {
    return defaults.bool(forKey: Config.keyEnabled)
  }

  func setEnabled(_ value: Bool) {
    defaults.set(value, forKey: Config.keyEnabled)
  }

  func writeToDisk() {
    if let data = try? JSONEncoder().encode(aggregates) {
      defaults.set(data, forKey: Config.keyAggregates)
    }
  }

  func clear() {
    aggregates.removeAll()
    defaults.removeObject(forKey: Config.keyAggregates)
  }

  static func toJsMap(_ aggregate: PostEngagementAggregate) -> [String: Any] {
    return [
      "postId": aggregate.postId,
      "totalTimeMs": aggregate.totalTimeMs,
      "activityBreakdown": [
        "stationary": aggregate.activityBreakdown.stationary,
        "walking": aggregate.activityBreakdown.walking,
        "running": aggregate.activityBreakdown.running,
        "automotive": aggregate.activityBreakdown.automotive,
        "cycling": aggregate.activityBreakdown.cycling,
        "unknown": aggregate.activityBreakdown.unknown
      ] as [String: Any],
      "avgScrollVelocity": aggregate.avgScrollVelocity,
      "peakScrollVelocity": aggregate.peakScrollVelocity,
      "sampleCount": aggregate.sampleCount,
      "firstSeenAt": aggregate.firstSeenAt,
      "lastSeenAt": aggregate.lastSeenAt
    ]
  }
}
