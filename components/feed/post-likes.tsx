import { Image, Text, View } from "react-native";

import { Colors } from "@/constants/theme";
import type { LikedByUser } from "@/data/mock-feed";

export function PostLikes({
  likedBy,
  formattedLikes,
  colors,
}: {
  likedBy: LikedByUser[];
  formattedLikes: string;
  colors: typeof Colors.light;
}) {
  if (likedBy.length > 0) {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 12,
        }}
      >
        <View style={{ flexDirection: "row", marginRight: 8 }}>
          {likedBy.map((user, index) => (
            <Image
              key={user.username}
              source={{ uri: user.avatar }}
              style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                borderWidth: 1.5,
                borderColor: colors.background,
                marginLeft: index > 0 ? -8 : 0,
              }}
            />
          ))}
        </View>
        <Text style={{ fontSize: 13, color: colors.text }}>
          Liked by{" "}
          <Text style={{ fontWeight: "600" }}>{likedBy[0].username}</Text> and{" "}
          <Text style={{ fontWeight: "600" }}>{formattedLikes} others</Text>
        </Text>
      </View>
    );
  }

  return (
    <Text
      style={{
        fontWeight: "600",
        paddingHorizontal: 12,
        fontSize: 14,
        color: colors.text,
      }}
    >
      {formattedLikes} likes
    </Text>
  );
}
