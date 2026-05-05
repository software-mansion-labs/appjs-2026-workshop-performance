import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useRef } from "react";
import {
  FlatList,
  StyleSheet,
  View,
  type FlatListProps,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
  type ViewToken,
} from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  type AnimatedProps,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

import { FeedItem } from "@/components/feed/feed-item";
import { useActivePost } from "@/context/active-post-context";
import { FeedPost } from "@/data/mock-feed";
import { findCenteredIndex } from "@/utils/feed-utils";

import Engagement from "engagement";

interface CellProps {
  cellKey: string;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onLayout?: (e: LayoutChangeEvent) => void;
}

// FlatList wraps each renderItem result in a CellRendererComponent. Default
// is a plain View positioned at the cell's absolute Y in scrollable content.
// Overriding it lets us read absolute Y directly via onLayout — no cumulative
// height computation, no iteration over the entire dataset in the worklet.
//
// useEffect cleanup evicts the entry on unmount so the layout map only ever
// contains currently-mounted items.
const FeedCell = ({ cellKey, children, style, onLayout, ...rest }: CellProps) => {
  const { reportCardLayout, unregisterCardLayout } = useActivePost();

  useEffect(() => {
    return () => unregisterCardLayout(cellKey);
  }, [cellKey, unregisterCardLayout]);

  return (
    <View
      style={style}
      {...rest}
      onLayout={(e: LayoutChangeEvent) => {
        // Forward to FlatList's internal layout tracker (virtualization needs it).
        onLayout?.(e);
        const { y, height } = e.nativeEvent.layout;
        reportCardLayout(cellKey, y, height);
      }}
    >
      {children}
    </View>
  );
};

const RawAnimatedFlatList = Animated.createAnimatedComponent(FlatList);
function AnimatedFlatList<T>(props: AnimatedProps<FlatListProps<T>>) {
  return <RawAnimatedFlatList {...(props as React.ComponentProps<typeof RawAnimatedFlatList>)} />;
}

export const FeedList = ({
  data,
  onLike,
}: {
  data: FeedPost[];
  onLike: (id: string) => void;
}) => {
  const { scrollY, viewportHeight, cardLayouts, setViewportHeight } = useActivePost();

  const lastSampleTs = useSharedValue(0);
  const lastSampleY = useSharedValue(0);

  const recordScrollSample = useCallback((postId: string, velocity: number) => {
    Engagement.recordScrollSample(postId, velocity);
  }, []);

  const scrollHandler = useAnimatedScrollHandler(event => {
    scrollY.value = event.contentOffset.y;

    // Throttle velocity sampling to ~10 Hz so we only bridge to JS every 100ms.
    const ts = Date.now();
    if (lastSampleTs.value === 0) {
      lastSampleTs.value = ts;
      lastSampleY.value = event.contentOffset.y;
      return;
    }
    if (ts - lastSampleTs.value < 100) return;

    const dt = ts - lastSampleTs.value;
    const dy = event.contentOffset.y - lastSampleY.value;
    lastSampleTs.value = ts;
    lastSampleY.value = event.contentOffset.y;
    if (dt <= 0) return;

    const velocity = Math.abs(dy) / dt * 1000;

    const vh = viewportHeight.value;
    if (vh <= 0) return;

    const cards = cardLayouts.value;
    const ids: string[] = [];
    for (const id in cards) ids.push(id);
    if (ids.length === 0) return;

    const viewCenter = event.contentOffset.y + vh / 2;
    const centeredIdx = findCenteredIndex(ids, cards, viewCenter);
    if (centeredIdx < 0) return;

    scheduleOnRN(recordScrollSample, ids[centeredIdx], velocity);
  });

  const onListLayout = useCallback(
    (e: LayoutChangeEvent) => {
      setViewportHeight(e.nativeEvent.layout.height);
    },
    [setViewportHeight],
  );

  const viewabilityConfigRef = useRef({
    itemVisiblePercentThreshold: 50,
  });

  const viewableSetRef = useRef<Set<string>>(new Set());
  const focusedRef = useRef(false);

  const onViewableItemsChanged = useCallback(({ changed }: { changed: ViewToken<FeedPost>[] }) => {
    changed.forEach(token => {
      const id = token.key;
      if (!id) return;
      if (token.isViewable) {
        viewableSetRef.current.add(id);
        if (focusedRef.current) Engagement.startSession(id, "feed");
      } else {
        viewableSetRef.current.delete(id);
        if (focusedRef.current) Engagement.stopSession(id, "feed");
      }
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      focusedRef.current = true;
      const count = viewableSetRef.current.size;
      console.log(`[Engagement][JS] feed focused — restarting ${count} session(s)`);
      viewableSetRef.current.forEach(id => Engagement.startSession(id, "feed"));
      return () => {
        focusedRef.current = false;
        const blurCount = viewableSetRef.current.size;
        console.log(`[Engagement][JS] feed blurred — stopping ${blurCount} session(s)`);
        viewableSetRef.current.forEach(id => Engagement.stopSession(id, "feed"));
      };
    }, []),
  );

  return (
    <AnimatedFlatList
      data={data}
      CellRendererComponent={FeedCell}
      renderItem={({ item }) => <FeedItem item={item} onLike={onLike} />}
      keyExtractor={item => item.id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.content}
      windowSize={21}
      maxToRenderPerBatch={10}
      initialNumToRender={5}
      removeClippedSubviews={false}
      onScroll={scrollHandler}
      scrollEventThrottle={16}
      onLayout={onListLayout}
      viewabilityConfig={viewabilityConfigRef.current}
      onViewableItemsChanged={onViewableItemsChanged}
    />
  );
};

const styles = StyleSheet.create({
  content: {
    paddingBottom: 20,
  },
});
