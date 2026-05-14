import { useState } from "react";
import { View, StyleSheet } from "react-native";

import { FeedHeader } from "@/components/feed/feed-header";
import { FeedList } from "@/components/feed/feed-list";
import { Colors } from "@/constants/theme";
import { ColorsContext } from "@/context/colors-context";
import { MOCK_FEED, FeedPost } from "@/data/mock-feed";
import { useColorScheme } from "@/hooks/use-color-scheme";

const HomeScreen = () => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const [feedData, setFeedData] = useState<FeedPost[]>(MOCK_FEED);



  const handleLike = (id: string) => {
    setFeedData(prev =>
      prev.map(post =>
        post.id === id
          ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
          : post
      )
    );
  };


  return (
    <ColorsContext.Provider value={colors}>
      <View style={[styles.container, { backgroundColor: colors.cardBackground }]}>
        <FeedHeader />
        <FeedList data={feedData} onLike={handleLike} />
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
