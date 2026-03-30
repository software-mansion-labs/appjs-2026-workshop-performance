import { useContext } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";

import { ColorsContext } from "@/context/colors-context";
import { HeartIcon } from "@/components/feed/icons/heart-icon";
import { CommentIcon } from "@/components/feed/icons/comment-icon";
import { ShareIcon } from "@/components/feed/icons/share-icon";
import { BookmarkIcon } from "@/components/feed/icons/bookmark-icon";

export const ActionButtons = ({
  isLiked,
  isBookmarked,
  onLike,
  onComment,
  onShare,
  onBookmark,
}: {
  isLiked: boolean;
  isBookmarked: boolean;
  onLike: () => void;
  onComment: () => void;
  onShare: () => void;
  onBookmark: () => void;
}) => {
  const colors = useContext(ColorsContext);

  return (
    <View style={styles.container}>
      <View style={styles.leftButtons}>
        <TouchableOpacity onPress={onLike} style={styles.iconButton}>
          <View style={isLiked ? shadowStyles.likeActiveShadow : shadowStyles.iconShadow}>
            <HeartIcon size={26} color={isLiked ? "#FF6B6B" : colors.text} filled={isLiked} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={onComment}>
          <View style={shadowStyles.iconShadow}>
            <CommentIcon size={24} color={colors.text} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={onShare}>
          <View style={shadowStyles.iconShadow}>
            <ShareIcon size={24} color={colors.text} />
          </View>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={onBookmark}>
        <View style={shadowStyles.iconShadow}>
          <BookmarkIcon size={24} color={colors.text} filled={isBookmarked} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  leftButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  iconButton: {
    padding: 2,
  },
});

const shadowStyles = StyleSheet.create({
  iconShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    borderRadius: 12,
    overflow: "hidden",
  },
  likeActiveShadow: {
    shadowColor: "#FF6B6B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    borderRadius: 13,
    overflow: "hidden",
  },
});
