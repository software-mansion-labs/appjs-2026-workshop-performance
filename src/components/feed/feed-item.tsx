import { useState, useEffect, useContext } from "react";
import { View, Pressable, Share, GestureResponderEvent, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

import { ColorsContext } from "@/context/colors-context";
import { FeedPost } from "@/data/mock-feed";
import { formatTags, formatRelativeTime } from "@/utils/feed-utils";

import { ActionButtons } from "./actions/action-buttons";
import { CommentList } from "./comments/comment-list";
import { CommentsLink } from "./comments/comments-link";
import { ImageCarousel } from "./content/image-carousel";
import { LikesCount } from "./content/likes-count";
import { PostCaption } from "./content/post-caption";
import { PostTimestamp } from "./content/post-timestamp";
import { TagList } from "./content/tag-list";
import { PostHeader } from "./header/post-header";
import { PostOptionsMenu } from "./header/post-options-menu";
import { SuggestedPostsSection } from "./suggestions/suggested-posts-section";

export const FeedItem = ({
  item,
  onLike,
  onBookmark,
}: {
  item: FeedPost;
  onLike: (id: string) => void;
  onBookmark: (id: string) => void;
}) => {
  const colors = useContext(ColorsContext);
  const router = useRouter();

  const openPost = () => {
    router.push(`/post/${item.id}`);
  };

  const openComments = () => {
    router.push(`/post/comments/${item.id}`);
  };

  const openLocation = () => {
    router.push(`/location/${encodeURIComponent(item.location.name)}`);
  };

  const openLikes = () => {
    router.push(`/likes/${item.id}`);
  };

  const openHashtag = (tag: string) => {
    const cleanTag = tag.replace("#", "");
    router.push(`/hashtag/${encodeURIComponent(cleanTag)}`);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this post by @${item.user.username}: https://example.com/post/${item.id}`,
        url: `https://example.com/post/${item.id}`,
      });
    } catch {
      // User cancelled
    }
  };

  // Redundant state synced from props
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [displayLikes, setDisplayLikes] = useState(0);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<{ x: number; y: number } | undefined>();

  useEffect(() => {
    setIsLiked(item.isLiked);
  }, [item.isLiked]);

  useEffect(() => {
    setIsBookmarked(item.isBookmarked);
  }, [item.isBookmarked]);

  useEffect(() => {
    setDisplayLikes(item.likes);
  }, [item.likes]);

  // Expensive work in render path
  const formattedTags = formatTags(item.tags);
  const formattedTime = formatRelativeTime(item.timestamp);

  const likesText = (() => {
    let text = "";
    for (let i = 0; i < 100; i++) {
      text = displayLikes.toLocaleString();
    }
    return text + " likes";
  })();

  if (isHidden) {
    return null;
  }

  return (
    <View
      style={[
        styles.container,
        shadowStyles.card,
        { backgroundColor: colors.cardBackground, borderBottomColor: colors.border },
      ]}
    >
      <PostHeader
        username={item.user.username}
        avatar={item.user.avatar}
        isVerified={item.user.isVerified}
        locationName={item.location.name}
        onLocationPress={openLocation}
        onMenuPress={(e: GestureResponderEvent) => {
          const { pageX, pageY } = e.nativeEvent;
          setMenuAnchor({ x: pageX, y: pageY });
          setShowOptionsMenu(true);
        }}
      />

      <PostOptionsMenu
        visible={showOptionsMenu}
        onClose={() => setShowOptionsMenu(false)}
        postId={item.id}
        username={item.user.username}
        onHidePost={() => setIsHidden(true)}
        anchorPosition={menuAnchor}
      />

      <Pressable onPress={openPost}>
        <ImageCarousel images={item.images} />
      </Pressable>

      <ActionButtons
        isLiked={isLiked}
        isBookmarked={isBookmarked}
        onLike={() => {
          setIsLiked(!isLiked);
          setDisplayLikes(isLiked ? displayLikes - 1 : displayLikes + 1);
          onLike(item.id);
        }}
        onComment={openComments}
        onShare={handleShare}
        onBookmark={() => {
          setIsBookmarked(!isBookmarked);
          onBookmark(item.id);
        }}
      />

      <LikesCount likesText={likesText} onPress={openLikes} />

      <PostCaption username={item.user.username} caption={item.caption} />

      <TagList tags={formattedTags} onTagPress={openHashtag} />

      <CommentsLink totalComments={item.totalComments} onPress={openComments} />

      <CommentList comments={item.comments} postId={item.id} />

      <PostTimestamp time={formattedTime} />

      {item.showSuggestions && item.suggestedPosts.length > 0 && <SuggestedPostsSection posts={item.suggestedPosts} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 4,
    borderBottomWidth: 0.5,
  },
});

const shadowStyles = StyleSheet.create({
  card: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
});
