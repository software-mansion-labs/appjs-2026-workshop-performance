#!/usr/bin/env node
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";

import sharp from "sharp";

const { values: args } = parseArgs({
  options: {
    "bits-per-channel": { type: "string", default: "6" },
    "grid-width": { type: "string", default: "3" },
    "grid-height": { type: "string", default: "3" },
    "edges-only": { type: "string", default: "true" },
    "downsample": { type: "string", default: "false" },
    "downsample-target-size": { type: "string", default: "200" },
    "post-count": { type: "string", default: "5000" },
    "concurrency": { type: "string", default: "8" },
    "retries": { type: "string", default: "3" },
  },
});

const config = {
  bitsPerChannel: parseInt(args["bits-per-channel"], 10),
  gridWidth: parseInt(args["grid-width"], 10),
  gridHeight: parseInt(args["grid-height"], 10),
  edgesOnly: args["edges-only"] === "true",
  downsample: args["downsample"] === "true",
  downsampleTargetSize: parseInt(args["downsample-target-size"], 10),
};
const postCount = parseInt(args["post-count"], 10);
const concurrency = parseInt(args["concurrency"], 10);
const maxRetries = parseInt(args["retries"], 10);

// Mirror constants from src/data/mock-feed.ts
const PHOTO_SIZE = 800;
const ASPECT_RATIOS = [1, 0.8, 16 / 9, 2, 4 / 5, 1.2, 3 / 4, 9 / 16];

function picsumUrl(picsumId, aspectRatio) {
  const w = PHOTO_SIZE;
  const h = Math.round(w / aspectRatio);
  return `https://picsum.photos/seed/${picsumId}/${w}/${h}`;
}

const postIdToUri = new Map();
const uriToPostIds = new Map();
for (let i = 0; i < postCount; i++) {
  const aspectRatio = ASPECT_RATIOS[i % ASPECT_RATIOS.length];
  const picsumId = (i * 10) % 1000;
  const uri = picsumUrl(picsumId, aspectRatio);
  const postId = String(i + 1);
  postIdToUri.set(postId, uri);
  if (!uriToPostIds.has(uri)) uriToPostIds.set(uri, []);
  uriToPostIds.get(uri).push(postId);
}

const uniqueUris = [...uriToPostIds.keys()];

// Direct port of modules/image-palette/ios/HistogramQuantizer.swift + ColorMath.swift.

function isEdge(row, col, gridHeight, gridWidth) {
  return row === 0 || row === gridHeight - 1 || col === 0 || col === gridWidth - 1;
}

function saturation(r, g, b) {
  const rf = r / 255, gf = g / 255, bf = b / 255;
  const maxC = Math.max(rf, gf, bf);
  const minC = Math.min(rf, gf, bf);
  if (maxC === minC) return 0;
  const l = (maxC + minC) / 2;
  const d = maxC - minC;
  return l > 0.5 ? d / (2 - maxC - minC) : d / (maxC + minC);
}

function hueToRgb(p, q, t) {
  let tt = t;
  if (tt < 0) tt += 1;
  if (tt > 1) tt -= 1;
  if (tt < 1 / 6) return p + (q - p) * 6 * tt;
  if (tt < 1 / 2) return q;
  if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
  return p;
}

function boostSaturation(r, g, b, factor) {
  const rf = r / 255, gf = g / 255, bf = b / 255;
  const maxC = Math.max(rf, gf, bf);
  const minC = Math.min(rf, gf, bf);
  const l = (maxC + minC) / 2;
  if (maxC === minC) return { r, g, b };
  const d = maxC - minC;
  const s = l > 0.5 ? d / (2 - maxC - minC) : d / (maxC + minC);
  let h;
  if (maxC === rf) h = ((gf - bf) / d + (gf < bf ? 6 : 0)) / 6;
  else if (maxC === gf) h = ((bf - rf) / d + 2) / 6;
  else h = ((rf - gf) / d + 4) / 6;
  const sBoosted = Math.min(1, s * factor);
  const q = l < 0.5 ? l * (1 + sBoosted) : l + sBoosted - l * sBoosted;
  const p = 2 * l - q;
  return {
    r: Math.round(hueToRgb(p, q, h + 1 / 3) * 255),
    g: Math.round(hueToRgb(p, q, h) * 255),
    b: Math.round(hueToRgb(p, q, h - 1 / 3) * 255),
  };
}

const SATURATION_BOOST = 1.7;
const SATURATION_FLOOR = 0.05;

function pickSwatch(hist, row, col, channelMask, restoreMult, restoreOffset, secondShift, bitsPerChannel) {
  let bestKey = null;
  let bestScore = -1;
  for (const [key, population] of hist) {
    const rq = (key >> secondShift) & channelMask;
    const gq = (key >> bitsPerChannel) & channelMask;
    const bq = key & channelMask;
    const r = rq * restoreMult + restoreOffset;
    const g = gq * restoreMult + restoreOffset;
    const b = bq * restoreMult + restoreOffset;
    const s = saturation(r, g, b);
    const score = population * (s + SATURATION_FLOOR);
    if (score > bestScore) {
      bestScore = score;
      bestKey = key;
    }
  }
  if (bestKey === null) {
    return { row, col, r: 128, g: 128, b: 128, population: 1 };
  }
  const rq = (bestKey >> secondShift) & channelMask;
  const gq = (bestKey >> bitsPerChannel) & channelMask;
  const bq = bestKey & channelMask;
  const baseR = rq * restoreMult + restoreOffset;
  const baseG = gq * restoreMult + restoreOffset;
  const baseB = bq * restoreMult + restoreOffset;
  const boosted = boostSaturation(baseR, baseG, baseB, SATURATION_BOOST);
  return { row, col, r: boosted.r, g: boosted.g, b: boosted.b, population: hist.get(bestKey) };
}

