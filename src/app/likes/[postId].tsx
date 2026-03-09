import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, FlatList } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { MOCK_FEED, FeedPost } from "@/data/mock-feed";
import { useColorScheme } from "@/hooks/use-color-scheme";

interface LikeUser {
  username: string;
  avatar: string;
  fullName: string;
  isVerified: boolean;
  isFollowing: boolean;
}

// Generate mock users who liked the post
function generateLikers(post: FeedPost): LikeUser[] {
  const users: LikeUser[] = [];
  const likeCount = Math.min(post.likes, 100); // Cap at 100 for performance

  // Add actual reaction users if available
  post.reactions.forEach(reaction => {
    reaction.users.forEach(user => {
      if (!users.find(u => u.username === user.username)) {
        users.push({
          username: user.username,
          avatar: user.avatar,
          fullName: generateFullName(user.username),
          isVerified: Math.random() > 0.85,
          isFollowing: Math.random() > 0.5
        });
      }
    });
  });

  // Add commenters
  post.comments.forEach(comment => {
    if (!users.find(u => u.username === comment.username)) {
      users.push({
        username: comment.username,
        avatar: comment.avatar,
        fullName: generateFullName(comment.username),
        isVerified: Math.random() > 0.9,
        isFollowing: Math.random() > 0.5
      });
    }
  });

  // Generate additional random users if needed
  while (users.length < likeCount) {
    const i = users.length;
    users.push({
      username: `user_${i + 200}`,
      avatar: `https://i.pravatar.cc/150?u=liker${i}`,
      fullName: generateFullName(`user_${i}`),
      isVerified: Math.random() > 0.92,
      isFollowing: Math.random() > 0.5
    });
  }

  return users;
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

function UserRow({ user, colors, onPress }: { user: LikeUser; colors: typeof Colors.light; onPress: () => void }) {
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

export default function LikesScreen() {
  const { postId } = useLocalSearchParams<{ postId: string }>();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();

  const [users, setUsers] = useState<LikeUser[]>([]);
  const [totalLikes, setTotalLikes] = useState(0);

  useEffect(() => {
    if (postId) {
      const post = MOCK_FEED.find(p => p.id === postId);
      if (post) {
        setUsers(generateLikers(post));
        setTotalLikes(post.likes);
      }
    }
  }, [postId]);

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
        <Text style={{ flex: 1, fontSize: 18, fontWeight: "600", color: colors.text }}>Likes</Text>
      </View>

      {/* Likes Count */}
      <View
        style={{
          padding: 16,
          borderBottomWidth: 0.5,
          borderBottomColor: colors.border,
          flexDirection: "row",
          alignItems: "center",
          gap: 8
        }}
      >
        <IconSymbol name="heart.fill" size={20} color="#FF6B6B" />
        <Text style={{ fontSize: 15, fontWeight: "500", color: colors.text }}>{totalLikes.toLocaleString()} likes</Text>
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
