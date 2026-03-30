import { useEffect, useRef, useContext } from "react";
import { Animated, StyleSheet } from "react-native";

import { ColorsContext } from "@/context/colors-context";

export const ImageShimmer = () => {
  const colors = useContext(ColorsContext);
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 600, useNativeDriver: false }),
        Animated.timing(opacity, { toValue: 0.4, duration: 600, useNativeDriver: false }),
      ])
    ).start();
  }, [opacity]);

  return (
    <Animated.View
      style={[styles.shimmer, shadowStyles.shimmerShadow, { backgroundColor: colors.border, opacity }]}
    />
  );
};

const styles = StyleSheet.create({
  shimmer: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
});

const shadowStyles = StyleSheet.create({
  shimmerShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
});
