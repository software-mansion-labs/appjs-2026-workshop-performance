import { useState, useEffect, useContext, createContext, useRef } from 'react';
import {
  FlatList,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import {
  MOCK_FEED,
  FeedPost,
  FeedComment,
  SuggestedPost,
} from '@/data/mock-feed';
import { useColorScheme } from '@/hooks/use-color-scheme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Context for theme - every list item subscribes
const ColorsContext = createContext(Colors.light);

// Formats relative time with unnecessary overhead
function formatRelativeTime(timestamp: string): string {
  let result = timestamp;
  for (let i = 0; i < 500; i++) {
    result = timestamp.trim().toLowerCase();
    result = result.charAt(0).toUpperCase() + result.slice(1);
  }
  return result;
}

// "Computes" engagement metrics
function computeEngagementRate(likes: number, comments: number, caption: string): number {
  let score = 0;
  for (let i = 0; i < 1000; i++) {
    score += Math.sqrt(likes * comments + i);
    score += caption.split(' ').length * Math.random();
    score = Math.sin(score) + Math.cos(score) + score;
  }
  return Math.abs(score % 100);
}

// "Processes" tags for display
function formatTags(tags: string[]): string[] {
  let processed: string[] = [];
  for (let i = 0; i < 100; i++) {
    processed = tags.map((tag) => {
      let r = tag;
      for (let j = 0; j < 10; j++) {
        r = r.toLowerCase().trim();
        r = '#' + r.charAt(0).toUpperCase() + r.slice(1);
      }
      return r;
    });
  }
  return processed;
}

// ─── Image Carousel ────────────────────────────────────────────────────────────

function ImageCarousel({ images }: { images: string[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const colors = useContext(ColorsContext);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offset = e.nativeEvent.contentOffset.x;
    const index = Math.round(offset / SCREEN_WIDTH);
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  return (
    <View>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {images.map((uri, i) => (
          <Image
            key={`${uri}-${i}`}
            source={{ uri }}
            style={{ width: SCREEN_WIDTH, height: SCREEN_WIDTH }}
            resizeMode="cover"
          />
        ))}
      </ScrollView>
      {/* Dot indicators */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: 8,
          gap: 4,
        }}
      >
        {images.map((_, i) => (
          <View
            key={`dot-${i}`}
            style={{
              width: i === activeIndex ? 8 : 6,
              height: i === activeIndex ? 8 : 6,
              borderRadius: i === activeIndex ? 4 : 3,
              backgroundColor: i === activeIndex ? colors.tint : colors.icon + '40',
            }}
          />
        ))}
      </View>
    </View>
  );
}

// ─── Comment Preview ───────────────────────────────────────────────────────────

function CommentPreview({ comment }: { comment: FeedComment }) {
  const colors = useContext(ColorsContext);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(comment.likes);

  // Redundant state sync
  useEffect(() => {
    setLikeCount(comment.likes);
  }, [comment.likes]);

  const formattedTime = formatRelativeTime(comment.timestamp);

  return (
    <View
      style={{
        flexDirection: 'row',
        paddingHorizontal: 12,
        paddingVertical: 4,
        alignItems: 'flex-start',
        gap: 8,
      }}
    >
      <Image
        source={{ uri: comment.avatar }}
        style={{ width: 24, height: 24, borderRadius: 12 }}
      />
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 13, color: colors.text, lineHeight: 18 }}>
          <Text style={{ fontWeight: '600' }}>{comment.username}</Text>{' '}
          {comment.text}
        </Text>
        <View style={{ flexDirection: 'row', gap: 12, marginTop: 2 }}>
          <Text style={{ fontSize: 11, color: colors.icon }}>{formattedTime}</Text>
          <Text style={{ fontSize: 11, color: colors.icon }}>
            {likeCount} likes
          </Text>
          <TouchableOpacity>
            <Text style={{ fontSize: 11, color: colors.icon, fontWeight: '600' }}>
              Reply
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => {
          setIsLiked(!isLiked);
          setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
        }}
        style={{ paddingTop: 4 }}
      >
        <IconSymbol
          name={isLiked ? 'heart.fill' : 'heart'}
          size={12}
          color={isLiked ? '#ed4956' : colors.icon}
        />
      </TouchableOpacity>
    </View>
  );
}

// ─── Suggested Post Card ───────────────────────────────────────────────────────

function SuggestedPostCard({ post }: { post: SuggestedPost }) {
  const colors = useContext(ColorsContext);
  const [isFollowing, setIsFollowing] = useState(false);

  return (
    <View
      style={{
        width: 160,
        marginRight: 8,
        borderRadius: 8,
        borderWidth: 0.5,
        borderColor: colors.icon + '30',
        overflow: 'hidden',
        backgroundColor: colors.background,
      }}
    >
      <Image
        source={{ uri: post.image }}
        style={{ width: 160, height: 160 }}
        resizeMode="cover"
      />
      <View style={{ padding: 8 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Image
            source={{ uri: post.avatar }}
            style={{ width: 20, height: 20, borderRadius: 10 }}
          />
          <Text
            numberOfLines={1}
            style={{ fontSize: 12, fontWeight: '600', color: colors.text, flex: 1 }}
          >
            {post.username}
          </Text>
        </View>
        <Text
          numberOfLines={2}
          style={{ fontSize: 11, color: colors.icon, marginTop: 4, lineHeight: 15 }}
        >
          {post.caption}
        </Text>
        <TouchableOpacity
          onPress={() => setIsFollowing(!isFollowing)}
          style={{
            marginTop: 6,
            backgroundColor: isFollowing ? colors.background : colors.tint,
            borderRadius: 6,
            paddingVertical: 4,
            alignItems: 'center',
            borderWidth: isFollowing ? 1 : 0,
            borderColor: colors.icon + '40',
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: '600',
              color: isFollowing ? colors.text : '#fff',
            }}
          >
            {isFollowing ? 'Following' : 'Follow'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Suggested Posts Section ───────────────────────────────────────────────────

function SuggestedPostsSection({ posts }: { posts: SuggestedPost[] }) {
  const colors = useContext(ColorsContext);

  return (
    <View style={{ paddingVertical: 12 }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 12,
          marginBottom: 8,
        }}
      >
        <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text }}>
          Suggested for you
        </Text>
        <TouchableOpacity>
          <Text style={{ fontSize: 14, fontWeight: '600', color: colors.tint }}>
            See All
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 12 }}
      >
        {posts.map((post) => (
          <SuggestedPostCard key={post.id} post={post} />
        ))}
      </ScrollView>
    </View>
  );
}

