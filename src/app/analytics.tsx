import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { PostAnalyticsChart } from "@/components/analytics/PostAnalyticsChart";
import { SkiaRenderer } from "@/components/analytics/renderers";
import { Colors } from "@/constants/theme";
import { MOCK_FEED } from "@/data/mock-feed";
import { useColorScheme } from "@/hooks/use-color-scheme";

// Unique users from the feed
const USERS = (() => {
  const seen = new Set<string>();
  return MOCK_FEED.filter(p => {
    if (seen.has(p.user.username)) return false;
    seen.add(p.user.username);
    return true;
  }).slice(0, 20);
})();

type DataSeries = "likes" | "comments" | "shares";

const DATA_SERIES_OPTIONS: { key: DataSeries; label: string; color: string }[] = [
  { key: "likes", label: "Likes", color: "#6C5CE7" },
  { key: "comments", label: "Comments", color: "#00B894" },
  { key: "shares", label: "Shares", color: "#FDCB6E" },
];

export default function AnalyticsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();

  const [selectedUserIndex, setSelectedUserIndex] = useState(0);
  const [enabledSeries, setEnabledSeries] = useState<Set<DataSeries>>(
    new Set<DataSeries>(["likes", "comments", "shares"])
  );
  const [dataPoints, setDataPoints] = useState(365);

  const selectedPost = USERS[selectedUserIndex];

  const toggleSeries = (series: DataSeries) => {
    setEnabledSeries(prev => {
      const next = new Set(prev);
      if (next.has(series)) {
        if (next.size > 1) next.delete(series);
      } else {
        next.add(series);
      }
      return next;
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.cardBackground }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingBottom: 10,
          paddingTop: insets.top,
          backgroundColor: colors.background,
          borderBottomWidth: 0.5,
          borderBottomColor: colors.border
        }}
      >
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 4, marginRight: 16 }}>
          <IconSymbol name="chevron.left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: "700", color: colors.text, flex: 1 }}>
          Analytics
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* User picker */}
        <Text
          style={{
            fontSize: 13,
            fontWeight: "600",
            color: colors.icon,
            marginHorizontal: 16,
            marginTop: 16,
            marginBottom: 8
          }}
        >
          User
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
        >
          {USERS.map((post, i) => {
            const active = i === selectedUserIndex;
            return (
              <TouchableOpacity
                key={post.user.username}
                onPress={() => setSelectedUserIndex(i)}
                style={{
                  alignItems: "center",
                  width: 52,
                  gap: 4,
                  opacity: active ? 1 : 0.5
                }}
              >
                <Image
                  source={{ uri: post.user.avatar }}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    borderWidth: 2,
                    borderColor: active ? colors.tint : "transparent"
                  }}
                />
                <Text
                  style={{
                    fontSize: 10,
                    color: colors.text,
                    fontWeight: active ? "700" : "400",
                    maxWidth: 60
                  }}
                  numberOfLines={1}
                >
                  {post.user.username}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Data series toggles */}
        <Text
          style={{
            fontSize: 13,
            fontWeight: "600",
            color: colors.icon,
            marginHorizontal: 16,
            marginTop: 16,
            marginBottom: 8
          }}
        >
          Data
        </Text>
        <View
          style={{
            flexDirection: "row",
            marginHorizontal: 16,
            gap: 8
          }}
        >
          {DATA_SERIES_OPTIONS.map(option => {
            const active = enabledSeries.has(option.key);
            return (
              <TouchableOpacity
                key={option.key}
                onPress={() => toggleSeries(option.key)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderRadius: 8,
                  backgroundColor: active ? option.color + "20" : colors.background,
                  borderWidth: 1,
                  borderColor: active ? option.color : colors.border
                }}
              >
                <View
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: active ? option.color : colors.border
                  }}
                />
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: active ? "600" : "400",
                    color: active ? colors.text : colors.icon
                  }}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Time range */}
        <View
          style={{
            flexDirection: "row",
            marginHorizontal: 16,
            marginTop: 16,
            gap: 8
          }}
        >
          {[30, 90, 180, 365].map(n => {
            const active = dataPoints === n;
            return (
              <TouchableOpacity
                key={n}
                onPress={() => setDataPoints(n)}
                style={{
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  borderRadius: 8,
                  backgroundColor: active ? colors.tint : colors.background,
                  borderWidth: 1,
                  borderColor: active ? colors.tint : colors.border
                }}
              >
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: active ? "700" : "500",
                    color: active ? "#fff" : colors.text
                  }}
                >
                  {n <= 90 ? `${n}d` : n === 180 ? "6mo" : "1y"}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Chart */}
        <View style={{ marginTop: 16 }}>
          <PostAnalyticsChart
            key={dataPoints}
            post={selectedPost}
            colors={colors}
            renderer={SkiaRenderer}
            enabledSeries={enabledSeries}
            days={dataPoints}
          />
        </View>
      </ScrollView>
    </View>
  );
}
