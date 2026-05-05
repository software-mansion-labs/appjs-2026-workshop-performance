import os

enum EngagementLog {
  private static let logger = Logger(subsystem: "com.engagement", category: "module")

  static func info(_ msg: String) {
    logger.info("[Engagement] \(msg, privacy: .public)")
  }
}
