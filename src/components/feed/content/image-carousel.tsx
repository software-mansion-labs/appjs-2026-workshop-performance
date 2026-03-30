import { useState, useContext } from "react";
import { ScrollView, View, NativeSyntheticEvent, NativeScrollEvent, StyleSheet } from "react-native";

import { ColorsContext } from "@/context/colors-context";
import { FeedImage } from "@/data/mock-feed";
import { CarouselImage } from "./carousel-image";

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
          <CarouselImage key={`${image.uri}-${i}`} image={image} />
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
