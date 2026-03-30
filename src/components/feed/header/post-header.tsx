import { useContext } from "react";
import { View, Text, Image, TouchableOpacity, GestureResponderEvent, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

import { ColorsContext } from "@/context/colors-context";
import { VerifiedIcon } from "@/components/feed/icons/verified-icon";

export const PostHeader = ({
  username,
  avatar,
  isVerified,
  locationName,
  onLocationPress,
  onMenuPress,
}: {
  username: string;
  avatar: string;
  isVerified: boolean;
  locationName: string;
  onLocationPress: () => void;
  onMenuPress: (e: GestureResponderEvent) => void;
}) => {
  const colors = useContext(ColorsContext);
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.userRow}
        onPress={() => router.push(`/profile/${username}`)}
      >
        <View style={shadowStyles.avatarShadow}>
          <View style={styles.avatarClip}>
            <Image source={{ uri: avatar }} style={styles.avatar} />
            <View style={styles.avatarOverlay} />
          </View>
        </View>

        <View>
          <View style={styles.nameRow}>
            <View style={shadowStyles.usernameShadow}>
              <Text style={{ fontWeight: "600", fontSize: 14, color: colors.text }}>{username}</Text>
            </View>
            {isVerified && (
              <View style={shadowStyles.badgeShadow}>
                <VerifiedIcon size={14} color="#3d2847" />
              </View>
            )}
          </View>
          <TouchableOpacity onPress={onLocationPress}>
            <View style={styles.locationRow}>
              <View style={[styles.locationDot, shadowStyles.locationDotShadow, { backgroundColor: colors.tint + "50" }]} />
              <Text style={{ fontSize: 11, color: colors.icon }}>{locationName}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={onMenuPress}>
        <Text style={{ fontSize: 16, fontWeight: "bold", color: colors.text }}>•••</Text>
      </TouchableOpacity>
    </View>
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

const shadowStyles = StyleSheet.create({
  avatarShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
  },
  usernameShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  badgeShadow: {
    shadowColor: "#3d2847",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    borderRadius: 7,
    overflow: "hidden",
  },
  locationDotShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
  },
});
