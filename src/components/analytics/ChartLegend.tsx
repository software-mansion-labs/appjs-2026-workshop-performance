import { View, Text } from "react-native";

import { type DataSeries, type ChartColors, SERIES_CONFIG } from "./chart-utils";

const LABELS: Record<DataSeries, string> = {
  likes: "Likes",
  comments: "Comments",
  shares: "Shares",
};

export function ChartLegend({ colors }: { colors: ChartColors }) {
  return (
    <View style={{ flexDirection: "row", gap: 16, marginTop: 6, paddingLeft: 4 }}>
      {(["likes", "comments", "shares"] as DataSeries[]).map(key => (
        <View key={key} style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <View style={{ width: 10, height: 3, backgroundColor: SERIES_CONFIG[key].color, borderRadius: 1 }} />
          <Text style={{ fontSize: 10, color: colors.icon }}>{LABELS[key]}</Text>
        </View>
      ))}
    </View>
  );
}
