import { useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { FeedComment } from "@/data/mock-feed";
import { formatRelativeTime } from "@/utils/feed-utils";

export const CommentItem = ({ 
  comment,
  colors,
  onReply,
  onProfilePress,
  isReply = false
}: {
  comment: FeedComment;
  colors: typeof Colors.light;
  onReply: (commentId: string, username: string) => void;
  onProfilePress: (username: string) => void;
  isReply?: boolean;
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(comment.likes);
  const [showReplies, setShowReplies] = useState(false);

  const formattedTime = formatRelativeTime(comment.timestamp);
  const hasReplies = comment.replies && comment.replies.length > 0;

  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          paddingHorizontal: 16,
          paddingLeft: isReply ? 56 : 16,
          paddingVertical: 12,
          alignItems: "flex-start",
          gap: 12
        }}
      >
        <TouchableOpacity onPress={() => onProfilePress(comment.username)}>
          <Image
            source={{ uri: comment.avatar }}
            style={{
              width: isReply ? 28 : 36,
              height: isReply ? 28 : 36,
              borderRadius: isReply ? 14 : 18
            }}
          />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 14, color: colors.text, lineHeight: 20 }}>
            <Text style={{ fontWeight: "600" }} onPress={() => onProfilePress(comment.username)}>
              {comment.username}
            </Text>{" "}
            {comment.replyingTo && (
              <Text style={{ color: "#3d2847" }} onPress={() => onProfilePress(comment.replyingTo!)}>
                @{comment.replyingTo}{" "}
              </Text>
            )}
            {comment.text}
          </Text>
          <View style={{ flexDirection: "row", gap: 16, marginTop: 6 }}>
            <Text style={{ fontSize: 12, color: colors.icon }}>{formattedTime}</Text>
            <Text style={{ fontSize: 12, color: colors.icon }}>{likeCount} likes</Text>
            <TouchableOpacity onPress={() => onReply(comment.id, comment.username)}>
              <Text style={{ fontSize: 12, color: colors.icon, fontWeight: "600" }}>Reply</Text>
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
          <IconSymbol name={isLiked ? "heart.fill" : "heart"} size={14} color={isLiked ? "#FF6B6B" : colors.icon} />
        </TouchableOpacity>
      </View>

      {/* View replies toggle */}
      {hasReplies && !isReply && (
        <TouchableOpacity
          onPress={() => setShowReplies(!showReplies)}
          style={{
            paddingLeft: 64,
            paddingBottom: 8,
            flexDirection: "row",
            alignItems: "center",
            gap: 8
          }}
        >
          <View
            style={{
              width: 24,
              height: 1,
              backgroundColor: colors.icon
            }}
          />
          <Text style={{ fontSize: 12, color: colors.icon, fontWeight: "600" }}>
            {showReplies
              ? "Hide replies"
              : `View ${comment.replies!.length} ${comment.replies!.length === 1 ? "reply" : "replies"}`}
          </Text>
        </TouchableOpacity>
      )}

      {/* Replies */}
      {showReplies &&
        hasReplies &&
        comment.replies!.map(reply => (
          <CommentItem
            key={reply.id}
            comment={reply}
            colors={colors}
            onReply={onReply}
            onProfilePress={onProfilePress}
            isReply
          />
        ))}
    </View>
  );
};
