package expo.modules.imagepalette

data class InternalSwatch(
  val row: Int,
  val col: Int,
  val r: Int,
  val g: Int,
  val b: Int,
  val population: Int
)

data class DecodedImage(
  val pixels: IntArray,
  val width: Int,
  val height: Int
)
