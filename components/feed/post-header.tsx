import { Image, Text, TouchableOpacity, View } from "react-native";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";

export function PostHeader({
  username,
  avatar,
  isVerified,
  location,
  colors,
}: {
  username: string;
  avatar: string;
  isVerified: boolean;
  location: string | null;
  colors: typeof Colors.light;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 12,
        paddingVertical: 10,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Image
          source={{ uri: avatar }}
          style={{ width: 32, height: 32, borderRadius: 16 }}
        />
        <View>
          <View
            style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
          >
            <Text
              style={{ fontWeight: "600", fontSize: 14, color: colors.text }}
            >
              {username}
            </Text>
            {isVerified && (
              <IconSymbol
                name="checkmark.seal.fill"
                size={14}
                color="#0095f6"
              />
            )}
          </View>
          {location && (
            <Text style={{ fontSize: 12, color: colors.icon }}>
              {location}
            </Text>
          )}
        </View>
      </View>
      <TouchableOpacity>
        <Text
          style={{ fontSize: 16, fontWeight: "bold", color: colors.text }}
        >
          •••
        </Text>
      </TouchableOpacity>
    </View>
  );
}
