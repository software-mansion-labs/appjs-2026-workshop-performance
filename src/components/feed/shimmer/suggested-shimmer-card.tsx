import { useContext } from "react";
import { View, StyleSheet } from "react-native";

import { ColorsContext } from "@/context/colors-context";
import { ShimmerView } from "./shimmer-view";

export const SuggestedShimmerCard = () => {
  const colors = useContext(ColorsContext);

  return (
    <View style={[styles.card, { borderColor: colors.border, backgroundColor: colors.cardBackground }]}>
      <ShimmerView style={[styles.image, shadowStyles.block]} />
      <View style={styles.info}>
        <View style={styles.userRow}>
          <ShimmerView style={[styles.avatar, shadowStyles.block]} />
          <ShimmerView style={[styles.usernameLine, shadowStyles.block]} />
        </View>
        <ShimmerView style={[styles.captionLine1, shadowStyles.block]} />
        <ShimmerView style={[styles.captionLine2, shadowStyles.block]} />
        <ShimmerView style={[styles.followButton, shadowStyles.block]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 160,
    marginRight: 8,
    borderRadius: 8,
    borderWidth: 0.5,
    overflow: "hidden",
  },
  image: {
    width: 160,
    height: 160,
  },
  info: {
    padding: 8,
    gap: 6,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  avatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  usernameLine: {
    height: 10,
    borderRadius: 5,
    flex: 1,
  },
  captionLine1: {
    height: 9,
    borderRadius: 4,
    width: "90%",
  },
  captionLine2: {
    height: 9,
    borderRadius: 4,
    width: "60%",
  },
  followButton: {
    height: 24,
    borderRadius: 6,
    marginTop: 2,
  },
});

const shadowStyles = StyleSheet.create({
  block: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
});
