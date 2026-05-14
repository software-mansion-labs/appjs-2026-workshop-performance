package expo.modules.imagepalette

import android.util.Log
import expo.modules.kotlin.functions.Queues
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import kotlinx.coroutines.CoroutineName
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.asCoroutineDispatcher
import kotlinx.coroutines.cancel
import java.util.concurrent.Executors

class ImagePaletteModule : Module() {

  private var config = Config()
  private var firstReadOccurred = false
  private val paletteCache = PaletteCache()

  private val workExecutor = Executors.newSingleThreadExecutor { r ->
    Thread(r, "ImagePalette-work")
  }
  private val workScope = CoroutineScope(
    workExecutor.asCoroutineDispatcher() +
      SupervisorJob() +
      CoroutineName("image-palette-work")
  )

  private fun log(msg: String) {
    Log.d(TAG, "[ImagePalette/$THREAD_TAG] $msg")
  }

  override fun definition() = ModuleDefinition {
    Name("ImagePalette")

    OnDestroy {
      workScope.cancel()
      workExecutor.shutdown()
      paletteCache.clear()
      config = Config()
      firstReadOccurred = false
    }

    Function("configure") { options: PaletteConfigOptions ->
      if (firstReadOccurred) {
        log("configure() ignored: must be called before the first getDominantColors() call")
        return@Function
      }
      val warnings = config.apply(options)
      warnings.forEach { log("configure: $it — ignored") }
    }

    val asyncFn = AsyncFunction("getDominantColors") { uri: String ->
      firstReadOccurred = true
      val cfg = config.copy()
      log("start")

      val key = PaletteKey.fromConfig(uri, cfg)
      if (cfg.cache) {
        paletteCache.get(key)?.let {
          log("cache HIT")
          return@AsyncFunction respond(it, cfg)
        }
        log("cache MISS")
      }

      val path = if (uri.startsWith("file://")) uri.removePrefix("file://") else uri

      val bitmap = ImageDecoder.decode(path, cfg.downsample, cfg.downsampleTargetSize)
        ?: return@AsyncFunction respond(emptyList(), cfg)

      val decoded = ImageDecoder.extractARGB(bitmap)

      val swatches = HistogramQuantizer.quantize(
        decoded,
        cfg.gridWidth,
        cfg.gridHeight,
        cfg.edgesOnly,
        cfg.bitsPerChannel
      )

      if (cfg.cache) {
        paletteCache.set(key, swatches)
      }

      log("resolved")
      respond(swatches, cfg)
    }
    if (BuildConfig.USE_WORKER_THREAD) asyncFn.runOnQueue(workScope)
    else asyncFn.runOnQueue(Queues.MAIN)
  }

  private fun respond(swatches: List<InternalSwatch>, config: Config): Map<String, Any> {
    return mapOf(
      "gridWidth" to config.gridWidth,
      "gridHeight" to config.gridHeight,
      "swatches" to swatches.map {
        mapOf(
          "row" to it.row,
          "col" to it.col,
          "r" to it.r,
          "g" to it.g,
          "b" to it.b,
          "population" to it.population
        )
      }
    )
  }

  companion object {
    private const val TAG = "ImagePalette"
    private val THREAD_TAG = if (BuildConfig.USE_WORKER_THREAD) "worker" else "main"
  }
}

