import { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Reanimated, { FadeIn, LinearTransition } from "react-native-reanimated";
import { FeedItem } from "@/components/feed/feed-item";
import { ShimmerList } from "@/components/feed/shimmer/shimmer-list";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { ColorsContext } from "@/context/colors-context";
import { MOCK_FEED, FeedPost } from "@/data/mock-feed";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();

  const [feedData, setFeedData] = useState<FeedPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFeedData(MOCK_FEED);
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ColorsContext.Provider value={colors}>
      <View style={{ flex: 1, backgroundColor: colors.cardBackground }}>
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 16,
            paddingBottom: 12,
            paddingTop: insets.top + 8,
            backgroundColor: colors.background,
            borderBottomWidth: 0.5,
            borderBottomColor: colors.border
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "700",
                color: colors.text,
                letterSpacing: -0.5
              }}
            >
              App.js
            </Text>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "400",
                color: colors.text
              }}
            >
              ✱
            </Text>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "700",
                color: colors.text,
                letterSpacing: -0.5
              }}
            >
              Conf
            </Text>
          </View>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <View
              style={{
                borderWidth: 1.5,
                borderColor: colors.text,
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 20,
                flexDirection: "row",
                alignItems: "center",
                gap: 6
              }}
            >
              <IconSymbol name="calendar" size={14} color={colors.text} />
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "500",
                  color: colors.text
                }}
              >
                27-29 May '26
              </Text>
            </View>
          </View>
        </View>

        {/* Feed */}
        <Reanimated.FlatList
          data={feedData}
          itemLayoutAnimation={LinearTransition}
          renderItem={({ item }) => (
            <Reanimated.View entering={FadeIn.duration(400)}>
              <FeedItem
                item={item}
                onLike={id => {
                  setFeedData(prev =>
                    prev.map(post =>
                      post.id === id
                        ? {
                          ...post,
                          isLiked: !post.isLiked,
                          likes: post.isLiked ? post.likes - 1 : post.likes + 1
                        }
                        : post
                    )
                  );
                }}
                onBookmark={id => {
                  setFeedData(prev =>
                    prev.map(post => (post.id === id ? { ...post, isBookmarked: !post.isBookmarked } : post))
                  );
                }}
              />
            </Reanimated.View>
          )}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          windowSize={21}
          maxToRenderPerBatch={10}
          initialNumToRender={5}
          removeClippedSubviews={false}
          ListEmptyComponent={isLoading ? <ShimmerList /> : null}

        />
      </View>
    </ColorsContext.Provider>
  );
}
