import Foundation

struct PaletteKey: Hashable {
  let uri: String
  let gridWidth: Int
  let gridHeight: Int
  let edgesOnly: Bool
  let bitsPerChannel: Int
  let downsample: Bool
  let downsampleTargetSize: Int

  init(uri: String, config: Config) {
    self.uri = uri
    self.gridWidth = config.gridWidth
    self.gridHeight = config.gridHeight
    self.edgesOnly = config.edgesOnly
    self.bitsPerChannel = config.bitsPerChannel
    self.downsample = config.downsample
    self.downsampleTargetSize = config.downsampleTargetSize
  }
}

final class PaletteCache {
  private var store: [PaletteKey: [InternalSwatch]] = [:]

  func get(_ key: PaletteKey) -> [InternalSwatch]? {
    return store[key]
  }

  func set(_ key: PaletteKey, _ value: [InternalSwatch]) {
    store[key] = value
  }

  func clear() {
    store.removeAll()
  }
}
