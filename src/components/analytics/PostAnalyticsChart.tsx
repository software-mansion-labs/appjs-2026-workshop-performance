import { View } from "react-native";

import { FeedPost } from "@/data/mock-feed";
import { type DataSeries, type ChartColors, SERIES_CONFIG, ALL_SERIES } from "./chart-utils";
import { useChartAnimation } from "./use-chart-animation";
import { type Renderer } from "./renderers";
import { ChartPostHeader } from "./ChartPostHeader";
import { ChartLegend } from "./ChartLegend";
import { ChartStats } from "./ChartStats";

interface PostAnalyticsChartProps {
  post: FeedPost;
  colors: ChartColors;
  renderer: Renderer;
  enabledSeries?: Set<DataSeries>;
  days?: number;
}

export function PostAnalyticsChart({ post, colors, renderer: R, enabledSeries, days = 30 }: PostAnalyticsChartProps) {
  const show = (s: DataSeries) => !enabledSeries || enabledSeries.has(s);
  const anim = useChartAnimation(post, days);

  return (
    <View style={{ backgroundColor: colors.cardBackground, borderRadius: 12, padding: 12, marginHorizontal: 16, marginBottom: 12, borderWidth: 0.5, borderColor: colors.border }}>
      <ChartPostHeader post={post} colors={colors} />

      <R.ChartArea bgColor={colors.cardBackground}>
        <R.GradientDefs postId={post.id} series={[...ALL_SERIES]} />
        <R.Grid maxVal={anim.maxLikes} dataLength={anim.rawLikes.length} borderColor={colors.border} labelColor={colors.icon} />

        {ALL_SERIES.map(key =>
          show(key) ? (
            <R.SeriesLine
              key={key}
              series={anim[key]}
              config={SERIES_CONFIG[key]}
              gradientId={`${key}-grad-${post.id}`}
              bgColor={colors.cardBackground}
              dataLength={anim.rawLikes.length}
            />
          ) : null
        )}

        {show("likes") && <R.PeakMarker series={anim.likes} color={SERIES_CONFIG.likes.color} prevPeakX={anim.prevPeakX} targetPeakX={anim.targetPeakX} progress={anim.progress} />}
      </R.ChartArea>

      <ChartLegend colors={colors} />
      <ChartStats post={post} colors={colors} />
    </View>
  );
}
