import { useState, useCallback } from "react";
import { Circle, Path, Text as SvgText } from "react-native-svg";
import Animated, { useAnimatedProps, useAnimatedReaction, runOnJS, type SharedValue } from "react-native-reanimated";

import { PADDING, PLOT_H, formatLabel, peakLabelFont, measureText, sampleDataAtX } from "../chart-utils";
import type { AnimatedSeriesData } from "../use-chart-animation";

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedSvgText = Animated.createAnimatedComponent(SvgText);

interface SvgPeakMarkerProps {
  series: AnimatedSeriesData;
  color: string;
  prevPeakX: SharedValue<number>;
  targetPeakX: SharedValue<number>;
  progress: SharedValue<number>;
}

/**
 * SVG peak marker: slides along X from old peak to new peak,
 * Y follows the likes curve at the current X position.
 */
export function SvgPeakMarker({ series, color, prevPeakX, targetPeakX, progress }: SvgPeakMarkerProps) {
  const [labelText, setLabelText] = useState("");

  const updateLabel = useCallback((text: string) => {
    setLabelText(text);
  }, []);

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
    const d = series.data.value;
    let best = 0;
    for (let i = 0; i < d.length; i++) if (d[i] > best) best = d[i];
    const label = formatLabel(Math.round(best));
    const textWidth = measureText(label, peakLabelFont);
    return { x: x - textWidth / 2, y: y - 8 };
  });

  useAnimatedReaction(
    () => {
      "worklet";
      const d = series.data.value;
      let best = 0;
      for (let i = 0; i < d.length; i++) if (d[i] > best) best = d[i];
      return formatLabel(Math.round(best));
    },
    (current) => {
      runOnJS(updateLabel)(current);
    }
  );

  return (
    <>
      <AnimatedPath animatedProps={lineProps} stroke={color} strokeWidth={0.5} strokeDasharray="3,3" fill="none" />
      <AnimatedCircle animatedProps={circleProps} fill={color} />
      <AnimatedSvgText animatedProps={textPositionProps} fontSize={8} fontWeight="bold" fontFamily="Helvetica" fill={color}>
        {labelText}
      </AnimatedSvgText>
    </>
  );
}