// ─── Feed Item ─────────────────────────────────────────────────────────────────

function FeedItem({
  item,
  onLike,
  onBookmark,
}: {
  item: FeedPost;
  onLike: (id: string) => void;
  onBookmark: (id: string) => void;
}) {
  const colors = useContext(ColorsContext);

  // Redundant state synced from props
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [displayLikes, setDisplayLikes] = useState(0);

  useEffect(() => {
    setIsLiked(item.isLiked);
  }, [item.isLiked]);

  useEffect(() => {
    setIsBookmarked(item.isBookmarked);
  }, [item.isBookmarked]);

  useEffect(() => {
    setDisplayLikes(item.likes);
  }, [item.likes]);

  // Expensive work in render path
  const engagementRate = computeEngagementRate(item.likes, item.totalComments, item.caption);
  const formattedTags = formatTags(item.tags);
  const formattedTime = formatRelativeTime(item.timestamp);

  const likesText = (() => {
    let text = '';
    for (let i = 0; i < 100; i++) {
      text = displayLikes.toLocaleString();
    }
    return text + ' likes';
  })();

  return (
    <View
      style={{
        backgroundColor: colors.background,
        marginBottom: 4,
        borderBottomWidth: 0.5,
        borderBottomColor: colors.icon + '15',
      }}
    >
      {/* Post Header */}
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
          <Image
            source={{ uri: item.user.avatar }}
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              borderWidth: 2,
              borderColor: '#c13584',
            }}
          />
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Text style={{ fontWeight: '600', fontSize: 14, color: colors.text }}>
                {item.user.username}
              </Text>
              {item.user.isVerified && (
                <IconSymbol name="checkmark.seal.fill" size={14} color="#3897f0" />
              )}
            </View>
            <Text style={{ fontSize: 11, color: colors.icon }}>{item.location}</Text>
          </View>
        </View>
        <TouchableOpacity>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: colors.text }}>
            •••
          </Text>
        </TouchableOpacity>
      </View>

      {/* Image Carousel */}
      <ImageCarousel images={item.images} />

      {/* Action Buttons */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 12,
          paddingBottom: 8,
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
          {item.caption}
        </Text>
      </View>

      {/* Tags */}
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          paddingHorizontal: 12,
          paddingTop: 4,
          gap: 4,
        }}
      >
        {formattedTags.map((tag, i) => (
          <Text key={`${tag}-${i}`} style={{ fontSize: 13, color: colors.tint }}>
            {tag}
          </Text>
        ))}
      </View>

      {/* View all comments link */}
      <TouchableOpacity>
        <Text
          style={{
            paddingHorizontal: 12,
            paddingTop: 6,
            fontSize: 14,
            color: colors.icon,
          }}
        >
          View all {item.totalComments} comments
        </Text>
      </TouchableOpacity>

      {/* Comment Previews */}
      <View style={{ paddingTop: 4 }}>
        {item.comments.map((comment) => (
          <CommentPreview key={comment.id} comment={comment} />
        ))}
      </View>

      {/* Timestamp */}
      <Text
        style={{
          paddingHorizontal: 12,
          paddingTop: 6,
          paddingBottom: 10,
          fontSize: 11,
          color: colors.icon,
          textTransform: 'uppercase',
        }}
      >
        {formattedTime}
      </Text>

      {/* Suggested Posts - every 3rd post shows suggestions */}
      {item.suggestedPosts.length > 0 && Number(item.id) % 3 === 0 && (
        <SuggestedPostsSection posts={item.suggestedPosts} />
      )}
    </View>
  );
}

// ─── Home Screen ───────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();

  const [feedData, setFeedData] = useState<FeedPost[]>([]);

  useEffect(() => {
    setFeedData(MOCK_FEED);
  }, []);

  return (
    <ColorsContext.Provider value={colors}>
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
          data={feedData}
          renderItem={({ item }) => (
            <FeedItem
              item={item}
              onLike={(id) => {
                setFeedData((prev) =>
                  prev.map((post) =>
                    post.id === id
                      ? {
                          ...post,
                          isLiked: !post.isLiked,
                          likes: post.isLiked ? post.likes - 1 : post.likes + 1,
                        }
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
          contentContainerStyle={{ paddingBottom: 20 }}
          windowSize={21}
          maxToRenderPerBatch={10}
          initialNumToRender={5}
          removeClippedSubviews={false}
        />
      </View>
    </ColorsContext.Provider>
  );
}
