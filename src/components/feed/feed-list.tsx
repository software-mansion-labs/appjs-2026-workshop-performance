import { FlashList } from "@shopify/flash-list";
import { useCallback } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

import { FeedItem } from "@/components/feed/feed-item";
import { SuggestedPostsSection } from "@/components/feed/suggestions/suggested-posts-section";
import { FeedListItem } from "@/data/mock-feed";

const AnimatedFlashList = Animated.createAnimatedComponent(FlashList<FeedListItem>);

export const FeedList = ({
  data,
}: {
  data: FeedListItem[];
}) => {
  const progress = useSharedValue(0);

  const renderItem = useCallback(({ item }: { item: FeedListItem }) => (
    item.type === "suggestions" ? (
      <SuggestedPostsSection posts={item.posts} />
    ) : (
      <FeedItem item={item} />
    )
  ), []);

  const getItemType = useCallback(
    (item: FeedListItem) => item.type,
    [],
  );

  const scrollHandler = useAnimatedScrollHandler(e => {
    const max = Math.max(1, e.contentSize.height - e.layoutMeasurement.height);
    const p = e.contentOffset.y / max;
    progress.value = Math.min(1, Math.max(0, p));
  });

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  return (
    <View style={styles.wrapper}>
      <View style={styles.progressTrack}>
        <Animated.View style={[styles.progressFill, progressStyle]} />
      </View>
      <AnimatedFlashList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        getItemType={getItemType}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        onScroll={scrollHandler}
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
