import { StyleSheet } from "react-native";
import Reanimated, { useAnimatedStyle } from "react-native-reanimated";

import { useImmersive } from "@/context/immersive-context";

import { AnimatedBackdrop } from "./animated-backdrop";

export const ImmersiveBackdrop = () => {
  const { progress } = useImmersive();

  const animStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
  }));

  return (
    <Reanimated.View style={[StyleSheet.absoluteFill, animStyle]} pointerEvents="none">
      <AnimatedBackdrop />
    </Reanimated.View>
  );
};
