import { TouchableOpacity } from "react-native";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";

export function LikeButton({
  isLiked,
  colors,
  onPress
}: {
  isLiked: boolean;
  colors: typeof Colors.light;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity onPress={onPress} style={{ padding: 2 }}>
      <IconSymbol name={isLiked ? "heart.fill" : "heart"} size={26} color={isLiked ? "#FF6B6B" : colors.text} />
    </TouchableOpacity>
  );
}
