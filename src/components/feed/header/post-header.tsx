import { useContext } from "react";
import { View, Text, Image, TouchableOpacity, GestureResponderEvent } from "react-native";
import { useRouter } from "expo-router";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { ColorsContext } from "@/context/colors-context";

export const PostHeader = ({
  username,
  avatar,
  isVerified,
  locationName,
  onLocationPress,
  onMenuPress,
}: {
  username: string;
  avatar: string;
  isVerified: boolean;
  locationName: string;
  onLocationPress: () => void;
  onMenuPress: (e: GestureResponderEvent) => void;
}) => {
  const colors = useContext(ColorsContext);
  const router = useRouter();

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
      <TouchableOpacity
        style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
        onPress={() => router.push(`/profile/${username}`)}
      >
        <Image
          source={{ uri: avatar }}
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            borderWidth: 2,
            borderColor: "#271c2d",
          }}
        />
        <View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <Text style={{ fontWeight: "600", fontSize: 14, color: colors.text }}>{username}</Text>
            {isVerified && <IconSymbol name="checkmark.seal.fill" size={14} color="#3d2847" />}
          </View>
          <TouchableOpacity onPress={onLocationPress}>
            <Text style={{ fontSize: 11, color: colors.icon }}>{locationName}</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={onMenuPress}>
        <Text style={{ fontSize: 16, fontWeight: "bold", color: colors.text }}>•••</Text>
      </TouchableOpacity>
    </View>
  );
};
