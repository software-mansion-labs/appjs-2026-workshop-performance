import { useState, useEffect } from "react";
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

  const [feedData, setFeedData] = useState<FeedPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFeedData(MOCK_FEED);
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleLike = (id: string) => {
    setFeedData(prev =>
      prev.map(post =>
        post.id === id
          ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
          : post
      )
    );
  };

  const handleBookmark = (id: string) => {
    setFeedData(prev =>
      prev.map(post => (post.id === id ? { ...post, isBookmarked: !post.isBookmarked } : post))
    );
  };

  return (
    <ColorsContext.Provider value={colors}>
      <View style={[styles.container, { backgroundColor: colors.cardBackground }]}>
        <FeedHeader />
        <FeedList data={feedData} isLoading={isLoading} onLike={handleLike} onBookmark={handleBookmark} />
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
