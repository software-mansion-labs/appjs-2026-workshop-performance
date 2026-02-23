import { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import type { SuggestedUser } from "@/data/mock-feed";

export function SuggestedCard({
  user,
  colors,
}: {
  user: SuggestedUser;
  colors: typeof Colors.light;
}) {
  const [isFollowing, setIsFollowing] = useState(false);

  return (
    <View
      style={{
        width: 160,
        borderRadius: 8,
        borderWidth: 0.5,
        borderColor: colors.icon + "30",
        alignItems: "center",
        paddingVertical: 16,
        paddingHorizontal: 8,
        backgroundColor: colors.background,
      }}
    >
      <Image
        source={{ uri: user.avatar }}
        style={{ width: 72, height: 72, borderRadius: 36 }}
      />
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 3,
          marginTop: 8,
        }}
      >
        <Text
          style={{
            fontWeight: "600",
            fontSize: 13,
            color: colors.text,
          }}
          numberOfLines={1}
        >
          {user.username}
        </Text>
        {user.isVerified && (
          <IconSymbol name="checkmark.seal.fill" size={12} color="#0095f6" />
        )}
      </View>
      <Text
        style={{ fontSize: 12, color: colors.icon, marginTop: 2 }}
        numberOfLines={1}
      >
        Suggested for you
      </Text>
      <Image
        source={{ uri: user.latestPost }}
        style={{
          width: 140,
          height: 100,
          borderRadius: 4,
          marginTop: 8,
        }}
      />
      <TouchableOpacity
        onPress={() => setIsFollowing((prev) => !prev)}
        style={{
          marginTop: 10,
          backgroundColor: isFollowing ? colors.background : "#0095f6",
          borderRadius: 8,
          paddingVertical: 7,
          paddingHorizontal: 24,
          borderWidth: isFollowing ? 0.5 : 0,
          borderColor: colors.icon + "60",
        }}
      >
        <Text
          style={{
            color: isFollowing ? colors.text : "#fff",
            fontWeight: "600",
            fontSize: 13,
          }}
        >
          {isFollowing ? "Following" : "Follow"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
