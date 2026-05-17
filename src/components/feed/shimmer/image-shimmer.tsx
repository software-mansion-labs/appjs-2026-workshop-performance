import { StyleSheet } from "react-native";

import { ShimmerView } from "./shimmer-view";

export const ImageShimmer = () => (
  <ShimmerView style={styles.shimmer} />
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
