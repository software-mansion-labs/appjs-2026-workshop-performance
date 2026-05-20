import { createContext, useCallback, useContext, useMemo } from "react";
import { useSharedValue, type SharedValue } from "react-native-reanimated";

import type { DominantColorsResult } from "image-palette";

import type { Layout } from "./feed-layout-context";

export type Palette = DominantColorsResult;
export type { Swatch } from "image-palette";

interface BackdropDataContextValue {
  imageLayouts: SharedValue<Record<string, Layout>>;
  palettes: SharedValue<Record<string, Palette>>;

  registerPalette: (postId: string, palette: Palette) => void;
  unregisterPalette: (postId: string) => void;
  registerImageLayout: (postId: string, y: number, height: number) => void;
  unregisterImageLayout: (postId: string) => void;
}

const BackdropDataContext = createContext<BackdropDataContextValue | null>(null);

export const BackdropDataProvider = ({ children }: { children: React.ReactNode }) => {
  const imageLayouts = useSharedValue<Record<string, Layout>>({});
  const palettes = useSharedValue<Record<string, Palette>>({});

  const registerPalette = useCallback(
    (postId: string, palette: Palette) => {
      if (palettes.value[postId] === palette) return;
      palettes.modify(p => {
        "worklet";
        Object.assign(p, { [postId]: palette });
        return p;
      });
    },
    [palettes],
  );

  const unregisterPalette = useCallback(
    (postId: string) => {
      if (!(postId in palettes.value)) return;
      palettes.modify(p => {
        "worklet";
        delete p[postId];
        return p;
      });
    },
    [palettes],
  );

  const registerImageLayout = useCallback(
    (postId: string, y: number, height: number) => {
      const existing = imageLayouts.value[postId];
      if (existing && existing.y === y && existing.height === height) return;
      imageLayouts.modify(i => {
        "worklet";
        Object.assign(i, { [postId]: { y, height } });
        return i;
      });
    },
    [imageLayouts],
  );

  const unregisterImageLayout = useCallback(
    (postId: string) => {
      if (!(postId in imageLayouts.value)) return;
      imageLayouts.modify(i => {
        "worklet";
        delete i[postId];
        return i;
      });
    },
    [imageLayouts],
  );

  const value = useMemo<BackdropDataContextValue>(
    () => ({
      imageLayouts,
      palettes,
      registerPalette,
      unregisterPalette,
      registerImageLayout,
      unregisterImageLayout,
    }),
    [
      imageLayouts,
      palettes,
      registerPalette,
      unregisterPalette,
      registerImageLayout,
      unregisterImageLayout,
    ],
  );

  return <BackdropDataContext.Provider value={value}>{children}</BackdropDataContext.Provider>;
};

export const useBackdropData = () => {
  const ctx = useContext(BackdropDataContext);
  if (!ctx) throw new Error("useBackdropData must be used within BackdropDataProvider");
  return ctx;
};
