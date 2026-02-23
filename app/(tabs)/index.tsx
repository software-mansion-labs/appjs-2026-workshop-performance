import { useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { MOCK_FEED, FeedPost } from '@/data/mock-feed';
import { useColorScheme } from '@/hooks/use-color-scheme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Expensive computation that runs on every render
function computeEngagementScore(likes: number, comments: number, caption: string): string {
  // Simulate heavy work: hash the caption character by character
  let hash = 0;
  for (let i = 0; i < 1000; i++) {
    for (let j = 0; j < caption.length; j++) {
      hash = ((hash << 5) - hash + caption.charCodeAt(j)) | 0;
    }
  }

  const score = (likes * 0.7 + comments * 0.3 + Math.abs(hash % 100)) / 100;
  return score.toFixed(1);
}

function FeedItem({ item, colors }: { item: FeedPost; colors: typeof Colors.light }) {
  const [isLiked, setIsLiked] = useState(item.isLiked);
  const [isBookmarked, setIsBookmarked] = useState(item.isBookmarked);
  const [likesCount, setLikesCount] = useState(item.likes);

  // Create new Intl formatter on every render (violates js-hoist-intl)
  const formattedLikes = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(likesCount);

  // Run expensive computation on every render (violates list-performance-item-expensive)
  const engagementScore = computeEngagementScore(item.likes, item.comments, item.caption);

  return (
    <View style={{ marginBottom: 8, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Image source={{ uri: item.user.avatar }} style={{ width: 32, height: 32, borderRadius: 16 }} />
          <Text style={{ fontWeight: '600', fontSize: 14, color: colors.text }}>
            {item.user.username}
          </Text>
        </View>
        <TouchableOpacity>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: colors.text }}>•••</Text>
        </TouchableOpacity>
      </View>

      {/* Image */}
      <Image
        source={{ uri: item.image }}
        style={{ width: SCREEN_WIDTH, height: SCREEN_WIDTH }}
        resizeMode="cover"
      />

      {/* Actions */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <TouchableOpacity onPress={() => {
            setIsLiked((prev) => {
              setLikesCount((count) => (prev ? count - 1 : count + 1));
              return !prev;
            });
          }} style={{ padding: 2 }}>
            <IconSymbol
              name={isLiked ? 'heart.fill' : 'heart'}
              size={26}
              color={isLiked ? '#ed4956' : colors.text}
            />
          </TouchableOpacity>
          <TouchableOpacity style={{ padding: 2 }}>
            <IconSymbol name="bubble.right" size={24} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={{ padding: 2 }}>
            <IconSymbol name="paperplane" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => setIsBookmarked((prev) => !prev)}>
          <IconSymbol
            name={isBookmarked ? 'bookmark.fill' : 'bookmark'}
            size={24}
            color={colors.text}
          />
        </TouchableOpacity>
      </View>

      {/* Likes */}
      <Text style={{ fontWeight: '600', paddingHorizontal: 12, fontSize: 14, color: colors.text }}>
        {formattedLikes} likes · {engagementScore} engagement
      </Text>

      {/* Caption */}
      <View style={{ paddingHorizontal: 12, paddingTop: 4 }}>
        <Text style={{ fontSize: 14, lineHeight: 20, color: colors.text }}>
          <Text style={{ fontWeight: '600' }}>{item.user.username}</Text>{' '}
          {item.caption}
        </Text>
      </View>

      {/* Comments */}
      {item.comments > 0 && (
        <TouchableOpacity>
          <Text style={{ paddingHorizontal: 12, paddingTop: 4, fontSize: 14, color: colors.icon }}>
            View all {item.comments} comments
          </Text>
        </TouchableOpacity>
      )}

      {/* Timestamp */}
      <Text style={{ paddingHorizontal: 12, paddingTop: 4, paddingBottom: 8, fontSize: 12, color: colors.icon }}>
        {item.timestamp}
      </Text>
    </View>
  );
}

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingBottom: 10,
          borderBottomWidth: 0.5,
          paddingTop: insets.top,
          backgroundColor: colors.background,
          borderBottomColor: colors.icon + '30',
        }}
      >
        <Text style={{ fontSize: 24, fontWeight: '700', fontStyle: 'italic', color: colors.text }}>
          Instagram
        </Text>
        <View style={{ flexDirection: 'row', gap: 16 }}>
          <TouchableOpacity style={{ padding: 4 }}>
            <IconSymbol name="heart" size={26} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={{ padding: 4 }}>
            <IconSymbol name="paperplane" size={26} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Feed */}
      <FlatList
        data={MOCK_FEED}
        renderItem={({ item }: { item: FeedPost }) => <FeedItem item={item} colors={colors} />}
        keyExtractor={(item: FeedPost) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}
