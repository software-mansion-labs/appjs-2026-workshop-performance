import { useEffect } from "react";

import { useFeedLayout } from "@/context/feed-layout-context";

export const useCardLayoutTracking = (postId: string, index: number) => {
  const { flashListRef, registerCardLayout, unregisterCardLayout } = useFeedLayout();

  useEffect(() => {
    const layout = flashListRef.current?.getLayout(index);
    if (layout) {
      registerCardLayout(postId, layout.y, layout.height);
    }
    return () => unregisterCardLayout(postId);
  }, [postId, index, flashListRef, registerCardLayout, unregisterCardLayout]);
};
