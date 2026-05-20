import { useCallback } from "react";
import { useSharedValue } from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

import Engagement from "engagement";

import { useFeedLayout } from "@/context/feed-layout-context";
import { findCenteredIndex } from "@/utils/feed-utils";

export const useEngagementScrollSampler = () => {
  const { viewportHeight, cardLayouts } = useFeedLayout();

  const lastSampleTs = useSharedValue(0);
  const lastSampleY = useSharedValue(0);

  const recordScrollSample = useCallback((postId: string, velocity: number) => {
    Engagement.recordScrollSample(postId, velocity);
  }, []);

  const sample = useCallback(
    (offsetY: number) => {
      "worklet";
      const ts = Date.now();
      if (lastSampleTs.value === 0) {
        lastSampleTs.value = ts;
        lastSampleY.value = offsetY;
        return;
      }
      if (ts - lastSampleTs.value < 100) return;

      const dt = ts - lastSampleTs.value;
      const dy = offsetY - lastSampleY.value;
      lastSampleTs.value = ts;
      lastSampleY.value = offsetY;
      if (dt <= 0) return;

      const velocity = (Math.abs(dy) / dt) * 1000;

      const vh = viewportHeight.value;
      if (vh <= 0) return;

      const cards = cardLayouts.value;
      const ids: string[] = [];
      for (const id in cards) ids.push(id);
      if (ids.length === 0) return;

      const viewCenter = offsetY + vh / 2;
      const centeredIdx = findCenteredIndex(ids, cards, viewCenter);
      if (centeredIdx < 0) return;

      scheduleOnRN(recordScrollSample, ids[centeredIdx], velocity);
    },
    [viewportHeight, cardLayouts, lastSampleTs, lastSampleY, recordScrollSample],
  );

  return sample;
};
