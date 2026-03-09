import { useState, useEffect, useContext } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { ColorsContext } from '@/context/colors-context';
import { FeedComment } from '@/data/mock-feed';
import { formatRelativeTime } from '@/utils/feed-utils';

export function CommentPreview({ comment }: { comment: FeedComment }) {
  const colors = useContext(ColorsContext);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(comment.likes);

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
          <Text style={{ fontSize: 11, color: colors.icon }}>
            {formattedTime}
          </Text>
          <Text style={{ fontSize: 11, color: colors.icon }}>
            {likeCount} likes
          </Text>
          <TouchableOpacity>
            <Text
              style={{ fontSize: 11, color: colors.icon, fontWeight: '600' }}
            >
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
