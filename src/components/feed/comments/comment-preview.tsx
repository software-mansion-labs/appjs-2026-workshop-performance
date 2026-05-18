import { useState, useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

import { ColorsContext } from "@/context/colors-context";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { ImageWithShimmer } from "@/components/feed/shimmer/image-with-shimmer";
import { FeedComment } from "@/data/mock-feed";
import { formatRelativeTime } from "@/utils/feed-utils";

export const CommentPreview = ({ comment, postId }: { comment: FeedComment; postId: string }) => {
  const colors = useContext(ColorsContext);
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(comment.likes);

  const formattedTime = formatRelativeTime(comment.timestamp);

  const handleReply = () => {
    router.push(`/post/comments/${postId}`);
  };

  const openProfile = () => {
    router.push(`/profile/${comment.username}`);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={openProfile}>
        <View style={shadowStyles.avatarShadow}>
          <ImageWithShimmer source={{ uri: comment.avatar }} style={[styles.avatar, styles.avatarClip]} />
        </View>
      </TouchableOpacity>
      <View style={styles.body}>
        <Text style={{ fontSize: 13, color: colors.text, lineHeight: 18 }}>
          <Text style={styles.username} onPress={openProfile}>
            {comment.username}
          </Text>{" "}
          {comment.text}
        </Text>
        <View style={styles.meta}>
          <Text style={{ fontSize: 11, color: colors.icon }}>{formattedTime}</Text>
          <Text style={{ fontSize: 11, color: colors.icon }}>{likeCount} likes</Text>
          <TouchableOpacity onPress={handleReply}>
            <Text style={{ fontSize: 11, color: colors.icon, fontWeight: "600" }}>Reply</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => {
          setIsLiked(!isLiked);
          setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
        }}
        style={styles.heartButton}
      >
        <View style={isLiked ? shadowStyles.heartActiveShadow : shadowStyles.heartShadow}>
          <IconSymbol name={isLiked ? "heart.fill" : "heart"} size={12} color={isLiked ? "#FF6B6B" : colors.icon} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: "flex-start",
    gap: 10,
  },
  avatarClip: {
    borderRadius: 14,
    overflow: "hidden",
  },
  avatar: {
    width: 28,
    height: 28,
  },
  body: {
    flex: 1,
  },
  username: {
    fontWeight: "600",
  },
  meta: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
  },
  heartButton: {
    paddingTop: 4,
  },
});

const shadowStyles = StyleSheet.create({
  avatarShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  heartShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderRadius: 6,
    overflow: "hidden",
  },
  heartActiveShadow: {
    shadowColor: "#FF6B6B",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
    borderRadius: 6,
    overflow: "hidden",
  },
});
