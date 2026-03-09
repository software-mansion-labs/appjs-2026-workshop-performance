import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, FlatList, Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { MOCK_FEED, FeedPost } from "@/data/mock-feed";
import { useColorScheme } from "@/hooks/use-color-scheme";

const { width } = Dimensions.get("window");
const imageSize = (width - 4) / 3;

function PostGridItem({ post, onPress }: { post: FeedPost; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} style={{ margin: 1 }}>
      <Image source={{ uri: post.images[0].uri }} style={{ width: imageSize, height: imageSize }} />
      {post.images.length > 1 && (
        <View style={{ position: "absolute", top: 8, right: 8 }}>
          <IconSymbol name="square.on.square" size={16} color="white" />
        </View>
      )}
    </TouchableOpacity>
  );
}

export default function HashtagScreen() {
  const { tag } = useLocalSearchParams<{ tag: string }>();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();

  const [posts, setPosts] = useState<FeedPost[]>([]);

  useEffect(() => {
    if (tag) {
      // Filter posts that contain this hashtag
      const hashtagLower = tag.toLowerCase().replace("#", "");
      const filteredPosts = MOCK_FEED.filter(
        post =>
          post.tags.some(t => t.toLowerCase().includes(hashtagLower)) ||
          post.caption.toLowerCase().includes(`#${hashtagLower}`)
      );
      setPosts(filteredPosts.length > 0 ? filteredPosts : MOCK_FEED.slice(0, 12));
    }
  }, [tag]);

  const displayTag = tag?.startsWith("#") ? tag : `#${tag}`;

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
          backgroundColor: colors.cardBackground,
          borderBottomWidth: 0.5,
          borderBottomColor: colors.border
        }}
      >
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 4, marginRight: 16 }}>
          <IconSymbol name="chevron.left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontSize: 18, fontWeight: "600", color: colors.text }}>{displayTag}</Text>
      </View>

      {/* Stats Header */}
      <View
        style={{
          padding: 16,
          borderBottomWidth: 0.5,
          borderBottomColor: colors.border
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 16,
              backgroundColor: colors.tint + "20",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <IconSymbol name="number" size={40} color={colors.tint} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 20, fontWeight: "700", color: colors.text }}>{displayTag}</Text>
            <Text style={{ fontSize: 14, color: colors.icon, marginTop: 4 }}>
              {posts.length.toLocaleString()} posts
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={{
            marginTop: 16,
            backgroundColor: colors.tint,
            borderRadius: 8,
            paddingVertical: 10,
            alignItems: "center"
          }}
        >
          <Text style={{ fontSize: 15, fontWeight: "600", color: "#fff" }}>Follow</Text>
        </TouchableOpacity>
      </View>

      {/* Posts Grid */}
      <FlatList
        data={posts}
        numColumns={3}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <PostGridItem post={item} onPress={() => router.push(`/post/${item.id}`)} />}
        contentContainerStyle={{ paddingBottom: insets.bottom }}
      />
    </View>
  );
}
