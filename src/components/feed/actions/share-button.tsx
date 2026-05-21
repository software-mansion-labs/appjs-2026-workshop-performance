import { memo, useCallback } from "react";
import { TouchableOpacity, Share } from "react-native";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";

function ShareButtonComponent({
  postId,
  username,
  colors,
  onShareComplete
}: {
  postId: string;
  username: string;
  colors: typeof Colors.light;
  onShareComplete: () => void;
}) {
  const handleShare = useCallback(async () => {
    try {
      const result = await Share.share({
        message: `Check out this post by @${username}: https://example.com/post/${postId}`,
        url: `https://example.com/post/${postId}`
      });
      if (result.action === Share.sharedAction) {
        onShareComplete();
      }
    } catch {
      // User cancelled
    }
  }, [postId, username, onShareComplete]);

  return (
    <TouchableOpacity style={{ padding: 2 }} onPress={handleShare}>
      <IconSymbol name="paperplane" size={24} color={colors.text} />
    </TouchableOpacity>
  );
}

export const ShareButton = memo(ShareButtonComponent);