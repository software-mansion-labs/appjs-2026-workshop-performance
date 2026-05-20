package expo.modules.engagement

import android.util.Log

object EngagementLog {
  fun info(msg: String) {
    Log.i(Config.LOG_TAG, "[Engagement] $msg")
  }
}
