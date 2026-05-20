import { Tabs } from "expo-router";
import React from "react";

import { AnimatedTabBar } from "@/components/feed/animated-tab-bar";
import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      tabBar={tabBarProps => <AnimatedTabBar {...tabBarProps} />}
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        tabBarInactiveTintColor: Colors[colorScheme ?? "light"].tabIconDefault,
        tabBarStyle: {
          backgroundColor: colorScheme === "dark" ? "#271c2d" : "#dfe7ff",
          borderTopColor: colorScheme === "dark" ? "#4a3d54" : "#c5c0cc"
        },
        headerShown: false,
        tabBarButton: HapticTab
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Feed",
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />
        }}
      />



      <Tabs.Screen
        name="profile"
        options={{
          title: "Attendee",
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />
        }}
      />
    </Tabs>
  );
}
