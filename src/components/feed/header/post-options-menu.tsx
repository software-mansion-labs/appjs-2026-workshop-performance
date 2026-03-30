import { useContext, useState } from "react";
import { Text, TouchableOpacity, Modal, Pressable, Alert, Share, Dimensions, StyleSheet } from "react-native";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";

import { ColorsContext } from "@/context/colors-context";
import { MenuIcon } from "@/components/feed/icons/menu-icon";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const POPOVER_WIDTH = 220;

interface PostOptionsMenuProps {
  visible: boolean;
  onClose: () => void;
  postId: string;
  username: string;
  onHidePost?: () => void;
  anchorPosition?: { x: number; y: number };
}

type MenuIconName = "bell" | "link" | "share" | "person" | "eye-slash" | "flag";

interface MenuOption {
  icon: MenuIconName;
  label: string;
  onPress: () => void;
  destructive?: boolean;
}

export const PostOptionsMenu = ({
  visible,
  onClose,
  postId,
  username,
  onHidePost,
  anchorPosition,
}: PostOptionsMenuProps) => {
  const colors = useContext(ColorsContext);
  const router = useRouter();
  const [isReported, setIsReported] = useState(false);

  const handleCopyLink = async () => {
    await Clipboard.setStringAsync(`https://example.com/post/${postId}`);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert("Link Copied", "Post link has been copied to clipboard");
    onClose();
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
    onClose();
  };

  const handleReport = () => {
    setIsReported(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert("Post Reported", "Thank you for your feedback. We will review this post.", [
      { text: "OK", onPress: onClose },
    ]);
  };

  const handleNotInterested = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (onHidePost) {
      onHidePost();
    }
    Alert.alert("Got it", "We will show you fewer posts like this.", [{ text: "OK", onPress: onClose }]);
  };

  const handleAboutAccount = () => {
    onClose();
    router.push(`/profile/${username}`);
  };

  const handleTurnOnNotifications = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert("Notifications On", `You will now receive notifications when @${username} posts.`, [
      { text: "OK", onPress: onClose },
    ]);
  };

  const menuOptions: MenuOption[] = [
    { icon: "bell", label: "Notifications", onPress: handleTurnOnNotifications },
    { icon: "link", label: "Copy link", onPress: handleCopyLink },
    { icon: "share", label: "Share", onPress: handleShare },
    { icon: "person", label: "About account", onPress: handleAboutAccount },
    { icon: "eye-slash", label: "Not interested", onPress: handleNotInterested },
    { icon: "flag", label: isReported ? "Reported" : "Report", onPress: handleReport, destructive: true },
  ];

  const popoverLeft = anchorPosition
    ? Math.min(Math.max(anchorPosition.x - POPOVER_WIDTH + 20, 16), SCREEN_WIDTH - POPOVER_WIDTH - 16)
    : SCREEN_WIDTH - POPOVER_WIDTH - 16;
  const popoverTop = anchorPosition ? anchorPosition.y + 10 : 100;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable
          style={[
            styles.popover,
            shadowStyles.popoverShadow,
            { top: popoverTop, left: popoverLeft, backgroundColor: colors.cardBackground },
          ]}
          onPress={(e) => e.stopPropagation()}
        >
          {menuOptions.map((option, index) => (
            <TouchableOpacity
              key={option.label}
              onPress={option.onPress}
              style={[
                styles.menuItem,
                {
                  borderBottomWidth: index < menuOptions.length - 1 ? 0.5 : 0,
                  borderBottomColor: colors.icon + "20",
                },
              ]}
            >
              <MenuIcon name={option.icon} size={18} color={option.destructive ? "#FF6B6B" : colors.text} />
              <Text style={[styles.menuLabel, { color: option.destructive ? "#FF6B6B" : colors.text }]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  popover: {
    position: "absolute",
    width: POPOVER_WIDTH,
    borderRadius: 12,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
  },
  menuLabel: {
    fontSize: 15,
    flex: 1,
  },
});

const shadowStyles = StyleSheet.create({
  popoverShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
});
