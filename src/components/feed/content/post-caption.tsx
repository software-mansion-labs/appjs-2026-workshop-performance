import { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";

import { ColorsContext } from "@/context/colors-context";

export const PostCaption = ({
  username,
  caption,
}: {
  username: string;
  caption: string;
}) => {
  const colors = useContext(ColorsContext);

  if (caption.length === 0) return null;

  return (
    <View style={styles.wrapper}>
      <View style={[styles.card, shadowStyles.cardShadow, { backgroundColor: colors.cardBackgroundAlt }]}>
        <View style={[styles.accentBar, { backgroundColor: colors.tint + "30" }]} />
        <Text style={[styles.text, { color: colors.text }]}>
          <Text style={styles.username}>{username}</Text> {caption}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 12,
    paddingTop: 4,
  },
  card: {
    borderRadius: 10,
    overflow: "hidden",
    padding: 8,
  },
  accentBar: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 3,
    height: "100%",
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    overflow: "hidden",
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
    paddingLeft: 4,
  },
  username: {
    fontWeight: "600",
  },
});

const shadowStyles = StyleSheet.create({
  cardShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
});
