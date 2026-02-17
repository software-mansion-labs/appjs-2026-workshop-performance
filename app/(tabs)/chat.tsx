import { useState, useCallback, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLLM, LLAMA3_2_1B_QLORA, Message } from "react-native-executorch";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function ChatScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");

  const llm = useLLM({ model: LLAMA3_2_1B_QLORA });

  const handleSend = useCallback(async () => {
    if (!inputText.trim() || llm.isGenerating) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: inputText.trim()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputText("");

    // Add placeholder for assistant message
    const assistantMessageId = (Date.now() + 1).toString();
    setMessages([...newMessages, { id: assistantMessageId, role: "assistant", content: "" }]);

    // Build chat history for the model
    const chat: Message[] = [
      { role: "system", content: "You are a helpful assistant. Keep your responses concise and friendly." },
      ...newMessages.map(msg => ({
        role: msg.role as "user" | "assistant",
        content: msg.content
      }))
    ];

    try {
      await llm.generate(chat);
    } catch (error) {
      console.error("Error generating response:", error);
    }
  }, [inputText, messages, llm]);

  // Update the last assistant message with streaming response
  const displayMessages = messages.map((msg, index) => {
    if (index === messages.length - 1 && msg.role === "assistant") {
      return { ...msg, content: llm.response || "..." };
    }
    return msg;
  });

  const renderMessage = useCallback(
    ({ item }: { item: ChatMessage }) => {
      const isUser = item.role === "user";
      return (
        <View
          style={[
            styles.messageBubble,
            isUser
              ? [styles.userBubble, { backgroundColor: colors.tint }]
              : [styles.assistantBubble, { backgroundColor: colors.icon + "30" }]
          ]}
        >
          <Text style={[styles.messageText, { color: isUser ? "#fff" : colors.text }]}>{item.content}</Text>
        </View>
      );
    },
    [colors]
  );

  const keyExtractor = useCallback((item: ChatMessage) => item.id, []);

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <IconSymbol name="message.fill" size={64} color={colors.icon} />
      <Text style={[styles.emptyTitle, { color: colors.text }]}>AI Chat</Text>
      <Text style={[styles.emptySubtext, { color: colors.icon }]}>
        {llm.isReady ? "Start a conversation with the AI" : "Loading AI model..."}
      </Text>
      {!llm.isReady && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.tint} />
          <Text style={[styles.loadingText, { color: colors.icon }]}>
            {Math.round(llm.downloadProgress * 100)}% downloaded
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0}
    >
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top,
            backgroundColor: colors.background,
            borderBottomColor: colors.icon + "30"
          }
        ]}
      >
        <Text style={[styles.headerTitle, { color: colors.text }]}>AI Chat</Text>
        {llm.isReady && (
          <View style={[styles.statusBadge, { backgroundColor: "#4CAF50" }]}>
            <Text style={styles.statusText}>Ready</Text>
          </View>
        )}
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={displayMessages}
        renderItem={renderMessage}
        keyExtractor={keyExtractor}
        contentContainerStyle={[styles.messagesContainer, messages.length === 0 && styles.emptyMessagesContainer]}
        ListEmptyComponent={renderEmptyState}
        onContentSizeChange={() => {
          if (messages.length > 0) {
            flatListRef.current?.scrollToEnd({ animated: true });
          }
        }}
      />

      {/* Input */}
      <View
        style={[
          styles.inputContainer,
          {
            paddingBottom: insets.bottom + 8,
            backgroundColor: colors.background,
            borderTopColor: colors.icon + "30"
          }
        ]}
      >
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.icon + "20",
              color: colors.text
            }
          ]}
          placeholder="Type a message..."
          placeholderTextColor={colors.icon}
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={1000}
          editable={llm.isReady && !llm.isGenerating}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            {
              backgroundColor: colors.tint,
              opacity: inputText.trim() && llm.isReady && !llm.isGenerating ? 1 : 0.5
            }
          ]}
          onPress={handleSend}
          disabled={!inputText.trim() || !llm.isReady || llm.isGenerating}
        >
          {llm.isGenerating ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <IconSymbol name="paperplane.fill" size={20} color="#fff" />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 0.5
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700"
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600"
  },
  messagesContainer: {
    padding: 16,
    flexGrow: 1
  },
  emptyMessagesContainer: {
    justifyContent: "center"
  },
  emptyContainer: {
    alignItems: "center",
    gap: 12
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600"
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: "center"
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8
  },
  loadingText: {
    fontSize: 14
  },
  messageBubble: {
    maxWidth: "80%",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    marginBottom: 8
  },
  userBubble: {
    alignSelf: "flex-end",
    borderBottomRightRadius: 4
  },
  assistantBubble: {
    alignSelf: "flex-start",
    borderBottomLeftRadius: 4
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 12,
    paddingTop: 8,
    borderTopWidth: 0.5,
    gap: 8
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center"
  }
});
