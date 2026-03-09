import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { ColorsContext } from '@/context/colors-context';
import { MOCK_FEED, FeedPost, FeedComment } from '@/data/mock-feed';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { formatRelativeTime } from '@/utils/feed-utils';

interface ReplyInfo {
  commentId: string;
  username: string;
}

function CommentItem({
  comment,
  colors,
  onReply,
  isReply = false,
}: {
  comment: FeedComment;
  colors: typeof Colors.light;
  onReply: (commentId: string, username: string) => void;
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
          flexDirection: 'row',
          paddingHorizontal: 16,
          paddingLeft: isReply ? 56 : 16,
          paddingVertical: 12,
          alignItems: 'flex-start',
          gap: 12,
        }}
      >
        <Image
          source={{ uri: comment.avatar }}
          style={{
            width: isReply ? 28 : 36,
            height: isReply ? 28 : 36,
            borderRadius: isReply ? 14 : 18,
          }}
        />
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 14, color: colors.text, lineHeight: 20 }}>
            <Text style={{ fontWeight: '600' }}>{comment.username}</Text>{' '}
            {comment.replyingTo && (
              <Text style={{ color: '#3897f0' }}>@{comment.replyingTo} </Text>
            )}
            {comment.text}
          </Text>
          <View style={{ flexDirection: 'row', gap: 16, marginTop: 6 }}>
            <Text style={{ fontSize: 12, color: colors.icon }}>
              {formattedTime}
            </Text>
            <Text style={{ fontSize: 12, color: colors.icon }}>
              {likeCount} likes
            </Text>
            <TouchableOpacity
              onPress={() => onReply(comment.id, comment.username)}
            >
              <Text
                style={{ fontSize: 12, color: colors.icon, fontWeight: '600' }}
              >
                Reply
              </Text>
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
          <IconSymbol
            name={isLiked ? 'heart.fill' : 'heart'}
            size={14}
            color={isLiked ? '#ed4956' : colors.icon}
          />
        </TouchableOpacity>
      </View>

      {/* View replies toggle */}
      {hasReplies && !isReply && (
        <TouchableOpacity
          onPress={() => setShowReplies(!showReplies)}
          style={{
            paddingLeft: 64,
            paddingBottom: 8,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <View
            style={{
              width: 24,
              height: 1,
              backgroundColor: colors.icon,
            }}
          />
          <Text style={{ fontSize: 12, color: colors.icon, fontWeight: '600' }}>
            {showReplies
              ? 'Hide replies'
              : `View ${comment.replies!.length} ${comment.replies!.length === 1 ? 'reply' : 'replies'}`}
          </Text>
        </TouchableOpacity>
      )}

      {/* Replies */}
      {showReplies &&
        hasReplies &&
        comment.replies!.map((reply) => (
          <CommentItem
            key={reply.id}
            comment={reply}
            colors={colors}
            onReply={onReply}
            isReply
          />
        ))}
    </View>
  );
}

