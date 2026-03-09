import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, FlatList, Dimensions, Linking, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { MOCK_FEED, FeedPost, LocationData } from "@/data/mock-feed";
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

export default function LocationScreen() {
  const { name } = useLocalSearchParams<{ name: string }>();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();

  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [locationData, setLocationData] = useState<LocationData | null>(null);

  useEffect(() => {
    if (name) {
      // Filter posts from this location
      const filteredPosts = MOCK_FEED.filter(post => post.location.name.toLowerCase().includes(name.toLowerCase()));
      setPosts(filteredPosts.length > 0 ? filteredPosts : MOCK_FEED.slice(0, 9));

      // Get location data from first matching post
      const matchingPost = filteredPosts[0] || MOCK_FEED[0];
      setLocationData(matchingPost.location);
    }
  }, [name]);

  const handleOpenMaps = () => {
    if (locationData?.coordinates) {
      const { latitude, longitude } = locationData.coordinates;
      const url = `https://maps.apple.com/?ll=${latitude},${longitude}&q=${encodeURIComponent(name || "")}`;
      Linking.openURL(url).catch(() => {
        Alert.alert("Error", "Could not open Maps");
      });
    }
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
        <Text style={{ flex: 1, fontSize: 18, fontWeight: "600", color: colors.text }} numberOfLines={1}>
          {name}
        </Text>
      </View>

      {/* Location Info */}
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
            <IconSymbol name="mappin.circle.fill" size={40} color={colors.tint} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 20, fontWeight: "700", color: colors.text }}>{name}</Text>
            {locationData && (
              <Text style={{ fontSize: 14, color: colors.icon, marginTop: 4 }}>
                {locationData.city}, {locationData.country}
              </Text>
            )}
            <Text style={{ fontSize: 13, color: colors.icon, marginTop: 2 }}>
              {posts.length.toLocaleString()} posts
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={{ flexDirection: "row", gap: 8, marginTop: 16 }}>
          <TouchableOpacity
            onPress={handleOpenMaps}
            style={{
              flex: 1,
              backgroundColor: colors.tint,
              borderRadius: 8,
              paddingVertical: 10,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 6
            }}
          >
            <IconSymbol name="map" size={18} color="#fff" />
            <Text style={{ fontSize: 15, fontWeight: "600", color: "#fff" }}>View on Map</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              paddingHorizontal: 16,
              borderRadius: 8,
              paddingVertical: 10,
              borderWidth: 1,
              borderColor: colors.border,
              justifyContent: "center"
            }}
          >
            <IconSymbol name="bookmark" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Posts Grid */}
      <FlatList
        data={posts}
        numColumns={3}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <PostGridItem post={item} onPress={() => router.push(`/post/${item.id}`)} />}
        contentContainerStyle={{ paddingBottom: insets.bottom }}
        ListHeaderComponent={
          <Text style={{ padding: 16, fontSize: 14, fontWeight: "600", color: colors.text }}>Top posts</Text>
        }
      />
    </View>
  );
}
