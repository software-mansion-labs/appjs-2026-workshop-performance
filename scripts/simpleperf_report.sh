#!/usr/bin/env bash
# simpleperf_report.sh — run simpleperf's python report on a perf.data file,
# handling the NDK path and a 3.9+ python for you.
# Usage:
#   ./simpleperf_report.sh <perf.data>           # HTML flamegraph, opens in browser
#   ./simpleperf_report.sh <perf.data> --text    # per-thread text report to stdout
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TRACES_DIR="$(cd "$SCRIPT_DIR/.." && pwd)/traces"
ANDROID_SDK="${ANDROID_HOME:-$HOME/Library/Android/sdk}"
PYTHON="${PYTHON:-/usr/bin/python3}"   # simpleperf scripts need 3.9+ (default python3 may be 3.8)

INPUT=""
MODE="html"
for a in "$@"; do
  case "$a" in
    --text) MODE="text" ;;
    --html) MODE="html" ;;
    *)      INPUT="$a" ;;
  esac
done

[[ -z "$INPUT" ]] && { echo "Usage: $0 <perf.data> [--text|--html]"; exit 1; }
[[ ! -f "$INPUT" ]] && { echo "File not found: $INPUT"; exit 1; }
case "$INPUT" in
  *.json)
    echo "That looks like a gecko/Firefox JSON, not a simpleperf record."
    echo "Open it at https://profiler.firefox.com instead."
    echo "For this script, pass the raw record: traces/perf_*.data"
    exit 1 ;;
esac

# simpleperf scripts dir from the newest NDK that has report_html.py
SP_DIR="$(dirname "$(ls -1 "$ANDROID_SDK"/ndk/*/simpleperf/report_html.py 2>/dev/null | sort -V | tail -1 || true)")"
[[ ! -f "$SP_DIR/report_html.py" ]] && { echo "simpleperf scripts not found under $ANDROID_SDK/ndk/*/simpleperf/"; exit 1; }

echo "Input: $INPUT"

if [[ "$MODE" == "text" ]]; then
  "$PYTHON" "$SP_DIR/report.py" -i "$INPUT" --sort thread,symbol
else
  mkdir -p "$TRACES_DIR"
  OUT="$TRACES_DIR/report_$(date +%Y%m%d-%H%M%S).html"
  "$PYTHON" "$SP_DIR/report_html.py" -i "$INPUT" -o "$OUT" --no_browser
  echo "Saved: $OUT"
  if command -v open >/dev/null 2>&1; then open "$OUT"; else echo "Open in a browser: $OUT"; fi
fi
