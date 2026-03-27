import { Circle, Path, Text as SvgText, TSpan } from "react-native-svg";
import Animated, { useAnimatedProps, type SharedValue } from "react-native-reanimated";

import { PADDING, PLOT_H, formatLabel, findPeakValue, peakLabelFont, measureText, sampleDataAtX } from "../chart-utils";
import type { AnimatedSeriesData } from "../use-chart-animation";

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedSvgText = Animated.createAnimatedComponent(SvgText);
const AnimatedTSpan = Animated.createAnimatedComponent(TSpan);

interface SvgPeakMarkerProps {
  series: AnimatedSeriesData;
  color: string;
  prevPeakX: SharedValue<number>;
  targetPeakX: SharedValue<number>;
  progress: SharedValue<number>;
}

export function SvgPeakMarker({ series, color, prevPeakX, targetPeakX, progress }: SvgPeakMarkerProps) {
  // Initial label for first render (before worklet kicks in)
  const initialLabel = formatLabel(Math.round(Math.max(...(series.data.value ?? [0]))));

  const lineProps = useAnimatedProps(() => {
    "worklet";
    const x = prevPeakX.value + (targetPeakX.value - prevPeakX.value) * progress.value;
    return { d: `M ${x} ${PADDING.top} L ${x} ${PADDING.top + PLOT_H}` };
  });

  const circleProps = useAnimatedProps(() => {
    "worklet";
    const x = prevPeakX.value + (targetPeakX.value - prevPeakX.value) * progress.value;
    const y = sampleDataAtX(series.data.value, series.max.value, x);
    return { cx: x, cy: y, r: 3 };
  });

  const textPositionProps = useAnimatedProps(() => {
    "worklet";
    const x = prevPeakX.value + (targetPeakX.value - prevPeakX.value) * progress.value;
    const y = sampleDataAtX(series.data.value, series.max.value, x);
    const label = formatLabel(Math.round(findPeakValue(series.data.value)));
    const textWidth = measureText(label, peakLabelFont);
    return { x: x - textWidth / 2, y: y - 8 };
  });

  // TSpan has an internal native `content` prop (not in public TS types, hence `as any`).
  // This lets us animate text on the UI thread via useAnimatedProps — avoiding
  // runOnJS + setState which would cause JS thread work every frame.
  // SVG <Text> only accepts text as React children (not animatable),
  // but TSpan's native layer (iOS: RNSVGTSpanManager, Android: TSpanView)
  // exposes `content` as a string prop that we can target directly.
  const tspanProps = useAnimatedProps(() => {
    "worklet";
    return { content: formatLabel(Math.round(findPeakValue(series.data.value))) };
  });

  return (
    <>
      <AnimatedPath animatedProps={lineProps} stroke={color} strokeWidth={0.5} strokeDasharray="3,3" fill="none" />
      <AnimatedCircle animatedProps={circleProps} fill={color} />
      <AnimatedSvgText animatedProps={textPositionProps} fontSize={8} fontWeight="bold" fontFamily="Helvetica" fill={color}>
        <AnimatedTSpan animatedProps={tspanProps as any}>{initialLabel}</AnimatedTSpan>
      </AnimatedSvgText>
    </>
  );
}
