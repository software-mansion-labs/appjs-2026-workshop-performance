import { StyleSheet } from "react-native";

import { ShimmerView } from "./shimmer-view";

export const ImageShimmer = () => (
  <ShimmerView style={[styles.shimmer, shadowStyles.shimmerShadow]} />
);

const styles = StyleSheet.create({
  shimmer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
