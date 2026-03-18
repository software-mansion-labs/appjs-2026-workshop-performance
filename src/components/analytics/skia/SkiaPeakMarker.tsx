import { Path as SkiaPath, Circle as SkiaCircle, Text as SkiaText, DashPathEffect } from "@shopify/react-native-skia";
import { useDerivedValue, type SharedValue } from "react-native-reanimated";

import { PADDING, PLOT_H, formatLabel, findPeakValue, peakLabelFont, measureText, sampleDataAtX } from "../chart-utils";
import type { AnimatedSeriesData } from "../use-chart-animation";

interface SkiaPeakMarkerProps {
  series: AnimatedSeriesData;
  color: string;
  prevPeakX: SharedValue<number>;
  targetPeakX: SharedValue<number>;
  progress: SharedValue<number>;
}

/**
 * Skia peak marker: slides along X from old peak to new peak,
 * Y follows the likes curve at the current X position.
 */
export function SkiaPeakMarker({ series, color, prevPeakX, targetPeakX, progress }: SkiaPeakMarkerProps) {
  // X interpolates linearly between old and new peak
  const markerX = useDerivedValue(() => {
    "worklet";
    return prevPeakX.value + (targetPeakX.value - prevPeakX.value) * progress.value;
  });

  // Y samples the current (interpolated) likes curve at markerX
  const markerY = useDerivedValue(() => {
    "worklet";
    return sampleDataAtX(series.data.value, series.max.value, markerX.value);
  });

  const peakLinePath = useDerivedValue(() => {
    "worklet";
    const x = markerX.value;
    return `M ${x} ${PADDING.top} L ${x} ${PADDING.top + PLOT_H}`;
  });

  const peakLabel = useDerivedValue(() => {
    "worklet";
    return formatLabel(Math.round(findPeakValue(series.data.value)));
  });

  const peakLabelX = useDerivedValue(() => {
    "worklet";
    const label = peakLabel.value;
    const textWidth = measureText(label, peakLabelFont);
    return markerX.value - textWidth / 2;
  });

  const peakLabelY = useDerivedValue(() => {
    "worklet";
    return markerY.value - 8;
  });

  return (
    <>
      <SkiaPath path={peakLinePath} color={color} style="stroke" strokeWidth={0.5}>
        <DashPathEffect intervals={[3, 3]} />
      </SkiaPath>
      <SkiaCircle cx={markerX} cy={markerY} r={3} color={color} />
      <SkiaText x={peakLabelX} y={peakLabelY} text={peakLabel} font={peakLabelFont} color={color} />
    </>
  );
}
