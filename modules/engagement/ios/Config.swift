import Foundation

enum Config {
  static let flushIntervalMs: Int64 = 5_000
  static let activityUpdateIntervalMs: Int64 = 1_000

  static let userDefaultsSuiteName: String = "expo.modules.engagement"
  static let keyAggregates: String = "aggregates"
  static let keyEnabled: String = "enabled"

  static let logTag: String = "Engagement"
}
