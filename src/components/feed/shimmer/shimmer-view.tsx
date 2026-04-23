import { useEffect, useRef, useContext } from "react";
import { Animated, StyleProp, ViewStyle } from "react-native";

import { ColorsContext } from "@/context/colors-context";

export const ShimmerView = ({ style }: { style?: StyleProp<ViewStyle> }) => {
  const colors = useContext(ColorsContext);
  const opacity = useRef(new Animated.Value(0.25)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: false }),
        Animated.timing(opacity, { toValue: 0.25, duration: 700, useNativeDriver: false }),
      ])
    ).start();
  }, [opacity]);

  return <Animated.View style={[{ backgroundColor: colors.border, overflow: "hidden" }, style, { opacity }]} />;
};
