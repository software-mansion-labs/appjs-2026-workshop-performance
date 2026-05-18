import { useState, useContext } from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

import { ColorsContext } from "@/context/colors-context";
import { FeedPostSlim } from "@/data/mock-feed";

import { ActionButtons } from "./actions/action-buttons";
import { CommentList } from "./comments/comment-list";
import { CommentsLink } from "./comments/comments-link";
import { ImageCarousel } from "./content/image-carousel";
import { PostCaption } from "./content/post-caption";
import { PostTimestamp } from "./content/post-timestamp";
import { TagList } from "./content/tag-list";
import { PostHeader } from "./header/post-header";

export const FeedItem = ({
  item,
}: {
  item: FeedPostSlim;
}) => {
  const colors = useContext(ColorsContext);
  const router = useRouter();
  const [isHidden, setIsHidden] = useState(false);

  if (isHidden) {
    return null;
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.cardBackground,
          borderBottomColor: colors.border,
        },
      ]}
    >
      <PostHeader
        postId={item.id}
        username={item.user.username}
        avatar={item.user.avatar}
        isVerified={item.user.isVerified}
        locationName={item.location.name}
        onHidePost={() => setIsHidden(true)}
      />

      <Pressable onPress={() => router.push(`/post/${item.id}`)}>
        <ImageCarousel images={item.images} />
      </Pressable>

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
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 4,
    borderBottomWidth: 0.5,
  },
});
