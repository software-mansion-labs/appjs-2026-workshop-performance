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

/**
 * Subscribe to immersive flag changes from a worklet callback.
 *
 * Caller's `reaction` MUST start with `"worklet";` — Reanimated's babel plugin
 * doesn't auto-workletize callbacks passed through custom hooks.
 *
 * **Stale-closure caveat**: `useAnimatedReaction` captures `reaction` once when
 * this hook runs (effectively on the first render of the consumer). If the
 * caller passes a closure over component state/props, later updates won't be
 * visible inside the worklet — it'll keep using the snapshot from first call.
 *
 * Safe patterns:
 *   - Module-stable callbacks (don't close over component state)
 *   - Closures that read from refs / SharedValues (always read current via .value)
 *
 * Unsafe pattern:
 *   - `useReactToImmersive(curr => { "worklet"; doSomething(stateVar); })`
 *     where `stateVar` is a React state / prop that changes — `stateVar` will
 *     be frozen at first-call value.
 */
export const useReactToImmersive = (
  reaction: (current: boolean, previous: boolean | null) => void,
) => {
  const { immersive } = useImmersive();
  useAnimatedReaction(() => immersive.value, reaction);
};
