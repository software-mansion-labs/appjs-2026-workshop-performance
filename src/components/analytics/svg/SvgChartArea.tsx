import { type ReactNode } from "react";
import Svg, { Rect } from "react-native-svg";

import { CHART_WIDTH, CHART_HEIGHT, PADDING, PLOT_W, PLOT_H } from "../chart-utils";

interface SvgChartAreaProps {
  bgColor: string;
  children: ReactNode;
}

export function SvgChartArea({ bgColor, children }: SvgChartAreaProps) {
  return (
    <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
      <Rect x={PADDING.left} y={PADDING.top} width={PLOT_W} height={PLOT_H} fill={bgColor} rx={4} />
      {children}
    </Svg>
  );
}
