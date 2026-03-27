import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: colors.cardBackground }]}>
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top,
            backgroundColor: colors.background,
            borderBottomColor: colors.icon + "30"
          }
        ]}
      >
        <Text style={[styles.headerTitle, { color: colors.text }]}>Attendee</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.avatarContainer}>
          <IconSymbol name="person.fill" size={48} color="#271c2d" />
        </View>
        <Text style={[styles.placeholder, { color: colors.text }]}>Welcome to App.js 2026!</Text>
        <Text style={[styles.subtext, { color: colors.icon }]}>Kraków, Poland • May 27-29</Text>
        <View style={styles.badgeContainer}>
          <View style={[styles.badge, { backgroundColor: "#271c2d" }]}>
            <Text style={styles.badgeText}>Workshop Pass</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: "#3d2847" }]}>
            <Text style={[styles.badgeText, { color: "#FFFFFF" }]}>Conference</Text>
          </View>
        </View>
        <TouchableOpacity
          style={[styles.analyticsButton, { borderColor: colors.text }]}
          onPress={() => router.push("/analytics")}
        >
          <IconSymbol name="chart.line.uptrend.xyaxis" size={18} color={colors.text} />
          <Text style={[styles.analyticsButtonText, { color: colors.text }]}>Analytics</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 0.5
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700"
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#efecf3",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    borderWidth: 2,
    borderColor: "#271c2d"
  },
  placeholder: {
    fontSize: 20,
    fontWeight: "600"
  },
  subtext: {
    fontSize: 14
  },
  badgeContainer: {
    flexDirection: "row",
    gap: 8,
    marginTop: 16
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF"
  },
  analyticsButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 24,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1.5
  },
  analyticsButtonText: {
    fontSize: 14,
    fontWeight: "600"
  }
});
