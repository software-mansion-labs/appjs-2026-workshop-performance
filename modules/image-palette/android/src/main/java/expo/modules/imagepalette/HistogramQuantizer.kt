package expo.modules.imagepalette

object HistogramQuantizer {

  private const val SATURATION_BOOST: Double = 1.7
  private const val SATURATION_FLOOR: Double = 0.05

  fun quantize(
    decoded: DecodedImage,
    gridWidth: Int,
    gridHeight: Int,
    edgesOnly: Boolean,
    bitsPerChannel: Int
  ): List<InternalSwatch> {
    val width = decoded.width
    val height = decoded.height
    val pixels = decoded.pixels

    val cellWidth = (width / gridWidth).coerceAtLeast(1)
    val cellHeight = (height / gridHeight).coerceAtLeast(1)

    val channelShift = 8 - bitsPerChannel
    val channelMask = (1 shl bitsPerChannel) - 1
    val restoreMult = 1 shl channelShift
    val restoreOffset = restoreMult / 2
    val secondShift = bitsPerChannel * 2

    val histograms = Array(gridWidth * gridHeight) { HashMap<Int, Int>(256) }

    for (y in 0 until height) {
      val row = minOf(y / cellHeight, gridHeight - 1)
      val rowOffset = y * width
      for (x in 0 until width) {
        val col = minOf(x / cellWidth, gridWidth - 1)
        if (edgesOnly && !isEdge(row, col, gridHeight, gridWidth)) {
          continue
        }
        val pixel = pixels[rowOffset + x]
        val r = (pixel shr 16) and 0xFF
        val g = (pixel shr 8) and 0xFF
        val b = pixel and 0xFF
        val rq = r shr channelShift
        val gq = g shr channelShift
        val bq = b shr channelShift
        val key = (rq shl secondShift) or (gq shl bitsPerChannel) or bq

        val regionIndex = row * gridWidth + col
        histograms[regionIndex][key] = (histograms[regionIndex][key] ?: 0) + 1
      }
    }

    val result = mutableListOf<InternalSwatch>()
    for (row in 0 until gridHeight) {
      for (col in 0 until gridWidth) {
        if (edgesOnly && !isEdge(row, col, gridHeight, gridWidth)) {
          continue
        }
        val regionIndex = row * gridWidth + col
        result.add(pickSwatch(
          histogram = histograms[regionIndex],
          row = row,
          col = col,
          channelMask = channelMask,
          restoreMult = restoreMult,
          restoreOffset = restoreOffset,
          secondShift = secondShift,
          bitsPerChannel = bitsPerChannel
        ))
      }
    }

    return result
  }

  private fun isEdge(row: Int, col: Int, gridHeight: Int, gridWidth: Int): Boolean {
    return row == 0 || row == gridHeight - 1 || col == 0 || col == gridWidth - 1
  }

  private fun pickSwatch(
    histogram: HashMap<Int, Int>,
    row: Int,
    col: Int,
    channelMask: Int,
    restoreMult: Int,
    restoreOffset: Int,
    secondShift: Int,
    bitsPerChannel: Int
  ): InternalSwatch {
    var bestKey: Int? = null
    var bestScore: Double = -1.0
    for ((key, population) in histogram) {
      val rq = (key shr secondShift) and channelMask
      val gq = (key shr bitsPerChannel) and channelMask
      val bq = key and channelMask
      val r = rq * restoreMult + restoreOffset
      val g = gq * restoreMult + restoreOffset
      val b = bq * restoreMult + restoreOffset
      val s = ColorMath.saturation(r, g, b)
      val score = population.toDouble() * (s + SATURATION_FLOOR)
      if (score > bestScore) {
        bestScore = score
        bestKey = key
      }
    }

    val key = bestKey
      ?: return InternalSwatch(row = row, col = col, r = 128, g = 128, b = 128, population = 1)

    val rq = (key shr secondShift) and channelMask
    val gq = (key shr bitsPerChannel) and channelMask
    val bq = key and channelMask
    val baseR = rq * restoreMult + restoreOffset
    val baseG = gq * restoreMult + restoreOffset
    val baseB = bq * restoreMult + restoreOffset
    val (br, bg, bb) = ColorMath.boostSaturation(baseR, baseG, baseB, SATURATION_BOOST)
    return InternalSwatch(
      row = row,
      col = col,
      r = br,
      g = bg,
      b = bb,
      population = histogram[key] ?: 1
    )
  }
}
