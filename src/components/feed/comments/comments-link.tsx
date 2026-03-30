import { useContext } from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";

import { ColorsContext } from "@/context/colors-context";

export const CommentsLink = ({
  totalComments,
  onPress,
}: {
  totalComments: number;
  onPress: () => void;
}) => {
  const colors = useContext(ColorsContext);

  if (totalComments === 0) return null;

  return (
    <TouchableOpacity onPress={onPress}>
      <Text style={[styles.text, { color: colors.icon }]}>
        {totalComments === 1 ? "View 1 comment" : `View all ${totalComments} comments`}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  text: {
    paddingHorizontal: 12,
    paddingTop: 6,
    fontSize: 14,
  },
});
