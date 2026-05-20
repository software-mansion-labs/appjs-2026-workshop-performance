package expo.modules.engagement

import android.Manifest
import android.os.Build
import expo.modules.interfaces.permissions.Permissions
import expo.modules.interfaces.permissions.PermissionsStatus

class EngagementPermissions(
  private val permissionsProvider: () -> Permissions?
) {
  fun isGranted(): Boolean {
    if (Environment.isEmulator) return true
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.Q) return true
    val perms = permissionsProvider() ?: return false
    return perms.hasGrantedPermissions(Manifest.permission.ACTIVITY_RECOGNITION)
  }

  fun ensureGranted(callback: (granted: Boolean) -> Unit) {
    if (Environment.isEmulator) {
      callback(true)
      return
    }
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.Q) {
      callback(true)
      return
    }
    val perms = permissionsProvider()
    if (perms == null) {
      callback(false)
      return
    }
    perms.askForPermissions({ result ->
      val granted = result[Manifest.permission.ACTIVITY_RECOGNITION]?.status == PermissionsStatus.GRANTED
      callback(granted)
    }, Manifest.permission.ACTIVITY_RECOGNITION)
  }
}
