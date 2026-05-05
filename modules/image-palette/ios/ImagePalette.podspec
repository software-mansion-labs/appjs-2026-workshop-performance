require 'json'

package = JSON.parse(File.read(File.join(__dir__, '..', 'package.json')))

worker_thread_flag = ENV['USE_IMAGE_PALETTE_WORKER_THREAD'] == 'true' \
  ? 'IMAGE_PALETTE_WORKER_THREAD' \
  : ''

Pod::Spec.new do |s|
  s.name           = 'ImagePalette'
  s.version        = package['version']
  s.summary        = package['description']
  s.description    = package['description']
  s.license        = 'MIT'
  s.author         = 'AppJS Workshop'
  s.homepage       = 'https://appjs.co'
  s.platforms      = { :ios => '15.1', :tvos => '15.1' }
  s.source         = { git: '' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'

  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
    'SWIFT_COMPILATION_MODE' => 'wholemodule',
    'SWIFT_ACTIVE_COMPILATION_CONDITIONS' => "$(inherited) #{worker_thread_flag}".strip
  }

  s.source_files = "**/*.{h,m,mm,swift,hpp,cpp}"
end
