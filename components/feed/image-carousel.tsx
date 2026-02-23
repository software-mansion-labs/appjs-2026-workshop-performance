import { useState } from "react";
import {
  Dimensions,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  View,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export function ImageCarousel({
  images,
  aspectRatio,
}: {
  images: string[];
  aspectRatio: number;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const imageHeight = SCREEN_WIDTH / aspectRatio;

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setActiveIndex(index);
  };

  return (
    <View>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {images.map((uri, index) => (
          <Image
            key={index}
            source={{ uri }}
            style={{ width: SCREEN_WIDTH, height: imageHeight }}
            resizeMode="cover"
          />
        ))}
      </ScrollView>
      {images.length > 1 && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 4,
            paddingTop: 8,
          }}
        >
          {images.map((_, index) => (
            <View
              key={index}
              style={{
                width: index === activeIndex ? 7 : 6,
                height: index === activeIndex ? 7 : 6,
                borderRadius: 4,
                backgroundColor:
                  index === activeIndex ? "#0095f6" : "#0095f6" + "40",
              }}
            />
          ))}
        </View>
      )}
    </View>
  );
}
