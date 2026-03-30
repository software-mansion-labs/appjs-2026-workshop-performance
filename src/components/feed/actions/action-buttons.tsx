import { useContext } from "react";
import { View, TouchableOpacity } from "react-native";

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
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 12,
        paddingBottom: 8,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
        <TouchableOpacity onPress={onLike} style={{ padding: 2 }}>
          <IconSymbol name={isLiked ? "heart.fill" : "heart"} size={26} color={isLiked ? "#FF6B6B" : colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={{ padding: 2 }} onPress={onComment}>
          <IconSymbol name="bubble.right" size={24} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={{ padding: 2 }} onPress={onShare}>
          <IconSymbol name="paperplane" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={onBookmark}>
        <IconSymbol name={isBookmarked ? "bookmark.fill" : "bookmark"} size={24} color={colors.text} />
      </TouchableOpacity>
    </View>
  );
};
