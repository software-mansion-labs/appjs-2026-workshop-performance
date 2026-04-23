import { useState, useContext } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
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
    <View style={[styles.card, { borderColor: colors.border, backgroundColor: colors.cardBackground }]}>
      <TouchableOpacity onPress={openPost}>
        <Image source={{ uri: post.image }} style={styles.image} resizeMode="cover" />
      </TouchableOpacity>
      <View style={styles.info}>
        <TouchableOpacity onPress={openProfile} style={styles.userRow}>
          <Image source={{ uri: post.avatar }} style={styles.avatar} />
          <Text numberOfLines={1} style={[styles.username, { color: colors.text }]}>
            {post.username}
          </Text>
        </TouchableOpacity>
        <Text numberOfLines={2} style={[styles.caption, { color: colors.icon }]}>
          {post.caption}
        </Text>
        <TouchableOpacity
          onPress={() => setIsFollowing(!isFollowing)}
          style={[
            styles.followButton,
            {
              backgroundColor: isFollowing ? colors.background : colors.tint,
              borderWidth: isFollowing ? 1 : 0,
              borderColor: colors.icon + "40",
            },
          ]}
        >
          <Text style={[styles.followText, { color: isFollowing ? colors.text : "#fff" }]}>
            {isFollowing ? "Following" : "Follow"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 160,
    marginRight: 8,
    borderRadius: 8,
    borderWidth: 0.5,
    overflow: "hidden",
  },
  image: {
    width: 160,
    height: 160,
  },
  info: {
    padding: 8,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  avatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  username: {
    fontSize: 12,
    fontWeight: "600",
    flex: 1,
  },
  caption: {
    fontSize: 11,
    marginTop: 4,
    lineHeight: 15,
  },
  followButton: {
    marginTop: 6,
    borderRadius: 6,
    paddingVertical: 4,
    alignItems: "center",
  },
  followText: {
    fontSize: 12,
    fontWeight: "600",
  },
});
