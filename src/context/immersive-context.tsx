import { createContext, useCallback, useContext, useMemo } from "react";
import {
  useAnimatedReaction,
  useSharedValue,
  withTiming,
  type SharedValue,
} from "react-native-reanimated";

import {
  TRANSITION_EASING,
  TRANSITION_MS,
} from "@/components/feed/immersive-animation";

interface ImmersiveContextValue {
  immersive: SharedValue<boolean>;
  progress: SharedValue<number>;
  toggle: () => void;
}

const ImmersiveContext = createContext<ImmersiveContextValue | null>(null);

export const ImmersiveProvider = ({ children }: { children: React.ReactNode }) => {
  const immersive = useSharedValue(false);
  const progress = useSharedValue(0);

  useAnimatedReaction(
    () => immersive.value,
    curr => {
      progress.value = withTiming(curr ? 1 : 0, {
        duration: TRANSITION_MS,
        easing: TRANSITION_EASING,
      });
    },
  );

  const toggle = useCallback(() => {
    immersive.value = !immersive.value;
  }, [immersive]);

  const value = useMemo(
    () => ({ immersive, progress, toggle }),
    [immersive, progress, toggle],
  );

  return <ImmersiveContext.Provider value={value}>{children}</ImmersiveContext.Provider>;
};

export const useImmersive = () => {
  const ctx = useContext(ImmersiveContext);
  if (!ctx) throw new Error("useImmersive must be used within ImmersiveProvider");
  return ctx;
};

export const useReactToImmersive = (
  reaction: (current: boolean, previous: boolean | null) => void,
  deps: unknown[] = [],
) => {
  const { immersive } = useImmersive();
  useAnimatedReaction(() => immersive.value, reaction, deps);
};
