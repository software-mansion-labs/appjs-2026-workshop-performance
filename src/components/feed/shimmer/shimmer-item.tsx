import { useEffect, useRef, useContext } from "react";
import { Animated, View, StyleSheet } from "react-native";

import { ColorsContext } from "@/context/colors-context";

export const ShimmerItem = () => {
  const colors = useContext(ColorsContext);
  const opacity = useRef(new Animated.Value(0.25)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 750,
          useNativeDriver: false,
        }),
        Animated.timing(opacity, {
          toValue: 0.25,
          duration: 750,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, [opacity]);

  const bg = colors.border;

  return (
    <View style={[styles.container, shadowStyles.card, { backgroundColor: colors.cardBackground, borderBottomColor: colors.border }]}>
      <View style={styles.header}>
        <Animated.View style={[styles.avatar, shadowStyles.block, { backgroundColor: bg, opacity }]} />
        <View style={styles.headerLines}>
          <Animated.View style={[styles.lineWide, shadowStyles.block, { backgroundColor: bg, opacity }]} />
          <Animated.View style={[styles.lineNarrow, shadowStyles.block, { backgroundColor: bg, opacity }]} />
        </View>
      </View>

      <Animated.View style={[styles.image, shadowStyles.imageShadow, { backgroundColor: bg, opacity }]} />

      <View style={styles.actions}>
        <Animated.View style={[styles.actionCircle, shadowStyles.block, { backgroundColor: bg, opacity }]} />
        <Animated.View style={[styles.actionCircle, shadowStyles.block, { backgroundColor: bg, opacity }]} />
        <Animated.View style={[styles.actionCircle, shadowStyles.block, { backgroundColor: bg, opacity }]} />
      </View>

      <View style={styles.caption}>
        <Animated.View style={[styles.lineFull, shadowStyles.block, { backgroundColor: bg, opacity }]} />
        <Animated.View style={[styles.lineMid, shadowStyles.block, { backgroundColor: bg, opacity }]} />
        <Animated.View style={[styles.lineShort, shadowStyles.block, { backgroundColor: bg, opacity }]} />
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
    overflow: "hidden",
  },
  headerLines: {
    flex: 1,
    gap: 6,
  },
  lineWide: {
    height: 12,
    borderRadius: 6,
    width: "50%",
    overflow: "hidden",
  },
  lineNarrow: {
    height: 10,
    borderRadius: 5,
    width: "30%",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 300,
    overflow: "hidden",
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
    overflow: "hidden",
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
    overflow: "hidden",
  },
  lineMid: {
    height: 11,
    borderRadius: 5,
    width: "65%",
    overflow: "hidden",
  },
  lineShort: {
    height: 11,
    borderRadius: 5,
    width: "40%",
    overflow: "hidden",
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
