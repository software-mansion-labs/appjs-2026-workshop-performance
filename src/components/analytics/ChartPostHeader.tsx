import { View, Text, Image } from "react-native";

import { FeedPost } from "@/data/mock-feed";
import { type ChartColors } from "./chart-utils";
import { AnimatedNumber } from "./AnimatedNumber";

export function ChartPostHeader({ post, colors }: { post: FeedPost; colors: ChartColors }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 }}>
      <Image source={{ uri: post.user.avatar }} style={{ width: 36, height: 36, borderRadius: 18 }} />
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 14, fontWeight: "600", color: colors.text }}>{post.user.username}</Text>
        <Text style={{ fontSize: 11, color: colors.icon }} numberOfLines={1}>{post.caption || "No caption"}</Text>
      </View>
      <View style={{ alignItems: "flex-end" }}>
        <AnimatedNumber value={post.likes} style={{ fontSize: 16, fontWeight: "700", color: colors.text }} />
        <Text style={{ fontSize: 10, color: colors.icon }}>total likes</Text>
      </View>
    </View>
  );
}
