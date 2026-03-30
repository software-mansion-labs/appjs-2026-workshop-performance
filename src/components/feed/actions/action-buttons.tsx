import { useContext } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { ColorsContext } from "@/context/colors-context";

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
            <IconSymbol name={isLiked ? "heart.fill" : "heart"} size={26} color={isLiked ? "#FF6B6B" : colors.text} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={onComment}>
          <View style={shadowStyles.iconShadow}>
            <IconSymbol name="bubble.right" size={24} color={colors.text} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={onShare}>
          <View style={shadowStyles.iconShadow}>
            <IconSymbol name="paperplane" size={24} color={colors.text} />
          </View>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={onBookmark}>
        <View style={shadowStyles.iconShadow}>
          <IconSymbol name={isBookmarked ? "bookmark.fill" : "bookmark"} size={24} color={colors.text} />
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
