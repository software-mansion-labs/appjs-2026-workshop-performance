import { useCallback, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, StyleSheet } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Engagement, { type PostEngagementAggregate } from "engagement";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { PostAnalyticsChart } from "@/components/analytics/PostAnalyticsChart";
import { SVGRenderer, SkiaRenderer } from "@/components/analytics/renderers";
import { Colors } from "@/constants/theme";
import { MOCK_FEED } from "@/data/mock-feed";
import { useColorScheme } from "@/hooks/use-color-scheme";

const ACTIVITY_LABELS: Record<keyof PostEngagementAggregate["activityBreakdown"], string> = {
  stationary: "stationary",
  walking: "walking",
  running: "running",
  automotive: "in transit",
  cycling: "cycling",
  unknown: "unknown",
};

const formatDuration = (totalMs: number): string => {
  const totalSeconds = Math.max(0, Math.floor(totalMs / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
};

const dominantActivity = (
  breakdown: PostEngagementAggregate["activityBreakdown"],
): string => {
  const entries = Object.entries(breakdown) as [
    keyof PostEngagementAggregate["activityBreakdown"],
    number,
  ][];
  let topKey: keyof PostEngagementAggregate["activityBreakdown"] | null = null;
  let topVal = 0;
  for (const [key, value] of entries) {
    if (value > topVal) {
      topVal = value;
      topKey = key;
    }
  }
  if (!topKey || topVal === 0) return "no activity data";
  return `mostly ${ACTIVITY_LABELS[topKey]}`;
};

// Unique users from the feed
const USERS = (() => {
  const seen = new Set<string>();
  return MOCK_FEED.filter(p => {
    if (seen.has(p.user.username)) return false;
    seen.add(p.user.username);
    return true;
  }).slice(0, 20);
})();

const POSTS_BY_ID = new Map(MOCK_FEED.map(p => [p.id, p]));

type Renderer = "svg" | "skia";
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

  const [renderer, setRenderer] = useState<Renderer>("svg");
  const [selectedUserIndex, setSelectedUserIndex] = useState(0);
  const [enabledSeries, setEnabledSeries] = useState<Set<DataSeries>>(
    new Set<DataSeries>(["likes", "comments", "shares"])
  );
  const [dataPoints, setDataPoints] = useState(365);

  const [topPosts, setTopPosts] = useState<PostEngagementAggregate[]>([]);
  const [topLoading, setTopLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      setTopLoading(true);
      Engagement.getTopPosts(5)
        .then(top => {
          if (!cancelled) {
            setTopPosts(top);
            setTopLoading(false);
          }
        })
        .catch(() => {
          if (!cancelled) {
            setTopPosts([]);
            setTopLoading(false);
          }
        });
      return () => {
        cancelled = true;
      };
    }, []),
  );

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

  const activeRenderer = renderer === "svg" ? SVGRenderer : SkiaRenderer;

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
        {/* Renderer toggle */}
        <View
          style={{
            flexDirection: "row",
            marginHorizontal: 16,
            marginTop: 12,
            backgroundColor: colors.background,
            borderRadius: 10,
            padding: 3
          }}
        >
          {(["svg", "skia"] as Renderer[]).map(option => {
            const active = renderer === option;
            return (
              <TouchableOpacity
                key={option}
                onPress={() => setRenderer(option)}
                style={{
                  flex: 1,
                  paddingVertical: 8,
                  borderRadius: 8,
                  alignItems: "center",
                  backgroundColor: active ? colors.cardBackground : "transparent"
                }}
              >
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: active ? "700" : "500",
                    color: active ? colors.text : colors.icon
                  }}
                >
                  {option === "svg" ? "react-native-svg" : "react-native-skia"}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

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
            key={`${renderer}-${dataPoints}`}
            post={selectedPost}
            colors={colors}
            renderer={activeRenderer}
            enabledSeries={enabledSeries}
            days={dataPoints}
          />
        </View>

        {/* Top engaged posts */}
        <Text style={[topPostsStyles.heading, { color: colors.text }]}>Top engaged posts</Text>

        {topLoading ? (
          <View style={topPostsStyles.loadingWrapper}>
            <ActivityIndicator color={colors.tint} />
          </View>
        ) : topPosts.length === 0 ? (
          <Text style={[topPostsStyles.emptyState, { color: colors.icon }]}>
            No engagement data yet — scroll the feed to start collecting.
          </Text>
        ) : (
          <View style={topPostsStyles.list}>
            {topPosts.map(item => {
              const post = POSTS_BY_ID.get(item.postId);
              const username = post?.user.username ?? "unknown";
              const thumbnail = post?.images[0]?.thumbnailUri ?? post?.images[0]?.uri;
              const totalLabel = formatDuration(item.totalTimeMs);
              const activityLabel = dominantActivity(item.activityBreakdown);
              const avg = Math.round(item.avgScrollVelocity);
              const peak = Math.round(item.peakScrollVelocity);

              return (
                <TouchableOpacity
                  key={item.postId}
                  onPress={() => router.push(`/post/${item.postId}`)}
                  style={[
                    topPostsStyles.row,
                    { backgroundColor: colors.background, borderColor: colors.border },
                  ]}
                >
                  {thumbnail ? (
                    <Image
                      source={{ uri: thumbnail }}
                      style={[
                        topPostsStyles.thumbnail,
                        { backgroundColor: colors.cardBackgroundAlt },
                      ]}
                    />
                  ) : (
                    <View
                      style={[
                        topPostsStyles.thumbnail,
                        { backgroundColor: colors.cardBackgroundAlt },
                      ]}
                    />
                  )}
                  <View style={topPostsStyles.body}>
                    <Text
                      style={[topPostsStyles.username, { color: colors.text }]}
                      numberOfLines={1}
                    >
                      @{username}
                    </Text>
                    <Text style={[topPostsStyles.metaPrimary, { color: colors.icon }]} numberOfLines={1}>
                      {totalLabel} · {activityLabel}
                    </Text>
                    <Text style={[topPostsStyles.metaSecondary, { color: colors.icon }]} numberOfLines={1}>
                      avg {avg} px/s · peak {peak} px/s
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const topPostsStyles = StyleSheet.create({
  heading: {
    fontSize: 16,
    fontWeight: "700",
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 10,
  },
  loadingWrapper: {
    paddingVertical: 24,
    alignItems: "center",
  },
  emptyState: {
    fontSize: 13,
    marginHorizontal: 16,
    marginTop: 4,
    marginBottom: 16,
    lineHeight: 18,
  },
  list: {
    marginHorizontal: 16,
    gap: 8,
  },
  row: {
    flexDirection: "row",
    borderRadius: 10,
    padding: 10,
    gap: 12,
    borderWidth: 1,
  },
  thumbnail: {
    width: 56,
    height: 56,
    borderRadius: 8,
  },
  body: {
    flex: 1,
    justifyContent: "center",
  },
  username: {
    fontSize: 14,
    fontWeight: "700",
  },
  metaPrimary: {
    fontSize: 12,
    marginTop: 2,
  },
  metaSecondary: {
    fontSize: 11,
    marginTop: 2,
  },
});
