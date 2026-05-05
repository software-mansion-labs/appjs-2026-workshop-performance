import { useContext, useState } from "react";
import { Pressable, StyleSheet, View, useColorScheme } from "react-native";
import { useRouter } from "expo-router";
import Reanimated, { useAnimatedStyle } from "react-native-reanimated";

import { useActivePost } from "@/context/active-post-context";
import { ColorsContext } from "@/context/colors-context";
import { useImmersive } from "@/context/immersive-context";
import { FeedImage, FeedPost } from "@/data/mock-feed";
import { useImagePalette } from "@/hooks/use-image-palette";

import { ActionButtons } from "./actions/action-buttons";
import { CommentList } from "./comments/comment-list";
import { CommentsLink } from "./comments/comments-link";
import { ImageCarousel } from "./content/image-carousel";
import { PostCaption } from "./content/post-caption";
import { PostTimestamp } from "./content/post-timestamp";
import { TagList } from "./content/tag-list";
import { PostHeader } from "./header/post-header";
import { SuggestedPostsSection } from "./suggestions/suggested-posts-section";

const CARD_BORDER_RADIUS = 20;
const CARD_OPACITY_IMMERSIVE = 0.2;
const CARD_OPACITY_PLAIN = 1;
const FROSTED_OPACITY_IMMERSIVE = 0.4;

const FROSTED_TINT_DARK = "#281E32";
const FROSTED_TINT_LIGHT = "#FFFFFF";

const AnimatedTranslucentCardBg = ({ color }: { color: string }) => {
  const { progress } = useImmersive();

  const animStyle = useAnimatedStyle(() => ({
    opacity: 1 - progress.value * (CARD_OPACITY_PLAIN - CARD_OPACITY_IMMERSIVE),
  }));

  return (
    <Reanimated.View
      style={[StyleSheet.absoluteFill, { backgroundColor: color }, animStyle]}
      pointerEvents="none"
    />
  );
};

const AnimatedFrostedLayer = ({ tint }: { tint: "light" | "dark" }) => {
  const { progress } = useImmersive();

  const animStyle = useAnimatedStyle(() => ({
    opacity: progress.value * FROSTED_OPACITY_IMMERSIVE,
  }));

  return (
    <Reanimated.View
      style={[
        StyleSheet.absoluteFill,
        { backgroundColor: tint === "dark" ? FROSTED_TINT_DARK : FROSTED_TINT_LIGHT },
        animStyle,
      ]}
      pointerEvents="none"
    />
  );
};

const FeedItemImage = ({ postId, images }: { postId: string; images: FeedImage[] }) => {
  const { reportImageLayout } = useActivePost();
  const router = useRouter();

  useImagePalette(postId, images[0]?.uri);

  return (
    <View
      style={styles.imageClip}
      onLayout={e => {
        const { y, height } = e.nativeEvent.layout;
        reportImageLayout(postId, y, height);
      }}
    >
      <Pressable onPress={() => router.push(`/post/${postId}`)}>
        <ImageCarousel images={images} />
      </Pressable>
    </View>
  );
};

export const FeedItem = ({
  item,
  onLike,
}: {
  item: FeedPost;
  onLike: (id: string) => void;
}) => {
  const colorScheme = useColorScheme();
  const colors = useContext(ColorsContext);
  const [isHidden, setIsHidden] = useState(false);

  if (isHidden) {
    return null;
  }

  return (
    <View style={styles.shadowWrapper}>
      <View style={styles.container}>
        <AnimatedTranslucentCardBg color={colors.cardBackground} />
        <AnimatedFrostedLayer tint={colorScheme === "dark" ? "dark" : "light"} />

        <PostHeader
          postId={item.id}
          username={item.user.username}
          avatar={item.user.avatar}
          isVerified={item.user.isVerified}
          locationName={item.location.name}
          onHidePost={() => setIsHidden(true)}
        />

        <FeedItemImage postId={item.id} images={item.images} />

        <ActionButtons
          postId={item.id}
          username={item.user.username}
          initialLikes={item.likes}
          initialIsLiked={item.isLiked}
          onLike={onLike}
        />

        <PostCaption username={item.user.username} caption={item.caption} />

        <TagList tags={item.tags} />

        <CommentsLink totalComments={item.totalComments} postId={item.id} />

        <CommentList comments={item.comments} postId={item.id} />

        <PostTimestamp timestamp={item.timestamp} />

        {item.showSuggestions && item.suggestedPosts.length > 0 && <SuggestedPostsSection posts={item.suggestedPosts} />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  shadowWrapper: {
    marginHorizontal: 12,
    marginBottom: 36,
    borderRadius: CARD_BORDER_RADIUS,
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
  },
  container: {
    borderRadius: CARD_BORDER_RADIUS,
    overflow: "hidden",
    isolation: "isolate",
  },
  imageClip: {
    overflow: "hidden",
  },
});
