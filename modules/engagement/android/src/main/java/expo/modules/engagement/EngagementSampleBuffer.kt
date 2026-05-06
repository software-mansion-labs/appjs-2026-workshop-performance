package expo.modules.engagement

class EngagementSampleBuffer {
  private val store = mutableMapOf<String, MutableList<EngagementSample>>()

  fun ensureKey(postId: String) {
    if (!store.containsKey(postId)) {
      store[postId] = mutableListOf()
    }
  }

  fun append(postId: String, sample: EngagementSample) {
    val list = store.getOrPut(postId) { mutableListOf() }
    list.add(sample)
  }

  fun appendToAll(postIds: Iterable<String>, sample: EngagementSample) {
    for (postId in postIds) {
      append(postId, sample)
    }
  }

  fun snapshot(): Map<String, MutableList<EngagementSample>> = store

  fun clearFor(postId: String) {
    store.remove(postId)
  }

  fun clearAll() {
    store.clear()
  }
}
