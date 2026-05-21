import { useContext, useState } from "react";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

import { BookmarkButton } from "@/components/feed/actions/bookmark-button";
import { LikeButton } from "@/components/feed/actions/like-button";
import { ShareButton } from "@/components/feed/actions/share-button";
import { ColorsContext } from "@/context/colors-context";
import { FeedPost } from "@/data/mock-feed";

interface PostActionsBarProps {
  post: FeedPost;
  shareCount: number;
  onShareComplete: () => void;
}

export const PostActionsBar = ({ post, shareCount, onShareComplete }: PostActionsBarProps) => {
  const colors = useContext(ColorsContext);
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(post.likes);

  const onLike = () => {
    setIsLiked(prevIsLiked => {
      const nextIsLiked = !prevIsLiked;
      setLikesCount(prev => prev + (nextIsLiked ? 1 : -1));
      return nextIsLiked;
    });
  };

  return (
    <>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 12,
          paddingVertical: 8
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
          <LikeButton isLiked={isLiked} colors={colors} onPress={onLike} />
          <ShareButton
            postId={post.id}
            username={post.user.username}
            colors={colors}
            onShareComplete={() => onShareComplete()}
          />
        </View>
        <BookmarkButton initialIsBookmarked={post.isBookmarked} colors={colors} />
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 12 }}>
        <TouchableOpacity onPress={() => router.push(`/likes/${post.id}`)}>
          <Text style={{ fontWeight: "600", fontSize: 14, color: colors.text }}>
            {likesCount.toLocaleString()} likes
          </Text>
        </TouchableOpacity>
        {shareCount > 0 && (
          <Text style={{ fontSize: 14, color: colors.icon }}>
            · {shareCount} {shareCount === 1 ? "share" : "shares"}
          </Text>
        )}
      </View>
    </>
  );
};
