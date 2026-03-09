import { useState, useEffect, useContext } from "react";
import { View, Text, Image, TouchableOpacity, Pressable, GestureResponderEvent } from "react-native";
import { useRouter } from "expo-router";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { ColorsContext } from "@/context/colors-context";
import { FeedPost } from "@/data/mock-feed";
import { computeEngagementRate, formatTags, formatRelativeTime } from "@/utils/feed-utils";

import { CommentPreview } from "./comment-preview";
import { ImageCarousel } from "./image-carousel";
import { PostOptionsMenu } from "./post-options-menu";
import { SuggestedPostsSection } from "./suggested-posts";

export function FeedItem({
  item,
  onLike,
  onBookmark
}: {
  item: FeedPost;
  onLike: (id: string) => void;
  onBookmark: (id: string) => void;
}) {
  const colors = useContext(ColorsContext);
  const router = useRouter();

  const openPost = () => {
    router.push(`/post/${item.id}`);
  };

  const openComments = () => {
    router.push(`/post/comments/${item.id}`);
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
  const engagementRate = computeEngagementRate(item.likes, item.totalComments, item.caption);
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
      style={{
        backgroundColor: colors.background,
        marginBottom: 4,
        borderBottomWidth: 0.5,
        borderBottomColor: colors.icon + "15"
      }}
    >
      {/* Post Header */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 12,
          paddingVertical: 10
        }}
      >
        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
          onPress={() => router.push(`/profile/${item.user.username}`)}
        >
          <Image
            source={{ uri: item.user.avatar }}
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              borderWidth: 2,
              borderColor: "#c13584"
            }}
          />
          <View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <Text style={{ fontWeight: "600", fontSize: 14, color: colors.text }}>{item.user.username}</Text>
              {item.user.isVerified && <IconSymbol name="checkmark.seal.fill" size={14} color="#3897f0" />}
            </View>
            <Text style={{ fontSize: 11, color: colors.icon }}>{item.location}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={(e: GestureResponderEvent) => {
            const { pageX, pageY } = e.nativeEvent;
            setMenuAnchor({ x: pageX, y: pageY });
            setShowOptionsMenu(true);
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "bold", color: colors.text }}>•••</Text>
        </TouchableOpacity>
      </View>

      <PostOptionsMenu
        visible={showOptionsMenu}
        onClose={() => setShowOptionsMenu(false)}
        postId={item.id}
        username={item.user.username}
        onHidePost={() => setIsHidden(true)}
        anchorPosition={menuAnchor}
      />

      {/* Image Carousel */}
      <Pressable onPress={openPost}>
        <ImageCarousel images={item.images} />
      </Pressable>

      {/* Action Buttons */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 12,
          paddingBottom: 8
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
          <TouchableOpacity
            onPress={() => {
              setIsLiked(!isLiked);
              setDisplayLikes(isLiked ? displayLikes - 1 : displayLikes + 1);
              onLike(item.id);
            }}
            style={{ padding: 2 }}
          >
            <IconSymbol name={isLiked ? "heart.fill" : "heart"} size={26} color={isLiked ? "#ed4956" : colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={{ padding: 2 }} onPress={openComments}>
            <IconSymbol name="bubble.right" size={24} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={{ padding: 2 }}>
            <IconSymbol name="paperplane" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => {
            setIsBookmarked(!isBookmarked);
            onBookmark(item.id);
          }}
        >
          <IconSymbol name={isBookmarked ? "bookmark.fill" : "bookmark"} size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Likes */}
      <Text
        style={{
          fontWeight: "600",
          paddingHorizontal: 12,
          fontSize: 14,
          color: colors.text
        }}
      >
        {likesText}
      </Text>

      {/* Caption - only if non-empty */}
      {item.caption.length > 0 && (
        <View style={{ paddingHorizontal: 12, paddingTop: 4 }}>
          <Text style={{ fontSize: 14, lineHeight: 20, color: colors.text }}>
            <Text style={{ fontWeight: "600" }}>{item.user.username}</Text> {item.caption}
          </Text>
        </View>
      )}

      {/* Tags - only if present */}
      {formattedTags.length > 0 && (
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            paddingHorizontal: 12,
            paddingTop: 4,
            gap: 4
          }}
        >
          {formattedTags.map((tag, i) => (
            <Text key={`${tag}-${i}`} style={{ fontSize: 13, color: colors.tint }}>
              {tag}
            </Text>
          ))}
        </View>
      )}

      {/* View all comments link - only if there are comments */}
      {item.totalComments > 0 && (
        <TouchableOpacity onPress={openComments}>
          <Text
            style={{
              paddingHorizontal: 12,
              paddingTop: 6,
              fontSize: 14,
              color: colors.icon
            }}
          >
            {item.totalComments === 1 ? "View 1 comment" : `View all ${item.totalComments} comments`}
          </Text>
        </TouchableOpacity>
      )}

      {/* Comment Previews - variable count */}
      {item.comments.length > 0 && (
        <View style={{ paddingTop: 4 }}>
          {item.comments.map(comment => (
            <CommentPreview key={comment.id} comment={comment} postId={item.id} />
          ))}
        </View>
      )}

      {/* Timestamp */}
      <Text
        style={{
          paddingHorizontal: 12,
          paddingTop: 6,
          paddingBottom: 10,
          fontSize: 11,
          color: colors.icon,
          textTransform: "uppercase"
        }}
      >
        {formattedTime}
      </Text>

      {/* Suggested Posts - only on flagged posts */}
      {item.showSuggestions && item.suggestedPosts.length > 0 && <SuggestedPostsSection posts={item.suggestedPosts} />}
    </View>
  );
}
