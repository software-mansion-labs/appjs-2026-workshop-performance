import { useState, useContext } from "react";
import { ScrollView, View, Image, NativeSyntheticEvent, NativeScrollEvent, StyleSheet } from "react-native";

import { ColorsContext } from "@/context/colors-context";
import { FeedImage } from "@/data/mock-feed";

const IMAGE_WIDTH = 400;

export const ImageCarousel = ({ images }: { images: FeedImage[] }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const colors = useContext(ColorsContext);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offset = e.nativeEvent.contentOffset.x;
    const index = Math.round(offset / IMAGE_WIDTH);
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  return (
    <View style={shadowStyles.carouselShadow}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {images.map((image, i) => (
          <View key={`${image.uri}-${i}`} style={styles.imageClip}>
            <Image
              source={{ uri: image.uri }}
              style={{ width: IMAGE_WIDTH, aspectRatio: image.aspectRatio }}
            />
            <View style={[styles.vignetteTop, shadowStyles.vignetteOverlay]} />
            <View style={[styles.vignetteBottom, shadowStyles.vignetteOverlay]} />
            <View style={[styles.cornerDecoration, shadowStyles.cornerDecorationShadow]} />
          </View>
        ))}
      </ScrollView>

      {images.length > 1 && (
        <View style={styles.dotsContainer}>
          {images.map((_, i) => (
            <View
              key={`dot-${i}`}
              style={i === activeIndex ? shadowStyles.activeDotShadow : shadowStyles.inactiveDotShadow}
            >
              <View
                style={[
                  styles.dot,
                  i === activeIndex
                    ? [styles.dotActive, { backgroundColor: colors.tint }]
                    : { backgroundColor: colors.icon + "40" },
                ]}
              />
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  imageClip: {
    overflow: "hidden",
  },
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
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  dotActive: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

const shadowStyles = StyleSheet.create({
  carouselShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  vignetteOverlay: {
    // intentionally empty — the overlay effect is in base styles; shadow group kept for easy removal
  },
  cornerDecorationShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  activeDotShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
  inactiveDotShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
});
