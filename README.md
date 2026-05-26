# App.js 2026 - React Native Performance Workshop

A hands-on workshop for diagnosing and fixing performance problems in a React Native.

## Workshop scope

The workshop is split into three parts:

- **React Native DevTools and the JS profiler with AI.** Reading flame graphs, spotting wasted renders, and using the Profiler tab together with AI assistance to find which component is actually expensive.
- **List performance.** Why feeds drop frames and the fixes that take a broken list back to the device refresh rate.
- **Native performance.** Debugging on the native side and understanding the native tools and code under a React Native app: what the platform profilers show, how to read native traces, and how to navigate the iOS and Android code that sits beneath JS.

The three parts are designed to stack. Profiling teaches you how to see the problem, list performance gives you the JS-side fixes, and the native session covers what is left.

## Requirements

- A local native Expo / React Native development environment capable of running `npx expo run:ios` and `npx expo run:android`.
- Node 20.19.x.
- npm or Yarn Classic.
- For iOS local development: macOS, Xcode 26.2+, iOS Simulator, CocoaPods, and Watchman recommended.
- For Android local development: Android Studio, JDK 17, Android SDK Platform 36, Android emulator, and Android NDK.
- Runtime targets for this project: iOS 15.1+ and Android 7.0+ / API 24+.
- A physical device is strongly recommended. The simulator hides the exact problems this workshop is about.

## Running the app

This is an Expo project with the New Architecture enabled, and it uses a few libraries that need native code (Reanimated, Skia, gesture handler, expo-image with blurhash). Run a clean prebuild before the first launch:

```bash
npx expo prebuild --clean && npm run ios
# or
npx expo prebuild --clean && npm run android
```

`--clean` wipes any stale `ios/` and `android/` folders so the prebuild matches the current `app.json` and `package.json`. Run it again whenever you switch to a branch that changes native config.

After the first successful build, `npm run ios` or `npm run android` alone is enough for incremental JS changes.

## Workshop tasks (Notion board)

All list-performance tasks are mirrored on a public Notion board so you can browse them with descriptions, hints, and explanations laid out side by side instead of scrolling one long markdown file:

https://honey-digit-2bf.notion.site/18208897bf51461a841214b5f8f9156f?v=515a5db545604338bf6fbab6c30bac69

The link is read-only - you can view every task without an account. If you have a Notion account and want to track your own progress, open the board, click `Duplicate` in the top-right to copy it into your own workspace, and then flip rows from `Todo` to `Done` as you work through them.
