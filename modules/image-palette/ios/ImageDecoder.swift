import UIKit
import ImageIO
import os

enum ImageDecoder {

  private static let signposter = OSSignposter(logHandle: OSLog(subsystem: "ImagePalette", category: .pointsOfInterest))

  static func decode(path: String, downsample: Bool, targetSize: Int) -> UIImage? {
    let interval = signposter.beginInterval("ImagePalette.decode")
    defer { signposter.endInterval("ImagePalette.decode", interval) }
    if !downsample {
      return UIImage(contentsOfFile: path)
    }
    let url = URL(fileURLWithPath: path)
    guard let source = CGImageSourceCreateWithURL(url as CFURL, nil) else {
      return UIImage(contentsOfFile: path)
    }
    let options: [CFString: Any] = [
      kCGImageSourceCreateThumbnailFromImageAlways: true,
      kCGImageSourceCreateThumbnailWithTransform: true,
      kCGImageSourceShouldCacheImmediately: true,
      kCGImageSourceThumbnailMaxPixelSize: targetSize
    ]
    guard let cgImage = CGImageSourceCreateThumbnailAtIndex(source, 0, options as CFDictionary) else {
      return nil
    }
    return UIImage(cgImage: cgImage)
  }

  static func extractRGBA(image: UIImage) -> DecodedImage? {
    let interval = signposter.beginInterval("ImagePalette.extractRGBA")
    defer { signposter.endInterval("ImagePalette.extractRGBA", interval) }
    guard let cgImage = image.cgImage else { return nil }

    let width = cgImage.width
    let height = cgImage.height
    let bytesPerRow = width * 4
    let totalBytes = bytesPerRow * height

    let colorSpace = CGColorSpaceCreateDeviceRGB()
    let bitmapInfo = CGImageAlphaInfo.noneSkipLast.rawValue | CGBitmapInfo.byteOrder32Big.rawValue

    var pixelData = Data(count: totalBytes)
    let drewSuccessfully: Bool = pixelData.withUnsafeMutableBytes { (rawBuffer: UnsafeMutableRawBufferPointer) -> Bool in
      guard let baseAddress = rawBuffer.baseAddress,
            let context = CGContext(
              data: baseAddress,
              width: width,
              height: height,
              bitsPerComponent: 8,
              bytesPerRow: bytesPerRow,
              space: colorSpace,
              bitmapInfo: bitmapInfo
            ) else {
        return false
      }
      context.draw(cgImage, in: CGRect(x: 0, y: 0, width: width, height: height))
      return true
    }

    guard drewSuccessfully else { return nil }
    return DecodedImage(pixelData: pixelData, width: width, height: height)
  }
}
