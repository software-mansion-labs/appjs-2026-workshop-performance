import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, Dimensions, Linking, Alert, Share } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { MOCK_FEED, FeedPost } from "@/data/mock-feed";
import { useColorScheme } from "@/hooks/use-color-scheme";

const { width } = Dimensions.get("window");
const imageSize = (width - 4) / 3;

interface UserProfile {
  username: string;
  avatar: string;
  isVerified: boolean;
  fullName: string;
  bio: string;
  website: string;
  postsCount: number;
  followersCount: number;
  followingCount: number;
  posts: FeedPost[];
  isFollowing: boolean;
}

function generateUserProfile(username: string): UserProfile {
  // Find all posts by this user
  const userPosts = MOCK_FEED.filter(post => post.user.username === username);
  const firstPost = userPosts[0];

  // Generate consistent profile data based on username
  const hash = username.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);

  const bios = [
    "🚀 React Native Developer | 📱 Mobile First | ⚛️ Expo Enthusiast",
    "💻 Full Stack Dev | 🔧 Open Source Contributor | 🌍 Remote Worker",
    "🎨 UI/UX Designer | 📱 Mobile Apps | 🎯 Performance Focused",
    "🏢 Software Mansion | 💜 React Native Core | 🎤 Conference Speaker",
    "🎵 Animations Expert | 🎸 Reanimated | 🎤 Workshop Instructor",
    "🍕 Food & Code | 🍳 Side Projects | 🌮 App.js Attendee",
    "⚛️ Expo Team | 🐱 Cat Parent | 🦋 Building the Future",
    "💻 Tech Lead | 🚀 Startups | 💡 Innovation & Mobile"
  ];

  const fullNames = [
    "Alex Johnson",
    "Maya Chen",
    "Jordan Smith",
    "Sam Rodriguez",
    "Riley Taylor",
    "Morgan Davis",
    "Casey Kim",
    "Drew Wilson",
    "Avery Martinez",
    "Quinn Brown",
    "Jamie Lee",
    "Parker Anderson"
  ];

  return {
    username,
    avatar: firstPost?.user.avatar || `https://i.pravatar.cc/150?u=${username}`,
    isVerified: firstPost?.user.isVerified || hash % 3 === 0,
    fullName: fullNames[hash % fullNames.length],
    bio: bios[hash % bios.length],
    website: `www.${username.replace("_", "")}.com`,
    postsCount: userPosts.length || Math.floor(hash % 500) + 10,
    followersCount: Math.floor((hash * 137) % 100000) + 1000,
    followingCount: Math.floor((hash * 43) % 1000) + 100,
    posts: userPosts,
    isFollowing: hash % 2 === 0
  };
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return num.toString();
}

function PostGridItem({ post, onPress }: { post: FeedPost; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} style={{ margin: 1 }}>
      <Image source={{ uri: post.images[0].uri }} style={{ width: imageSize, height: imageSize }} />
      {post.images.length > 1 && (
        <View style={{ position: "absolute", top: 8, right: 8 }}>
          <IconSymbol name="square.on.square" size={16} color="white" />
        </View>
      )}
    </TouchableOpacity>
  );
}

