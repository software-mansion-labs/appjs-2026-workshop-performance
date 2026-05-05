import Foundation

enum ColorMath {

  static func saturation(r: Int, g: Int, b: Int) -> Double {
    let rf = Double(r) / 255.0
    let gf = Double(g) / 255.0
    let bf = Double(b) / 255.0
    let maxC = max(rf, max(gf, bf))
    let minC = min(rf, min(gf, bf))
    if maxC == minC { return 0 }
    let l = (maxC + minC) / 2.0
    let d = maxC - minC
    return l > 0.5 ? d / (2.0 - maxC - minC) : d / (maxC + minC)
  }

  static func boostSaturation(r: Int, g: Int, b: Int, factor: Double) -> (r: Int, g: Int, b: Int) {
    let rf = Double(r) / 255.0
    let gf = Double(g) / 255.0
    let bf = Double(b) / 255.0
    let maxC = max(rf, max(gf, bf))
    let minC = min(rf, min(gf, bf))
    let l = (maxC + minC) / 2.0
    if maxC == minC { return (r, g, b) }
    let d = maxC - minC
    let s = l > 0.5 ? d / (2.0 - maxC - minC) : d / (maxC + minC)
    var h: Double
    if maxC == rf {
      h = ((gf - bf) / d + (gf < bf ? 6 : 0)) / 6
    } else if maxC == gf {
      h = ((bf - rf) / d + 2) / 6
    } else {
      h = ((rf - gf) / d + 4) / 6
    }
    let sBoosted = min(1.0, s * factor)
    let q = l < 0.5 ? l * (1 + sBoosted) : l + sBoosted - l * sBoosted
    let p = 2 * l - q
    let outR = hueToRgb(p: p, q: q, t: h + 1.0 / 3.0)
    let outG = hueToRgb(p: p, q: q, t: h)
    let outB = hueToRgb(p: p, q: q, t: h - 1.0 / 3.0)
    return (
      Int((outR * 255).rounded()),
      Int((outG * 255).rounded()),
      Int((outB * 255).rounded())
    )
  }

  private static func hueToRgb(p: Double, q: Double, t: Double) -> Double {
    var tt = t
    if tt < 0 { tt += 1 }
    if tt > 1 { tt -= 1 }
    if tt < 1.0 / 6.0 { return p + (q - p) * 6 * tt }
    if tt < 1.0 / 2.0 { return q }
    if tt < 2.0 / 3.0 { return p + (q - p) * (2.0 / 3.0 - tt) * 6 }
    return p
  }
}
