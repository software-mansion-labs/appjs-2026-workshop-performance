import { createContext, useCallback, useContext, useMemo, useRef, type RefObject } from "react";
import { useSharedValue, type SharedValue } from "react-native-reanimated";

import type { FlashListRef } from "@shopify/flash-list";

import type { FeedListItem } from "@/data/mock-feed";

export interface Layout {
  y: number;
  height: number;
}

interface FeedLayoutContextValue {
  scrollY: SharedValue<number>;
  viewportHeight: SharedValue<number>;
  cardLayouts: SharedValue<Record<string, Layout>>;
  flashListRef: RefObject<FlashListRef<FeedListItem> | null>;

  setViewportHeight: (h: number) => void;
  registerCardLayout: (postId: string, y: number, height: number) => void;
  unregisterCardLayout: (postId: string) => void;
}

const FeedLayoutContext = createContext<FeedLayoutContextValue | null>(null);

export const FeedLayoutProvider = ({ children }: { children: React.ReactNode }) => {
  const scrollY = useSharedValue(0);
  const viewportHeight = useSharedValue(0);
  const cardLayouts = useSharedValue<Record<string, Layout>>({});
  const flashListRef = useRef<FlashListRef<FeedListItem> | null>(null);

  const setViewportHeight = useCallback(
    (h: number) => {
      if (viewportHeight.value !== h) {
        viewportHeight.value = h;
      }
    },
    [viewportHeight],
  );

  const registerCardLayout = useCallback(
    (postId: string, y: number, height: number) => {
      const existing = cardLayouts.value[postId];
      if (existing && existing.y === y && existing.height === height) return;
      cardLayouts.modify(c => {
        "worklet";
        Object.assign(c, { [postId]: { y, height } });
        return c;
      });
    },
    [cardLayouts],
  );

  const unregisterCardLayout = useCallback(
    (postId: string) => {
      if (!(postId in cardLayouts.value)) return;
      cardLayouts.modify(c => {
        "worklet";
        delete c[postId];
        return c;
      });
    },
    [cardLayouts],
  );

  const value = useMemo<FeedLayoutContextValue>(
    () => ({
      scrollY,
      viewportHeight,
      cardLayouts,
      flashListRef,
      setViewportHeight,
      registerCardLayout,
      unregisterCardLayout,
    }),
    [
      scrollY,
      viewportHeight,
      cardLayouts,
      setViewportHeight,
      registerCardLayout,
      unregisterCardLayout,
    ],
  );

  return <FeedLayoutContext.Provider value={value}>{children}</FeedLayoutContext.Provider>;
};

export const useFeedLayout = () => {
  const ctx = useContext(FeedLayoutContext);
  if (!ctx) throw new Error("useFeedLayout must be used within FeedLayoutProvider");
  return ctx;
};
