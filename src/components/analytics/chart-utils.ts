import { Platform } from "react-native";
import { matchFont } from "@shopify/react-native-skia";

// --- Shared fonts (used by both SVG and Skia for consistent measurement) ---

const fontFamily = Platform.select({ ios: "Helvetica", default: "sans-serif" });
export const labelFont = matchFont({ fontFamily: fontFamily!, fontSize: 9 });
export const peakLabelFont = matchFont({ fontFamily: fontFamily!, fontSize: 8, fontWeight: "bold" as const });

export function measureText(text: string, font: ReturnType<typeof matchFont> = labelFont): number {
  "worklet";
  return font.measureText(text).width;
}

// --- Layout constants ---

export const CHART_WIDTH = 340;
export const CHART_HEIGHT = 180;
export const PADDING = { top: 20, right: 16, bottom: 30, left: 40 };
export const PLOT_W = CHART_WIDTH - PADDING.left - PADDING.right;
export const PLOT_H = CHART_HEIGHT - PADDING.top - PADDING.bottom;

// --- Types ---

/** Ordered back-to-front for rendering (first drawn = behind) */
export const ALL_SERIES = ["shares", "comments", "likes"] as const;

export type DataSeries = (typeof ALL_SERIES)[number];

export interface ChartColors {
  text: string;
  icon: string;
  cardBackground: string;
  border: string;
  tint: string;
}

export interface SeriesConfig {
  color: string;
  starOuter: number;
  starInner: number;
  lineWidth: number;
  gradientOpacity: [number, number];
}

export const SERIES_CONFIG: Record<DataSeries, SeriesConfig> = {
  likes: { color: "#6C5CE7", starOuter: 4, starInner: 1.8, lineWidth: 2, gradientOpacity: [0.3, 0.02] },
  comments: { color: "#00B894", starOuter: 3.5, starInner: 1.5, lineWidth: 1.5, gradientOpacity: [0.2, 0.01] },
  shares: { color: "#FDCB6E", starOuter: 3.5, starInner: 1.5, lineWidth: 1.5, gradientOpacity: [0.25, 0.02] },
};

// --- Path string builders (worklet-safe) ---

export function buildLinePath(data: number[], maxVal: number): string {
  "worklet";
  if (data.length === 0) return "";
  const stepX = PLOT_W / (data.length - 1);
  return data
    .map((val, i) => {
      const x = PADDING.left + i * stepX;
      const y = PADDING.top + PLOT_H - (val / maxVal) * PLOT_H;
      return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

export function buildAreaPath(data: number[], maxVal: number): string {
  "worklet";
  const line = buildLinePath(data, maxVal);
  if (!line) return "";
  const stepX = PLOT_W / (data.length - 1);
  const lastX = PADDING.left + (data.length - 1) * stepX;
  const baseline = PADDING.top + PLOT_H;
  return `${line} L ${lastX.toFixed(1)} ${baseline} L ${PADDING.left} ${baseline} Z`;
}

export function starPath(cx: number, cy: number, outerR: number, innerR: number, pts = 5): string {
  "worklet";
  const step = Math.PI / pts;
  const parts: string[] = [];
  for (let i = 0; i < 2 * pts; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = i * step - Math.PI / 2;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    parts.push(`${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return parts.join(" ") + " Z";
}

export function buildStarsPath(data: number[], maxVal: number, outerR: number, innerR: number): string {
  "worklet";
  let s = "";
  const stepX = PLOT_W / (data.length - 1);
  for (let i = 0; i < data.length; i++) {
    const cx = PADDING.left + i * stepX;
    const cy = PADDING.top + PLOT_H - (data[i] / maxVal) * PLOT_H;
    s += starPath(cx, cy, outerR, innerR) + " ";
  }
  return s;
}

// --- Math helpers (worklet-safe) ---

export function lerpArrays(a: number[], b: number[], t: number): number[] {
  "worklet";
  const len = Math.max(a.length, b.length);
  const result: number[] = [];
  for (let i = 0; i < len; i++) {
    const va = i < a.length ? a[i] : 0;
    const vb = i < b.length ? b[i] : 0;
    result.push(va + (vb - va) * t);
  }
  return result;
}

export function getPointX(index: number, total: number): number {
  "worklet";
  const stepX = PLOT_W / (total - 1);
  return PADDING.left + index * stepX;
}

/** Interpolate Y value from data at a fractional X position */
export function sampleDataAtX(data: number[], maxVal: number, x: number): number {
  "worklet";
  if (data.length === 0) return PADDING.top + PLOT_H;
  const stepX = PLOT_W / (data.length - 1);
  const fractionalIdx = (x - PADDING.left) / stepX;
  const i0 = Math.max(0, Math.min(data.length - 1, Math.floor(fractionalIdx)));
  const i1 = Math.min(data.length - 1, i0 + 1);
  const frac = fractionalIdx - i0;
  const val = data[i0] + (data[i1] - data[i0]) * frac;
  return PADDING.top + PLOT_H - (val / maxVal) * PLOT_H;
}

export function findPeakIndex(data: number[]): number {
  "worklet";
  let idx = 0;
  let best = 0;
  for (let i = 0; i < data.length; i++) {
    if (data[i] > best) { best = data[i]; idx = i; }
  }
  return idx;
}

export function formatLabel(val: number): string {
  "worklet";
  return val > 999 ? (val / 1000).toFixed(1) + "k" : Math.round(val).toString();
}

// --- Grid helpers ---

export function getGridYs(lines = 4): number[] {
  return Array.from({ length: lines }, (_, i) =>
    PADDING.top + (PLOT_H / (lines - 1)) * i
  );
}

export function getGridLabels(maxVal: number, lines = 4): number[] {
  return Array.from({ length: lines }, (_, i) =>
    Math.round(maxVal * (1 - i / (lines - 1)))
  );
}

export function getXLabelIndices(dataLength: number, count = 4): number[] {
  if (dataLength <= 1) return [0];
  return Array.from({ length: count }, (_, i) =>
    Math.round((i / (count - 1)) * (dataLength - 1))
  );
}
