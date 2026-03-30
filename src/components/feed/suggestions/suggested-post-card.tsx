import { useState, useContext } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

import { ColorsContext } from "@/context/colors-context";
import { SuggestedPost } from "@/data/mock-feed";

export const SuggestedPostCard = ({ post }: { post: SuggestedPost }) => {
  const colors = useContext(ColorsContext);
  const router = useRouter();
  const [isFollowing, setIsFollowing] = useState(false);

  const openProfile = () => {
    router.push(`/profile/${post.username}`);
  };

  const openPost = () => {
    router.push(`/post/${post.id}`);
  };

  return (
    <View
      style={{
        width: 160,
        marginRight: 8,
        borderRadius: 8,
        borderWidth: 0.5,
        borderColor: colors.border,
        overflow: "hidden",
        backgroundColor: colors.cardBackground,
      }}
    >
      <TouchableOpacity onPress={openPost}>
        <Image source={{ uri: post.image }} style={{ width: 160, height: 160 }} resizeMode="cover" />
      </TouchableOpacity>
      <View style={{ padding: 8 }}>
        <TouchableOpacity onPress={openProfile} style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Image source={{ uri: post.avatar }} style={{ width: 20, height: 20, borderRadius: 10 }} />
          <Text
            numberOfLines={1}
            style={{
              fontSize: 12,
              fontWeight: "600",
              color: colors.text,
              flex: 1,
            }}
          >
            {post.username}
          </Text>
        </TouchableOpacity>
        <Text
          numberOfLines={2}
          style={{
            fontSize: 11,
            color: colors.icon,
            marginTop: 4,
            lineHeight: 15,
          }}
        >
          {post.caption}
        </Text>
        <TouchableOpacity
          onPress={() => setIsFollowing(!isFollowing)}
          style={{
            marginTop: 6,
            backgroundColor: isFollowing ? colors.background : colors.tint,
            borderRadius: 6,
            paddingVertical: 4,
            alignItems: "center",
            borderWidth: isFollowing ? 1 : 0,
            borderColor: colors.icon + "40",
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: "600",
              color: isFollowing ? colors.text : "#fff",
            }}
          >
            {isFollowing ? "Following" : "Follow"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
