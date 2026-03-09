import { useRouter } from "expo-router";
import { useState } from "react";
import { View, Text, Image, TouchableOpacity, FlatList } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { MOCK_FEED } from "@/data/mock-feed";
import { useColorScheme } from "@/hooks/use-color-scheme";

interface SuggestedUser {
  username: string;
  avatar: string;
  fullName: string;
  isVerified: boolean;
  mutualFollowers: number;
  latestPostImage?: string;
}

// Generate suggested users from feed data
function generateSuggestedUsers(): SuggestedUser[] {
  const usersMap = new Map<string, SuggestedUser>();

  MOCK_FEED.forEach(post => {
    if (!usersMap.has(post.user.username)) {
      usersMap.set(post.user.username, {
        username: post.user.username,
        avatar: post.user.avatar,
        fullName: generateFullName(post.user.username),
        isVerified: post.user.isVerified,
        mutualFollowers: Math.floor(Math.random() * 20) + 1,
        latestPostImage: post.images[0]?.uri
      });
    }
  });

  // Add more generated users
  for (let i = 0; i < 30; i++) {
    const username = `suggested_user_${i}`;
    if (!usersMap.has(username)) {
      usersMap.set(username, {
        username,
        avatar: `https://i.pravatar.cc/150?u=suggested${i}`,
        fullName: generateFullName(username),
        isVerified: Math.random() > 0.85,
        mutualFollowers: Math.floor(Math.random() * 15) + 1,
        latestPostImage: `https://picsum.photos/seed/suggested${i}/400/400`
      });
    }
  }

  return Array.from(usersMap.values());
}

function generateFullName(username: string): string {
  const hash = username.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const firstNames = [
    "Alex",
    "Maya",
    "Jordan",
    "Sam",
    "Riley",
    "Morgan",
    "Casey",
    "Drew",
    "Avery",
    "Quinn",
    "Jamie",
    "Parker"
  ];
  const lastNames = [
    "Johnson",
    "Chen",
    "Smith",
    "Rodriguez",
    "Taylor",
    "Davis",
    "Kim",
    "Wilson",
    "Martinez",
    "Brown",
    "Lee",
    "Anderson"
  ];
  return `${firstNames[hash % firstNames.length]} ${lastNames[(hash * 7) % lastNames.length]}`;
}

function SuggestedUserCard({
  user,
  colors,
  onProfilePress
}: {
  user: SuggestedUser;
  colors: typeof Colors.light;
  onProfilePress: () => void;
}) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  return (
    <View
      style={{
        width: 160,
        margin: 4,
        borderRadius: 12,
        borderWidth: 0.5,
        borderColor: colors.border,
        overflow: "hidden",
        backgroundColor: colors.cardBackground
      }}
    >
      {/* Dismiss button */}
      <TouchableOpacity
        onPress={() => setIsDismissed(true)}
        style={{
          position: "absolute",
          top: 8,
          right: 8,
          zIndex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          borderRadius: 10,
          padding: 2
        }}
      >
        <IconSymbol name="xmark" size={12} color="#fff" />
      </TouchableOpacity>

      {/* Background Image */}
      {user.latestPostImage && (
        <Image source={{ uri: user.latestPostImage }} style={{ width: 160, height: 100 }} resizeMode="cover" />
      )}

      <View style={{ padding: 12, alignItems: "center" }}>
        {/* Avatar */}
        <TouchableOpacity onPress={onProfilePress}>
          <Image
            source={{ uri: user.avatar }}
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              borderWidth: 3,
              borderColor: colors.cardBackground,
              marginTop: user.latestPostImage ? -40 : 0
            }}
          />
        </TouchableOpacity>

        {/* Username */}
        <TouchableOpacity onPress={onProfilePress} style={{ alignItems: "center", marginTop: 8 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <Text style={{ fontSize: 13, fontWeight: "600", color: colors.text }} numberOfLines={1}>
              {user.username}
            </Text>
            {user.isVerified && <IconSymbol name="checkmark.seal.fill" size={12} color="#3d2847" />}
          </View>
          <Text style={{ fontSize: 11, color: colors.icon, marginTop: 2 }}>{user.fullName}</Text>
        </TouchableOpacity>

        {/* Mutual followers */}
        <Text style={{ fontSize: 11, color: colors.icon, marginTop: 4, textAlign: "center" }}>
          Followed by {user.mutualFollowers} of your friends
        </Text>

        {/* Follow button */}
        <TouchableOpacity
          onPress={() => setIsFollowing(!isFollowing)}
          style={{
            marginTop: 10,
            backgroundColor: isFollowing ? colors.background : colors.tint,
            borderRadius: 8,
            paddingVertical: 8,
            paddingHorizontal: 24,
            borderWidth: isFollowing ? 1 : 0,
            borderColor: colors.border
          }}
        >
          <Text
            style={{
              fontSize: 13,
              fontWeight: "600",
              color: isFollowing ? colors.text : "#fff"
            }}
          >
            {isFollowing ? "Following" : "Follow"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function SuggestionsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();

  const [users] = useState<SuggestedUser[]>(generateSuggestedUsers());

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingBottom: 10,
          paddingTop: insets.top,
          backgroundColor: colors.cardBackground,
          borderBottomWidth: 0.5,
          borderBottomColor: colors.border
        }}
      >
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 4, marginRight: 16 }}>
          <IconSymbol name="chevron.left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontSize: 18, fontWeight: "600", color: colors.text }}>Suggested for you</Text>
      </View>

      {/* Users Grid */}
      <FlatList
        data={users}
        numColumns={2}
        keyExtractor={item => item.username}
        renderItem={({ item }) => (
          <SuggestedUserCard
            user={item}
            colors={colors}
            onProfilePress={() => router.push(`/profile/${item.username}`)}
          />
        )}
        contentContainerStyle={{ padding: 4, paddingBottom: insets.bottom }}
        columnWrapperStyle={{ justifyContent: "center" }}
      />
    </View>
  );
}
