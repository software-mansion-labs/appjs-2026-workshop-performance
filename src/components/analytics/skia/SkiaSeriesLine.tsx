import { Path as SkiaPath, LinearGradient, vec } from "@shopify/react-native-skia";
import { useDerivedValue } from "react-native-reanimated";

import { PADDING, PLOT_H, type SeriesConfig, buildLinePath, buildAreaPath, buildStarsPath } from "../chart-utils";
import type { AnimatedSeriesData } from "../use-chart-animation";

interface SkiaSeriesLineProps {
  series: AnimatedSeriesData;
  config: SeriesConfig;
  bgColor: string;
  gradientId?: string;   // ignored — Skia uses inline gradients
  dataLength?: number;   // ignored — Skia reads from series.data
}

/**
 * Skia series: area gradient + line + all stars in ONE merged path.
 *
 * Everything renders inside a single Canvas — no matter how many
 * data points, it's always just draw commands, not native views.
 */
export function SkiaSeriesLine({ series, config, bgColor }: SkiaSeriesLineProps) {
  const areaPath = useDerivedValue(() => {
    "worklet";
    return buildAreaPath(series.data.value, series.max.value);
  });

  const linePath = useDerivedValue(() => {
    "worklet";
    return buildLinePath(series.data.value, series.max.value);
  });

  // All stars merged into a single path string
  const starsPath = useDerivedValue(() => {
    "worklet";
    return buildStarsPath(series.data.value, series.max.value, config.starOuter, config.starInner);
  });

  const [opTop, opBottom] = config.gradientOpacity;
  const colorTop = config.color + Math.round(opTop * 255).toString(16).padStart(2, "0");
  const colorBottom = config.color + Math.round(opBottom * 255).toString(16).padStart(2, "0");

  return (
    <>
      <SkiaPath path={areaPath}>
        <LinearGradient start={vec(0, PADDING.top)} end={vec(0, PADDING.top + PLOT_H)} colors={[colorTop, colorBottom]} />
      </SkiaPath>
      <SkiaPath path={linePath} color={config.color} style="stroke" strokeWidth={config.lineWidth} strokeJoin="round" strokeCap="round" />
      <SkiaPath path={starsPath} color={config.color} />
      <SkiaPath path={starsPath} color={bgColor} style="stroke" strokeWidth={0.5} />
    </>
  );
}
