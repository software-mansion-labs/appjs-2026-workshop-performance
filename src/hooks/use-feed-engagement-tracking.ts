import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useRef } from "react";
import type { ViewToken } from "react-native";

import Engagement from "engagement";

import type { FeedListItem } from "@/data/mock-feed";

export const useFeedEngagementTracking = () => {
  const viewableSetRef = useRef<Set<string>>(new Set());
  const focusedRef = useRef(false);

  const onViewableItemsChanged = useCallback(
    ({ changed }: { changed: ViewToken<FeedListItem>[] }) => {
      changed.forEach(token => {
        if (!token.item || token.item.type !== "post") return;
        const id = token.item.id;
        if (token.isViewable) {
          viewableSetRef.current.add(id);
          if (focusedRef.current) Engagement.startSession(id, "feed");
        } else {
          viewableSetRef.current.delete(id);
          if (focusedRef.current) Engagement.stopSession(id, "feed");
        }
      });
    },
    [],
  );

  useFocusEffect(
    useCallback(() => {
      focusedRef.current = true;
      viewableSetRef.current.forEach(id => Engagement.startSession(id, "feed"));
      return () => {
        focusedRef.current = false;
        viewableSetRef.current.forEach(id => Engagement.stopSession(id, "feed"));
      };
    }, []),
  );

  return onViewableItemsChanged;
};
