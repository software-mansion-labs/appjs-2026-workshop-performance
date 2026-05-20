import Foundation

struct InternalSwatch {
  let row: Int
  let col: Int
  let r: Int
  let g: Int
  let b: Int
  let population: Int
}

struct DecodedImage {
  let pixelData: Data
  let width: Int
  let height: Int
}
