import { useState, useCallback } from "react";
import { TouchableOpacity } from "react-native";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";

export function BookmarkButton({
  initialIsBookmarked,
  colors
}: {
  initialIsBookmarked: boolean;
  colors: typeof Colors.light;
}) {
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);

  const handleBookmark = useCallback(() => {
    setIsBookmarked(prev => !prev);
  }, []);

  return (
    <TouchableOpacity onPress={handleBookmark}>
      <IconSymbol name={isBookmarked ? "bookmark.fill" : "bookmark"} size={24} color={colors.text} />
    </TouchableOpacity>
  );
}
