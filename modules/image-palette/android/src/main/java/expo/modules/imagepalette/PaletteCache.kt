package expo.modules.imagepalette

data class PaletteKey(
  val uri: String,
  val gridWidth: Int,
  val gridHeight: Int,
  val edgesOnly: Boolean,
  val bitsPerChannel: Int,
  val downsample: Boolean,
  val downsampleTargetSize: Int
) {
  companion object {
    fun fromConfig(uri: String, config: Config) = PaletteKey(
      uri = uri,
      gridWidth = config.gridWidth,
      gridHeight = config.gridHeight,
      edgesOnly = config.edgesOnly,
      bitsPerChannel = config.bitsPerChannel,
      downsample = config.downsample,
      downsampleTargetSize = config.downsampleTargetSize
    )
  }
}

class PaletteCache {
  private val store = mutableMapOf<PaletteKey, List<InternalSwatch>>()

  fun get(key: PaletteKey): List<InternalSwatch>? = store[key]

  fun set(key: PaletteKey, value: List<InternalSwatch>) {
    store[key] = value
  }

  fun clear() {
    store.clear()
  }
}
