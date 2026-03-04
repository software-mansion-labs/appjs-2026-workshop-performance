import { useState, useContext } from 'react';
import {
  ScrollView,
  View,
  Image,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';

import { ColorsContext } from '@/context/colors-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export function ImageCarousel({ images }: { images: string[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const colors = useContext(ColorsContext);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offset = e.nativeEvent.contentOffset.x;
    const index = Math.round(offset / SCREEN_WIDTH);
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
        {images.map((uri, i) => (
          <Image
            key={`${uri}-${i}`}
            source={{ uri }}
            style={{ width: SCREEN_WIDTH, height: SCREEN_WIDTH }}
            resizeMode="cover"
          />
        ))}
      </ScrollView>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
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
              backgroundColor:
                i === activeIndex ? colors.tint : colors.icon + '40',
            }}
          />
        ))}
      </View>
    </View>
  );
}
