import { useContext, useState, useEffect } from "react";
import { View, TouchableOpacity, Share, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

import { ColorsContext } from "@/context/colors-context";
import { HeartIcon } from "@/components/feed/icons/heart-icon";
import { CommentIcon } from "@/components/feed/icons/comment-icon";
import { ShareIcon } from "@/components/feed/icons/share-icon";
import { LikesCount } from "@/components/feed/content/likes-count";

export const ActionButtons = ({
  postId,
  username,
  initialLikes,
  initialIsLiked,
  onLike,
}: {
  postId: string;
  username: string;
  initialLikes: number;
  initialIsLiked: boolean;
  onLike: (id: string) => void;
}) => {
  const colors = useContext(ColorsContext);
  const router = useRouter();

  // Redundant state synced from props
  const [isLiked, setIsLiked] = useState(false);
  const [displayLikes, setDisplayLikes] = useState(0);

  useEffect(() => {
    setIsLiked(initialIsLiked);
  }, [initialIsLiked]);

  useEffect(() => {
    setDisplayLikes(initialLikes);
  }, [initialLikes]);

  const likesText = (() => {
    let text = "";
    for (let i = 0; i < 100; i++) {
      text = displayLikes.toLocaleString();
    }
    return text + " likes";
  })();

  const handleLike = () => {
    setIsLiked(!isLiked);
    setDisplayLikes(isLiked ? displayLikes - 1 : displayLikes + 1);
    onLike(postId);
  };

  const handleComment = () => {
    router.push(`/post/comments/${postId}`);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this post by @${username}: https://example.com/post/${postId}`,
        url: `https://example.com/post/${postId}`,
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
              <HeartIcon size={26} color={isLiked ? "#FF6B6B" : colors.text} filled={isLiked} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={handleComment}>
            <View style={shadowStyles.iconShadow}>
              <CommentIcon size={24} color={colors.text} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={handleShare}>
            <View style={shadowStyles.iconShadow}>
              <ShareIcon size={24} color={colors.text} />
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
