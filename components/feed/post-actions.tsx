import { TouchableOpacity, View } from "react-native";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";

export function PostActions({
  isLiked,
  isBookmarked,
  onLikePress,
  onBookmarkPress,
  colors,
}: {
  isLiked: boolean;
  isBookmarked: boolean;
  onLikePress: () => void;
  onBookmarkPress: () => void;
  colors: typeof Colors.light;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 12,
        paddingVertical: 10,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
        <TouchableOpacity onPress={onLikePress} style={{ padding: 2 }}>
          <IconSymbol
            name={isLiked ? "heart.fill" : "heart"}
            size={26}
            color={isLiked ? "#ed4956" : colors.text}
          />
        </TouchableOpacity>
        <TouchableOpacity style={{ padding: 2 }}>
          <IconSymbol name="bubble.right" size={24} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={{ padding: 2 }}>
          <IconSymbol name="paperplane" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={onBookmarkPress}>
        <IconSymbol
          name={isBookmarked ? "bookmark.fill" : "bookmark"}
          size={24}
          color={colors.text}
        />
      </TouchableOpacity>
    </View>
  );
}
