import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";

// App.js Conference custom themes
const AppJSDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: "#dfe7ff",
    background: "#271c2d",
    card: "#362a3d",
    text: "#ffffff",
    border: "#4a3d54",
    notification: "#dfe7ff"
  }
};

const AppJSLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#271c2d",
    background: "#dfe7ff",
    card: "#fdfcfc",
    text: "#271c2d",
    border: "#c5c0cc",
    notification: "#271c2d"
  }
};

export const unstable_settings = {
  anchor: "(tabs)"
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? AppJSDarkTheme : AppJSLightTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="post/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="post/comments/[id]" options={{ headerShown: false, presentation: "modal" }} />
        <Stack.Screen name="profile/[username]" options={{ headerShown: false }} />
        <Stack.Screen name="hashtag/[tag]" options={{ headerShown: false }} />
        <Stack.Screen name="location/[name]" options={{ headerShown: false }} />
        <Stack.Screen name="followers/[username]" options={{ headerShown: false }} />
        <Stack.Screen name="likes/[postId]" options={{ headerShown: false }} />
        <Stack.Screen name="suggestions" options={{ headerShown: false }} />
        <Stack.Screen name="analytics" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: "modal", title: "Modal" }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
