import { useContext } from "react";
import { View, Text } from "react-native";

import { ColorsContext } from "@/context/colors-context";

export const PostCaption = ({
  username,
  caption,
}: {
  username: string;
  caption: string;
}) => {
  const colors = useContext(ColorsContext);

  if (caption.length === 0) return null;

  return (
    <View style={{ paddingHorizontal: 12, paddingTop: 4 }}>
      <Text style={{ fontSize: 14, lineHeight: 20, color: colors.text }}>
        <Text style={{ fontWeight: "600" }}>{username}</Text> {caption}
      </Text>
    </View>
  );
};
