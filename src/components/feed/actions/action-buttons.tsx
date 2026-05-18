import { useContext, useState } from "react";
import { View, TouchableOpacity, Share, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

import { ColorsContext } from "@/context/colors-context";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { LikesCount } from "@/components/feed/content/likes-count";

export const ActionButtons = ({
  postId,
  username,
  initialLikes,
  initialIsLiked
}: {
  postId: string;
  username: string;
  initialLikes: number;
  initialIsLiked: boolean;
}) => {
  const colors = useContext(ColorsContext);
  const router = useRouter();

  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likes, setLikes] = useState(initialLikes);

  const likesText = likes.toLocaleString() + " likes";

  const handleLike = () => {
    setIsLiked(prev => !prev);
    setLikes(prev => (isLiked ? prev - 1 : prev + 1));
  };

  const handleComment = () => {
    router.push(`/post/comments/${postId}`);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this post by @${username}: https://example.com/post/${postId}`,
        url: `https://example.com/post/${postId}`
      });
    } catch {
      // User cancelled
    }
  };

  const openLikes = () => {
    router.push(`/likes/${postId}`);
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.leftButtons}>
          <TouchableOpacity onPress={handleLike} style={styles.iconButton}>
            <View style={isLiked ? shadowStyles.likeActiveShadow : shadowStyles.iconShadow}>
              <IconSymbol name={isLiked ? "heart.fill" : "heart"} size={26} color={isLiked ? "#FF6B6B" : colors.text} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={handleComment}>
            <View style={shadowStyles.iconShadow}>
              <IconSymbol name="bubble.right" size={24} color={colors.text} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={handleShare}>
            <View style={shadowStyles.iconShadow}>
              <IconSymbol name="paperplane" size={24} color={colors.text} />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <LikesCount likesText={likesText} onPress={openLikes} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingBottom: 8
  },
  leftButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14
  },
  iconButton: {
    padding: 2
  }
});

const shadowStyles = StyleSheet.create({
  iconShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    borderRadius: 12,
    overflow: "hidden"
  },
  likeActiveShadow: {
    shadowColor: "#FF6B6B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    borderRadius: 13,
    overflow: "hidden"
  }
});
