import { type DataSeries } from "../chart-utils";

/**
 * No-op: Skia doesn't need a separate gradient definitions block.
 * Gradients are applied inline as children of <Path> in SkiaSeriesLine.
 *
 * This component exists so SVG and Skia chart compositions look identical.
 */
export function SkiaGradientDefs(_props: { postId: string; series: DataSeries[] }) {
  return null;
}
