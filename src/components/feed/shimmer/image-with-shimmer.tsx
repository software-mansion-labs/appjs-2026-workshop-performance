import { useState } from "react";
import { Image, ImageProps, View } from "react-native";

import { ImageShimmer } from "./image-shimmer";

export const ImageWithShimmer = ({ style, ...imageProps }: ImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <View style={[style, { overflow: "hidden" }]}>
      <Image {...imageProps} style={style} onLoad={() => setIsLoaded(true)} />
      {!isLoaded && <ImageShimmer />}
    </View>
  );
};
