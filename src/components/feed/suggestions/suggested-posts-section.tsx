import { useContext } from "react";
import { ScrollView, View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

import { ColorsContext } from "@/context/colors-context";
import { SuggestedPost } from "@/data/mock-feed";

import { SuggestedPostCard } from "./suggested-post-card";

export const SuggestedPostsSection = ({ posts }: { posts: SuggestedPost[] }) => {
  const colors = useContext(ColorsContext);
  const router = useRouter();

  const openSuggestions = () => {
    router.push("/suggestions");
  };

  return (
    <View style={{ paddingVertical: 12 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 12,
          marginBottom: 8,
        }}
      >
        <Text style={{ fontSize: 14, fontWeight: "600", color: colors.text }}>Suggested for you</Text>
        <TouchableOpacity onPress={openSuggestions}>
          <Text style={{ fontSize: 14, fontWeight: "600", color: colors.tint }}>See All</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 12 }}>
        {posts.map((post) => (
          <SuggestedPostCard key={post.id} post={post} />
        ))}
      </ScrollView>
    </View>
  );
};
