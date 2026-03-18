import { useEffect, useState, useCallback } from "react";
import { Text, type TextStyle } from "react-native";
import { useSharedValue, withTiming, useAnimatedReaction, runOnJS } from "react-native-reanimated";

interface AnimatedNumberProps {
  value: number;
  style?: TextStyle;
  suffix?: string;
  duration?: number;
  formatFn?: (n: number) => string;
}

const defaultFormat = (n: number) => Math.round(n).toLocaleString();

export function AnimatedNumber({ value, style, suffix = "", duration = 500, formatFn = defaultFormat }: AnimatedNumberProps) {
  const animated = useSharedValue(value);
  const [display, setDisplay] = useState(formatFn(value));

  const updateDisplay = useCallback((n: number) => {
    setDisplay(formatFn(n));
  }, [formatFn]);

  useEffect(() => {
    animated.value = withTiming(value, { duration });
  }, [value]);

  useAnimatedReaction(
    () => animated.value,
    (current) => {
      runOnJS(updateDisplay)(current);
    }
  );

  return <Text style={style}>{display}{suffix}</Text>;
}
