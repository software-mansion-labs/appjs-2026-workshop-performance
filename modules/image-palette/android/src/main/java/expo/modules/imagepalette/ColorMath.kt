package expo.modules.imagepalette

import kotlin.math.roundToInt

object ColorMath {

  fun saturation(r: Int, g: Int, b: Int): Double {
    val rf = r / 255.0
    val gf = g / 255.0
    val bf = b / 255.0
    val maxC = maxOf(rf, gf, bf)
    val minC = minOf(rf, gf, bf)
    if (maxC == minC) return 0.0
    val l = (maxC + minC) / 2.0
    val d = maxC - minC
    return if (l > 0.5) d / (2.0 - maxC - minC) else d / (maxC + minC)
  }

  fun boostSaturation(r: Int, g: Int, b: Int, factor: Double): Triple<Int, Int, Int> {
    val rf = r / 255.0
    val gf = g / 255.0
    val bf = b / 255.0
    val maxC = maxOf(rf, gf, bf)
    val minC = minOf(rf, gf, bf)
    val l = (maxC + minC) / 2.0
    if (maxC == minC) return Triple(r, g, b)
    val d = maxC - minC
    val s = if (l > 0.5) d / (2.0 - maxC - minC) else d / (maxC + minC)
    val h = when (maxC) {
      rf -> ((gf - bf) / d + (if (gf < bf) 6.0 else 0.0)) / 6.0
      gf -> ((bf - rf) / d + 2.0) / 6.0
      else -> ((rf - gf) / d + 4.0) / 6.0
    }
    val sBoosted = minOf(1.0, s * factor)
    val q = if (l < 0.5) l * (1 + sBoosted) else l + sBoosted - l * sBoosted
    val p = 2 * l - q
    val outR = hueToRgb(p, q, h + 1.0 / 3.0)
    val outG = hueToRgb(p, q, h)
    val outB = hueToRgb(p, q, h - 1.0 / 3.0)
    return Triple(
      (outR * 255).roundToInt(),
      (outG * 255).roundToInt(),
      (outB * 255).roundToInt()
    )
  }

  private fun hueToRgb(p: Double, q: Double, t: Double): Double {
    var tt = t
    if (tt < 0) tt += 1
    if (tt > 1) tt -= 1
    if (tt < 1.0 / 6.0) return p + (q - p) * 6 * tt
    if (tt < 1.0 / 2.0) return q
    if (tt < 2.0 / 3.0) return p + (q - p) * (2.0 / 3.0 - tt) * 6
    return p
  }
}
