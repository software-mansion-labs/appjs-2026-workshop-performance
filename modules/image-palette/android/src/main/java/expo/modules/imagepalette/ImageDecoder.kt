package expo.modules.imagepalette

import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.os.Trace

object ImageDecoder {

  fun decode(path: String, downsample: Boolean, targetSize: Int): Bitmap? {
    Trace.beginSection("ImagePalette.decode")
    try {
      if (!downsample) {
        return BitmapFactory.decodeFile(path)
      }
      val bounds = BitmapFactory.Options().apply { inJustDecodeBounds = true }
      BitmapFactory.decodeFile(path, bounds)
      if (bounds.outWidth <= 0 || bounds.outHeight <= 0) return null

      var sampleSize = 1
      val largerEdge = maxOf(bounds.outWidth, bounds.outHeight)
      while (largerEdge / (sampleSize * 2) >= targetSize) {
        sampleSize *= 2
      }

      val opts = BitmapFactory.Options().apply {
        inSampleSize = sampleSize
        inPreferredConfig = Bitmap.Config.ARGB_8888
      }
      return BitmapFactory.decodeFile(path, opts)
    } finally {
      Trace.endSection()
    }
  }

  fun extractARGB(bitmap: Bitmap): DecodedImage {
    Trace.beginSection("ImagePalette.extractARGB")
    try {
      val width = bitmap.width
      val height = bitmap.height
      val pixels = IntArray(width * height)
      bitmap.getPixels(pixels, 0, width, 0, 0, width, height)
      return DecodedImage(pixels = pixels, width = width, height = height)
    } finally {
      Trace.endSection()
    }
  }
}
