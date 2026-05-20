package expo.modules.engagement

enum class ActivityType(val raw: String) {
  STATIONARY("stationary"),
  WALKING("walking"),
  RUNNING("running"),
  AUTOMOTIVE("automotive"),
  CYCLING("cycling"),
  UNKNOWN("unknown");

  companion object {
    fun fromRaw(raw: String?): ActivityType =
      values().firstOrNull { it.raw == raw } ?: UNKNOWN
  }
}

enum class Confidence(val raw: String) {
  LOW("low"),
  MEDIUM("medium"),
  HIGH("high");

  companion object {
    fun fromRaw(raw: String?): Confidence =
      values().firstOrNull { it.raw == raw } ?: LOW

    fun fromPercent(percent: Int): Confidence = when {
      percent >= 75 -> HIGH
      percent >= 40 -> MEDIUM
      else -> LOW
    }
  }
}

data class ActivityBreakdown(
  var stationary: Long = 0L,
  var walking: Long = 0L,
  var running: Long = 0L,
  var automotive: Long = 0L,
  var cycling: Long = 0L,
  var unknown: Long = 0L
) {
  fun add(type: ActivityType, ms: Long) {
    when (type) {
      ActivityType.STATIONARY -> stationary += ms
      ActivityType.WALKING -> walking += ms
      ActivityType.RUNNING -> running += ms
      ActivityType.AUTOMOTIVE -> automotive += ms
      ActivityType.CYCLING -> cycling += ms
      ActivityType.UNKNOWN -> unknown += ms
    }
  }

  fun merge(other: ActivityBreakdown) {
    stationary += other.stationary
    walking += other.walking
    running += other.running
    automotive += other.automotive
    cycling += other.cycling
    unknown += other.unknown
  }
}

data class PostEngagementAggregate(
  val postId: String,
  var totalTimeMs: Long,
  var activityBreakdown: ActivityBreakdown,
  var avgScrollVelocity: Double,
  var peakScrollVelocity: Double,
  var sampleCount: Long,
  var firstSeenAt: Long,
  var lastSeenAt: Long
)
