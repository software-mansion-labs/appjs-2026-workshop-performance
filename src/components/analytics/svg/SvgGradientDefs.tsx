import { Defs, LinearGradient, Stop } from "react-native-svg";

import { type DataSeries, SERIES_CONFIG } from "../chart-utils";

interface SvgGradientDefsProps {
  postId: string;
  series: DataSeries[];
}

/**
 * SVG requires gradient definitions in a <Defs> block, referenced by id.
 * Each gradient = 3 native nodes (LinearGradient + 2 Stop).
 */
export function SvgGradientDefs({ postId, series }: SvgGradientDefsProps) {
  return (
    <Defs>
      {series.map(key => {
        const cfg = SERIES_CONFIG[key];
        return (
          <LinearGradient key={key} id={`${key}-grad-${postId}`} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={cfg.color} stopOpacity={String(cfg.gradientOpacity[0])} />
            <Stop offset="1" stopColor={cfg.color} stopOpacity={String(cfg.gradientOpacity[1])} />
          </LinearGradient>
        );
      })}
    </Defs>
  );
}
