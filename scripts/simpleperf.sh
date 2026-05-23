#!/usr/bin/env bash
# simpleperf.sh — record CPU call-stack sampling with simpleperf, then convert to a
# Firefox Profiler (gecko) JSON for online viewing at https://profiler.firefox.com
# (clean Java/Kotlin names, ART frames folded, per-thread).
# Usage: ./simpleperf.sh <seconds> [package] [freq_hz]
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TRACES_DIR="$(cd "$SCRIPT_DIR/.." && pwd)/traces"

SECS="${1:-}"
PKG="${2:-com.staszekscp.appjsperformanceworkshop}"   # default package
FREQ="${3:-4000}"                                      # sampling frequency in Hz
DEV_PATH="/data/local/tmp/perf.data"
ANDROID_SDK="${ANDROID_HOME:-$HOME/Library/Android/sdk}"
PYTHON="${PYTHON:-/usr/bin/python3}"                   # gecko script needs 3.9+ (default python3 may be 3.8)

# colors (only when stdout is a tty)
if [[ -t 1 ]]; then
  C_GECKO=$'\033[1;36m'; C_PERF=$'\033[1;32m'; C_RST=$'\033[0m'
else
  C_GECKO=""; C_PERF=""; C_RST=""
fi

[[ -z "$SECS" ]] && { echo "Usage: $0 <seconds> [package] [freq_hz]"; exit 1; }

# newest NDK that ships the gecko converter
GECKO="$(ls -1 "$ANDROID_SDK"/ndk/*/simpleperf/gecko_profile_generator.py 2>/dev/null | sort -V | tail -1 || true)"

mkdir -p "$TRACES_DIR"
STAMP="$(date +%Y%m%d-%H%M%S)"
PERF_OUT="$TRACES_DIR/perf_$STAMP.data"
PROFILE_OUT="$TRACES_DIR/profile_$STAMP.json"

# allow perf_event sampling (no-op if already enabled; harmless if it fails)
adb shell setprop security.perf_harden 0 >/dev/null 2>&1 || true

echo "Recording ${SECS}s on $PKG (sampling ${FREQ}Hz)"
echo ">>> Scroll the feed in immersive mode now <<<"
adb shell simpleperf record --app "$PKG" -g -f "$FREQ" --duration "$SECS" -o "$DEV_PATH"

adb pull "$DEV_PATH" "$PERF_OUT" >/dev/null

GECKO_OUT=""
if [[ -n "$GECKO" ]]; then
  "$PYTHON" "$GECKO" -i "$PERF_OUT" > "$PROFILE_OUT" && GECKO_OUT="$PROFILE_OUT"
fi

echo
if [[ -n "$GECKO_OUT" ]]; then
  printf '%sgecko format trace:      %s%s\n' "$C_GECKO" "$GECKO_OUT" "$C_RST"
else
  printf '%sgecko format trace:      (skipped — gecko_profile_generator.py not found)%s\n' "$C_GECKO" "$C_RST"
fi
printf '%ssimpleperf format trace: %s%s\n' "$C_PERF" "$PERF_OUT" "$C_RST"