function quantize(pixels, width, height, cfg) {
  const { bitsPerChannel, gridWidth, gridHeight, edgesOnly } = cfg;
  const bytesPerRow = width * 4;
  const cellWidth = Math.max(1, Math.floor(width / gridWidth));
  const cellHeight = Math.max(1, Math.floor(height / gridHeight));
  const channelShift = 8 - bitsPerChannel;
  const channelMask = (1 << bitsPerChannel) - 1;
  const restoreMult = 1 << channelShift;
  const restoreOffset = restoreMult >> 1;
  const secondShift = bitsPerChannel * 2;

  const histograms = Array.from({ length: gridWidth * gridHeight }, () => new Map());

  for (let y = 0; y < height; y++) {
    const row = Math.min(Math.floor(y / cellHeight), gridHeight - 1);
    const rowOffset = y * bytesPerRow;
    for (let x = 0; x < width; x++) {
      const col = Math.min(Math.floor(x / cellWidth), gridWidth - 1);
      if (edgesOnly && !isEdge(row, col, gridHeight, gridWidth)) continue;
      const i = rowOffset + x * 4;
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      const rq = r >> channelShift;
      const gq = g >> channelShift;
      const bq = b >> channelShift;
      const key = (rq << secondShift) | (gq << bitsPerChannel) | bq;
      const regionIndex = row * gridWidth + col;
      histograms[regionIndex].set(key, (histograms[regionIndex].get(key) || 0) + 1);
    }
  }

  const swatches = [];
  for (let row = 0; row < gridHeight; row++) {
    for (let col = 0; col < gridWidth; col++) {
      if (edgesOnly && !isEdge(row, col, gridHeight, gridWidth)) continue;
      const regionIndex = row * gridWidth + col;
      swatches.push(
        pickSwatch(histograms[regionIndex], row, col, channelMask, restoreMult, restoreOffset, secondShift, bitsPerChannel),
      );
    }
  }
  return swatches;
}

async function fetchWithRetry(uri) {
  let lastErr;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(uri, { redirect: "follow" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return Buffer.from(await res.arrayBuffer());
    } catch (e) {
      lastErr = e;
      if (attempt < maxRetries) {
        await new Promise(r => setTimeout(r, 500 * attempt));
      }
    }
  }
  throw lastErr;
}

async function computePaletteForUri(uri) {
  const buf = await fetchWithRetry(uri);
  let pipeline = sharp(buf);
  if (config.downsample) {
    pipeline = pipeline.resize({
      width: config.downsampleTargetSize,
      height: config.downsampleTargetSize,
      fit: "inside",
      withoutEnlargement: true,
    });
  }
  const { data, info } = await pipeline.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const swatches = quantize(data, info.width, info.height, config);
  return { gridWidth: config.gridWidth, gridHeight: config.gridHeight, swatches };
}

async function processInBatches(items, fn) {
  const results = new Map();
  let cursor = 0;
  let done = 0;
  const total = items.length;

  async function worker() {
    while (cursor < items.length) {
      const idx = cursor++;
      const item = items[idx];
      try {
        const r = await fn(item);
        results.set(item, r);
      } catch (e) {
        console.error(`\n  ✗ ${item}: ${e.message}`);
      }
      done++;
      process.stdout.write(`\r  ${done}/${total}`);
    }
  }

  await Promise.all(Array.from({ length: concurrency }, () => worker()));
  process.stdout.write("\n");
  return results;
}

console.log(`config: ${JSON.stringify(config)}`);
console.log(`posts: ${postCount}, unique URLs after dedup: ${uniqueUris.length}, concurrency: ${concurrency}`);
console.log("computing palettes...");

const t0 = Date.now();
const uriToPalette = await processInBatches(uniqueUris, computePaletteForUri);
const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
console.log(`done in ${elapsed}s — ${uriToPalette.size}/${uniqueUris.length} succeeded`);

// Build shared-palette output: list of unique palettes + postId -> palette index.
const paletteList = [];
const uriToIndex = new Map();
for (const uri of uniqueUris) {
  const palette = uriToPalette.get(uri);
  if (!palette) continue;
  uriToIndex.set(uri, paletteList.length);
  paletteList.push(palette);
}

const postIdToIndex = [];
for (const [postId, uri] of postIdToUri) {
  const idx = uriToIndex.get(uri);
  if (idx !== undefined) postIdToIndex.push([postId, idx]);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const outPath = resolve(__dirname, "..", "src", "data", "mock-palettes.ts");

const palettesLiteral = paletteList
  .map(p => {
    const sw = p.swatches
      .map(s => `{r:${s.r},g:${s.g},b:${s.b},row:${s.row},col:${s.col},population:${s.population}}`)
      .join(",");
    return `{gridWidth:${p.gridWidth},gridHeight:${p.gridHeight},swatches:[${sw}]}`;
  })
  .join(",\n  ");

const mapLiteral = postIdToIndex.map(([postId, idx]) => `  "${postId}": P[${idx}]`).join(",\n");

const tsContent = `// Auto-generated by scripts/generate-palettes.mjs. Do not edit by hand.
import type { DominantColorsResult } from "image-palette";

const P: DominantColorsResult[] = [
  ${palettesLiteral},
];

export const MOCK_PALETTES: Record<string, DominantColorsResult> = {
${mapLiteral},
};
`;

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, tsContent);
console.log(`wrote ${outPath} (${paletteList.length} unique palettes, ${postIdToIndex.length} postId entries)`);
