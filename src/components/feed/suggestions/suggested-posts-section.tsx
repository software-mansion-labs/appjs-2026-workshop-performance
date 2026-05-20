import { FlashList } from "@shopify/flash-list";
import { useCallback, useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

import { AnimatedFrostedLayer, AnimatedTranslucentCardBg } from "@/components/feed/feed-immersive-layers";
import { ColorsContext } from "@/context/colors-context";
import { SuggestedPost } from "@/data/mock-feed";

import { SuggestedPostCard } from "./suggested-post-card";

const CARD_HEIGHT = 280;

export const SuggestedPostsSection = ({ posts }: { posts: SuggestedPost[] }) => {
  const colors = useContext(ColorsContext);
  const router = useRouter();

  const openSuggestions = () => {
    router.push("/suggestions");
  };

  const renderItem = useCallback(({ item }: { item: SuggestedPost }) => (
    <SuggestedPostCard post={item} />
  ), []);

  return (
    <View style={styles.container}>
      <AnimatedTranslucentCardBg color={colors.cardBackground} />
      <AnimatedFrostedLayer />
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Suggested for you</Text>
        <TouchableOpacity onPress={openSuggestions}>
          <Text style={[styles.seeAll, { color: colors.tint }]}>See All</Text>
        </TouchableOpacity>
      </View>
      <View style={{ height: CARD_HEIGHT }}>
        <FlashList
          data={posts}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        />
      </View>
    </View>
  );
};

const CARD_BORDER_RADIUS = 20;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 12,
    marginBottom: 36,
    borderRadius: CARD_BORDER_RADIUS,
    overflow: "hidden",
    isolation: "isolate",
    paddingVertical: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
  },
  seeAll: {
    fontSize: 14,
    fontWeight: "600",
  },
  scrollContent: {
    paddingHorizontal: 12,
  },
});