export default function CommentsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();
  const inputRef = useRef<TextInput>(null);

  const [post, setPost] = useState<FeedPost | null>(null);
  const [comments, setComments] = useState<FeedComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyInfo, setReplyInfo] = useState<ReplyInfo | null>(null);

  useEffect(() => {
    const foundPost = MOCK_FEED.find((p) => p.id === id);
    if (foundPost) {
      setPost(foundPost);
      setComments(foundPost.comments);
    }
  }, [id]);

  const handleReply = useCallback((commentId: string, username: string) => {
    setReplyInfo({ commentId, username });
    setNewComment(`@${username} `);
    inputRef.current?.focus();
  }, []);

  const handleAddComment = useCallback(() => {
    if (!newComment.trim() || !post) return;

    const commentText = replyInfo
      ? newComment.replace(`@${replyInfo.username} `, '')
      : newComment;

    const newCommentObj: FeedComment = {
      id: `new-comment-${Date.now()}`,
      username: 'you',
      avatar: 'https://i.pravatar.cc/150?img=68',
      text: commentText.trim(),
      likes: 0,
      timestamp: 'Just now',
      replyingTo: replyInfo?.username,
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
        })
      );
    } else {
      // Add as top-level comment
      setComments((prev) => [newCommentObj, ...prev]);
    }

    setNewComment('');
    setReplyInfo(null);
  }, [newComment, post, replyInfo]);

  const cancelReply = useCallback(() => {
    setReplyInfo(null);
    setNewComment('');
  }, []);

  if (!post) {
    return (
      <ColorsContext.Provider value={colors}>
        <View
          style={{
            flex: 1,
            backgroundColor: colors.background,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{ color: colors.text }}>Post not found</Text>
        </View>
      </ColorsContext.Provider>
    );
  }

  const renderHeader = () => (
    <View
      style={{
        borderBottomWidth: 0.5,
        borderBottomColor: colors.icon + '30',
        paddingBottom: 12,
      }}
    >
      {/* Caption as first "comment" */}
      {post.caption.length > 0 && (
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 16,
            paddingVertical: 12,
            alignItems: 'flex-start',
            gap: 12,
          }}
        >
          <Image
            source={{ uri: post.user.avatar }}
            style={{ width: 36, height: 36, borderRadius: 18 }}
          />
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, color: colors.text, lineHeight: 20 }}>
              <Text style={{ fontWeight: '600' }}>{post.user.username}</Text>{' '}
              {post.caption}
            </Text>
            <Text style={{ fontSize: 12, color: colors.icon, marginTop: 6 }}>
              {formatRelativeTime(post.timestamp)}
            </Text>
          </View>
        </View>
      )}
    </View>
  );

  return (
    <ColorsContext.Provider value={colors}>
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: colors.background }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={90}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingBottom: 10,
            paddingTop: insets.top,
            backgroundColor: colors.background,
            borderBottomWidth: 0.5,
            borderBottomColor: colors.icon + '30',
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
              fontWeight: '600',
              color: colors.text,
              flex: 1,
            }}
          >
            Comments
          </Text>
          <TouchableOpacity style={{ padding: 4 }}>
            <IconSymbol name="paperplane" size={22} color={colors.text} />
          </TouchableOpacity>
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
            />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <View style={{ padding: 40, alignItems: 'center' }}>
              <Text
                style={{
                  color: colors.text,
                  fontSize: 18,
                  fontWeight: '600',
                  marginBottom: 8,
                }}
              >
                No comments yet
              </Text>
              <Text
                style={{ color: colors.icon, fontSize: 14, textAlign: 'center' }}
              >
                Start the conversation.
              </Text>
            </View>
          }
        />

        {/* Reply indicator */}
        {replyInfo && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 16,
              paddingVertical: 8,
              backgroundColor: colors.icon + '15',
              borderTopWidth: 0.5,
              borderTopColor: colors.icon + '30',
            }}
          >
            <Text style={{ fontSize: 13, color: colors.icon }}>
              Replying to{' '}
              <Text style={{ color: colors.text, fontWeight: '600' }}>
                @{replyInfo.username}
              </Text>
            </Text>
            <TouchableOpacity onPress={cancelReply}>
              <IconSymbol name="xmark" size={18} color={colors.icon} />
            </TouchableOpacity>
          </View>
        )}

        {/* Comment Input */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 12,
            paddingVertical: 10,
            borderTopWidth: replyInfo ? 0 : 0.5,
            borderTopColor: colors.icon + '30',
            backgroundColor: colors.background,
            paddingBottom: insets.bottom + 10,
          }}
        >
          <Image
            source={{ uri: 'https://i.pravatar.cc/150?img=68' }}
            style={{ width: 36, height: 36, borderRadius: 18 }}
          />
          <TextInput
            ref={inputRef}
            style={{
              flex: 1,
              marginHorizontal: 12,
              paddingVertical: 10,
              paddingHorizontal: 14,
              backgroundColor: colors.icon + '15',
              borderRadius: 22,
              color: colors.text,
              fontSize: 14,
            }}
            placeholder={
              replyInfo ? `Reply to @${replyInfo.username}...` : 'Add a comment...'
            }
            placeholderTextColor={colors.icon}
            value={newComment}
            onChangeText={setNewComment}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            onPress={handleAddComment}
            disabled={!newComment.trim()}
          >
            <Text
              style={{
                color: newComment.trim() ? '#3897f0' : colors.icon,
                fontWeight: '600',
                fontSize: 14,
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
