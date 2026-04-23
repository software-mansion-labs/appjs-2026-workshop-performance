import { useContext } from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";

import { ColorsContext } from "@/context/colors-context";

export const LikesCount = ({
  likesText,
  onPress,
}: {
  likesText: string;
  onPress: () => void;
}) => {
  const colors = useContext(ColorsContext);

  return (
    <TouchableOpacity onPress={onPress}>
      <Text style={[styles.text, { color: colors.text }]}>
        {likesText}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  text: {
    fontWeight: "600",
    paddingHorizontal: 12,
    fontSize: 14,
  },
});
