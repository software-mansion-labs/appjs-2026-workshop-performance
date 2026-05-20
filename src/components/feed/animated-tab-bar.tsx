import { BottomTabBar, type BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useEffect } from "react";
import { StyleSheet } from "react-native";
import Reanimated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { useImmersive } from "@/context/immersive-context";

import { TRANSITION_EASING, TRANSITION_MS } from "./immersive-animation";

const TAB_BAR_SLIDE_PX = 120;
const IMMERSIVE_TAB_NAME = "index";

export const AnimatedTabBar = (props: BottomTabBarProps) => {
  const { progress } = useImmersive();
  const isOnImmersiveTab =
    props.state.routes[props.state.index].name === IMMERSIVE_TAB_NAME;

  const gate = useSharedValue(0);
  useEffect(() => {
    gate.value = withTiming(isOnImmersiveTab ? 1 : 0, {
      duration: TRANSITION_MS,
      easing: TRANSITION_EASING,
    });
  }, [isOnImmersiveTab, gate]);

  const animStyle = useAnimatedStyle(() => {
    const hide = progress.value * gate.value;
    return {
      transform: [{ translateY: hide * TAB_BAR_SLIDE_PX }],
      opacity: 1 - hide,
    };
  });

  return (
    <Reanimated.View style={[styles.tabBarWrapper, animStyle]}>
      <BottomTabBar {...props} />
    </Reanimated.View>
  );
};

const styles = StyleSheet.create({
  tabBarWrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
});
