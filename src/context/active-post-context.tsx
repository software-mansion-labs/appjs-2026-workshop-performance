import { createContext, useCallback, useContext, useMemo } from "react";
import { useSharedValue, type SharedValue } from "react-native-reanimated";

export interface Swatch {
  row: number;
  col: number;
  r: number;
  g: number;
  b: number;
  population: number;
}

export interface Palette {
  gridWidth: number;
  gridHeight: number;
  swatches: Swatch[];
}

export const FALLBACK_GRID_WIDTH = 3;
export const FALLBACK_GRID_HEIGHT = 3;

const buildFallbackPalette = (): Palette => {
  const swatches: Swatch[] = [];
  for (let row = 0; row < FALLBACK_GRID_HEIGHT; row++) {
    for (let col = 0; col < FALLBACK_GRID_WIDTH; col++) {
      swatches.push({ row, col, r: 90, g: 95, b: 110, population: 1 });
    }
  }
  return { gridWidth: FALLBACK_GRID_WIDTH, gridHeight: FALLBACK_GRID_HEIGHT, swatches };
};

export const FALLBACK_PALETTE: Palette = buildFallbackPalette();

interface Layout {
  y: number;
  height: number;
}

interface ActivePostContextValue {
  scrollY: SharedValue<number>;
  viewportHeight: SharedValue<number>;
  cardLayouts: SharedValue<Record<string, Layout>>;
  imageLayouts: SharedValue<Record<string, Layout>>;
  palettes: SharedValue<Record<string, Palette>>;

  setViewportHeight: (h: number) => void;
  registerPalette: (postId: string, palette: Palette) => void;
  unregisterPalette: (postId: string) => void;
  reportCardLayout: (postId: string, y: number, height: number) => void;
  unregisterCardLayout: (postId: string) => void;
  reportImageLayout: (postId: string, y: number, height: number) => void;
}

const ActivePostContext = createContext<ActivePostContextValue | null>(null);

export const ActivePostProvider = ({ children }: { children: React.ReactNode }) => {
  const scrollY = useSharedValue(0);
  const viewportHeight = useSharedValue(0);
  const cardLayouts = useSharedValue<Record<string, Layout>>({});
  const imageLayouts = useSharedValue<Record<string, Layout>>({});
  const palettes = useSharedValue<Record<string, Palette>>({});

  const setViewportHeight = useCallback(
    (h: number) => {
      if (viewportHeight.value !== h) {
        viewportHeight.value = h;
      }
    },
    [viewportHeight],
  );

  const registerPalette = useCallback(
    (postId: string, palette: Palette) => {
      if (palettes.value[postId] === palette) return;
      palettes.modify(p => {
        "worklet";
        (p as Record<string, Palette>)[postId] = palette;
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
        delete (p as Record<string, Palette>)[postId];
        return p;
      });
    },
    [palettes],
  );

  const reportCardLayout = useCallback(
    (postId: string, y: number, height: number) => {
      const existing = cardLayouts.value[postId];
      if (existing && existing.y === y && existing.height === height) return;
      cardLayouts.modify(c => {
        "worklet";
        (c as Record<string, Layout>)[postId] = { y, height };
        return c;
      });
    },
    [cardLayouts],
  );

  const unregisterCardLayout = useCallback(
    (postId: string) => {
      if (postId in cardLayouts.value) {
        cardLayouts.modify(c => {
          "worklet";
          delete (c as Record<string, Layout>)[postId];
          return c;
        });
      }
      if (postId in imageLayouts.value) {
        imageLayouts.modify(i => {
          "worklet";
          delete (i as Record<string, Layout>)[postId];
          return i;
        });
      }
    },
    [cardLayouts, imageLayouts],
  );

  const reportImageLayout = useCallback(
    (postId: string, y: number, height: number) => {
      const existing = imageLayouts.value[postId];
      if (existing && existing.y === y && existing.height === height) return;
      imageLayouts.modify(i => {
        "worklet";
        (i as Record<string, Layout>)[postId] = { y, height };
        return i;
      });
    },
    [imageLayouts],
  );

  const value = useMemo<ActivePostContextValue>(
    () => ({
      scrollY,
      viewportHeight,
      cardLayouts,
      imageLayouts,
      palettes,
      setViewportHeight,
      registerPalette,
      unregisterPalette,
      reportCardLayout,
      unregisterCardLayout,
      reportImageLayout,
    }),
    [
      scrollY,
      viewportHeight,
      cardLayouts,
      imageLayouts,
      palettes,
      setViewportHeight,
      registerPalette,
      unregisterPalette,
      reportCardLayout,
      unregisterCardLayout,
      reportImageLayout,
    ],
  );

  return <ActivePostContext.Provider value={value}>{children}</ActivePostContext.Provider>;
};

export const useActivePost = () => {
  const ctx = useContext(ActivePostContext);
  if (!ctx) throw new Error("useActivePost must be used within ActivePostProvider");
  return ctx;
};
