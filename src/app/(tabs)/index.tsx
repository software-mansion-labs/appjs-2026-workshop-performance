import { useMemo } from "react";
import { View, StyleSheet } from "react-native";

import { FeedHeader } from "@/components/feed/feed-header";
import { FeedList } from "@/components/feed/feed-list";
import { Colors } from "@/constants/theme";
import { ColorsContext } from "@/context/colors-context";
import { MOCK_FEED, toSlimFeed } from "@/data/mock-feed";
import { useColorScheme } from "@/hooks/use-color-scheme";

const feedData = toSlimFeed(MOCK_FEED);

const HomeScreen = () => {
  const colorScheme = useColorScheme();
  const colors = useMemo(() => Colors[colorScheme ?? "light"], [colorScheme]);

  return (
    <ColorsContext.Provider value={colors}>
      <View style={[styles.container, { backgroundColor: colors.cardBackground }]}>
        <FeedHeader />
        <FeedList data={feedData} />
      </View>
    </ColorsContext.Provider>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
