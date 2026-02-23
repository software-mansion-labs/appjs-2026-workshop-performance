import { Image, Text, TouchableOpacity, View } from "react-native";

import { Colors } from "@/constants/theme";
import type { CommentPreview } from "@/data/mock-feed";

export function PostComments({
  topComments,
  totalComments,
  colors,
}: {
  topComments: CommentPreview[];
  totalComments: number;
  colors: typeof Colors.light;
}) {
  if (topComments.length === 0) {
    if (totalComments > 0) {
      return (
        <TouchableOpacity>
          <Text
            style={{
              paddingHorizontal: 12,
              paddingTop: 4,
              fontSize: 14,
              color: colors.icon,
            }}
          >
            View all {totalComments} comments
          </Text>
        </TouchableOpacity>
      );
    }
    return null;
  }

  return (
    <>
      {topComments.map((comment, index) => (
        <View
          key={index}
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 12,
            paddingTop: 4,
            gap: 6,
          }}
        >
          <Image
            source={{ uri: comment.avatar }}
            style={{ width: 18, height: 18, borderRadius: 9 }}
          />
          <Text
            style={{ fontSize: 13, color: colors.text, flex: 1 }}
            numberOfLines={1}
          >
            <Text style={{ fontWeight: "600" }}>{comment.username}</Text>{" "}
            {comment.text}
          </Text>
        </View>
      ))}
      {totalComments > topComments.length && (
        <TouchableOpacity>
          <Text
            style={{
              paddingHorizontal: 12,
              paddingTop: 4,
              fontSize: 14,
              color: colors.icon,
            }}
          >
            View all {totalComments} comments
          </Text>
        </TouchableOpacity>
      )}
    </>
  );
}
