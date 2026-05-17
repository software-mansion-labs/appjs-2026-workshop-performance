import { useRef, useState } from "react";
import {
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  View,
} from "react-native";
import Reanimated, { FadeIn, LinearTransition } from "react-native-reanimated";

import { FeedItem } from "@/components/feed/feed-item";
import { SuggestedPostsSection } from "@/components/feed/suggestions/suggested-posts-section";
import { FeedListItem } from "@/data/mock-feed";

export const FeedList = ({
  data,
  onLike,
}: {
  data: FeedListItem[];
  onLike: (id: string) => void;
}) => {
  const contentHeight = useRef(0);
  const layoutHeight = useRef(0);
  const [progress, setProgress] = useState(0);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offset = e.nativeEvent.contentOffset.y;
    const max = Math.max(1, contentHeight.current - layoutHeight.current);
    const p = Math.min(1, Math.max(0, offset / max));
    setProgress(p);
  };

  const handleContentSizeChange = (_w: number, h: number) => {
    contentHeight.current = h;
  };

  const handleLayout = (e: LayoutChangeEvent) => {
    layoutHeight.current = e.nativeEvent.layout.height;
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>
      <Reanimated.FlatList
        data={data}
        itemLayoutAnimation={LinearTransition}
        renderItem={({ item }) => (
          <Reanimated.View entering={FadeIn.duration(400)}>
            {item.type === "suggestions" ? (
              <SuggestedPostsSection posts={item.posts} />
            ) : (
              <FeedItem item={item} onLike={onLike} />
            )}
          </Reanimated.View>
        )}
        keyExtractor={(_item, index) => String(index)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        windowSize={21}
        maxToRenderPerBatch={10}
        initialNumToRender={5}
        removeClippedSubviews={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onContentSizeChange={handleContentSizeChange}
        onLayout={handleLayout}
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
