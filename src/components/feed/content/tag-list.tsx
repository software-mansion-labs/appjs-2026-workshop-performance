import { useContext } from "react";
import { View, Text, TouchableOpacity } from "react-native";

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
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        paddingHorizontal: 12,
        paddingTop: 4,
        gap: 4,
      }}
    >
      {tags.map((tag, i) => (
        <TouchableOpacity key={`${tag}-${i}`} onPress={() => onTagPress(tag)}>
          <Text style={{ fontSize: 13, color: colors.tint }}>{tag}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};
