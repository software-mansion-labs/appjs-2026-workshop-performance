import { useCallback, useEffect, useRef } from "react";
import { Image } from "expo-image";
import { scheduleOnRN } from "react-native-worklets";

import ImagePalette from "image-palette";

import { useBackdropData, type Palette } from "@/context/backdrop-data-context";
import { useImmersive, useReactToImmersive } from "@/context/immersive-context";

const fetchPaletteFromNative = async (uri: string): Promise<Palette | null> => {
  await Image.prefetch(uri);
  const cachePath = await Image.getCachePathAsync(uri);
  if (!cachePath) return null;
  return ImagePalette.getDominantColors(cachePath);
};

export const useImagePalette = (postId: string, uri: string | undefined) => {
  const { registerPalette, unregisterPalette } = useBackdropData();
  const { immersive } = useImmersive();
  const lastKeyRef = useRef<string | null>(null);

  const fetchOnce = useCallback(async () => {
    if (!uri) return;
    const key = `${postId}::${uri}`;
    if (lastKeyRef.current === key) return;
    lastKeyRef.current = key;
    try {
      const palette = await fetchPaletteFromNative(uri);
      if (lastKeyRef.current !== key) return;
      if (palette) registerPalette(postId, palette);
    } catch {
      if (lastKeyRef.current === key) lastKeyRef.current = null;
    }
  }, [postId, uri, registerPalette]);

  useReactToImmersive(curr => {
    "worklet";
    if (curr) scheduleOnRN(fetchOnce);
  }, [fetchOnce]);

  useEffect(() => {
    if (immersive.get()) void fetchOnce();
  }, [fetchOnce, immersive]);

  useEffect(() => {
    return () => unregisterPalette(postId);
  }, [postId, unregisterPalette]);
};
