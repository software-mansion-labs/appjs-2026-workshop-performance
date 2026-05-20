import { useContext } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import Reanimated, {
  interpolateColor,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { EngagementSettingsButton } from "@/components/feed/header/engagement-settings-menu";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { ColorsContext } from "@/context/colors-context";
import { useImmersive } from "@/context/immersive-context";

export const FeedHeader = () => {
  const colors = useContext(ColorsContext);
  const insets = useSafeAreaInsets();
  const { progress, toggle } = useImmersive();

  const buttonBgStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [`${colors.text}00`, colors.text],
    ),
  }));

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + 8,
          backgroundColor: colors.background,
          borderBottomColor: colors.border
        }
      ]}
    >
      <Image source={require("../../../assets/images/logo_appjs.png")} style={styles.logo} />
      <View style={styles.actions}>
        <Pressable onPress={toggle} hitSlop={6}>
          <Reanimated.View
            style={[styles.toggleBadge, { borderColor: colors.text }, buttonBgStyle]}
          >
            <Text style={styles.toggleEmoji}>{"✨"}</Text>
          </Reanimated.View>
        </Pressable>
        <EngagementSettingsButton />
        <View style={[styles.dateBadge, { borderColor: colors.text }]}>
          <IconSymbol name="calendar" size={14} color={colors.text} />
          <Text style={[styles.dateText, { color: colors.text }]}>27-29 May &apos;26</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 0.5
  },
  logo: {
    height: 32,
    width: 36
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  toggleBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  toggleEmoji: {
    fontSize: 14,
  },
  dateBadge: {
    borderWidth: 1.5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 6
  },
  dateText: {
    fontSize: 12,
    fontWeight: "500"
  }
});
