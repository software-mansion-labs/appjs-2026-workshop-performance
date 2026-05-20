package expo.modules.engagement

data class EngagementSample(
  val timestampMs: Long,
  val activity: ActivityType,
  val confidence: Confidence,
  val scrollVelocity: Float
)
