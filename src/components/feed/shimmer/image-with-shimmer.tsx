import { useState } from "react";
import { View } from "react-native";
import { Image, ImageProps } from "expo-image";

import { ImageShimmer } from "./image-shimmer";

export const ImageWithShimmer = ({ style, ...imageProps }: ImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <View style={[style, { overflow: "hidden" }]}>
      <Image {...imageProps} style={style} contentFit="cover" onLoad={() => setIsLoaded(true)} />
      {!isLoaded && <ImageShimmer />}
    </View>
  );
};
