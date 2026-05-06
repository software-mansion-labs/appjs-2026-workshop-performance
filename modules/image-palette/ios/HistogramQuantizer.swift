import Foundation

enum HistogramQuantizer {

  private static let SATURATION_BOOST: Double = 1.7
  private static let SATURATION_FLOOR: Double = 0.05

  static func quantize(
    decoded: DecodedImage,
    gridWidth: Int,
    gridHeight: Int,
    edgesOnly: Bool,
    bitsPerChannel: Int
  ) -> [InternalSwatch] {
    let width = decoded.width
    let height = decoded.height
    let bytesPerRow = width * 4

    let cellWidth = max(1, width / gridWidth)
    let cellHeight = max(1, height / gridHeight)

    let channelShift = 8 - bitsPerChannel
    let channelMask = (1 << bitsPerChannel) - 1
    let restoreMult = 1 << channelShift
    let restoreOffset = restoreMult / 2
    let secondShift = bitsPerChannel * 2

    var histograms: [[Int: Int]] = Array(repeating: [:], count: gridWidth * gridHeight)

    decoded.pixelData.withUnsafeBytes { (rawBuffer: UnsafeRawBufferPointer) in
      let bytes = rawBuffer.bindMemory(to: UInt8.self)
      for y in 0..<height {
        let row = min(y / cellHeight, gridHeight - 1)
        let rowOffset = y * bytesPerRow
        for x in 0..<width {
          let col = min(x / cellWidth, gridWidth - 1)
          if edgesOnly && !isEdge(row: row, col: col, gridHeight: gridHeight, gridWidth: gridWidth) {
            continue
          }
          let i = rowOffset + x * 4
          let r = Int(bytes[i])
          let g = Int(bytes[i + 1])
          let b = Int(bytes[i + 2])
          let rq = r >> channelShift
          let gq = g >> channelShift
          let bq = b >> channelShift
          let key = (rq << secondShift) | (gq << bitsPerChannel) | bq

          let regionIndex = row * gridWidth + col
          histograms[regionIndex][key, default: 0] += 1
        }
      }
    }

    var result: [InternalSwatch] = []
    result.reserveCapacity(gridWidth * gridHeight)

    for row in 0..<gridHeight {
      for col in 0..<gridWidth {
        if edgesOnly && !isEdge(row: row, col: col, gridHeight: gridHeight, gridWidth: gridWidth) {
          continue
        }
        let regionIndex = row * gridWidth + col
        result.append(pickSwatch(
          histogram: histograms[regionIndex],
          row: row,
          col: col,
          channelMask: channelMask,
          restoreMult: restoreMult,
          restoreOffset: restoreOffset,
          secondShift: secondShift,
          bitsPerChannel: bitsPerChannel
        ))
      }
    }

    return result
  }

  private static func isEdge(row: Int, col: Int, gridHeight: Int, gridWidth: Int) -> Bool {
    return row == 0 || row == gridHeight - 1 || col == 0 || col == gridWidth - 1
  }

  private static func pickSwatch(
    histogram: [Int: Int],
    row: Int,
    col: Int,
    channelMask: Int,
    restoreMult: Int,
    restoreOffset: Int,
    secondShift: Int,
    bitsPerChannel: Int
  ) -> InternalSwatch {
    var bestKey: Int? = nil
    var bestScore: Double = -1
    for (key, population) in histogram {
      let rq = (key >> secondShift) & channelMask
      let gq = (key >> bitsPerChannel) & channelMask
      let bq = key & channelMask
      let r = rq * restoreMult + restoreOffset
      let g = gq * restoreMult + restoreOffset
      let b = bq * restoreMult + restoreOffset
      let s = ColorMath.saturation(r: r, g: g, b: b)
      let score = Double(population) * (s + SATURATION_FLOOR)
      if score > bestScore {
        bestScore = score
        bestKey = key
      }
    }

    guard let key = bestKey else {
      return InternalSwatch(row: row, col: col, r: 128, g: 128, b: 128, population: 1)
    }

    let rq = (key >> secondShift) & channelMask
    let gq = (key >> bitsPerChannel) & channelMask
    let bq = key & channelMask
    let baseR = rq * restoreMult + restoreOffset
    let baseG = gq * restoreMult + restoreOffset
    let baseB = bq * restoreMult + restoreOffset
    let boosted = ColorMath.boostSaturation(r: baseR, g: baseG, b: baseB, factor: SATURATION_BOOST)
    return InternalSwatch(
      row: row,
      col: col,
      r: boosted.r,
      g: boosted.g,
      b: boosted.b,
      population: histogram[key] ?? 1
    )
  }
}
