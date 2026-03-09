import { useState, useEffect, useContext } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { ColorsContext } from "@/context/colors-context";
import { FeedComment } from "@/data/mock-feed";
import { formatRelativeTime } from "@/utils/feed-utils";

export function CommentPreview({ comment, postId }: { comment: FeedComment; postId: string }) {
  const colors = useContext(ColorsContext);
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(comment.likes);

  useEffect(() => {
    setLikeCount(comment.likes);
  }, [comment.likes]);

  const formattedTime = formatRelativeTime(comment.timestamp);

  const handleReply = () => {
    router.push(`/post/comments/${postId}`);
  };

  return (
    <View
      style={{
        flexDirection: "row",
        paddingHorizontal: 12,
        paddingVertical: 8,
        alignItems: "flex-start",
        gap: 10
      }}
    >
      <Image source={{ uri: comment.avatar }} style={{ width: 28, height: 28, borderRadius: 14 }} />
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 13, color: colors.text, lineHeight: 18 }}>
          <Text style={{ fontWeight: "600" }}>{comment.username}</Text> {comment.text}
        </Text>
        <View style={{ flexDirection: "row", gap: 12, marginTop: 4 }}>
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
        style={{ paddingTop: 4 }}
      >
        <IconSymbol name={isLiked ? "heart.fill" : "heart"} size={12} color={isLiked ? "#FF6B6B" : colors.icon} />
      </TouchableOpacity>
    </View>
  );
}
