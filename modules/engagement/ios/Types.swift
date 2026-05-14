import Foundation

enum ActivityType: String, Codable {
  case stationary
  case walking
  case running
  case automotive
  case cycling
  case unknown

  static func fromRaw(_ raw: String?) -> ActivityType {
    return ActivityType(rawValue: raw ?? "") ?? .unknown
  }
}

enum Confidence: String, Codable {
  case low
  case medium
  case high

  static func fromRaw(_ raw: String?) -> Confidence {
    return Confidence(rawValue: raw ?? "") ?? .low
  }
}

struct ActivityBreakdown: Codable {
  var stationary: Int64 = 0
  var walking: Int64 = 0
  var running: Int64 = 0
  var automotive: Int64 = 0
  var cycling: Int64 = 0
  var unknown: Int64 = 0

  mutating func add(_ type: ActivityType, ms: Int64) {
    switch type {
    case .stationary: stationary += ms
    case .walking: walking += ms
    case .running: running += ms
    case .automotive: automotive += ms
    case .cycling: cycling += ms
    case .unknown: unknown += ms
    }
  }

  mutating func merge(_ other: ActivityBreakdown) {
    stationary += other.stationary
    walking += other.walking
    running += other.running
    automotive += other.automotive
    cycling += other.cycling
    unknown += other.unknown
  }
}

struct PostEngagementAggregate: Codable {
  let postId: String
  var totalTimeMs: Int64
  var activityBreakdown: ActivityBreakdown
  var avgScrollVelocity: Double
  var peakScrollVelocity: Double
  var sampleCount: Int64
  var firstSeenAt: Int64
  var lastSeenAt: Int64
}
