import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

import Engagement from "engagement";

export const useDetailEngagementTracking = (postId: string) => {
  useFocusEffect(
    useCallback(() => {
      if (!postId) return;
      Engagement.startSession(postId, "detail");
      return () => {
        Engagement.stopSession(postId, "detail");
      };
    }, [postId]),
  );
};
