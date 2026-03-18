import { Path } from "react-native-svg";
import Animated, { useAnimatedProps } from "react-native-reanimated";

import { type SeriesConfig, buildLinePath, buildAreaPath, buildStarsPath } from "../chart-utils";
import type { AnimatedSeriesData } from "../use-chart-animation";

const AnimatedPath = Animated.createAnimatedComponent(Path);

interface SvgSeriesLineProps {
  series: AnimatedSeriesData;
  config: SeriesConfig;
  gradientId: string;
  bgColor: string;
  dataLength: number;
}

/**
 * SVG series: area gradient + line + all stars merged into one Path.
 *
 * Despite being a single React element, the native RNSVGPath still has to
 * parse and render ~11,000 path commands (10 segments × N stars) every frame.
 * This is invisible from JS but heavy on the native UI thread.
 */
export function SvgSeriesLine({ series, config, gradientId, bgColor }: SvgSeriesLineProps) {
  const areaProps = useAnimatedProps(() => {
    "worklet";
    return { d: buildAreaPath(series.data.value, series.max.value) };
  });

  const lineProps = useAnimatedProps(() => {
    "worklet";
    return { d: buildLinePath(series.data.value, series.max.value) };
  });

  // All stars merged into one path string — 1 React element, 1 native view,
  // but the native view parses a massive `d` string every frame
  const starsProps = useAnimatedProps(() => {
    "worklet";
    return { d: buildStarsPath(series.data.value, series.max.value, config.starOuter, config.starInner) };
  });

  return (
    <>
      <AnimatedPath animatedProps={areaProps} fill={`url(#${gradientId})`} />
      <AnimatedPath animatedProps={lineProps} stroke={config.color} strokeWidth={config.lineWidth} fill="none" strokeLinejoin="round" strokeLinecap="round" />
      <AnimatedPath animatedProps={starsProps} fill={config.color} stroke={bgColor} strokeWidth={0.5} />
    </>
  );
}
