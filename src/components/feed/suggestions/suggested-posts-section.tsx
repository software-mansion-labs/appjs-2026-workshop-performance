import { useContext, useState, useEffect } from "react";
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import Reanimated, { FadeIn } from "react-native-reanimated";

import { ColorsContext } from "@/context/colors-context";
import { SuggestedPost } from "@/data/mock-feed";
import { SuggestedShimmerCard } from "@/components/feed/shimmer/suggested-shimmer-card";

import { SuggestedPostCard } from "./suggested-post-card";

const SHIMMER_COUNT = 4;

export const SuggestedPostsSection = ({ posts }: { posts: SuggestedPost[] }) => {
  const colors = useContext(ColorsContext);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const openSuggestions = () => {
    router.push("/suggestions");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Suggested for you</Text>
        <TouchableOpacity onPress={openSuggestions}>
          <Text style={[styles.seeAll, { color: colors.tint }]}>See All</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {isLoading
          ? Array.from({ length: SHIMMER_COUNT }).map((_, i) => <SuggestedShimmerCard key={i} />)
          : posts.map((post) => (
              <Reanimated.View key={post.id} entering={FadeIn.duration(400)}>
                <SuggestedPostCard post={post} />
              </Reanimated.View>
            ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
