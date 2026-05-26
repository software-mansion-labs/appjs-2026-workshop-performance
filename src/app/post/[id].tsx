import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useEffect, useCallback, useRef, useMemo, startTransition } from "react";
import { View, Text, Image, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { PostDetailHeader } from "@/components/feed/post-detail-header";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { ColorsContext } from "@/context/colors-context";
import { FeedPost, FeedComment, MOCK_FEED } from "@/data/mock-feed";
import { useColorScheme } from "@/hooks/use-color-scheme";

import { CommentComposer, CommentComposerRef } from "@/components/feed/comments/comment-composer";
import { CommentItem } from "@/components/feed/comments/comment-item";
import { findRelatedPosts } from "@/utils/related-posts";

const PostDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const composerRef = useRef<CommentComposerRef>(null);
  const prevCommentsLengthRef = useRef(0);
  const [post, setPost] = useState<FeedPost | null>(null);
  const [comments, setComments] = useState<FeedComment[]>([]);
  const [shareCount, setShareCount] = useState(0);
  const [rendered, setRendered] = useState(false);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  useEffect(() => {
    const foundPost = MOCK_FEED.find(p => p.id === id);
    if (foundPost) {
      setPost(foundPost);
      setComments(foundPost.comments);
    }
  }, [id]);

  useEffect(() => {
    startTransition(() => {
      setRendered(true);
    });
  }, []);

  const hasNewComments = comments.length > prevCommentsLengthRef.current;
  prevCommentsLengthRef.current = comments.length;

  const relatedPosts = useMemo(() => (post ? findRelatedPosts(post) : []), [post]);

  const handleReply = useCallback((commentId: string, username: string) => {
    composerRef.current?.startReply(commentId, username);
  }, []);

  const handleAddComment = useCallback((comment: FeedComment, replyToCommentId?: string) => {
    if (replyToCommentId) {
      setComments(prev =>
        prev.map(c => (c.id === replyToCommentId ? { ...c, replies: [...(c.replies || []), comment] } : c))
      );
    } else {
      setComments(prev => [comment, ...prev]);
    }
  }, []);

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

        {/* Post Content and Comments List */}
        <FlatList
          data={comments}
          extraData={[shareCount]}
          ListHeaderComponent={
            <PostDetailHeader
              post={post}
              shareCount={shareCount}
              commentsCount={comments.length}
              hasNewComments={hasNewComments}
              onShareComplete={() => setShareCount(prevShareCount => prevShareCount + 1)}
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
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <View style={{ padding: 20, alignItems: "center" }}>
              <Text style={{ color: colors.icon, fontSize: 14 }}>No comments yet. Be the first to comment!</Text>
            </View>
          }
          ListFooterComponent={
            relatedPosts.length > 0 && rendered ? (
              <View
                style={{
                  paddingTop: 16,
                  borderTopWidth: 0.5,
                  borderTopColor: colors.icon + "30"
                }}
              >
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
                    <TouchableOpacity onPress={() => router.push(`/post/${item.post.id}`)} style={{ width: 140 }}>
                      <Image
                        source={{
                          uri: item.post.images[0]?.thumbnailUri || item.post.images[0]?.uri
                        }}
                        style={{ width: 140, height: 140, borderRadius: 8 }}
                      />
                      <Text
                        numberOfLines={1}
                        style={{
                          fontSize: 12,
                          fontWeight: "600",
                          color: colors.text,
                          marginTop: 6
                        }}
                      >
                        {item.post.user.username}
                      </Text>
                      <Text
                        numberOfLines={1}
                        style={{
                          fontSize: 11,
                          color: colors.icon,
                          marginTop: 2
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

        {/* Reply indicator + Comment Input */}
        <CommentComposer
          ref={composerRef}
          post={post}
          comments={comments}
          onAddComment={handleAddComment}
          onRemoveComment={commentId => setComments(prev => prev.filter(c => c.id !== commentId))}
          colors={colors}
          bottomInset={insets.bottom}
        />
      </KeyboardAvoidingView>
    </ColorsContext.Provider>
  );
};

export default PostDetailScreen;
