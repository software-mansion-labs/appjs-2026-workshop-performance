import ExpoModulesCore
import UIKit
import os

public class ImagePaletteModule: Module {

  private var config = Config()
  private var firstReadOccurred = false
  private let paletteCache = PaletteCache()

  private static let logger = Logger(subsystem: "com.imagepalette", category: "main")

  private func log(_ msg: String) {
    let line = "[ImagePalette] \(msg)"
    Self.logger.info("\(line, privacy: .public)")
  }

  public func definition() -> ModuleDefinition {
    Name("ImagePalette")

    OnDestroy {
      self.paletteCache.clear()
      self.config = Config()
      self.firstReadOccurred = false
    }

    Function("configure") { (options: PaletteConfigOptions) -> Void in
      if self.firstReadOccurred {
        self.log("configure() ignored: must be called before the first getDominantColors() call")
        return
      }
      let warnings = self.config.apply(options)
      for warning in warnings {
        self.log("configure: \(warning) — ignored")
      }
    }

    AsyncFunction("getDominantColors") { (uri: String) -> [String: Any]? in
      self.firstReadOccurred = true
      let cfg = self.config
      self.log("start")

      let key = PaletteKey(uri: uri, config: cfg)
      if cfg.cache, let cached = self.paletteCache.get(key) {
        self.log("cache HIT")
        return self.respond(swatches: cached, config: cfg)
      }
      if cfg.cache {
        self.log("cache MISS")
      }

      let path = uri.hasPrefix("file://") ? String(uri.dropFirst(7)) : uri

      guard let image = ImageDecoder.decode(
              path: path,
              downsample: cfg.downsample,
              targetSize: cfg.downsampleTargetSize
            ) else {
        return nil
      }

      guard let decoded = ImageDecoder.extractRGBA(image: image) else {
        return nil
      }

      let swatches = HistogramQuantizer.quantize(
        decoded: decoded,
        gridWidth: cfg.gridWidth,
        gridHeight: cfg.gridHeight,
        edgesOnly: cfg.edgesOnly,
        bitsPerChannel: cfg.bitsPerChannel
      )

      if cfg.cache {
        self.paletteCache.set(key, swatches)
      }

      self.log("resolved")
      return self.respond(swatches: swatches, config: cfg)
    }
  }

  private func respond(swatches: [InternalSwatch], config: Config) -> [String: Any] {
    return [
      "gridWidth": config.gridWidth,
      "gridHeight": config.gridHeight,
      "swatches": swatches.map { swatch in
        [
          "row": swatch.row,
          "col": swatch.col,
          "r": swatch.r,
          "g": swatch.g,
          "b": swatch.b,
          "population": swatch.population
        ] as [String: Any]
      }
    ]
  }
}
