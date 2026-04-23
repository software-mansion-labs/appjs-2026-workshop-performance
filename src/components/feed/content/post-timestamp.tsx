import { useContext } from "react";
import { Text, StyleSheet } from "react-native";

import { ColorsContext } from "@/context/colors-context";
import { formatRelativeTime } from "@/utils/feed-utils";

export const PostTimestamp = ({ timestamp }: { timestamp: string }) => {
  const colors = useContext(ColorsContext);

  const formattedTime = formatRelativeTime(timestamp);

  return (
    <Text style={[styles.text, { color: colors.icon }]}>
      {formattedTime}
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
