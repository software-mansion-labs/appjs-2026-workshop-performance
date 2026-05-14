import { Line, Text as SvgText, G } from "react-native-svg";

import { CHART_HEIGHT, PADDING, PLOT_W, PLOT_H, getGridYs, getGridLabels, getXLabelIndices, formatLabel, labelFont, measureText } from "../chart-utils";

interface SvgGridProps {
  maxVal: number;
  dataLength: number;
  borderColor: string;
  labelColor: string;
}

export function SvgGrid({ maxVal, dataLength, borderColor, labelColor }: SvgGridProps) {
  const gridYs = getGridYs();
  const gridLabels = getGridLabels(maxVal);
  const xIndices = getXLabelIndices(dataLength);
  const stepX = PLOT_W / (dataLength - 1);

  return (
    <>
      {/* Horizontal grid lines + Y labels */}
      {gridYs.map((y, i) => {
        const text = formatLabel(gridLabels[i]);
        const textWidth = measureText(text);
        return (
          <G key={`grid-${i}`}>
            <Line x1={PADDING.left} y1={y} x2={PADDING.left + PLOT_W} y2={y} stroke={borderColor} strokeWidth={0.5} strokeDasharray="4,3" />
            <SvgText x={PADDING.left - 6 - textWidth} y={y + 3} fontSize={9} fontFamily="Helvetica" fill={labelColor}>
              {text}
            </SvgText>
          </G>
        );
      })}

      {/* X labels */}
      {xIndices.map(idx => {
        const text = `D${idx + 1}`;
        const textWidth = measureText(text);
        return (
          <SvgText key={`xlabel-${idx}`} x={PADDING.left + idx * stepX - textWidth / 2} y={CHART_HEIGHT - 6} fontSize={9} fontFamily="Helvetica" fill={labelColor}>
            {text}
          </SvgText>
        );
      })}

      {/* Axis lines */}
      <Line x1={PADDING.left} y1={PADDING.top} x2={PADDING.left} y2={PADDING.top + PLOT_H} stroke={borderColor} strokeWidth={1} />
      <Line x1={PADDING.left} y1={PADDING.top + PLOT_H} x2={PADDING.left + PLOT_W} y2={PADDING.top + PLOT_H} stroke={borderColor} strokeWidth={1} />
    </>
  );
}
