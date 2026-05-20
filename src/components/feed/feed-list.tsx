import { FlashList } from "@shopify/flash-list";
import { useCallback } from "react";
import {
  StyleSheet,
  View,
  type LayoutChangeEvent,
} from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

import { FeedItem } from "@/components/feed/feed-item";
import { SuggestedPostsSection } from "@/components/feed/suggestions/suggested-posts-section";
import { useFeedLayout } from "@/context/feed-layout-context";
import { FeedListItem } from "@/data/mock-feed";
import { useEngagementScrollSampler } from "@/hooks/use-engagement-scroll-sampler";
import { useFeedEngagementTracking } from "@/hooks/use-feed-engagement-tracking";

const AnimatedFlashList = Animated.createAnimatedComponent(FlashList<FeedListItem>);

const VIEWABILITY_CONFIG = {
  itemVisiblePercentThreshold: 50,
};

export const FeedList = ({
  data,
}: {
  data: FeedListItem[];
}) => {
  const { scrollY, setViewportHeight, flashListRef } = useFeedLayout();
  const progress = useSharedValue(0);

  const sampleEngagementScroll = useEngagementScrollSampler();
  const onViewableItemsChanged = useFeedEngagementTracking();

  const scrollHandler = useAnimatedScrollHandler(event => {
    scrollY.value = event.contentOffset.y;

    const max = Math.max(1, event.contentSize.height - event.layoutMeasurement.height);
    const p = event.contentOffset.y / max;
    progress.value = Math.min(1, Math.max(0, p));

    sampleEngagementScroll(event.contentOffset.y);
  });

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  const renderItem = useCallback(({ item, index }: { item: FeedListItem; index: number }) => (
    item.type === "suggestions" ? (
      <SuggestedPostsSection posts={item.posts} />
    ) : (
      <FeedItem item={item} index={index} />
    )
  ), []);

  const getItemType = useCallback(
    (item: FeedListItem) => item.type,
    [],
  );

  const onListLayout = useCallback(
    (e: LayoutChangeEvent) => {
      setViewportHeight(e.nativeEvent.layout.height);
    },
    [setViewportHeight],
  );

  return (
    <View style={styles.wrapper}>
      <View style={styles.progressTrack}>
        <Animated.View style={[styles.progressFill, progressStyle]} />
      </View>
      <AnimatedFlashList
        ref={flashListRef}
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        getItemType={getItemType}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        onScroll={scrollHandler}
        onLayout={onListLayout}
        viewabilityConfig={VIEWABILITY_CONFIG}
        onViewableItemsChanged={onViewableItemsChanged}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  content: {
    paddingBottom: 20,
  },
  progressTrack: {
    height: 3,
    backgroundColor: "rgba(0, 0, 0, 0.06)",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#FF3B30",
  },
});
