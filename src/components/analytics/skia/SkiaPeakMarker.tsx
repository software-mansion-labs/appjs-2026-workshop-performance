import { Path as SkiaPath, Circle as SkiaCircle, Text as SkiaText, DashPathEffect } from "@shopify/react-native-skia";
import { useDerivedValue, type SharedValue } from "react-native-reanimated";

import { PADDING, PLOT_H, formatLabel, peakLabelFont, measureText, sampleDataAtX } from "../chart-utils";
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
    const d = series.data.value;
    const x = markerX.value;
    // Sample value at current X
    const stepX = d.length > 1 ? (PADDING.left + ((d.length - 1) * (x - PADDING.left)) / (x - PADDING.left + 0.001)) : 0;
    // Simpler: just read from sampleDataAtX inverted
    let best = 0;
    for (let i = 0; i < d.length; i++) {
      if (d[i] > best) best = d[i];
    }
    // During animation show interpolated peak value
    const frac = progress.value;
    const oldPeak = (() => { let b = 0; for (let i = 0; i < d.length; i++) if (d[i] > b) b = d[i]; return b; })();
    return formatLabel(Math.round(oldPeak));
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
