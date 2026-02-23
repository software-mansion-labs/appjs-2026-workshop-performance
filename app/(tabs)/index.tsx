import { useState, useCallback } from 'react';
import {
  StyleSheet,
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

  const handleLike = useCallback(() => {
    setIsLiked((prev) => {
      setLikesCount((count) => (prev ? count - 1 : count + 1));
      return !prev;
    });
  }, []);

  const handleBookmark = useCallback(() => {
    setIsBookmarked((prev) => !prev);
  }, []);

  return (
    <View style={[styles.postContainer, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.postHeader}>
        <View style={styles.userInfo}>
          <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
          <Text style={[styles.username, { color: colors.text }]}>
            {item.user.username}
          </Text>
        </View>
        <TouchableOpacity>
          <Text style={[styles.moreButton, { color: colors.text }]}>•••</Text>
        </TouchableOpacity>
      </View>

      {/* Image */}
      <Image
        source={{ uri: item.image }}
        style={styles.postImage}
        resizeMode="cover"
      />

      {/* Actions */}
      <View style={styles.actionsContainer}>
        <View style={styles.leftActions}>
          <TouchableOpacity onPress={handleLike} style={styles.actionButton}>
            <IconSymbol
              name={isLiked ? 'heart.fill' : 'heart'}
              size={26}
              color={isLiked ? '#ed4956' : colors.text}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <IconSymbol name="bubble.right" size={24} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <IconSymbol name="paperplane" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={handleBookmark}>
          <IconSymbol
            name={isBookmarked ? 'bookmark.fill' : 'bookmark'}
            size={24}
            color={colors.text}
          />
        </TouchableOpacity>
      </View>

      {/* Likes */}
      <Text style={[styles.likesCount, { color: colors.text }]}>
        {formattedLikes} likes · {engagementScore} engagement
      </Text>

      {/* Caption */}
      <View style={styles.captionContainer}>
        <Text style={[styles.caption, { color: colors.text }]}>
          <Text style={styles.captionUsername}>{item.user.username}</Text>{' '}
          {item.caption}
        </Text>
      </View>

      {/* Comments */}
      {item.comments > 0 && (
        <TouchableOpacity>
          <Text style={[styles.viewComments, { color: colors.icon }]}>
            View all {item.comments} comments
          </Text>
        </TouchableOpacity>
      )}

      {/* Timestamp */}
      <Text style={[styles.timestamp, { color: colors.icon }]}>
        {item.timestamp}
      </Text>
    </View>
  );
}

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();

  const renderItem = useCallback(
    ({ item }: { item: FeedPost }) => <FeedItem item={item} colors={colors} />,
    [colors]
  );

  const keyExtractor = useCallback((item: FeedPost) => item.id, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top,
            backgroundColor: colors.background,
            borderBottomColor: colors.icon + '30',
          },
        ]}
      >
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Instagram
        </Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerActionButton}>
            <IconSymbol name="heart" size={26} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerActionButton}>
            <IconSymbol name="paperplane" size={26} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Feed */}
      <FlatList
        data={MOCK_FEED}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.feedContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 0.5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    fontStyle: 'italic',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 16,
  },
  headerActionButton: {
    padding: 4,
  },
  feedContainer: {
    paddingBottom: 20,
  },
  postContainer: {
    marginBottom: 8,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  username: {
    fontWeight: '600',
    fontSize: 14,
  },
  moreButton: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  postImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  actionButton: {
    padding: 2,
  },
  likesCount: {
    fontWeight: '600',
    paddingHorizontal: 12,
    fontSize: 14,
  },
  captionContainer: {
    paddingHorizontal: 12,
    paddingTop: 4,
  },
  caption: {
    fontSize: 14,
    lineHeight: 20,
  },
  captionUsername: {
    fontWeight: '600',
  },
  viewComments: {
    paddingHorizontal: 12,
    paddingTop: 4,
    fontSize: 14,
  },
  timestamp: {
    paddingHorizontal: 12,
    paddingTop: 4,
    paddingBottom: 8,
    fontSize: 12,
  },
});
