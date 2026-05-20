import { useState, useContext, useLayoutEffect, useRef, memo, type RefObject } from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

import { useBackdropData } from "@/context/backdrop-data-context";
import { ColorsContext } from "@/context/colors-context";
import { FeedImage, FeedPostSlim } from "@/data/mock-feed";
import { useCardLayoutTracking } from "@/hooks/use-card-layout-tracking";
import { useImagePalette } from "@/hooks/use-image-palette";

import { ActionButtons } from "./actions/action-buttons";
import { CommentList } from "./comments/comment-list";
import { CommentsLink } from "./comments/comments-link";
import { ImageCarousel } from "./content/image-carousel";
import { PostCaption } from "./content/post-caption";
import { PostTimestamp } from "./content/post-timestamp";
import { TagList } from "./content/tag-list";
import { AnimatedFrostedLayer, AnimatedTranslucentCardBg } from "./feed-immersive-layers";
import { PostHeader } from "./header/post-header";

interface FeedItemImageProps {
  postId: string;
  images: FeedImage[];
  imageClipRef: RefObject<View | null>;
}

const FeedItemImage = ({ postId, images, imageClipRef }: FeedItemImageProps) => {
  const router = useRouter();
  useImagePalette(postId);

  return (
    <View ref={imageClipRef} style={styles.imageClip}>
      <Pressable onPress={() => router.push(`/post/${postId}`)}>
        <ImageCarousel images={images} />
      </Pressable>
    </View>
  );
};

export const FeedItem = memo(({
  item,
  index,
}: {
  item: FeedPostSlim;
  index: number;
}) => {
  const colors = useContext(ColorsContext);
  const { registerImageLayout, unregisterImageLayout } = useBackdropData();
  const cardRef = useRef<View>(null);
  const imageClipRef = useRef<View>(null);
  const [isHidden, setIsHidden] = useState(false);

  useCardLayoutTracking(item.id, index);

  useLayoutEffect(() => {
    const imgRect = imageClipRef.current?.getBoundingClientRect?.();
    const cardRect = cardRef.current?.getBoundingClientRect?.();
    if (imgRect && cardRect) {
      registerImageLayout(item.id, imgRect.top - cardRect.top, imgRect.height);
    }
    return () => unregisterImageLayout(item.id);
  }, [item.id, registerImageLayout, unregisterImageLayout]);

  if (isHidden) {
    return null;
  }

  return (
    <View ref={cardRef} style={styles.container}>
      <AnimatedTranslucentCardBg color={colors.cardBackground} />
      <AnimatedFrostedLayer />

      <PostHeader
        postId={item.id}
        username={item.user.username}
        avatar={item.user.avatar}
        isVerified={item.user.isVerified}
        locationName={item.location.name}
        onHidePost={() => setIsHidden(true)}
      />

      <FeedItemImage postId={item.id} images={item.images} imageClipRef={imageClipRef} />

      <ActionButtons
        postId={item.id}
        username={item.user.username}
        initialLikes={item.likes}
        initialIsLiked={item.isLiked}
      />

      <PostCaption username={item.user.username} caption={item.caption} />

      <TagList tags={item.tags} />

      <CommentsLink totalComments={item.totalComments} postId={item.id} />

      <CommentList comments={item.comments} postId={item.id} />

      <PostTimestamp timestamp={item.timestamp} />
    </View>
  );
});

FeedItem.displayName = "FeedItem";

const CARD_BORDER_RADIUS = 20;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 12,
    marginBottom: 36,
    borderRadius: CARD_BORDER_RADIUS,
    overflow: "hidden",
    isolation: "isolate",
  },
  imageClip: {
    overflow: "hidden",
  },
});
