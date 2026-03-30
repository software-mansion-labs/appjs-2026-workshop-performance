import { StyleSheet } from "react-native";
import Reanimated, { FadeIn, LinearTransition } from "react-native-reanimated";

import { FeedItem } from "@/components/feed/feed-item";
import { ShimmerList } from "@/components/feed/shimmer/shimmer-list";
import { FeedPost } from "@/data/mock-feed";

export const FeedList = ({
  data,
  isLoading,
  onLike,
  onBookmark,
}: {
  data: FeedPost[];
  isLoading: boolean;
  onLike: (id: string) => void;
  onBookmark: (id: string) => void;
}) => (
  <Reanimated.FlatList
    data={data}
    itemLayoutAnimation={LinearTransition}
    renderItem={({ item }) => (
      <Reanimated.View entering={FadeIn.duration(400)}>
        <FeedItem item={item} onLike={onLike} onBookmark={onBookmark} />
      </Reanimated.View>
    )}
    keyExtractor={item => item.id}
    showsVerticalScrollIndicator={false}
    contentContainerStyle={styles.content}
    windowSize={21}
    maxToRenderPerBatch={10}
    initialNumToRender={5}
    removeClippedSubviews={false}
    ListEmptyComponent={isLoading ? <ShimmerList /> : null}
  />
);

const styles = StyleSheet.create({
  content: {
    paddingBottom: 20,
  },
});
