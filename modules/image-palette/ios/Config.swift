import ExpoModulesCore

struct PaletteConfigOptions: Record {
  @Field var bitsPerChannel: Int?
  @Field var gridWidth: Int?
  @Field var gridHeight: Int?
  @Field var edgesOnly: Bool?
  @Field var downsample: Bool?
  @Field var downsampleTargetSize: Int?
  @Field var cache: Bool?
}

struct Config {
  var bitsPerChannel: Int = 6
  var gridWidth: Int = 3
  var gridHeight: Int = 3
  var edgesOnly: Bool = true
  var downsample: Bool = false
  var downsampleTargetSize: Int = 200
  var cache: Bool = false

  mutating func apply(_ options: PaletteConfigOptions) -> [String] {
    var warnings: [String] = []
    if let v = options.bitsPerChannel {
      if (1...8).contains(v) { bitsPerChannel = v }
      else { warnings.append("'bitsPerChannel' must be 1..8, got \(v)") }
    }
    if let v = options.gridWidth {
      if v >= 1 { gridWidth = v }
      else { warnings.append("'gridWidth' must be >= 1, got \(v)") }
    }
    if let v = options.gridHeight {
      if v >= 1 { gridHeight = v }
      else { warnings.append("'gridHeight' must be >= 1, got \(v)") }
    }
    if let v = options.edgesOnly { edgesOnly = v }
    if let v = options.downsample { downsample = v }
    if let v = options.downsampleTargetSize {
      if v > 0 { downsampleTargetSize = v }
      else { warnings.append("'downsampleTargetSize' must be > 0, got \(v)") }
    }
    if let v = options.cache { cache = v }
    return warnings
  }
}
