import { useState } from "react";
import { Text, View } from "react-native";

import { ImageCarousel } from "@/components/feed/image-carousel";
import { PostActions } from "@/components/feed/post-actions";
import { PostComments } from "@/components/feed/post-comments";
import { PostHeader } from "@/components/feed/post-header";
import { PostLikes } from "@/components/feed/post-likes";
import { Colors } from "@/constants/theme";
import type { FeedPost } from "@/data/mock-feed";

export function PostCard({
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
      <PostHeader
        username={item.user.username}
        avatar={item.user.avatar}
        isVerified={item.user.isVerified}
        location={item.location}
        colors={colors}
      />

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

      <ImageCarousel
        images={item.images}
        aspectRatio={item.imageAspectRatio}
      />

      <PostActions
        isLiked={isLiked}
        isBookmarked={isBookmarked}
        onLikePress={() => {
          setIsLiked((prev) => {
            setLikesCount((count) => (prev ? count - 1 : count + 1));
            return !prev;
          });
        }}
        onBookmarkPress={() => setIsBookmarked((prev) => !prev)}
        colors={colors}
      />

      <PostLikes
        likedBy={item.likedBy}
        formattedLikes={formattedLikes}
        colors={colors}
      />

      {item.caption && (
        <View style={{ paddingHorizontal: 12, paddingTop: 4 }}>
          <Text style={{ fontSize: 14, lineHeight: 20, color: colors.text }}>
            <Text style={{ fontWeight: "600" }}>{item.user.username}</Text>{" "}
            {item.caption}
          </Text>
        </View>
      )}

      <PostComments
        topComments={item.topComments}
        totalComments={item.comments}
        colors={colors}
      />

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
