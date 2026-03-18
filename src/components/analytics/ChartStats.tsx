import { View, Text } from "react-native";

import { FeedPost } from "@/data/mock-feed";
import { type ChartColors } from "./chart-utils";
import { AnimatedNumber } from "./AnimatedNumber";

const formatPercent = (n: number) => {
  "worklet";
  return n.toFixed(1);
};

export function ChartStats({ post, colors }: { post: FeedPost; colors: ChartColors }) {

  return (
    <View style={{ flexDirection: "row", marginTop: 10, paddingTop: 10, borderTopWidth: 0.5, borderTopColor: colors.border }}>
      <View style={{ flex: 1, alignItems: "center" }}>
        <AnimatedNumber value={post.analytics.reach} style={{ fontSize: 14, fontWeight: "700", color: colors.text }} />
        <Text style={{ fontSize: 10, color: colors.icon }}>Reach</Text>
      </View>
      <View style={{ flex: 1, alignItems: "center" }}>
        <AnimatedNumber value={post.analytics.impressions} style={{ fontSize: 14, fontWeight: "700", color: colors.text }} />
        <Text style={{ fontSize: 10, color: colors.icon }}>Impressions</Text>
      </View>
      <View style={{ flex: 1, alignItems: "center" }}>
        <AnimatedNumber value={post.analytics.engagementRate * 100} style={{ fontSize: 14, fontWeight: "700", color: colors.text }} suffix="%" formatFn={formatPercent} />
        <Text style={{ fontSize: 10, color: colors.icon }}>Eng. Rate</Text>
      </View>
      <View style={{ flex: 1, alignItems: "center" }}>
        <AnimatedNumber value={post.analytics.saves} style={{ fontSize: 14, fontWeight: "700", color: colors.text }} />
        <Text style={{ fontSize: 10, color: colors.icon }}>Saves</Text>
      </View>
    </View>
  );
}
