import { Text, TouchableOpacity, View } from "react-native";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";

export function FeedHeader({
  colors,
  topInset,
}: {
  colors: typeof Colors.light;
  topInset: number;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingBottom: 10,
        borderBottomWidth: 0.5,
        paddingTop: topInset,
        backgroundColor: colors.background,
        borderBottomColor: colors.icon + "30",
      }}
    >
      <Text
        style={{
          fontSize: 24,
          fontWeight: "700",
          fontStyle: "italic",
          color: colors.text,
        }}
      >
        Instagram
      </Text>
      <View style={{ flexDirection: "row", gap: 16 }}>
        <TouchableOpacity style={{ padding: 4 }}>
          <IconSymbol name="heart" size={26} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={{ padding: 4 }}>
          <IconSymbol name="paperplane" size={26} color={colors.text} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
