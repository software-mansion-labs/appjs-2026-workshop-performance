import { type ComponentType, type ReactNode } from "react";
import { type SharedValue } from "react-native-reanimated";

import { type DataSeries, type SeriesConfig } from "./chart-utils";
import { type AnimatedSeriesData } from "./use-chart-animation";

import { SkiaChartArea } from "./skia/SkiaChartArea";
import { SkiaGradientDefs } from "./skia/SkiaGradientDefs";
import { SkiaGrid } from "./skia/SkiaGrid";
import { SkiaSeriesLine } from "./skia/SkiaSeriesLine";
import { SkiaPeakMarker } from "./skia/SkiaPeakMarker";

export interface Renderer {
  ChartArea: ComponentType<{ bgColor: string; children: ReactNode }>;
  GradientDefs: ComponentType<{ postId: string; series: DataSeries[] }>;
  Grid: ComponentType<{ maxVal: number; dataLength: number; borderColor: string; labelColor: string }>;
  SeriesLine: ComponentType<{ series: AnimatedSeriesData; config: SeriesConfig; gradientId: string; bgColor: string; dataLength: number }>;
  PeakMarker: ComponentType<{ series: AnimatedSeriesData; color: string; prevPeakX: SharedValue<number>; targetPeakX: SharedValue<number>; progress: SharedValue<number> }>;
}

export const SkiaRenderer: Renderer = {
  ChartArea: SkiaChartArea,
  GradientDefs: SkiaGradientDefs,
  Grid: SkiaGrid,
  SeriesLine: SkiaSeriesLine,
  PeakMarker: SkiaPeakMarker,
};
