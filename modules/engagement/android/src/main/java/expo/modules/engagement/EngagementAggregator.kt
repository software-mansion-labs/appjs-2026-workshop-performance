package expo.modules.engagement

object EngagementAggregator {

  fun aggregate(
    postId: String,
    samples: List<EngagementSample>,
    totalTimeMs: Long
  ): PostEngagementAggregate? {
    if (samples.isEmpty() && totalTimeMs == 0L) return null

    val breakdown = ActivityBreakdown()
    var velocitySum = 0.0
    var velocityCount = 0L
    var peakVelocity = 0.0
    var firstTs = Long.MAX_VALUE
    var lastTs = Long.MIN_VALUE

    val perSampleMs = if (samples.size > 1) {
      val span = samples.last().timestampMs - samples.first().timestampMs
      (span / (samples.size - 1)).coerceAtLeast(0L)
    } else {
      0L
    }

    for (s in samples) {
      breakdown.add(s.activity, perSampleMs)
      val v = s.scrollVelocity.toDouble()
      if (v > 0.0) {
        velocitySum += v
        velocityCount += 1
        if (v > peakVelocity) peakVelocity = v
      }
      if (s.timestampMs < firstTs) firstTs = s.timestampMs
      if (s.timestampMs > lastTs) lastTs = s.timestampMs
    }

    val avgVelocity = if (velocityCount > 0) velocitySum / velocityCount else 0.0

    return PostEngagementAggregate(
      postId = postId,
      totalTimeMs = totalTimeMs,
      activityBreakdown = breakdown,
      avgScrollVelocity = avgVelocity,
      peakScrollVelocity = peakVelocity,
      sampleCount = samples.size.toLong(),
      firstSeenAt = if (firstTs == Long.MAX_VALUE) 0L else firstTs,
      lastSeenAt = if (lastTs == Long.MIN_VALUE) 0L else lastTs
    )
  }

  fun merge(existing: PostEngagementAggregate?, partial: PostEngagementAggregate): PostEngagementAggregate {
    if (existing == null) {
      return partial.copy(activityBreakdown = partial.activityBreakdown.copy())
    }

    val mergedBreakdown = existing.activityBreakdown.copy()
    mergedBreakdown.merge(partial.activityBreakdown)

    val totalSamples = existing.sampleCount + partial.sampleCount
    val mergedAvg = if (totalSamples > 0L) {
      (existing.avgScrollVelocity * existing.sampleCount + partial.avgScrollVelocity * partial.sampleCount) / totalSamples
    } else {
      0.0
    }

    return PostEngagementAggregate(
      postId = existing.postId,
      totalTimeMs = partial.totalTimeMs,
      activityBreakdown = mergedBreakdown,
      avgScrollVelocity = mergedAvg,
      peakScrollVelocity = maxOf(existing.peakScrollVelocity, partial.peakScrollVelocity),
      sampleCount = totalSamples,
      firstSeenAt = when {
        existing.firstSeenAt == 0L -> partial.firstSeenAt
        partial.firstSeenAt == 0L -> existing.firstSeenAt
        else -> minOf(existing.firstSeenAt, partial.firstSeenAt)
      },
      lastSeenAt = maxOf(existing.lastSeenAt, partial.lastSeenAt)
    )
  }
}
