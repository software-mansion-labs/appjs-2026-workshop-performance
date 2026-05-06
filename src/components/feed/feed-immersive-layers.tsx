import { StyleSheet, useColorScheme } from "react-native";
import Reanimated, { useAnimatedStyle } from "react-native-reanimated";

import { useImmersive } from "@/context/immersive-context";

const CARD_OPACITY_IMMERSIVE = 0.2;
const CARD_OPACITY_PLAIN = 1;
const FROSTED_OPACITY_IMMERSIVE = 0.4;

const FROSTED_TINT_DARK = "#281E32";
const FROSTED_TINT_LIGHT = "#FFFFFF";

export const AnimatedTranslucentCardBg = ({ color }: { color: string }) => {
  const { progress } = useImmersive();

  const animStyle = useAnimatedStyle(() => ({
    opacity: 1 - progress.value * (CARD_OPACITY_PLAIN - CARD_OPACITY_IMMERSIVE),
  }));

  return (
    <Reanimated.View
      style={[StyleSheet.absoluteFill, { backgroundColor: color }, animStyle]}
      pointerEvents="none"
    />
  );
};

export const AnimatedFrostedLayer = () => {
  const { progress } = useImmersive();
  const colorScheme = useColorScheme();
  const tintColor = colorScheme === "dark" ? FROSTED_TINT_DARK : FROSTED_TINT_LIGHT;

  const animStyle = useAnimatedStyle(() => ({
    opacity: progress.value * FROSTED_OPACITY_IMMERSIVE,
  }));

  return (
    <Reanimated.View
      style={[StyleSheet.absoluteFill, { backgroundColor: tintColor }, animStyle]}
      pointerEvents="none"
    />
  );
};
