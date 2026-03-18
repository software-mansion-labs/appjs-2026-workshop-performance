import { Path } from "react-native-svg";
import Animated, { useAnimatedProps } from "react-native-reanimated";

import { type SeriesConfig, buildLinePath, buildAreaPath, starPath, getPointX, PADDING, PLOT_H } from "../chart-utils";
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
 * SVG series: area gradient + line + individual animated star Path per data point.
 *
 * Each star is a separate native RNSVGPath view — this is what makes
 * SVG heavy with many data points. N data points = N native views.
 */
export function SvgSeriesLine({ series, config, gradientId, bgColor, dataLength }: SvgSeriesLineProps) {
  const areaProps = useAnimatedProps(() => {
    "worklet";
    return { d: buildAreaPath(series.data.value, series.max.value) };
  });

  const lineProps = useAnimatedProps(() => {
    "worklet";
    return { d: buildLinePath(series.data.value, series.max.value) };
  });

  // Stars — one useAnimatedProps per data point (N native views!)
  const starProps = Array.from({ length: dataLength }, (_, i) =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useAnimatedProps(() => {
      "worklet";
      const data = series.data.value;
      const max = series.max.value;
      const val = i < data.length ? data[i] : 0;
      const cx = getPointX(i, data.length);
      const cy = PADDING.top + PLOT_H - (val / max) * PLOT_H;
      return { d: starPath(cx, cy, config.starOuter, config.starInner) };
    })
  );

  return (
    <>
      <AnimatedPath animatedProps={areaProps} fill={`url(#${gradientId})`} />
      <AnimatedPath animatedProps={lineProps} stroke={config.color} strokeWidth={config.lineWidth} fill="none" strokeLinejoin="round" strokeLinecap="round" />
      {starProps.map((props, i) => (
        <AnimatedPath key={`star-${i}`} animatedProps={props} fill={config.color} stroke={bgColor} strokeWidth={0.5} />
      ))}
    </>
  );
}
