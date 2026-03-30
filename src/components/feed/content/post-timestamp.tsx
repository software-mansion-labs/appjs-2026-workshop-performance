import { useContext } from "react";
import { Text, StyleSheet } from "react-native";

import { ColorsContext } from "@/context/colors-context";

export const PostTimestamp = ({ time }: { time: string }) => {
  const colors = useContext(ColorsContext);

  return (
    <Text style={[styles.text, { color: colors.icon }]}>
      {time}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    paddingHorizontal: 12,
    paddingTop: 6,
    paddingBottom: 10,
    fontSize: 11,
    textTransform: "uppercase",
  },
});