export default function UserProfileScreen() {
  const { username } = useLocalSearchParams<{ username: string }>();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState<"grid" | "tagged">("grid");

  useEffect(() => {
    if (username) {
      const userProfile = generateUserProfile(username);
      setProfile(userProfile);
      setIsFollowing(userProfile.isFollowing);
    }
  }, [username]);

  if (!profile) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.cardBackground,
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Text style={{ color: colors.text }}>Loading...</Text>
      </View>
    );
  }

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
          backgroundColor: colors.cardBackground,
          borderBottomWidth: 0.5,
          borderBottomColor: colors.border
        }}
      >
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 4, marginRight: 16 }}>
          <IconSymbol name="chevron.left" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: 4 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "600",
              color: colors.text
            }}
          >
            {profile.username}
          </Text>
          {profile.isVerified && <IconSymbol name="checkmark.seal.fill" size={16} color="#3d2847" />}
        </View>
        <TouchableOpacity
          style={{ padding: 4 }}
          onPress={() => {
            Alert.alert(profile.username, undefined, [
              {
                text: "Share Profile",
                onPress: () =>
                  Share.share({
                    message: `Check out @${profile.username}'s profile: https://example.com/profile/${profile.username}`,
                    url: `https://example.com/profile/${profile.username}`
                  })
              },
              { text: "Copy Profile URL", onPress: () => Alert.alert("Copied", "Profile URL copied to clipboard") },
              {
                text: "Block",
                style: "destructive",
                onPress: () => Alert.alert("Blocked", `You have blocked @${profile.username}`)
              },
              {
                text: "Report",
                style: "destructive",
                onPress: () => Alert.alert("Reported", "Thank you for your report. We will review this account.")
              },
              { text: "Cancel", style: "cancel" }
            ]);
          }}
        >
          <IconSymbol name="ellipsis" size={22} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView>
        {/* Profile Info */}
        <View style={{ padding: 16 }}>
          {/* Avatar and Stats */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 16
            }}
          >
            <Image
              source={{ uri: profile.avatar }}
              style={{
                width: 86,
                height: 86,
                borderRadius: 43,
                borderWidth: 3,
                borderColor: "#271c2d"
              }}
            />
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-around",
                marginLeft: 20
              }}
            >
              <View style={{ alignItems: "center" }}>
                <Text style={{ fontSize: 18, fontWeight: "700", color: colors.text }}>{profile.postsCount}</Text>
                <Text style={{ fontSize: 13, color: colors.icon }}>Posts</Text>
              </View>
              <TouchableOpacity
                onPress={() => router.push(`/followers/${username}?type=followers`)}
                style={{ alignItems: "center" }}
              >
                <Text style={{ fontSize: 18, fontWeight: "700", color: colors.text }}>
                  {formatNumber(profile.followersCount)}
                </Text>
                <Text style={{ fontSize: 13, color: colors.icon }}>Followers</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push(`/followers/${username}?type=following`)}
                style={{ alignItems: "center" }}
              >
                <Text style={{ fontSize: 18, fontWeight: "700", color: colors.text }}>
                  {formatNumber(profile.followingCount)}
                </Text>
                <Text style={{ fontSize: 13, color: colors.icon }}>Following</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Name and Bio */}
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: colors.text,
              marginBottom: 2
            }}
          >
            {profile.fullName}
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: colors.text,
              lineHeight: 20,
              marginBottom: 4
            }}
          >
            {profile.bio}
          </Text>
          <Text
            style={{ fontSize: 14, color: "#3d2847" }}
            onPress={() => Linking.openURL(`https://${profile.website}`)}
          >
            {profile.website}
          </Text>

          {/* Action Buttons */}
          <View
            style={{
              flexDirection: "row",
              marginTop: 16,
              gap: 8
            }}
          >
            <TouchableOpacity
              onPress={() => setIsFollowing(!isFollowing)}
              style={{
                flex: 1,
                backgroundColor: isFollowing ? colors.icon + "20" : "#271c2d",
                paddingVertical: 8,
                borderRadius: 8,
                alignItems: "center"
              }}
            >
              <Text
                style={{
                  fontWeight: "600",
                  color: isFollowing ? colors.text : "#FFFFFF"
                }}
              >
                {isFollowing ? "Following" : "Follow"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => Alert.alert("Message", `Opening chat with @${profile.username}...`)}
              style={{
                flex: 1,
                backgroundColor: colors.icon + "20",
                paddingVertical: 8,
                borderRadius: 8,
                alignItems: "center"
              }}
            >
              <Text style={{ fontWeight: "600", color: colors.text }}>Message</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tab Bar */}
        <View
          style={{
            flexDirection: "row",
            borderTopWidth: 0.5,
            borderTopColor: colors.icon + "30"
          }}
        >
          <TouchableOpacity
            onPress={() => setActiveTab("grid")}
            style={{
              flex: 1,
              alignItems: "center",
              paddingVertical: 12,
              borderBottomWidth: activeTab === "grid" ? 1 : 0,
              borderBottomColor: colors.text
            }}
          >
            <IconSymbol name="square.grid.3x3" size={24} color={activeTab === "grid" ? colors.text : colors.icon} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab("tagged")}
            style={{
              flex: 1,
              alignItems: "center",
              paddingVertical: 12,
              borderBottomWidth: activeTab === "tagged" ? 1 : 0,
              borderBottomColor: colors.text
            }}
          >
            <IconSymbol
              name="person.crop.square"
              size={24}
              color={activeTab === "tagged" ? colors.text : colors.icon}
            />
          </TouchableOpacity>
        </View>

        {/* Posts Grid */}
        {activeTab === "grid" && (
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {profile.posts.length > 0 ? (
              profile.posts.map(post => (
                <PostGridItem key={post.id} post={post} onPress={() => router.push(`/post/${post.id}`)} />
              ))
            ) : (
              <View
                style={{
                  width: "100%",
                  paddingVertical: 60,
                  alignItems: "center"
                }}
              >
                <IconSymbol name="camera" size={48} color={colors.icon} />
                <Text
                  style={{
                    marginTop: 16,
                    fontSize: 22,
                    fontWeight: "700",
                    color: colors.text
                  }}
                >
                  No Posts Yet
                </Text>
              </View>
            )}
          </View>
        )}

        {activeTab === "tagged" && (
          <View
            style={{
              paddingVertical: 60,
              alignItems: "center"
            }}
          >
            <IconSymbol name="person.crop.square" size={48} color={colors.icon} />
            <Text
              style={{
                marginTop: 16,
                fontSize: 22,
                fontWeight: "700",
                color: colors.text
              }}
            >
              Photos of {profile.username}
            </Text>
            <Text
              style={{
                marginTop: 8,
                fontSize: 14,
                color: colors.icon,
                textAlign: "center",
                paddingHorizontal: 40
              }}
            >
              When people tag {profile.username} in photos, they will appear here.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
