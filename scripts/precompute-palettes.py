#!/usr/bin/env python3
"""
Precompute dominant-color palettes for all unique Picsum images used by mock-feed.

Mirrors the native `image-palette` Expo module's algorithm 1:1:
  1. Divide image into a `gridWidth × gridHeight` grid
  2. Per region: 5-bit-per-channel histogram (32k buckets)
  3. Per region: pick bucket with max (population × (saturation + 0.05))
  4. Map bucket center back to RGB (×8 + 4)
  5. Boost saturation ×1.7 in HSL space
  6. Optional `edges_only` mode skips interior pixels and interior result cells

mock-feed.ts uses:
  picsumId    = (i * 10 + j) % 1000                            # post i, image j
  aspectRatio = aspectRatios[i % 8]                            # 8 ratios cycle
  w, h        = 800, round(800 / aspectRatio)
  url         = https://picsum.photos/id/{picsumId}/{w}/{h}

Hook only uses images[0] → j = 0. For i in [0, 5000), the unique
(picsumId, w, h) tuples are 200 (100 picsumIds × 2 aspect ratios each,
because gcd(100, 8) = 4 ⇒ orbit length = 2).

Output JSON shape (keyed by `{picsumId}_{w}x{h}`, value matches native
module response):
  {
    "0_800x800": {
      "gridWidth": 3,
      "gridHeight": 3,
      "swatches": [
        { "row": 0, "col": 0, "r": 15, "g": 1, "b": 1, "population": 5802 },
        ...
      ]
    },
    ...
  }

Usage:
  python3 scripts/precompute-palettes.py                      # 3x3, full grid
  python3 scripts/precompute-palettes.py --grid 5 5           # 5x5 full
  python3 scripts/precompute-palettes.py --grid 10 10 --edges # 10x10 edges-only
"""

from __future__ import annotations

import argparse
import json
import os
import sys
import time
import urllib.request
from io import BytesIO

try:
    from PIL import Image
except ImportError:
    print("PIL/Pillow required: pip install Pillow", file=sys.stderr)
    sys.exit(1)

# Algorithm constants — keep in sync with HistogramQuantizer.swift / .kt.
# Quantization precision: 5-bit per channel = 32 levels (32k buckets total),
# 6-bit = 64 levels (262k buckets). More bits → finer color discrimination,
# at the cost of more histogram entries and longer picking iteration.
BITS_PER_CHANNEL = 6
CHANNEL_SHIFT = 8 - BITS_PER_CHANNEL
CHANNEL_MASK = (1 << BITS_PER_CHANNEL) - 1
CHANNEL_RESTORE_MULT = 1 << CHANNEL_SHIFT
CHANNEL_RESTORE_OFFSET = CHANNEL_RESTORE_MULT // 2

SATURATION_BOOST = 1.7
SATURATION_FLOOR = 0.05

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), os.pardir))
OUTPUT_PATH = os.path.join(PROJECT_ROOT, "src", "data", "precomputed-palettes.json")


def saturation(r: int, g: int, b: int) -> float:
    rf, gf, bf = r / 255.0, g / 255.0, b / 255.0
    mx = max(rf, gf, bf)
    mn = min(rf, gf, bf)
    if mx == mn:
        return 0.0
    l = (mx + mn) / 2.0
    d = mx - mn
    return d / (2.0 - mx - mn) if l > 0.5 else d / (mx + mn)


def boost_saturation(r: int, g: int, b: int, factor: float):
    rf, gf, bf = r / 255.0, g / 255.0, b / 255.0
    mx = max(rf, gf, bf)
    mn = min(rf, gf, bf)
    l = (mx + mn) / 2.0
    if mx == mn:
        return r, g, b
    d = mx - mn
    s = d / (2.0 - mx - mn) if l > 0.5 else d / (mx + mn)

    if mx == rf:
        h = ((gf - bf) / d + (6 if gf < bf else 0)) / 6.0
    elif mx == gf:
        h = ((bf - rf) / d + 2) / 6.0
    else:
        h = ((rf - gf) / d + 4) / 6.0

    s_boosted = min(1.0, s * factor)

    def hue_to_rgb(p: float, q: float, t: float) -> float:
        if t < 0:
            t += 1
        if t > 1:
            t -= 1
        if t < 1 / 6:
            return p + (q - p) * 6 * t
        if t < 1 / 2:
            return q
        if t < 2 / 3:
            return p + (q - p) * (2 / 3 - t) * 6
        return p

    q = l * (1 + s_boosted) if l < 0.5 else l + s_boosted - l * s_boosted
    p = 2 * l - q
    r_out = hue_to_rgb(p, q, h + 1 / 3)
    g_out = hue_to_rgb(p, q, h)
    b_out = hue_to_rgb(p, q, h - 1 / 3)
    return round(r_out * 255), round(g_out * 255), round(b_out * 255)


