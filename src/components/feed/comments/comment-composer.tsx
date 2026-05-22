import { forwardRef, useCallback, useImperativeHandle, useRef, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

import { CommentInput } from "@/components/feed/comment-input";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { FeedComment, FeedPost, Mention } from "@/data/mock-feed";
import { detectSpam } from "@/utils/spam-detection";

interface ReplyInfo {
  commentId: string;
  username: string;
}

export interface CommentComposerRef {
  startReply: (commentId: string, username: string) => void;
}

interface CommentComposerProps {
  post: FeedPost;
  comments: FeedComment[];
  onAddComment: (comment: FeedComment, replyToCommentId?: string) => void;
  onRemoveComment?: (commentId: string) => void;
  colors: typeof Colors.light;
  bottomInset: number;
}

export const CommentComposer = forwardRef<CommentComposerRef, CommentComposerProps>(function CommentComposer(
  { post, comments, onAddComment, onRemoveComment, colors, bottomInset },
  ref
) {
  const inputRef = useRef<TextInput>(null);
  const [newComment, setNewComment] = useState("");
  const [replyInfo, setReplyInfo] = useState<ReplyInfo | null>(null);

  useImperativeHandle(ref, () => ({
    startReply(commentId, username) {
      setReplyInfo({ commentId, username });
      setNewComment(`@${username} `);
      inputRef.current?.focus();
    }
  }));

  const handleAddComment = useCallback(() => {
    if (!newComment.trim() || !post) return;

    const commentText = replyInfo ? newComment.replace(`@${replyInfo.username} `, "") : newComment;

    const mentionRegex = /@(\w+)/g;
    const mentions: Mention[] = [];
    let match: RegExpExecArray | null;
    while ((match = mentionRegex.exec(commentText)) !== null) {
      mentions.push({
        username: match[1],
        position: { start: match.index, end: match.index + match[0].length },
        userId: match[1]
      });
    }

    const newCommentObj: FeedComment = {
      id: `new-comment-${Date.now()}`,
      username: "you",
      avatar: "https://i.pravatar.cc/150?img=68",
      text: commentText.trim(),
      likes: 0,
      timestamp: "Just now",
      replyingTo: replyInfo?.username,
      mentions,
      replies: []
    };

    onAddComment(newCommentObj, replyInfo?.commentId);
    setNewComment("");
    setReplyInfo(null);

    // Run spam check after the render, remove if spam
    setTimeout(() => {
      const { isSpam, maxSimilarity } = detectSpam(commentText, comments);
      if (isSpam) {
        console.warn(`[Spam] Comment discarded (similarity: ${maxSimilarity.toFixed(2)})`);
        onRemoveComment?.(newCommentObj.id);
      }
    }, 0);
  }, [newComment, post, replyInfo, comments, onAddComment, onRemoveComment]);

  const cancelReply = useCallback(() => {
    setReplyInfo(null);
    setNewComment("");
  }, []);

  return (
    <>
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

      <CommentInput
        ref={inputRef}
        value={newComment}
        onChangeText={setNewComment}
        onSubmit={handleAddComment}
        placeholder={replyInfo ? `Reply to @${replyInfo.username}...` : "Add a comment..."}
        colors={colors}
        comments={comments}
        bottomInset={bottomInset}
        showTopBorder={!replyInfo}
      />
    </>
  );
});
