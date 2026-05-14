package expo.modules.engagement

object Config {
  const val FLUSH_INTERVAL_MS: Long = 5_000L
  const val ACTIVITY_UPDATE_INTERVAL_MS: Long = 1_000L

  const val PREFS_NAME: String = "expo.modules.engagement.prefs"
  const val KEY_AGGREGATES: String = "aggregates"
  const val KEY_ENABLED: String = "enabled"

  const val LOG_TAG: String = "Engagement"
}
