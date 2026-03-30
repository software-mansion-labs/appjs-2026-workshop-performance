import { useState, useContext } from "react";
import { ScrollView, View, Image, NativeSyntheticEvent, NativeScrollEvent } from "react-native";

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
    <View>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {images.map((image, i) => (
          <Image
            key={`${image.uri}-${i}`}
            source={{ uri: image.uri }}
            style={{ width: IMAGE_WIDTH, aspectRatio: image.aspectRatio }}
          />
        ))}
      </ScrollView>
      {images.length > 1 && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            paddingVertical: 8,
            gap: 4,
          }}
        >
          {images.map((_, i) => (
            <View
              key={`dot-${i}`}
              style={{
                width: i === activeIndex ? 8 : 6,
                height: i === activeIndex ? 8 : 6,
                borderRadius: i === activeIndex ? 4 : 3,
                backgroundColor: i === activeIndex ? colors.tint : colors.icon + "40",
              }}
            />
          ))}
        </View>
      )}
    </View>
  );
};
