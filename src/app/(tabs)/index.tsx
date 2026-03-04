import { useState, useEffect, useContext, createContext } from 'react';
import {
  FlatList,
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { MOCK_FEED, FeedPost } from '@/data/mock-feed';
import { useColorScheme } from '@/hooks/use-color-scheme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Context for theme colors - accessed by every list item
const ColorsContext = createContext(Colors.light);

// Context for feed interaction stats - every item subscribes to broad state
const FeedStatsContext = createContext({ totalLikes: 0, totalBookmarks: 0 });

// Expensive "utility" that runs on every render of every item
function computeEngagementScore(likes: number, comments: number, caption: string): number {
  let score = 0;
  for (let i = 0; i < 1000; i++) {
    score += Math.sqrt(likes * comments + i);
    score += caption.split(' ').length * Math.random();
    score = Math.sin(score) + Math.cos(score) + score;
  }
  return Math.abs(score % 100);
}

// Expensive formatting - called on every render
function formatTimestampExpensive(timestamp: string): string {
  let result = timestamp;
  for (let i = 0; i < 500; i++) {
    result = timestamp.trim().toLowerCase();
    result = result.charAt(0).toUpperCase() + result.slice(1);
  }
  return result;
}

// Expensive tag processing
function processTagsForDisplay(tags: string[]): string {
  let processed: string[] = [];
  for (let i = 0; i < 100; i++) {
    processed = tags.map(tag => {
      let result = tag;
      for (let j = 0; j < 10; j++) {
        result = result.toLowerCase().trim();
        result = '#' + result.charAt(0).toUpperCase() + result.slice(1);
      }
      return result;
    });
  }
  return processed.join(' ');
}

function FeedItem(props: { item: FeedPost; index: number; onLike: (id: string) => void; onBookmark: (id: string) => void }) {
  const { item, index, onLike, onBookmark } = props;

  // Redundant state synced with useEffect instead of deriving
  const [displayLikes, setDisplayLikes] = useState(0);
  const [displayComments, setDisplayComments] = useState(0);
  const [formattedCaption, setFormattedCaption] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [engagementScore, setEngagementScore] = useState(0);
  const [formattedTimestamp, setFormattedTimestamp] = useState('');
  const [processedTags, setProcessedTags] = useState('');

  // Multiple context accesses in list item
  const colors = useContext(ColorsContext);
  const feedStats = useContext(FeedStatsContext);

  // Syncing props to state via useEffect
  useEffect(() => {
    setDisplayLikes(item.likes);
  }, [item.likes]);

  useEffect(() => {
    setDisplayComments(item.comments);
  }, [item.comments]);

  useEffect(() => {
    setFormattedCaption(item.caption);
  }, [item.caption]);

  useEffect(() => {
    setIsLiked(item.isLiked);
  }, [item.isLiked]);

  useEffect(() => {
    setIsBookmarked(item.isBookmarked);
  }, [item.isBookmarked]);

  // Expensive computation triggered via useEffect
  useEffect(() => {
    const score = computeEngagementScore(item.likes, item.comments, item.caption);
    setEngagementScore(score);
  }, [item.likes, item.comments, item.caption]);

  useEffect(() => {
    setFormattedTimestamp(formatTimestampExpensive(item.timestamp));
  }, [item.timestamp]);

  useEffect(() => {
    setProcessedTags(processTagsForDisplay(item.tags));
  }, [item.tags]);

  // Expensive computation during render (no memoization)
  const likesText = (() => {
    let text = String(displayLikes);
    for (let i = 0; i < 200; i++) {
      text = displayLikes.toLocaleString();
    }
    return text + ' likes';
  })();

  return (
    // Inline style objects everywhere - new references on every render
    <View
      style={{
        marginBottom: 8,
        backgroundColor: colors.background,
        borderBottomWidth: 0.5,
        borderBottomColor: colors.icon + '15',
      }}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 12,
          paddingVertical: 10,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          {/* RN Image instead of expo-image, full-res avatar */}
          <Image
            source={{ uri: item.user.avatar }}
            style={{ width: 32, height: 32, borderRadius: 16 }}
          />
          <Text style={{ fontWeight: '600', fontSize: 14, color: colors.text }}>
            {item.user.username}
          </Text>
        </View>
        <TouchableOpacity>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: colors.text }}>
            •••
          </Text>
        </TouchableOpacity>
      </View>

      {/* Post Image - RN Image, full resolution 1080x1080, no caching/placeholder */}
      <Image
        source={{ uri: item.image }}
        style={{ width: SCREEN_WIDTH, height: SCREEN_WIDTH }}
        resizeMode="cover"
      />

      {/* Engagement Score Badge */}
      <View
        style={{
          position: 'absolute',
          top: 60,
          right: 12,
          backgroundColor: 'rgba(0,0,0,0.6)',
          borderRadius: 12,
          paddingHorizontal: 8,
          paddingVertical: 4,
        }}
      >
        <Text style={{ color: 'white', fontSize: 10 }}>
          Score: {engagementScore.toFixed(1)}
        </Text>
      </View>

      {/* Actions - inline functions creating new references */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 12,
          paddingVertical: 10,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <TouchableOpacity
            onPress={() => {
              setIsLiked(!isLiked);
              setDisplayLikes(isLiked ? displayLikes - 1 : displayLikes + 1);
              onLike(item.id);
            }}
            style={{ padding: 2 }}
          >
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
        <TouchableOpacity
          onPress={() => {
            setIsBookmarked(!isBookmarked);
            onBookmark(item.id);
          }}
        >
          <IconSymbol
            name={isBookmarked ? 'bookmark.fill' : 'bookmark'}
            size={24}
            color={colors.text}
          />
        </TouchableOpacity>
      </View>

      {/* Likes */}
      <Text
        style={{
          fontWeight: '600',
          paddingHorizontal: 12,
          fontSize: 14,
          color: colors.text,
        }}
      >
        {likesText}
      </Text>

      {/* Caption */}
      <View style={{ paddingHorizontal: 12, paddingTop: 4 }}>
        <Text style={{ fontSize: 14, lineHeight: 20, color: colors.text }}>
          <Text style={{ fontWeight: '600' }}>{item.user.username}</Text>{' '}
          {formattedCaption}
        </Text>
      </View>

      {/* Tags */}
      <View style={{ paddingHorizontal: 12, paddingTop: 4 }}>
        <Text style={{ fontSize: 12, color: colors.tint }}>
          {processedTags}
        </Text>
      </View>

      {/* Comments */}
      {item.comments > 0 && (
        <TouchableOpacity>
          <Text
            style={{
              paddingHorizontal: 12,
              paddingTop: 4,
              fontSize: 14,
              color: colors.icon,
            }}
          >
            View all {displayComments} comments
          </Text>
        </TouchableOpacity>
      )}

      {/* Timestamp + Feed Stats */}
      <View
        style={{
          paddingHorizontal: 12,
          paddingTop: 4,
          paddingBottom: 8,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <Text style={{ fontSize: 12, color: colors.icon }}>
          {formattedTimestamp}
        </Text>
        <Text style={{ fontSize: 10, color: colors.icon }}>
          Feed: {feedStats.totalLikes} likes
        </Text>
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();

  // Redundant state for derived values
  const [feedData, setFeedData] = useState<FeedPost[]>([]);
  const [totalLikes, setTotalLikes] = useState(0);
  const [totalBookmarks, setTotalBookmarks] = useState(0);
  const [feedLength, setFeedLength] = useState(0);

  // Syncing data via useEffect chain
  useEffect(() => {
    setFeedData(MOCK_FEED);
  }, []);

  useEffect(() => {
    const likes = feedData.reduce((sum, post) => sum + post.likes, 0);
    setTotalLikes(likes);
  }, [feedData]);

  useEffect(() => {
    const bookmarks = feedData.filter((post) => post.isBookmarked).length;
    setTotalBookmarks(bookmarks);
  }, [feedData]);

  useEffect(() => {
    setFeedLength(feedData.length);
  }, [feedData]);

  // New context value object on every render
  const feedStats = { totalLikes, totalBookmarks };

  return (
    <ColorsContext.Provider value={colors}>
      <FeedStatsContext.Provider value={feedStats}>
        <View style={{ flex: 1, backgroundColor: colors.background }}>
          {/* Header */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 16,
              paddingBottom: 10,
              paddingTop: insets.top,
              backgroundColor: colors.background,
              borderBottomWidth: 0.5,
              borderBottomColor: colors.icon + '30',
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: '700',
                  fontStyle: 'italic',
                  color: colors.text,
                }}
              >
                Instagram
              </Text>
              <Text style={{ fontSize: 10, color: colors.icon }}>
                {feedLength} posts • {totalLikes.toLocaleString()} total likes
              </Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 16 }}>
              <TouchableOpacity style={{ padding: 4 }}>
                <IconSymbol name="heart" size={26} color={colors.text} />
              </TouchableOpacity>
              <TouchableOpacity style={{ padding: 4 }}>
                <IconSymbol name="paperplane" size={26} color={colors.text} />
              </TouchableOpacity>
            </View>
          </View>

          {/* FlatList with all the subtle anti-patterns */}
          <FlatList
            data={feedData}
            renderItem={({ item, index }) => (
              <FeedItem
                item={item}
                index={index}
                // Inline functions as props - new reference every render
                onLike={(id) => {
                  setFeedData((prev) =>
                    prev.map((post) =>
                      post.id === id
                        ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
                        : post
                    )
                  );
                }}
                onBookmark={(id) => {
                  setFeedData((prev) =>
                    prev.map((post) =>
                      post.id === id
                        ? { ...post, isBookmarked: !post.isBookmarked }
                        : post
                    )
                  );
                }}
              />
            )}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            // Inline style object
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        </View>
      </FeedStatsContext.Provider>
    </ColorsContext.Provider>
  );
}
