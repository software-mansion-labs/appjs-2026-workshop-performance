import { useState } from "react";
import { TouchableOpacity } from "react-native";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";

export function LikeButton({
  initialIsLiked,
  initialLikesCount,
  colors,
  onLikesCountChange
}: {
  initialIsLiked: boolean;
  initialLikesCount: number;
  colors: typeof Colors.light;
  onLikesCountChange: (count: number) => void;
}) {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likesCount, setLikesCount] = useState(initialLikesCount);

  const handleLike = () => {
    const newIsLiked = !isLiked;
    const newCount = newIsLiked ? likesCount + 1 : likesCount - 1;
    setIsLiked(newIsLiked);
    setLikesCount(newCount);
    onLikesCountChange(newCount);
  };

  return (
    <TouchableOpacity onPress={handleLike} style={{ padding: 2 }}>
      <IconSymbol name={isLiked ? "heart.fill" : "heart"} size={26} color={isLiked ? "#FF6B6B" : colors.text} />
    </TouchableOpacity>
  );
}
