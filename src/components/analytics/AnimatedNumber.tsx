import { useEffect } from "react";
import { TextInput, type TextStyle, StyleSheet } from "react-native";
import Animated, { useSharedValue, withTiming, useAnimatedProps } from "react-native-reanimated";

// Hack: RN Text doesn't expose a native "text" prop (content goes through React children),
// so useAnimatedProps can't animate it on the UI thread. TextInput has a native "text" prop
// with Reanimated's built-in TextInputAdapter, so we use it as a read-only text display.
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

interface AnimatedNumberProps {
  value: number;
  style?: TextStyle;
  suffix?: string;
  duration?: number;
  formatFn?: (n: number) => string;
}

const defaultFormat = (n: number) => {
  "worklet";
  return Math.round(n).toLocaleString();
};

export function AnimatedNumber({ value, style, suffix = "", duration = 500, formatFn = defaultFormat }: AnimatedNumberProps) {
  const animated = useSharedValue(value);

  useEffect(() => {
    animated.value = withTiming(value, { duration });
  }, [value, duration]);

  const animatedProps = useAnimatedProps(() => {
    const formatted = formatFn(animated.value);
    return { text: `${formatted}${suffix}` } as any;
  });

  return (
    <AnimatedTextInput
      editable={false}
      scrollEnabled={false}
      underlineColorAndroid="transparent"
      style={[styles.text, style]}
      animatedProps={animatedProps}
      defaultValue={`${formatFn(value)}${suffix}`}
    />
  );
}

const styles = StyleSheet.create({
  text: {
    padding: 0,
    margin: 0,
    minWidth: 100,
    textAlign: "center",
  },
});
