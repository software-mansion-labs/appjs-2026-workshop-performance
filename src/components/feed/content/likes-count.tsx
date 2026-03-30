import { useContext } from "react";
import { Text, TouchableOpacity } from "react-native";

import { ColorsContext } from "@/context/colors-context";

export const LikesCount = ({
  likesText,
  onPress,
}: {
  likesText: string;
  onPress: () => void;
}) => {
  const colors = useContext(ColorsContext);

  return (
    <TouchableOpacity onPress={onPress}>
      <Text
        style={{
          fontWeight: "600",
          paddingHorizontal: 12,
          fontSize: 14,
          color: colors.text,
        }}
      >
        {likesText}
      </Text>
    </TouchableOpacity>
  );
};
