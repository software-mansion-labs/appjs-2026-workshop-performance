import { View, StyleSheet } from "react-native";

import { FeedComment } from "@/data/mock-feed";

import { CommentPreview } from "./comment-preview";

export const CommentList = ({
  comments,
  postId,
}: {
  comments: FeedComment[];
  postId: string;
}) => {
  if (comments.length === 0) return null;

  return (
    <View style={styles.container}>
      {comments.map((comment) => (
        <CommentPreview key={comment.id} comment={comment} postId={postId} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 4,
  },
});
