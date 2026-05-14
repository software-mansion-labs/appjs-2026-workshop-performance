import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, FlatList } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { MOCK_FEED } from "@/data/mock-feed";
import { useColorScheme } from "@/hooks/use-color-scheme";

interface UserItem {
  username: string;
  avatar: string;
  fullName: string;
  isVerified: boolean;
  isFollowing: boolean;
}

// Generate mock users based on feed data
function generateUsers(username: string, type: "followers" | "following", count: number): UserItem[] {
  const uniqueUsers = new Map<string, UserItem>();

  // Gather unique users from feed
  MOCK_FEED.forEach(post => {
    if (!uniqueUsers.has(post.user.username)) {
      uniqueUsers.set(post.user.username, {
        username: post.user.username,
        avatar: post.user.avatar,
        fullName: generateFullName(post.user.username),
        isVerified: post.user.isVerified,
        isFollowing: Math.random() > 0.5
      });
    }
    // Add commenters
    post.comments.forEach(comment => {
      if (!uniqueUsers.has(comment.username)) {
        uniqueUsers.set(comment.username, {
          username: comment.username,
          avatar: comment.avatar,
          fullName: generateFullName(comment.username),
          isVerified: Math.random() > 0.8,
          isFollowing: Math.random() > 0.5
        });
      }
    });
  });

  const users = Array.from(uniqueUsers.values());

  // Generate additional random users if needed
  while (users.length < count) {
    const i = users.length;
    users.push({
      username: `user_${i + 100}`,
      avatar: `https://i.pravatar.cc/150?u=user${i}`,
      fullName: generateFullName(`user_${i}`),
      isVerified: Math.random() > 0.9,
      isFollowing: type === "following" ? true : Math.random() > 0.5
    });
  }

  return users.slice(0, count);
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

function UserRow({ user, colors, onPress }: { user: UserItem; colors: typeof Colors.light; onPress: () => void }) {
  const [isFollowing, setIsFollowing] = useState(user.isFollowing);

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 10,
        gap: 12
      }}
    >
      <TouchableOpacity onPress={onPress}>
        <Image
          source={{ uri: user.avatar }}
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            borderWidth: 2,
            borderColor: colors.border
          }}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={onPress} style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <Text style={{ fontSize: 14, fontWeight: "600", color: colors.text }}>{user.username}</Text>
          {user.isVerified && <IconSymbol name="checkmark.seal.fill" size={14} color="#3d2847" />}
        </View>
        <Text style={{ fontSize: 13, color: colors.icon }}>{user.fullName}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setIsFollowing(!isFollowing)}
        style={{
          backgroundColor: isFollowing ? "transparent" : colors.tint,
          borderRadius: 8,
          paddingVertical: 7,
          paddingHorizontal: 20,
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
  );
}

export default function FollowersScreen() {
  const { username, type } = useLocalSearchParams<{ username: string; type: "followers" | "following" }>();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();

  const [users, setUsers] = useState<UserItem[]>([]);
  const [activeTab, setActiveTab] = useState<"followers" | "following">(type || "followers");

  useEffect(() => {
    if (username) {
      const count = activeTab === "followers" ? 150 : 80;
      setUsers(generateUsers(username, activeTab, count));
    }
  }, [username, activeTab]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.cardBackground }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingBottom: 10,
          paddingTop: insets.top,
          backgroundColor: colors.background,
          borderBottomWidth: 0.5,
          borderBottomColor: colors.border
        }}
      >
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 4, marginRight: 16 }}>
          <IconSymbol name="chevron.left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontSize: 18, fontWeight: "600", color: colors.text }}>{username}</Text>
      </View>

      {/* Tabs */}
      <View
        style={{
          flexDirection: "row",
          borderBottomWidth: 0.5,
          borderBottomColor: colors.border
        }}
      >
        <TouchableOpacity
          onPress={() => setActiveTab("followers")}
          style={{
            flex: 1,
            alignItems: "center",
            paddingVertical: 14,
            borderBottomWidth: activeTab === "followers" ? 2 : 0,
            borderBottomColor: colors.text
          }}
        >
          <Text
            style={{
              fontSize: 15,
              fontWeight: activeTab === "followers" ? "600" : "400",
              color: activeTab === "followers" ? colors.text : colors.icon
            }}
          >
            Followers
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab("following")}
          style={{
            flex: 1,
            alignItems: "center",
            paddingVertical: 14,
            borderBottomWidth: activeTab === "following" ? 2 : 0,
            borderBottomColor: colors.text
          }}
        >
          <Text
            style={{
              fontSize: 15,
              fontWeight: activeTab === "following" ? "600" : "400",
              color: activeTab === "following" ? colors.text : colors.icon
            }}
          >
            Following
          </Text>
        </TouchableOpacity>
      </View>

      {/* Users List */}
      <FlatList
        data={users}
        keyExtractor={item => item.username}
        renderItem={({ item }) => (
          <UserRow user={item} colors={colors} onPress={() => router.push(`/profile/${item.username}`)} />
        )}
        contentContainerStyle={{ paddingBottom: insets.bottom }}
      />
    </View>
  );
}
