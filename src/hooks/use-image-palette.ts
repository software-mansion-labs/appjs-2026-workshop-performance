import { useEffect } from "react";
import { scheduleOnRN } from "react-native-worklets";

import { useBackdropData } from "@/context/backdrop-data-context";
import { useImmersive, useReactToImmersive } from "@/context/immersive-context";
import { MOCK_PALETTES } from "@/data/mock-palettes";

export const useImagePalette = (postId: string) => {
  const { registerPalette, unregisterPalette } = useBackdropData();
  const { immersive } = useImmersive();

  useReactToImmersive(curr => {
    "worklet";
    if (!curr) return;
    const palette = MOCK_PALETTES[postId];
    if (palette) scheduleOnRN(registerPalette, postId, palette);
  }, [postId, registerPalette]);

  useEffect(() => {
    if (!immersive.get()) return;
    const palette = MOCK_PALETTES[postId];
    if (palette) registerPalette(postId, palette);
  }, [postId, registerPalette, immersive]);

  useEffect(() => {
    return () => unregisterPalette(postId);
  }, [postId, unregisterPalette]);
};
