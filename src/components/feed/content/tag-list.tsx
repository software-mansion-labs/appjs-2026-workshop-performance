import { useContext, useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

import { ColorsContext } from "@/context/colors-context";
import { formatTags } from "@/utils/feed-utils";

export const TagList = ({
  tags,
}: {
  tags: string[];
}) => {
  const colors = useContext(ColorsContext);
  const router = useRouter();

  const formattedTags = useMemo(() => formatTags(tags), [tags]);

  if (formattedTags.length === 0) return null;

  const openHashtag = (tag: string) => {
    const cleanTag = tag.replace("#", "");
    router.push(`/hashtag/${encodeURIComponent(cleanTag)}`);
  };

  return (
    <View style={styles.container}>
      {formattedTags.map((tag, i) => (
        <TouchableOpacity key={`${tag}-${i}`} onPress={() => openHashtag(tag)}>
          <Text style={{ fontSize: 13, color: colors.tint }}>{tag}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 12,
    paddingTop: 4,
    gap: 4,
  },
});
