import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { sendMessage } from "../services/chatbot/chatbot_service";

// Định nghĩa giao diện tin nhắn
interface Message {
  id: string;
  text: string;
  isUser: boolean; // true nếu là tin nhắn của người dùng, false nếu là tin nhắn của bot
}

export default function ChatbotScreen() {
  const router = useRouter();
  // Mảng lưu trữ các tin nhắn trong cuộc trò chuyện
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Xin chào! Tôi là chatbot trợ lý ảo. Tôi có thể giúp gì cho bạn?",
      isUser: false,
    },
  ]);
  // Lưu trữ nội dung tin nhắn đang nhập
  const [inputMessage, setInputMessage] = useState("");
  // Trạng thái đang tải khi gửi tin nhắn
  const [isLoading, setIsLoading] = useState(false);
  // Tham chiếu đến FlatList để điều khiển cuộn
  const flatListRef = useRef<FlatList>(null);

  // Cuộn xuống tin nhắn mới nhất
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (inputMessage.trim() === "") return;

    // Tạo tin nhắn của người dùng
    const userMessage = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true,
    };

    // Cập nhật danh sách tin nhắn với tin nhắn của người dùng
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      // Gửi tin nhắn đến API
      const response = await sendMessage(userMessage.text);

      // Nếu thành công, thêm phản hồi của bot vào danh sách tin nhắn
      if (response && response.code === 200) {
        const botResponse = {
          id: (Date.now() + 1).toString(),
          text: response.data,
          isUser: false,
        };
        setMessages((prevMessages) => [...prevMessages, botResponse]);
      } else {
        // Nếu lỗi, hiển thị thông báo lỗi
        const errorMessage = {
          id: (Date.now() + 1).toString(),
          text: "Xin lỗi, tôi đang gặp sự cố. Vui lòng thử lại sau.",
          isUser: false,
        };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      // Hiển thị lỗi kết nối
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        text: "Xin lỗi, tôi đang gặp sự cố kết nối. Vui lòng thử lại sau.",
        isUser: false,
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      {/* <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Trợ lý ảo</Text>
        <View style={styles.placeholder} />
      </View> */}

      {/* Danh sách tin nhắn trò chuyện */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        style={styles.messagesList}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageBubble,
              item.isUser ? styles.userBubble : styles.botBubble,
            ]}
          >
            <Text
              style={[
                styles.messageText,
                item.isUser ? styles.userText : styles.botText,
              ]}
            >
              {item.text}
            </Text>
          </View>
        )}
      />

      {/* Khu vực nhập tin nhắn */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.inputContainer}
      >
        <TextInput
          style={styles.input}
          placeholder="Nhập tin nhắn..."
          value={inputMessage}
          onChangeText={setInputMessage}
          autoCapitalize="none"
          multiline
        />
        {isLoading ? (
          <View style={styles.sendButton}>
            <ActivityIndicator size="small" color="#fff" />
          </View>
        ) : (
          <TouchableOpacity
            style={[
              styles.sendButton,
              !inputMessage.trim() && styles.disabledSendButton,
            ]}
            onPress={handleSendMessage}
            disabled={!inputMessage.trim()}
          >
            <Ionicons name="send" size={18} color="#fff" />
          </TouchableOpacity>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#26b9c8",
    paddingTop: 30,
    paddingHorizontal: 10,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  placeholder: {
    width: 34,
  },
  messagesList: {
    flex: 1,
    padding: 16,
  },
  messageBubble: {
    maxWidth: "80%",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 16,
    marginBottom: 10,
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#26b9c8",
    borderTopRightRadius: 4,
  },
  botBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    borderTopLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
  },
  userText: {
    color: "#fff",
  },
  botText: {
    color: "#333",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  input: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: "#26b9c8",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  disabledSendButton: {
    backgroundColor: "#bdbdbd",
  },
});
