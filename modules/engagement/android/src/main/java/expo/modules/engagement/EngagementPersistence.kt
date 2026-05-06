package expo.modules.engagement

import android.content.Context
import android.content.SharedPreferences
import org.json.JSONArray
import org.json.JSONObject

class EngagementPersistence(context: Context) {

  private val prefs: SharedPreferences =
    context.getSharedPreferences(Config.PREFS_NAME, Context.MODE_PRIVATE)

  private val aggregates: MutableMap<String, PostEngagementAggregate> = mutableMapOf()

  fun load() {
    aggregates.clear()
    val raw = prefs.getString(Config.KEY_AGGREGATES, null) ?: return
    runCatching {
      val obj = JSONObject(raw)
      val keys = obj.keys()
      while (keys.hasNext()) {
        val postId = keys.next()
        val node = obj.getJSONObject(postId)
        aggregates[postId] = decode(postId, node)
      }
    }
  }

  fun all(): Map<String, PostEngagementAggregate> = aggregates

  fun get(postId: String): PostEngagementAggregate? = aggregates[postId]

  fun put(postId: String, aggregate: PostEngagementAggregate) {
    aggregates[postId] = aggregate
  }

  fun isEnabled(): Boolean = prefs.getBoolean(Config.KEY_ENABLED, false)

  fun setEnabled(value: Boolean) {
    prefs.edit().putBoolean(Config.KEY_ENABLED, value).apply()
  }

  fun writeToDisk() {
    val obj = JSONObject()
    for ((postId, aggregate) in aggregates) {
      obj.put(postId, encode(aggregate))
    }
    prefs.edit().putString(Config.KEY_AGGREGATES, obj.toString()).apply()
  }

  fun clear() {
    aggregates.clear()
    prefs.edit().remove(Config.KEY_AGGREGATES).apply()
  }

  private fun encode(aggregate: PostEngagementAggregate): JSONObject {
    val breakdown = JSONObject()
      .put("stationary", aggregate.activityBreakdown.stationary)
      .put("walking", aggregate.activityBreakdown.walking)
      .put("running", aggregate.activityBreakdown.running)
      .put("automotive", aggregate.activityBreakdown.automotive)
      .put("cycling", aggregate.activityBreakdown.cycling)
      .put("unknown", aggregate.activityBreakdown.unknown)

    return JSONObject()
      .put("postId", aggregate.postId)
      .put("totalTimeMs", aggregate.totalTimeMs)
      .put("activityBreakdown", breakdown)
      .put("avgScrollVelocity", aggregate.avgScrollVelocity)
      .put("peakScrollVelocity", aggregate.peakScrollVelocity)
      .put("sampleCount", aggregate.sampleCount)
      .put("firstSeenAt", aggregate.firstSeenAt)
      .put("lastSeenAt", aggregate.lastSeenAt)
  }

  private fun decode(postId: String, node: JSONObject): PostEngagementAggregate {
    val breakdownNode = node.optJSONObject("activityBreakdown") ?: JSONObject()
    val breakdown = ActivityBreakdown(
      stationary = breakdownNode.optLong("stationary", 0L),
      walking = breakdownNode.optLong("walking", 0L),
      running = breakdownNode.optLong("running", 0L),
      automotive = breakdownNode.optLong("automotive", 0L),
      cycling = breakdownNode.optLong("cycling", 0L),
      unknown = breakdownNode.optLong("unknown", 0L)
    )
    return PostEngagementAggregate(
      postId = node.optString("postId", postId),
      totalTimeMs = node.optLong("totalTimeMs", 0L),
      activityBreakdown = breakdown,
      avgScrollVelocity = node.optDouble("avgScrollVelocity", 0.0),
      peakScrollVelocity = node.optDouble("peakScrollVelocity", 0.0),
      sampleCount = node.optLong("sampleCount", 0L),
      firstSeenAt = node.optLong("firstSeenAt", 0L),
      lastSeenAt = node.optLong("lastSeenAt", 0L)
    )
  }

  companion object {
    fun toJsMap(aggregate: PostEngagementAggregate): Map<String, Any> {
      return mapOf(
        "postId" to aggregate.postId,
        "totalTimeMs" to aggregate.totalTimeMs,
        "activityBreakdown" to mapOf(
          "stationary" to aggregate.activityBreakdown.stationary,
          "walking" to aggregate.activityBreakdown.walking,
          "running" to aggregate.activityBreakdown.running,
          "automotive" to aggregate.activityBreakdown.automotive,
          "cycling" to aggregate.activityBreakdown.cycling,
          "unknown" to aggregate.activityBreakdown.unknown
        ),
        "avgScrollVelocity" to aggregate.avgScrollVelocity,
        "peakScrollVelocity" to aggregate.peakScrollVelocity,
        "sampleCount" to aggregate.sampleCount,
        "firstSeenAt" to aggregate.firstSeenAt,
        "lastSeenAt" to aggregate.lastSeenAt
      )
    }
  }
}
