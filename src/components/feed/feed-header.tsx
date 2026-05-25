import { useContext } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { ColorsContext } from "@/context/colors-context";

export const FeedHeader = () => {
  const colors = useContext(ColorsContext);
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + 8,
          backgroundColor: colors.background,
          borderBottomColor: colors.border
        }
      ]}
    >
      <Image source={require("../../../assets/images/logo_appjs.png")} style={styles.logo} />
      <View style={styles.actions}>
        <View style={[styles.dateBadge, { borderColor: colors.text }]}>
          <IconSymbol name="calendar" size={14} color={colors.text} />
          <Text style={[styles.dateText, { color: colors.text }]}>27-29 May &apos;26</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 0.5
  },
  logo: {
    height: 32,
    width: 36
  },
  actions: {
    flexDirection: "row",
    gap: 8
  },
  dateBadge: {
    borderWidth: 1.5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 6
  },
  dateText: {
    fontSize: 12,
    fontWeight: "500"
  }
});
