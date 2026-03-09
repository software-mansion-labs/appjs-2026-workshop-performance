import { useState, useEffect } from 'react';
import { FlatList, View, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FeedItem } from '@/components/feed/feed-item';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { ColorsContext } from '@/context/colors-context';
import { MOCK_FEED, FeedPost } from '@/data/mock-feed';
import { useColorScheme } from '@/hooks/use-color-scheme';

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
                          likes: post.isLiked
                            ? post.likes - 1
                            : post.likes + 1,
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
