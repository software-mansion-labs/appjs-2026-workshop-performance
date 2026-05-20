import { useMemo } from "react";
import { View, StyleSheet } from "react-native";

import { FeedHeader } from "@/components/feed/feed-header";
import { FeedList } from "@/components/feed/feed-list";
import { ImmersiveBackdrop } from "@/components/feed/immersive-backdrop";
import { Colors } from "@/constants/theme";
import { BackdropDataProvider } from "@/context/backdrop-data-context";
import { ColorsContext } from "@/context/colors-context";
import { FeedLayoutProvider } from "@/context/feed-layout-context";
import { MOCK_FEED, toSlimFeed } from "@/data/mock-feed";
import { useColorScheme } from "@/hooks/use-color-scheme";

const feedData = toSlimFeed(MOCK_FEED);

const HomeScreen = () => {
  const colorScheme = useColorScheme();
  const colors = useMemo(() => Colors[colorScheme ?? "light"], [colorScheme]);

  return (
    <ColorsContext.Provider value={colors}>
      <FeedLayoutProvider>
        <BackdropDataProvider>
          <View style={styles.container}>
            <FeedHeader />
            <View style={styles.feedArea}>
              <ImmersiveBackdrop />
              <FeedList data={feedData} />
            </View>
          </View>
        </BackdropDataProvider>
      </FeedLayoutProvider>
    </ColorsContext.Provider>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  feedArea: {
    flex: 1,
  },
});
