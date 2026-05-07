import { forwardRef, useCallback, useMemo, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image } from "react-native";

import { Colors } from "@/constants/theme";
import { FeedComment } from "@/data/mock-feed";
import { buildMentionSuggestions } from "@/utils/mention-utils";

function MentionSuggestions({
  suggestions,
  colors,
  onSelect
}: {
  suggestions: { username: string; relevance: number }[];
  colors: typeof Colors.light;
  onSelect: (username: string) => void;
}) {
  // Run expensive work synchronously for each chip during this
  // component's render — this blocks the JS thread.
  const chips = suggestions.slice(0, 8).map(item => {
    const displayName = item.username;
    return { ...item, displayName };
  });

  return (
    <View
      style={{
        borderTopWidth: 0.5,
        borderTopColor: colors.icon + "30",
        backgroundColor: colors.background,
        paddingVertical: 8,
        paddingHorizontal: 12
      }}
    >
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {chips.map(item => (
          <TouchableOpacity
            key={item.username}
            onPress={() => onSelect(item.username)}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 6,
              backgroundColor: colors.icon + "15",
              borderRadius: 16,
              marginRight: 8
            }}
          >
            <Text
              style={{
                fontSize: 13,
                fontWeight: "600",
                color: colors.text
              }}
            >
              @{item.displayName}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

interface CommentInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  placeholder: string;
  colors: typeof Colors.light;
  comments: FeedComment[];
  bottomInset: number;
  showTopBorder: boolean;
}

/**
 * A comment input with a horizontal mention-suggestion bar that appears
 * when the user is typing an @mention.
 */
const CommentInput = forwardRef<TextInput, CommentInputProps>(function CommentInput(
  { value, onChangeText, onSubmit, placeholder, colors, comments, bottomInset, showTopBorder },
  ref
) {

  // Use immediate value to decide whether to SHOW suggestions (so
  // the bar appears/disappears instantly), but the deferred value
  // to compute WHICH suggestions (so the heavy chips lag behind).
  const isTypingMention = value.match(/@(\w*)$/) !== null;

  // Expensive: scans 200 posts, flattens nested comments, builds user
  // profiles, runs Levenshtein distance for each word pair. Uses the
  // deferred value so typing is never blocked by this computation.
  const mentionSuggestions = useMemo(() => buildMentionSuggestions(comments, value), [comments, value]);

  const showSuggestions = isTypingMention && mentionSuggestions.length > 0;

  const handleSelectMention = useCallback(
    (username: string) => {
      const atIndex = value.lastIndexOf("@");
      const before = value.slice(0, atIndex);
      onChangeText(`${before}@${username} `);
    },
    [value, onChangeText]
  );

  return (
    <View>
      {/* Mention suggestions bar — each chip is artificially heavy */}
      {showSuggestions && (
        <MentionSuggestions suggestions={mentionSuggestions} colors={colors} onSelect={handleSelectMention} />
      )}

      {/* Input row */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 12,
          paddingVertical: 10,
          borderTopWidth: showTopBorder ? 0.5 : 0,
          borderTopColor: colors.border,
          backgroundColor: colors.background,
          paddingBottom: bottomInset + 10
        }}
      >
        <Image
          source={{ uri: "https://i.pravatar.cc/150?img=68" }}
          style={{ width: 32, height: 32, borderRadius: 16 }}
        />

        <TextInput
          ref={ref}
          style={{
            flex: 1,
            marginHorizontal: 12,
            paddingVertical: 8,
            paddingHorizontal: 12,
            backgroundColor: colors.icon + "15",
            borderRadius: 20,
            color: colors.text,
            fontSize: 14
          }}
          placeholder={placeholder}
          placeholderTextColor={colors.icon}
          value={value}
          onChangeText={onChangeText}
          multiline
          maxLength={500}
        />

        <TouchableOpacity onPress={onSubmit} disabled={!value.trim()}>
          <Text
            style={{
              color: value.trim() ? "#271c2d" : colors.icon,
              fontWeight: "600",
              fontSize: 14
            }}
          >
            Post
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

export { CommentInput };
