import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { PostDetailHeader } from "@/components/feed/post-detail-header";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { ColorsContext } from "@/context/colors-context";
import { MOCK_FEED, FeedPost, FeedComment } from "@/data/mock-feed";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { buildMentionSuggestions } from "@/utils/mention-utils";
import { detectSpam } from "@/utils/spam-detection";

import { CommentInput } from "@/components/feed/comment-input";
import { CommentItem } from "@/components/feed/comments/comment-item";
import { findRelatedPosts } from "@/utils/related-posts";

interface ReplyInfo {
  commentId: string;
  username: string;
}

const PostDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const inputRef = useRef<TextInput>(null);
  const prevCommentsLengthRef = useRef(0);
  const [post, setPost] = useState<FeedPost | null>(null);
  const [comments, setComments] = useState<FeedComment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyInfo, setReplyInfo] = useState<ReplyInfo | null>(null);
  const [shareCount, setShareCount] = useState(0);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  useEffect(() => {
    const foundPost = MOCK_FEED.find((p) => p.id === id);
    if (foundPost) {
      setPost(foundPost);
      setComments(foundPost.comments);
    }
  }, [id]);

  const hasNewComments = comments.length > prevCommentsLengthRef.current;
  prevCommentsLengthRef.current = comments.length;

  const relatedPosts = useMemo(() => (post ? findRelatedPosts(post) : []), [post]);

  const handleReply = useCallback((commentId: string, username: string) => {
    setReplyInfo({ commentId, username });
    setNewComment(`@${username} `);
    inputRef.current?.focus();
  }, []);

  const handleAddComment = useCallback(() => {
    if (!newComment.trim() || !post) return;

    const commentText = replyInfo
      ? newComment.replace(`@${replyInfo.username} `, "")
      : newComment;

    // Run spam detection — blocks the JS thread
    const { isSpam, maxSimilarity } = detectSpam(commentText, comments);
    if (isSpam) {
      console.warn(
        `[Spam] Comment blocked (similarity: ${maxSimilarity.toFixed(2)})`,
      );
      return;
    }

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
      replies: [],
    };

    if (replyInfo) {
      // Add as reply to existing comment
      setComments((prev) =>
        prev.map((comment) => {
          if (comment.id === replyInfo.commentId) {
            return {
              ...comment,
              replies: [...(comment.replies || []), newCommentObj],
            };
          }
          return comment;
        }),
      );
    } else {
      setComments((prev) => [newCommentObj, ...prev]);
    }

    setNewComment("");
    setReplyInfo(null);
  }, [newComment, post, replyInfo, comments]);

  const cancelReply = useCallback(() => {
    setReplyInfo(null);
    setNewComment("");
  }, []);


  if (!post) {
    return (
      <ColorsContext.Provider value={colors}>
        <View
          style={{
            flex: 1,
            backgroundColor: colors.cardBackground,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: colors.text }}>Post not found</Text>
        </View>
      </ColorsContext.Provider>
    );
  }

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
            borderBottomColor: colors.border,
          }}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ padding: 4, marginRight: 16 }}
          >
            <IconSymbol name="chevron.left" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: colors.text,
              flex: 1,
            }}
          >
            Post
          </Text>
        </View>

        {/* Comments List */}
        <FlatList
          data={comments}
          extraData={[shareCount]}
          ListHeaderComponent={
            <PostDetailHeader
              post={post}
              shareCount={shareCount}
              commentsCount={comments.length}
              hasNewComments={hasNewComments}
              onShareComplete={() =>
                setShareCount((prevShareCount) => prevShareCount + 1)
              }
            />
          }
          renderItem={({ item }) => (
            <CommentItem
              comment={item}
              colors={colors}
              onReply={handleReply}
              onProfilePress={(username: string) => {
                router.push(`/profile/${username}`);
              }}
            />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <View style={{ padding: 20, alignItems: "center" }}>
              <Text style={{ color: colors.icon, fontSize: 14 }}>
                No comments yet. Be the first to comment!
              </Text>
            </View>
          }
          ListFooterComponent={
            relatedPosts.length > 0 ? (
              <View
                style={{
                  paddingTop: 16,
                  borderTopWidth: 0.5,
                  borderTopColor: colors.icon + "30",
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: colors.text,
                    paddingHorizontal: 12,
                    paddingBottom: 12,
                  }}
                >
                  You might also like
                </Text>
                <FlatList
                  horizontal
                  data={relatedPosts}
                  keyExtractor={(item) => item.post.id}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: 12, gap: 10 }}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => router.push(`/post/${item.post.id}`)}
                      style={{ width: 140 }}
                    >
                      <Image
                        source={{
                          uri:
                            item.post.images[0]?.thumbnailUri ||
                            item.post.images[0]?.uri,
                        }}
                        style={{ width: 140, height: 140, borderRadius: 8 }}
                      />
                      <Text
                        numberOfLines={1}
                        style={{
                          fontSize: 12,
                          fontWeight: "600",
                          color: colors.text,
                          marginTop: 6,
                        }}
                      >
                        {item.post.user.username}
                      </Text>
                      <Text
                        numberOfLines={1}
                        style={{
                          fontSize: 11,
                          color: colors.icon,
                          marginTop: 2,
                        }}
                      >
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
              borderTopColor: colors.icon + "30",
            }}
          >
            <Text style={{ fontSize: 13, color: colors.icon }}>
              Replying to{" "}
              <Text style={{ color: colors.text, fontWeight: "600" }}>
                @{replyInfo.username}
              </Text>
            </Text>
            <TouchableOpacity onPress={cancelReply}>
              <IconSymbol name="xmark" size={18} color={colors.icon} />
            </TouchableOpacity>
          </View>
        )}

        {/* Comment Input */}
        <CommentInput
          ref={inputRef}
          value={newComment}
          onChangeText={setNewComment}
          onSubmit={handleAddComment}
          placeholder={
            replyInfo
              ? `Reply to @${replyInfo.username}...`
              : "Add a comment..."
          }
          colors={colors}
          comments={comments}
          bottomInset={insets.bottom}
          showTopBorder={!replyInfo}
        />
      </KeyboardAvoidingView>
    </ColorsContext.Provider>
  );
};

export default PostDetailScreen;