def is_edge(row: int, col: int, grid_height: int, grid_width: int) -> bool:
    """True if the cell sits on the perimeter of the grid."""
    return row == 0 or row == grid_height - 1 or col == 0 or col == grid_width - 1


def extract_palette(img: Image.Image, grid_width: int, grid_height: int, edges_only: bool):
    """Return a list of swatch dicts: { row, col, r, g, b, population }.

    Sparse when `edges_only=True` — interior cells are skipped both in the pixel
    loop and in the result, exactly like the native quantizer.
    """
    img = img.convert("RGB")
    w, h = img.size
    pixels = img.load()
    cell_w = max(1, w // grid_width)
    cell_h = max(1, h // grid_height)

    histograms = [{} for _ in range(grid_width * grid_height)]
    for y in range(h):
        row = min(y // cell_h, grid_height - 1)
        for x in range(w):
            col = min(x // cell_w, grid_width - 1)
            # Edge-only fast path: skip interior pixels entirely.
            if edges_only and not is_edge(row, col, grid_height, grid_width):
                continue
            r, g, b = pixels[x, y]
            rq = r >> CHANNEL_SHIFT
            gq = g >> CHANNEL_SHIFT
            bq = b >> CHANNEL_SHIFT
            key = (rq << (BITS_PER_CHANNEL * 2)) | (gq << BITS_PER_CHANNEL) | bq
            idx = row * grid_width + col
            histograms[idx][key] = histograms[idx].get(key, 0) + 1

    swatches = []
    for row in range(grid_height):
        for col in range(grid_width):
            if edges_only and not is_edge(row, col, grid_height, grid_width):
                continue
            idx = row * grid_width + col
            hist = histograms[idx]

            if not hist:
                swatches.append({
                    "row": row, "col": col,
                    "r": 128, "g": 128, "b": 128, "population": 1,
                })
                continue

            best_key = None
            best_score = -1.0
            for key, pop in hist.items():
                rq = (key >> (BITS_PER_CHANNEL * 2)) & CHANNEL_MASK
                gq = (key >> BITS_PER_CHANNEL) & CHANNEL_MASK
                bq = key & CHANNEL_MASK
                r = rq * CHANNEL_RESTORE_MULT + CHANNEL_RESTORE_OFFSET
                g = gq * CHANNEL_RESTORE_MULT + CHANNEL_RESTORE_OFFSET
                b = bq * CHANNEL_RESTORE_MULT + CHANNEL_RESTORE_OFFSET
                s = saturation(r, g, b)
                score = pop * (s + SATURATION_FLOOR)
                if score > best_score:
                    best_score = score
                    best_key = key

            key = best_key
            rq = (key >> (BITS_PER_CHANNEL * 2)) & CHANNEL_MASK
            gq = (key >> BITS_PER_CHANNEL) & CHANNEL_MASK
            bq = key & CHANNEL_MASK
            base_r = rq * CHANNEL_RESTORE_MULT + CHANNEL_RESTORE_OFFSET
            base_g = gq * CHANNEL_RESTORE_MULT + CHANNEL_RESTORE_OFFSET
            base_b = bq * CHANNEL_RESTORE_MULT + CHANNEL_RESTORE_OFFSET
            boosted = boost_saturation(base_r, base_g, base_b, SATURATION_BOOST)
            swatches.append({
                "row": row, "col": col,
                "r": boosted[0],
                "g": boosted[1],
                "b": boosted[2],
                "population": hist[key],
            })
    return swatches


def fallback_palette(grid_width: int, grid_height: int, edges_only: bool):
    """Neutral gray swatches with the same shape extract_palette would produce."""
    swatches = []
    for row in range(grid_height):
        for col in range(grid_width):
            if edges_only and not is_edge(row, col, grid_height, grid_width):
                continue
            swatches.append({
                "row": row, "col": col,
                "r": 90, "g": 95, "b": 110, "population": 1,
            })
    return swatches


def fetch(picsum_id: int, w: int, h: int, retries: int = 3) -> Image.Image:
    url = f"https://picsum.photos/id/{picsum_id}/{w}/{h}"
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "precompute-palettes/1.0"})
            with urllib.request.urlopen(req, timeout=15) as resp:
                data = resp.read()
            return Image.open(BytesIO(data))
        except Exception as e:
            if attempt + 1 == retries:
                raise
            print(f"  retry {attempt+1} for id={picsum_id}: {e}", file=sys.stderr)
            time.sleep(1.5 * (attempt + 1))
    raise RuntimeError("unreachable")


def parse_args():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument(
        "--grid",
        nargs=2,
        type=int,
        default=[3, 3],
        metavar=("WIDTH", "HEIGHT"),
        help="Sampling grid dimensions (default: 3 3)",
    )
    ap.add_argument(
        "--edges",
        action="store_true",
        help="Sample only perimeter cells (matches edgesOnly=true on native side)",
    )
    ap.add_argument(
        "--output",
        default=OUTPUT_PATH,
        help=f"Output JSON path (default: {OUTPUT_PATH})",
    )
    return ap.parse_args()


PHOTO_W = 800
ASPECT_RATIOS = [1.0, 0.8, 16 / 9, 2.0, 4 / 5, 1.2, 3 / 4, 9 / 16]


def collect_tuples(post_count: int = 5000) -> list[tuple[int, int, int]]:
    """Mirror generateMockFeed → return unique (picsumId, w, h) for j=0.

    For i in [0, 5000), picsumId = (i*10) % 1000, aspectRatio = ASPECT_RATIOS[i % 8].
    Because gcd(100, 8) = 4, each picsumId maps to exactly 2 aspect ratios,
    yielding 200 unique tuples across the full mock feed.
    """
    seen: set[tuple[int, int, int]] = set()
    tuples: list[tuple[int, int, int]] = []
    for i in range(post_count):
        picsum_id = (i * 10) % 1000
        ar = ASPECT_RATIOS[i % len(ASPECT_RATIOS)]
        w = PHOTO_W
        h = round(w / ar)
        key = (picsum_id, w, h)
        if key not in seen:
            seen.add(key)
            tuples.append(key)
    return tuples


def main():
    args = parse_args()
    grid_width, grid_height = args.grid
    edges_only = args.edges

    if grid_width < 1 or grid_height < 1:
        print("grid dimensions must be >= 1", file=sys.stderr)
        sys.exit(1)

    tuples = collect_tuples()
    mode = f"{grid_width}×{grid_height}{' edges-only' if edges_only else ''}"
    print(f"Computing {mode} palettes for {len(tuples)} unique (id,w,h) tuples...", file=sys.stderr)

    output: dict = {}
    for n, (pid, w, h) in enumerate(tuples, 1):
        key = f"{pid}_{w}x{h}"
        print(f"[{n}/{len(tuples)}] {key}", file=sys.stderr)
        try:
            img = fetch(pid, w, h)
            swatches = extract_palette(img, grid_width, grid_height, edges_only)
        except Exception as e:
            print(f"  failed: {e}", file=sys.stderr)
            swatches = fallback_palette(grid_width, grid_height, edges_only)
        output[key] = {
            "gridWidth": grid_width,
            "gridHeight": grid_height,
            "swatches": swatches,
        }

    os.makedirs(os.path.dirname(args.output), exist_ok=True)
    with open(args.output, "w") as f:
        json.dump(output, f, indent=2)
    print(f"\nWrote {len(output)} palettes → {args.output}", file=sys.stderr)


if __name__ == "__main__":
    main()
