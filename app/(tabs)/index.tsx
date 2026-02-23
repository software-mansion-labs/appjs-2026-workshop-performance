import { FlatList, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { FeedHeader } from "@/components/feed/feed-header";
import { PostCard } from "@/components/feed/post-card";
import { SuggestionsRow } from "@/components/feed/suggestions-row";
import { Colors } from "@/constants/theme";
import { FEED_DATA, type FeedItem } from "@/data/mock-feed";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <FeedHeader colors={colors} topInset={insets.top} />

      <FlatList
        data={FEED_DATA}
        renderItem={({ item }: { item: FeedItem }) => {
          if (item.type === "suggestions") {
            return <SuggestionsRow suggestions={item.data} colors={colors} />;
          }
          return <PostCard item={item.data} colors={colors} />;
        }}
        keyExtractor={(_: FeedItem, index: number) => index.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}
