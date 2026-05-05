package expo.modules.engagement

class EngagementSessionTracker(
  private val clock: () -> Long = { System.currentTimeMillis() }
) {
  private data class SessionClock(
    var accumulatedMs: Long = 0,
    var currentStartMs: Long? = null
  )

  private val activeSessions = mutableMapOf<String, Int>()
  private val sessionClocks = mutableMapOf<String, SessionClock>()
  private var tracking: Boolean = false

  fun startSession(postId: String) {
    val current = activeSessions[postId] ?: 0
    activeSessions[postId] = current + 1
    val sc = sessionClocks.getOrPut(postId) { SessionClock() }
    if (tracking && sc.currentStartMs == null) {
      sc.currentStartMs = clock()
    }
  }

  fun stopSession(postId: String) {
    val current = activeSessions[postId] ?: return
    if (current <= 1) {
      activeSessions.remove(postId)
      sessionClocks[postId]?.let { sc ->
        sc.currentStartMs?.let { start ->
          sc.accumulatedMs += clock() - start
          sc.currentStartMs = null
        }
      }
    } else {
      activeSessions[postId] = current - 1
    }
  }

  fun isActive(postId: String): Boolean = activeSessions.containsKey(postId)

  fun activePostIds(): Set<String> = activeSessions.keys.toSet()

  fun snapshotTimeMs(postId: String): Long {
    val sc = sessionClocks[postId] ?: return 0L
    val activeMs = sc.currentStartMs?.let { clock() - it } ?: 0L
    return sc.accumulatedMs + activeMs
  }

  fun pauseAll() {
    tracking = false
    val now = clock()
    for (sc in sessionClocks.values) {
      sc.currentStartMs?.let { start ->
        sc.accumulatedMs += now - start
        sc.currentStartMs = null
      }
    }
  }

  fun resumeAll() {
    tracking = true
    val now = clock()
    for (postId in activeSessions.keys) {
      val sc = sessionClocks.getOrPut(postId) { SessionClock() }
      if (sc.currentStartMs == null) {
        sc.currentStartMs = now
      }
    }
  }

  fun seed(postId: String, accumulatedMs: Long) {
    sessionClocks.getOrPut(postId) { SessionClock() }.accumulatedMs = accumulatedMs
  }

  fun resetAccumulated() {
    val now = clock()
    for (sc in sessionClocks.values) {
      sc.accumulatedMs = 0
      if (sc.currentStartMs != null) sc.currentStartMs = now
    }
  }

  fun clear() {
    activeSessions.clear()
    sessionClocks.clear()
  }
}
