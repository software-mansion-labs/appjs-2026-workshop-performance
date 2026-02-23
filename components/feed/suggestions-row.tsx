import { FlatList, Text, TouchableOpacity, View } from "react-native";

import { SuggestedCard } from "@/components/feed/suggested-card";
import { Colors } from "@/constants/theme";
import type { SuggestedUser } from "@/data/mock-feed";

export function SuggestionsRow({
  suggestions,
  colors,
}: {
  suggestions: SuggestedUser[];
  colors: typeof Colors.light;
}) {
  return (
    <View style={{ paddingVertical: 12 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 12,
          marginBottom: 10,
        }}
      >
        <Text style={{ fontWeight: "600", fontSize: 14, color: colors.text }}>
          Suggested for you
        </Text>
        <TouchableOpacity>
          <Text style={{ color: "#0095f6", fontWeight: "600", fontSize: 14 }}>
            See All
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        horizontal
        data={suggestions}
        renderItem={({ item }: { item: SuggestedUser }) => (
          <SuggestedCard user={item} colors={colors} />
        )}
        keyExtractor={(item: SuggestedUser, index: number) =>
          `${item.username}-${index}`
        }
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 12, gap: 8 }}
      />
    </View>
  );
}
