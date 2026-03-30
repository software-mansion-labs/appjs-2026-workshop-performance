import { useContext } from "react";
import { Text } from "react-native";

import { ColorsContext } from "@/context/colors-context";

export const PostTimestamp = ({ time }: { time: string }) => {
  const colors = useContext(ColorsContext);

  return (
    <Text
      style={{
        paddingHorizontal: 12,
        paddingTop: 6,
        paddingBottom: 10,
        fontSize: 11,
        color: colors.icon,
        textTransform: "uppercase",
      }}
    >
      {time}
    </Text>
  );
};
