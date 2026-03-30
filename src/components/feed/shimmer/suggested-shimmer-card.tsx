import { useEffect, useRef, useContext } from "react";
import { Animated, View, StyleSheet } from "react-native";

import { ColorsContext } from "@/context/colors-context";

export const SuggestedShimmerCard = () => {
  const colors = useContext(ColorsContext);
  const opacity = useRef(new Animated.Value(0.25)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: false }),
        Animated.timing(opacity, { toValue: 0.25, duration: 700, useNativeDriver: false }),
      ])
    ).start();
  }, [opacity]);

  const bg = colors.border;

  return (
    <View style={[styles.card, { borderColor: colors.border, backgroundColor: colors.cardBackground }]}>
      <Animated.View style={[styles.image, shadowStyles.block, { backgroundColor: bg, opacity }]} />
      <View style={styles.info}>
        <View style={styles.userRow}>
          <Animated.View style={[styles.avatar, shadowStyles.block, { backgroundColor: bg, opacity }]} />
          <Animated.View style={[styles.usernameLine, shadowStyles.block, { backgroundColor: bg, opacity }]} />
        </View>
        <Animated.View style={[styles.captionLine1, shadowStyles.block, { backgroundColor: bg, opacity }]} />
        <Animated.View style={[styles.captionLine2, shadowStyles.block, { backgroundColor: bg, opacity }]} />
        <Animated.View style={[styles.followButton, shadowStyles.block, { backgroundColor: bg, opacity }]} />
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
    overflow: "hidden",
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
    overflow: "hidden",
  },
  usernameLine: {
    height: 10,
    borderRadius: 5,
    flex: 1,
    overflow: "hidden",
  },
  captionLine1: {
    height: 9,
    borderRadius: 4,
    width: "90%",
    overflow: "hidden",
  },
  captionLine2: {
    height: 9,
    borderRadius: 4,
    width: "60%",
    overflow: "hidden",
  },
  followButton: {
    height: 24,
    borderRadius: 6,
    marginTop: 2,
    overflow: "hidden",
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
