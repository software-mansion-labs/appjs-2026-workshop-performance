import { useContext, useState } from "react";
import { View, Text, TouchableOpacity, GestureResponderEvent, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

import { ColorsContext } from "@/context/colors-context";
import { VerifiedIcon } from "@/components/feed/icons/verified-icon";
import { ImageWithShimmer } from "@/components/feed/shimmer/image-with-shimmer";
import { PostOptionsMenu } from "./post-options-menu";

export const PostHeader = ({
  postId,
  username,
  avatar,
  isVerified,
  locationName,
  onHidePost,
}: {
  postId: string;
  username: string;
  avatar: string;
  isVerified: boolean;
  locationName: string;
  onHidePost: () => void;
}) => {
  const colors = useContext(ColorsContext);
  const router = useRouter();
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<{ x: number; y: number } | undefined>();

  const openLocation = () => {
    router.push(`/location/${encodeURIComponent(locationName)}`);
  };

  const handleMenuPress = (e: GestureResponderEvent) => {
    const { pageX, pageY } = e.nativeEvent;
    setMenuAnchor({ x: pageX, y: pageY });
    setShowOptionsMenu(true);
  };

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.userRow}
          onPress={() => router.push(`/profile/${username}`)}
        >
          <View style={styles.avatarClip}>
            <ImageWithShimmer source={{ uri: avatar }} style={styles.avatar} />
            <View style={styles.avatarOverlay} />
          </View>

          <View>
            <View style={styles.nameRow}>
              <Text style={{ fontWeight: "600", fontSize: 14, color: colors.text }}>{username}</Text>
              {isVerified && (
                <VerifiedIcon size={14} color="#3d2847" />
              )}
            </View>
            <TouchableOpacity onPress={openLocation}>
              <View style={styles.locationRow}>
                <View style={[styles.locationDot, { backgroundColor: colors.tint + "50" }]} />
                <Text style={{ fontSize: 11, color: colors.icon }}>{locationName}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleMenuPress}>
          <Text style={{ fontSize: 16, fontWeight: "bold", color: colors.text }}>•••</Text>
        </TouchableOpacity>
      </View>

      <PostOptionsMenu
        visible={showOptionsMenu}
        onClose={() => setShowOptionsMenu(false)}
        postId={postId}
        username={username}
        onHidePost={onHidePost}
        anchorPosition={menuAnchor}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatarClip: {
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#271c2d",
  },
  avatar: {
    width: 32,
    height: 32,
  },
  avatarOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.15)",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  locationDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
});
