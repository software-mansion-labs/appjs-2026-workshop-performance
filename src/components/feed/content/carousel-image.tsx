import { View, StyleSheet } from "react-native";

import { FeedImage } from "@/data/mock-feed";
import { ImageWithShimmer } from "@/components/feed/shimmer/image-with-shimmer";

const IMAGE_WIDTH = 400;

export const CarouselImage = ({ image }: { image: FeedImage }) => (
  <View>
    <ImageWithShimmer
      source={{ uri: image.uri }}
      style={{ width: IMAGE_WIDTH, aspectRatio: image.aspectRatio }}
    />
    <View style={styles.vignetteTop} />
    <View style={styles.vignetteBottom} />
    <View style={styles.cornerDecoration} />
  </View>
);

const styles = StyleSheet.create({
  vignetteTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 50,
    backgroundColor: "rgba(0,0,0,0.06)",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: "hidden",
  },
  vignetteBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
    backgroundColor: "rgba(0,0,0,0.06)",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: "hidden",
  },
  cornerDecoration: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.12)",
    overflow: "hidden",
  },
});
