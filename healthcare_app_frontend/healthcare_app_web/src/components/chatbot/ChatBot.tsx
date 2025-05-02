import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  IconButton,
  Paper,
  Typography,
  TextField,
  Fab,
  Fade,
  List,
  ListItem,
  Divider,
  CircularProgress,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import { sendMessage } from "../../services/chatbot/chatbot_service";

// Định nghĩa interface cho tin nhắn
interface Message {
  text: string;
  isUser: boolean; // true nếu tin nhắn từ người dùng, false nếu từ chatbot
}

const ChatBot: React.FC = () => {
  // State quản lý trạng thái hiển thị của cửa sổ chat
  const [isOpen, setIsOpen] = useState(false);

  // State lưu trữ danh sách tin nhắn
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Xin chào! Tôi là chatbot trợ lý ảo. Tôi có thể giúp gì cho bạn?",
      isUser: false,
    },
  ]);

  // State lưu nội dung tin nhắn đang nhập
  const [currentMessage, setCurrentMessage] = useState("");

  // State hiển thị trạng thái đang tải
  const [isLoading, setIsLoading] = useState(false);

  // Ref để cuộn xuống tin nhắn mới nhất
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Hàm chuyển đổi trạng thái hiển thị cửa sổ chat
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  // Tự động cuộn xuống tin nhắn mới nhất khi có tin nhắn mới
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Xử lý gửi tin nhắn
  const handleSendMessage = async () => {
    // Nếu tin nhắn trống, không làm gì cả
    if (currentMessage.trim() === "") return;

    // Thêm tin nhắn của người dùng vào danh sách
    setMessages((prev) => [...prev, { text: currentMessage, isUser: true }]);
    const userMessage = currentMessage;
    setCurrentMessage(""); // Xóa nội dung đã nhập
    setIsLoading(true); // Hiển thị trạng thái đang tải

    try {
      // Gửi tin nhắn đến API
      const response = await sendMessage(userMessage);

      // Nếu gửi thành công, thêm phản hồi vào danh sách tin nhắn
      if (response && response.code === 200) {
        setMessages((prev) => [
          ...prev,
          { text: response.data, isUser: false },
        ]);
      } else {
        // Nếu có lỗi, hiển thị thông báo lỗi
        setMessages((prev) => [
          ...prev,
          {
            text: "Xin lỗi, tôi đang gặp sự cố. Vui lòng thử lại sau.",
            isUser: false,
          },
        ]);
      }
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn:", error);

      // Hiển thị thông báo lỗi kết nối
      setMessages((prev) => [
        ...prev,
        {
          text: "Xin lỗi, tôi đang gặp sự cố kết nối. Vui lòng thử lại sau.",
          isUser: false,
        },
      ]);
    } finally {
      setIsLoading(false); // Kết thúc trạng thái đang tải
    }
  };

  // Xử lý sự kiện nhấn phím Enter trong trường nhập liệu
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
      e.preventDefault(); // Ngăn chặn hành vi mặc định của phím Enter
    }
  };

  return (
    <Box sx={{ position: "fixed", bottom: 20, right: 20, zIndex: 1000 }}>
      {/* Nút hiển thị/ẩn cửa sổ chat */}
      <Fab
        color="primary"
        aria-label="chat"
        onClick={toggleChat}
        sx={{ boxShadow: 3 }}
      >
        {isOpen ? <CloseIcon /> : <ChatIcon />}
      </Fab>

      {/* Cửa sổ chat */}
      <Fade in={isOpen}>
        <Paper
          elevation={3}
          sx={{
            position: "absolute",
            bottom: 70,
            right: 0,
            width: 300,
            height: 400,
            display: isOpen ? "flex" : "none",
            flexDirection: "column",
            overflow: "hidden",
            borderRadius: 2,
          }}
        >
          {/* Phần tiêu đề cửa sổ chat */}
          <Box
            sx={{
              p: 1.5,
              backgroundColor: "primary.main",
              color: "white",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="subtitle1">Trợ lý ảo</Typography>
            <IconButton size="small" color="inherit" onClick={toggleChat}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* Phần hiển thị tin nhắn */}
          <Box
            sx={{
              flexGrow: 1,
              overflowY: "auto",
              p: 2,
              bgcolor: "#f5f5f5",
            }}
          >
            <List sx={{ p: 0 }}>
              {/* Hiển thị danh sách tin nhắn */}
              {messages.map((message, index) => (
                <ListItem
                  key={index}
                  sx={{
                    display: "flex",
                    justifyContent: message.isUser ? "flex-end" : "flex-start",
                    p: 0.5,
                  }}
                >
                  <Paper
                    elevation={1}
                    sx={{
                      p: 1,
                      maxWidth: "85%",
                      bgcolor: message.isUser ? "primary.light" : "white",
                      color: message.isUser ? "white" : "text.primary",
                      borderRadius: 1.5,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ wordBreak: "break-word" }}
                    >
                      {message.text}
                    </Typography>
                  </Paper>
                </ListItem>
              ))}

              {/* Hiển thị trạng thái đang tải */}
              {isLoading && (
                <ListItem
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    p: 0.5,
                  }}
                >
                  <Paper
                    elevation={1}
                    sx={{
                      p: 1,
                      bgcolor: "white",
                      borderRadius: 1.5,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <CircularProgress size={16} sx={{ mr: 1 }} />
                      <Typography variant="body2">...</Typography>
                    </Box>
                  </Paper>
                </ListItem>
              )}

              {/* Phần tử trống dùng để cuộn xuống tin nhắn mới nhất */}
              <div ref={messagesEndRef} />
            </List>
          </Box>

          <Divider />

          {/* Phần nhập tin nhắn */}
          <Box
            sx={{
              p: 1,
              display: "flex",
              alignItems: "center",
              bgcolor: "background.paper",
            }}
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
          >
            <TextField
              fullWidth
              size="small"
              placeholder="Nhập tin nhắn..."
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              variant="outlined"
              autoComplete="off"
              sx={{ mr: 1 }}
            />
            <IconButton
              color="primary"
              onClick={handleSendMessage}
              disabled={isLoading || currentMessage.trim() === ""}
              size="small"
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Paper>
      </Fade>
    </Box>
  );
};

export default ChatBot;
