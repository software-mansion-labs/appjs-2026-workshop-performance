import { useContext, useState } from "react";
import { useRouter } from "expo-router";
import { GestureResponderEvent, Image, Text, TouchableOpacity, View } from "react-native";

import { BookmarkButton } from "@/components/feed/actions/bookmark-button";
import { LikeButton } from "@/components/feed/actions/like-button";
import { ShareButton } from "@/components/feed/actions/share-button";
import { ImageCarousel } from "@/components/feed/content/image-carousel";
import { PostOptionsMenu } from "@/components/feed/header/post-options-menu";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { ColorsContext } from "@/context/colors-context";
import { FeedPost } from "@/data/mock-feed";
import { formatRelativeTime } from "@/utils/feed-utils";

interface PostDetailHeaderProps {
  post: FeedPost;
  shareCount: number;
  commentsCount: number;
  hasNewComments: boolean;
  onShareComplete: () => void;
}

export const PostDetailHeader = ({
  post,
  shareCount,
  commentsCount,
  hasNewComments,
  onShareComplete
}: PostDetailHeaderProps) => {
  const colors = useContext(ColorsContext);
  const router = useRouter();
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<{ x: number; y: number } | undefined>();
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(post.likes);
  
  const onLike = () => {
    setIsLiked(prevIsLiked => {
      const nextIsLiked = !prevIsLiked;
      setLikesCount(prevLikesCount => prevLikesCount + (nextIsLiked ? 1 : -1));
      return nextIsLiked;
    });
  };

  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 12,
          paddingVertical: 10
        }}
      >
        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
          onPress={() => router.push(`/profile/${post.user.username}`)}
        >
          <Image
            source={{ uri: post.user.avatar }}
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              borderWidth: 2,
              borderColor: "#271c2d"
            }}
          />
          <View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <Text style={{ fontWeight: "600", fontSize: 14, color: colors.text }}>{post.user.username}</Text>
              {post.user.isVerified && <IconSymbol name="checkmark.seal.fill" size={14} color="#3d2847" />}
            </View>
            <TouchableOpacity onPress={() => router.push(`/location/${encodeURIComponent(post.location.name)}`)}>
              <Text style={{ fontSize: 11, color: colors.icon }}>{post.location.name}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={(e: GestureResponderEvent) => {
            const { pageX, pageY } = e.nativeEvent;
            setMenuAnchor({ x: pageX, y: pageY });
            setShowOptionsMenu(true);
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "bold", color: colors.text }}>•••</Text>
        </TouchableOpacity>
      </View>

      <PostOptionsMenu
        visible={showOptionsMenu}
        onClose={() => setShowOptionsMenu(false)}
        postId={post.id}
        username={post.user.username}
        anchorPosition={menuAnchor}
      />

      <ImageCarousel images={post.images} />

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
            onShareComplete={onShareComplete}
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

      {post.caption.length > 0 && (
        <View style={{ paddingHorizontal: 12, paddingTop: 4 }}>
          <Text style={{ fontSize: 14, lineHeight: 20, color: colors.text }}>
            <Text style={{ fontWeight: "600" }} onPress={() => router.push(`/profile/${post.user.username}`)}>
              {post.user.username}
            </Text>{" "}
            {post.caption}
          </Text>
        </View>
      )}

      <Text
        style={{
          paddingHorizontal: 12,
          paddingTop: 8,
          paddingBottom: 16,
          fontSize: 11,
          color: colors.icon,
          textTransform: "uppercase"
        }}
      >
        {formatRelativeTime(post.timestamp)}
      </Text>

      <View
        style={{
          borderTopWidth: 0.5,
          borderTopColor: colors.icon + "30",
          paddingHorizontal: 12,
          paddingVertical: 12
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Text style={{ fontSize: 14, fontWeight: "600", color: colors.text }}>
            {commentsCount === 1 ? "1 Comment" : `${commentsCount} Comments`}
          </Text>
          {hasNewComments && (
            <View
              style={{
                backgroundColor: "#3d2847",
                borderRadius: 4,
                paddingHorizontal: 6,
                paddingVertical: 2
              }}
            >
              <Text style={{ fontSize: 10, fontWeight: "700", color: "#fff" }}>NEW</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};
