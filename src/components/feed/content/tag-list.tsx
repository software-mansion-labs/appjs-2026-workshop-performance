import { useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

import { ColorsContext } from "@/context/colors-context";

export const TagList = ({
  tags,
  onTagPress,
}: {
  tags: string[];
  onTagPress: (tag: string) => void;
}) => {
  const colors = useContext(ColorsContext);

  if (tags.length === 0) return null;

  return (
    <View style={styles.container}>
      {tags.map((tag, i) => (
        <TouchableOpacity key={`${tag}-${i}`} onPress={() => onTagPress(tag)}>
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
