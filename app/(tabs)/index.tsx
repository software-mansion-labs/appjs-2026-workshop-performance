import { useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { FeedPost, MOCK_FEED } from "@/data/mock-feed";
import { useColorScheme } from "@/hooks/use-color-scheme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

function ImageCarousel({
  images,
  aspectRatio,
}: {
  images: string[];
  aspectRatio: number;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const imageHeight = SCREEN_WIDTH / aspectRatio;

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setActiveIndex(index);
  };

  return (
    <View>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {images.map((uri, index) => (
          <Image
            key={index}
            source={{ uri }}
            style={{ width: SCREEN_WIDTH, height: imageHeight }}
            resizeMode="cover"
          />
        ))}
      </ScrollView>
      {images.length > 1 && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 4,
            paddingTop: 8,
          }}
        >
          {images.map((_, index) => (
            <View
              key={index}
              style={{
                width: index === activeIndex ? 7 : 6,
                height: index === activeIndex ? 7 : 6,
                borderRadius: 4,
                backgroundColor:
                  index === activeIndex ? "#0095f6" : "#0095f6" + "40",
              }}
            />
          ))}
        </View>
      )}
    </View>
  );
}

function FeedItem({
  item,
  colors,
}: {
  item: FeedPost;
  colors: typeof Colors.light;
}) {
  const [isLiked, setIsLiked] = useState(item.isLiked);
  const [isBookmarked, setIsBookmarked] = useState(item.isBookmarked);
  const [likesCount, setLikesCount] = useState(item.likes);

  const formattedLikes = new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(likesCount);

  return (
    <View style={{ marginBottom: 8, backgroundColor: colors.background }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 12,
          paddingVertical: 10,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Image
            source={{ uri: item.user.avatar }}
            style={{ width: 32, height: 32, borderRadius: 16 }}
          />
          <View>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
            >
              <Text
                style={{ fontWeight: "600", fontSize: 14, color: colors.text }}
              >
                {item.user.username}
              </Text>
              {item.user.isVerified && (
                <IconSymbol
                  name="checkmark.seal.fill"
                  size={14}
                  color="#0095f6"
                />
              )}
            </View>
            {item.location && (
              <Text style={{ fontSize: 12, color: colors.icon }}>
                {item.location}
              </Text>
            )}
          </View>
        </View>
        <TouchableOpacity>
          <Text
            style={{ fontSize: 16, fontWeight: "bold", color: colors.text }}
          >
            •••
          </Text>
        </TouchableOpacity>
      </View>

      {/* Sponsored label */}
      {item.isSponsored && (
        <Text
          style={{
            paddingHorizontal: 12,
            paddingBottom: 6,
            fontSize: 12,
            color: colors.icon,
          }}
        >
          Sponsored
        </Text>
      )}

      {/* Carousel */}
      <ImageCarousel images={item.images} aspectRatio={item.imageAspectRatio} />

      {/* Actions */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 12,
          paddingVertical: 10,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
          <TouchableOpacity
            onPress={() => {
              setIsLiked((prev) => {
                setLikesCount((count) => (prev ? count - 1 : count + 1));
                return !prev;
              });
            }}
            style={{ padding: 2 }}
          >
            <IconSymbol
              name={isLiked ? "heart.fill" : "heart"}
              size={26}
              color={isLiked ? "#ed4956" : colors.text}
            />
          </TouchableOpacity>
          <TouchableOpacity style={{ padding: 2 }}>
            <IconSymbol name="bubble.right" size={24} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={{ padding: 2 }}>
            <IconSymbol name="paperplane" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => setIsBookmarked((prev) => !prev)}>
          <IconSymbol
            name={isBookmarked ? "bookmark.fill" : "bookmark"}
            size={24}
            color={colors.text}
          />
        </TouchableOpacity>
      </View>

      {/* Liked by */}
      {item.likedBy.length > 0 ? (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 12,
          }}
        >
          <View style={{ flexDirection: "row", marginRight: 8 }}>
            {item.likedBy.map((user, index) => (
              <Image
                key={user.username}
                source={{ uri: user.avatar }}
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  borderWidth: 1.5,
                  borderColor: colors.background,
                  marginLeft: index > 0 ? -8 : 0,
                }}
              />
            ))}
          </View>
          <Text style={{ fontSize: 13, color: colors.text }}>
            Liked by{" "}
            <Text style={{ fontWeight: "600" }}>
              {item.likedBy[0].username}
            </Text>{" "}
            and{" "}
            <Text style={{ fontWeight: "600" }}>{formattedLikes} others</Text>
          </Text>
        </View>
      ) : (
        <Text
          style={{
            fontWeight: "600",
            paddingHorizontal: 12,
            fontSize: 14,
            color: colors.text,
          }}
        >
          {formattedLikes} likes
        </Text>
      )}

      {/* Caption */}
      {item.caption && (
        <View style={{ paddingHorizontal: 12, paddingTop: 4 }}>
          <Text style={{ fontSize: 14, lineHeight: 20, color: colors.text }}>
            <Text style={{ fontWeight: "600" }}>{item.user.username}</Text>{" "}
            {item.caption}
          </Text>
        </View>
      )}

      {/* View all comments */}
      {item.comments > 0 && item.topComments.length === 0 && (
        <TouchableOpacity>
          <Text
            style={{
              paddingHorizontal: 12,
              paddingTop: 4,
              fontSize: 14,
              color: colors.icon,
            }}
          >
            View all {item.comments} comments
          </Text>
        </TouchableOpacity>
      )}

      {/* Top comments */}
      {item.topComments.length > 0 && (
        <>
          {item.topComments.map((comment, index) => (
            <View
              key={index}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 12,
                paddingTop: 4,
                gap: 6,
              }}
            >
              <Image
                source={{ uri: comment.avatar }}
                style={{ width: 18, height: 18, borderRadius: 9 }}
              />
              <Text
                style={{ fontSize: 13, color: colors.text, flex: 1 }}
                numberOfLines={1}
              >
                <Text style={{ fontWeight: "600" }}>{comment.username}</Text>{" "}
                {comment.text}
              </Text>
            </View>
          ))}
          {item.comments > item.topComments.length && (
            <TouchableOpacity>
              <Text
                style={{
                  paddingHorizontal: 12,
                  paddingTop: 4,
                  fontSize: 14,
                  color: colors.icon,
                }}
              >
                View all {item.comments} comments
              </Text>
            </TouchableOpacity>
          )}
        </>
      )}

      {/* Timestamp */}
      <Text
        style={{
          paddingHorizontal: 12,
          paddingTop: 4,
          paddingBottom: 8,
          fontSize: 12,
          color: colors.icon,
        }}
      >
        {item.timestamp}
      </Text>
    </View>
  );
}

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingBottom: 10,
          borderBottomWidth: 0.5,
          paddingTop: insets.top,
          backgroundColor: colors.background,
          borderBottomColor: colors.icon + "30",
        }}
      >
        <Text
          style={{
            fontSize: 24,
            fontWeight: "700",
            fontStyle: "italic",
            color: colors.text,
          }}
        >
          Instagram
        </Text>
        <View style={{ flexDirection: "row", gap: 16 }}>
          <TouchableOpacity style={{ padding: 4 }}>
            <IconSymbol name="heart" size={26} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={{ padding: 4 }}>
            <IconSymbol name="paperplane" size={26} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Feed */}
      <FlatList
        data={MOCK_FEED}
        renderItem={({ item }: { item: FeedPost }) => (
          <FeedItem item={item} colors={colors} />
        )}
        keyExtractor={(item: FeedPost) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}
