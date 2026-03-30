import { useContext } from "react";
import { View, StyleSheet } from "react-native";

import { ColorsContext } from "@/context/colors-context";
import { ShimmerView } from "./shimmer-view";

export const ShimmerItem = () => {
  const colors = useContext(ColorsContext);

  return (
    <View style={[styles.container, shadowStyles.card, { backgroundColor: colors.cardBackground, borderBottomColor: colors.border }]}>
      <View style={styles.header}>
        <ShimmerView style={[styles.avatar, shadowStyles.block]} />
        <View style={styles.headerLines}>
          <ShimmerView style={[styles.lineWide, shadowStyles.block]} />
          <ShimmerView style={[styles.lineNarrow, shadowStyles.block]} />
        </View>
      </View>

      <ShimmerView style={[styles.image, shadowStyles.imageShadow]} />

      <View style={styles.actions}>
        <ShimmerView style={[styles.actionCircle, shadowStyles.block]} />
        <ShimmerView style={[styles.actionCircle, shadowStyles.block]} />
        <ShimmerView style={[styles.actionCircle, shadowStyles.block]} />
      </View>

      <View style={styles.caption}>
        <ShimmerView style={[styles.lineFull, shadowStyles.block]} />
        <ShimmerView style={[styles.lineMid, shadowStyles.block]} />
        <ShimmerView style={[styles.lineShort, shadowStyles.block]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 4,
    borderBottomWidth: 0.5,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  headerLines: {
    flex: 1,
    gap: 6,
  },
  lineWide: {
    height: 12,
    borderRadius: 6,
    width: "50%",
  },
  lineNarrow: {
    height: 10,
    borderRadius: 5,
    width: "30%",
  },
  image: {
    width: "100%",
    height: 300,
  },
  actions: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 14,
  },
  actionCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
  },
  caption: {
    paddingHorizontal: 12,
    paddingBottom: 14,
    gap: 8,
  },
  lineFull: {
    height: 11,
    borderRadius: 5,
    width: "90%",
  },
  lineMid: {
    height: 11,
    borderRadius: 5,
    width: "65%",
  },
  lineShort: {
    height: 11,
    borderRadius: 5,
    width: "40%",
  },
});

const shadowStyles = StyleSheet.create({
  card: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  block: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  imageShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
});
