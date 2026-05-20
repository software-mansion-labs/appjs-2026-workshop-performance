package expo.modules.imagepalette

import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record

class PaletteConfigOptions : Record {
  @Field var bitsPerChannel: Int? = null
  @Field var gridWidth: Int? = null
  @Field var gridHeight: Int? = null
  @Field var edgesOnly: Boolean? = null
  @Field var downsample: Boolean? = null
  @Field var downsampleTargetSize: Int? = null
  @Field var cache: Boolean? = null
}

data class Config(
  var bitsPerChannel: Int = 6,
  var gridWidth: Int = 3,
  var gridHeight: Int = 3,
  var edgesOnly: Boolean = true,
  var downsample: Boolean = false,
  var downsampleTargetSize: Int = 200,
  var cache: Boolean = false
) {
  fun apply(options: PaletteConfigOptions): List<String> {
    val warnings = mutableListOf<String>()
    options.bitsPerChannel?.let { v ->
      if (v in 1..8) bitsPerChannel = v
      else warnings.add("'bitsPerChannel' must be 1..8, got $v")
    }
    options.gridWidth?.let { v ->
      if (v >= 1) gridWidth = v
      else warnings.add("'gridWidth' must be >= 1, got $v")
    }
    options.gridHeight?.let { v ->
      if (v >= 1) gridHeight = v
      else warnings.add("'gridHeight' must be >= 1, got $v")
    }
    options.edgesOnly?.let { edgesOnly = it }
    options.downsample?.let { downsample = it }
    options.downsampleTargetSize?.let { v ->
      if (v > 0) downsampleTargetSize = v
      else warnings.add("'downsampleTargetSize' must be > 0, got $v")
    }
    options.cache?.let { cache = it }
    return warnings
  }
}
