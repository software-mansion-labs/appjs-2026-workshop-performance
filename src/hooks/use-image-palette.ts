import { useCallback, useEffect, useRef } from "react";
import { Image } from "expo-image";
import { scheduleOnRN } from "react-native-worklets";

import ImagePalette from "image-palette";

import { useActivePost, type Palette } from "@/context/active-post-context";
import { useReactToImmersive } from "@/context/immersive-context";

const fetchPaletteFromNative = async (uri: string): Promise<Palette | null> => {
  await Image.prefetch(uri);
  const cachePath = await Image.getCachePathAsync(uri);
  if (!cachePath) {
    if (__DEV__) console.warn("[ImagePalette] no cache path for", uri);
    return null;
  }
  const result = await ImagePalette.getDominantColors(cachePath);
  return result as Palette;
};

export const useImagePalette = (postId: string, uri: string | undefined) => {
  const { registerPalette, unregisterPalette } = useActivePost();
  const doneRef = useRef(false);

  const fetchOnce = useCallback(async () => {
    if (doneRef.current || !uri) return;
    doneRef.current = true;
    try {
      const palette = await fetchPaletteFromNative(uri);
      if (palette) registerPalette(postId, palette);
    } catch (err) {
      doneRef.current = false;
      if (__DEV__) console.warn("[useImagePalette] failed for", postId, err);
    }
  }, [postId, uri, registerPalette]);

  useReactToImmersive(curr => {
    "worklet";
    if (curr) {
      scheduleOnRN(fetchOnce);
    }
  });

  useEffect(() => {
    return () => {
      unregisterPalette(postId);
      doneRef.current = false;
    };
  }, [postId, unregisterPalette]);
};
