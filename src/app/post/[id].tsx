import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useEffect, useCallback, useRef, memo, useMemo } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  GestureResponderEvent,
  Share
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { ColorsContext } from "@/context/colors-context";
import { MOCK_FEED, FeedPost, FeedComment } from "@/data/mock-feed";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { formatRelativeTime } from "@/utils/feed-utils";
import { buildMentionSuggestions } from "@/utils/mention-utils";

import { ImageCarousel } from "@/components/feed/content/image-carousel";
import { PostOptionsMenu } from "@/components/feed/header/post-options-menu";
import { findRelatedPosts } from "@/utils/related-posts";

interface ReplyInfo {
  commentId: string;
  username: string;
}

const CommentItem = memo(function CommentItem({
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
}) {
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
});

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();
  const inputRef = useRef<TextInput>(null);

  const [post, setPost] = useState<FeedPost | null>(null);
  const [comments, setComments] = useState<FeedComment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyInfo, setReplyInfo] = useState<ReplyInfo | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<{ x: number; y: number } | undefined>();

  useEffect(() => {
    const foundPost = MOCK_FEED.find(p => p.id === id);
    if (foundPost) {
      setPost(foundPost);
      setComments(foundPost.comments);
      setIsLiked(foundPost.isLiked);
      setIsBookmarked(foundPost.isBookmarked);
      setLikesCount(foundPost.likes);
    }
  }, [id]);

  const handleProfilePress = useCallback((username: string) => {
    router.push(`/profile/${username}`);
  }, [router]);

  // Expensive: scores every post in MOCK_FEED against the current post
  // using Jaccard tag similarity, cosine TF vectors on captions and
  // comments, Haversine geo-distance, and engagement metrics.
  // Only recomputes when the post or comments change — not on every
  // keystroke in the comment input.
  const relatedPosts = post ? findRelatedPosts(post) : []
  const handleReply = useCallback((commentId: string, username: string) => {
    setReplyInfo({ commentId, username });
    setNewComment(`@${username} `);
    inputRef.current?.focus();
  }, []);

  const handleAddComment = useCallback(() => {
    if (!newComment.trim() || !post) return;

    const commentText = replyInfo ? newComment.replace(`@${replyInfo.username} `, "") : newComment;

    // Build mention suggestions for the comment context
    const mentionSuggestions = buildMentionSuggestions(comments, commentText);

    const newCommentObj: FeedComment = {
      id: `new-comment-${Date.now()}`,
      username: "you",
      avatar: "https://i.pravatar.cc/150?img=68",
      text: commentText.trim(),
      likes: 0,
      timestamp: "Just now",
      replyingTo: replyInfo?.username,
      mentions: mentionSuggestions.slice(0, 5).map((s, i) => ({
        username: s.username,
        position: { start: i, end: i + s.username.length },
        userId: s.username,
      })),
      replies: []
    };

    if (replyInfo) {
      // Add as reply to existing comment
      setComments(prev =>
        prev.map(comment => {
          if (comment.id === replyInfo.commentId) {
            return {
              ...comment,
              replies: [...(comment.replies || []), newCommentObj]
            };
          }
          return comment;
        })
      );
    } else {
      // Add as top-level comment
      setComments(prev => [newCommentObj, ...prev]);
    }

    setNewComment("");
    setReplyInfo(null);
  }, [newComment, post, replyInfo, comments]);

  const cancelReply = useCallback(() => {
    setReplyInfo(null);
    setNewComment("");
  }, []);

  const handleLike = useCallback(() => {
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
  }, [isLiked, likesCount]);

  const handleBookmark = useCallback(() => {
    setIsBookmarked(!isBookmarked);
  }, [isBookmarked]);

  if (!post) {
    return (
      <ColorsContext.Provider value={colors}>
        <View
          style={{
            flex: 1,
            backgroundColor: colors.cardBackground,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Text style={{ color: colors.text }}>Post not found</Text>
        </View>
      </ColorsContext.Provider>
    );
  }

  const renderHeader = () => (
    <View>
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
          onPress={() => router.push(`/profile/${post.user.username}`)}
        >
          <Image
            source={{ uri: post.user.avatar }}
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              borderWidth: 2,
              borderColor: "#271c2d"
            }}
          />
          <View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <Text style={{ fontWeight: "600", fontSize: 14, color: colors.text }}>{post.user.username}</Text>
              {post.user.isVerified && <IconSymbol name="checkmark.seal.fill" size={14} color="#3d2847" />}
            </View>
            <TouchableOpacity onPress={() => router.push(`/location/${encodeURIComponent(post.location.name)}`)}>
              <Text style={{ fontSize: 11, color: colors.icon }}>{post.location.name}</Text>
            </TouchableOpacity>
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
        postId={post.id}
        username={post.user.username}
        anchorPosition={menuAnchor}
      />

      {/* Image Carousel */}
      <ImageCarousel images={post.images} />

      {/* Action Buttons */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 12,
          paddingVertical: 8
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
          <TouchableOpacity onPress={handleLike} style={{ padding: 2 }}>
            <IconSymbol name={isLiked ? "heart.fill" : "heart"} size={26} color={isLiked ? "#FF6B6B" : colors.text} />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ padding: 2 }}
            onPress={() =>
              Share.share({
                message: `Check out this post by @${post.user.username}: https://example.com/post/${post.id}`,
                url: `https://example.com/post/${post.id}`
              })
            }
          >
            <IconSymbol name="paperplane" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={handleBookmark}>
          <IconSymbol name={isBookmarked ? "bookmark.fill" : "bookmark"} size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Likes */}
      <TouchableOpacity onPress={() => router.push(`/likes/${post.id}`)}>
        <Text
          style={{
            fontWeight: "600",
            paddingHorizontal: 12,
            fontSize: 14,
            color: colors.text
          }}
        >
          {likesCount.toLocaleString()} likes
        </Text>
      </TouchableOpacity>

      {/* Caption */}
      {post.caption.length > 0 && (
        <View style={{ paddingHorizontal: 12, paddingTop: 4 }}>
          <Text style={{ fontSize: 14, lineHeight: 20, color: colors.text }}>
            <Text style={{ fontWeight: "600" }} onPress={() => router.push(`/profile/${post.user.username}`)}>
              {post.user.username}
            </Text>{" "}
            {post.caption}
          </Text>
        </View>
      )}

      {/* Timestamp */}
      <Text
        style={{
          paddingHorizontal: 12,
          paddingTop: 8,
          paddingBottom: 16,
          fontSize: 11,
          color: colors.icon,
          textTransform: "uppercase"
        }}
      >
        {formatRelativeTime(post.timestamp)}
      </Text>

      {/* Comments header */}
      <View
        style={{
          borderTopWidth: 0.5,
          borderTopColor: colors.icon + "30",
          paddingHorizontal: 12,
          paddingVertical: 12
        }}
      >
        <Text style={{ fontSize: 14, fontWeight: "600", color: colors.text }}>
          {comments.length === 1 ? "1 Comment" : `${comments.length} Comments`}
        </Text>
      </View>
    </View>
  );

  return (
    <ColorsContext.Provider value={colors}>
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: colors.cardBackground }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={90}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 16,
            paddingBottom: 10,
            paddingTop: insets.top,
            backgroundColor: colors.background,
            borderBottomWidth: 0.5,
            borderBottomColor: colors.border
          }}
        >
          <TouchableOpacity onPress={() => router.back()} style={{ padding: 4, marginRight: 16 }}>
            <IconSymbol name="chevron.left" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: colors.text,
              flex: 1
            }}
          >
            Post
          </Text>
        </View>

        {/* Comments List */}
        <FlatList
          data={comments}
          ListHeaderComponent={renderHeader}
          renderItem={({ item }) => (
            <CommentItem
              comment={item}
              colors={colors}
              onReply={handleReply}
              onProfilePress={handleProfilePress}
            />
          )}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <View style={{ padding: 20, alignItems: "center" }}>
              <Text style={{ color: colors.icon, fontSize: 14 }}>No comments yet. Be the first to comment!</Text>
            </View>
          }
          ListFooterComponent={
            relatedPosts.length > 0 ? (
              <View style={{ paddingTop: 16, borderTopWidth: 0.5, borderTopColor: colors.icon + "30" }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: colors.text,
                    paddingHorizontal: 12,
                    paddingBottom: 12
                  }}
                >
                  You might also like
                </Text>
                <FlatList
                  horizontal
                  data={relatedPosts}
                  keyExtractor={item => item.post.id}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: 12, gap: 10 }}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => router.push(`/post/${item.post.id}`)}
                      style={{ width: 140 }}
                    >
                      <Image
                        source={{ uri: item.post.images[0]?.thumbnailUri || item.post.images[0]?.uri }}
                        style={{ width: 140, height: 140, borderRadius: 8 }}
                      />
                      <Text
                        numberOfLines={1}
                        style={{ fontSize: 12, fontWeight: "600", color: colors.text, marginTop: 6 }}
                      >
                        {item.post.user.username}
                      </Text>
                      <Text numberOfLines={1} style={{ fontSize: 11, color: colors.icon, marginTop: 2 }}>
                        {item.reasons.slice(0, 2).join(" · ")}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            ) : null
          }
        />

        {/* Reply indicator */}
        {replyInfo && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 16,
              paddingVertical: 8,
              backgroundColor: colors.icon + "15",
              borderTopWidth: 0.5,
              borderTopColor: colors.icon + "30"
            }}
          >
            <Text style={{ fontSize: 13, color: colors.icon }}>
              Replying to <Text style={{ color: colors.text, fontWeight: "600" }}>@{replyInfo.username}</Text>
            </Text>
            <TouchableOpacity onPress={cancelReply}>
              <IconSymbol name="xmark" size={18} color={colors.icon} />
            </TouchableOpacity>
          </View>
        )}

        {/* Comment Input */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 12,
            paddingVertical: 10,
            borderTopWidth: replyInfo ? 0 : 0.5,
            borderTopColor: colors.border,
            backgroundColor: colors.background,
            paddingBottom: insets.bottom + 10
          }}
        >
          <Image
            source={{ uri: "https://i.pravatar.cc/150?img=68" }}
            style={{ width: 32, height: 32, borderRadius: 16 }}
          />
          <TextInput
            ref={inputRef}
            style={{
              flex: 1,
              marginHorizontal: 12,
              paddingVertical: 8,
              paddingHorizontal: 12,
              backgroundColor: colors.icon + "15",
              borderRadius: 20,
              color: colors.text,
              fontSize: 14
            }}
            placeholder={replyInfo ? `Reply to @${replyInfo.username}...` : "Add a comment..."}
            placeholderTextColor={colors.icon}
            value={newComment}
            onChangeText={setNewComment}
            multiline
            maxLength={500}
          />
          <TouchableOpacity onPress={handleAddComment} disabled={!newComment.trim()}>
            <Text
              style={{
                color: newComment.trim() ? "#271c2d" : colors.icon,
                fontWeight: "600",
                fontSize: 14
              }}
            >
              Post
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ColorsContext.Provider>
  );
}
