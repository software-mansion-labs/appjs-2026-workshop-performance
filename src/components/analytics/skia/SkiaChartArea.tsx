import { type ReactNode } from "react";
import { Canvas } from "@shopify/react-native-skia";

import { CHART_WIDTH, CHART_HEIGHT } from "../chart-utils";

interface SkiaChartAreaProps {
  bgColor: string;
  children: ReactNode;
}

export function SkiaChartArea({ children }: SkiaChartAreaProps) {
  return (
    <Canvas style={{ width: CHART_WIDTH, height: CHART_HEIGHT }}>
      {children}
    </Canvas>
  );
}
