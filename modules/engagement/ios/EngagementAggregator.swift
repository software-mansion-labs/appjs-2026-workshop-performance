import Foundation

enum EngagementAggregator {

  static func aggregate(
    postId: String,
    samples: [EngagementSample],
    totalTimeMs: Int64
  ) -> PostEngagementAggregate? {
    if samples.isEmpty && totalTimeMs == 0 { return nil }

    var breakdown = ActivityBreakdown()
    var velocitySum: Double = 0
    var velocityCount: Int64 = 0
    var peakVelocity: Double = 0
    var firstTs: Int64 = .max
    var lastTs: Int64 = .min

    let perSampleMs: Int64
    if samples.count > 1 {
      let span = samples.last!.timestampMs - samples.first!.timestampMs
      perSampleMs = max(0, span / Int64(samples.count - 1))
    } else {
      perSampleMs = 0
    }

    for s in samples {
      breakdown.add(s.activity, ms: perSampleMs)
      let v = Double(s.scrollVelocity)
      if v > 0 {
        velocitySum += v
        velocityCount += 1
        if v > peakVelocity { peakVelocity = v }
      }
      if s.timestampMs < firstTs { firstTs = s.timestampMs }
      if s.timestampMs > lastTs { lastTs = s.timestampMs }
    }

    let avgVelocity = velocityCount > 0 ? velocitySum / Double(velocityCount) : 0

    return PostEngagementAggregate(
      postId: postId,
      totalTimeMs: totalTimeMs,
      activityBreakdown: breakdown,
      avgScrollVelocity: avgVelocity,
      peakScrollVelocity: peakVelocity,
      sampleCount: Int64(samples.count),
      firstSeenAt: firstTs == .max ? 0 : firstTs,
      lastSeenAt: lastTs == .min ? 0 : lastTs
    )
  }

  static func merge(_ existing: PostEngagementAggregate?, _ partial: PostEngagementAggregate) -> PostEngagementAggregate {
    guard let existing = existing else { return partial }

    var mergedBreakdown = existing.activityBreakdown
    mergedBreakdown.merge(partial.activityBreakdown)

    let totalSamples = existing.sampleCount + partial.sampleCount
    let mergedAvg: Double = totalSamples > 0
      ? (existing.avgScrollVelocity * Double(existing.sampleCount)
         + partial.avgScrollVelocity * Double(partial.sampleCount)) / Double(totalSamples)
      : 0

    return PostEngagementAggregate(
      postId: existing.postId,
      totalTimeMs: partial.totalTimeMs,
      activityBreakdown: mergedBreakdown,
      avgScrollVelocity: mergedAvg,
      peakScrollVelocity: max(existing.peakScrollVelocity, partial.peakScrollVelocity),
      sampleCount: totalSamples,
      firstSeenAt: {
        if existing.firstSeenAt == 0 { return partial.firstSeenAt }
        if partial.firstSeenAt == 0 { return existing.firstSeenAt }
        return min(existing.firstSeenAt, partial.firstSeenAt)
      }(),
      lastSeenAt: max(existing.lastSeenAt, partial.lastSeenAt)
    )
  }
}
