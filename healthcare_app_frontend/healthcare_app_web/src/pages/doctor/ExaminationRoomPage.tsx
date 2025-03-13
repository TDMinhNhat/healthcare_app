import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  TextField,
  Divider,
  Stack,
  IconButton,
} from "@mui/material";
import VideocamIcon from "@mui/icons-material/Videocam";
import ChatIcon from "@mui/icons-material/Chat";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router";

const ExaminationRoomPage: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Here you would initialize your video/chat services
    // and load patient data for this examination
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [roomId]);

  const handleBack = () => {
    navigate("/doctor/current-schedule");
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <IconButton onClick={handleBack}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" component="h1">
            Phòng khám trực tuyến: {roomId}
          </Typography>
        </Stack>
      </Paper>

      {loading ? (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography>Đang khởi tạo phòng khám trực tuyến...</Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2, height: "100%", minHeight: "400px" }}>
              <Typography variant="h6" gutterBottom>
                <VideocamIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                Cuộc gọi video
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box
                sx={{
                  bgcolor: "#000",
                  height: "400px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography color="white">
                  Khu vực video call sẽ hiển thị ở đây
                </Typography>
              </Box>
              <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                <Button variant="contained" color="primary">
                  Bật/Tắt camera
                </Button>
                <Button variant="contained" color="primary">
                  Bật/Tắt mic
                </Button>
                <Button variant="contained" color="error">
                  Kết thúc
                </Button>
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  <ChatIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                  Chat với bệnh nhân
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ height: "200px", overflowY: "auto", mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Nhắn tin với bệnh nhân tại đây...
                  </Typography>
                </Box>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Nhập tin nhắn..."
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <Button variant="contained" size="small">
                        Gửi
                      </Button>
                    ),
                  }}
                />
              </Paper>

              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  <AssignmentIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                  Ghi chú khám bệnh
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  placeholder="Nhập ghi chú khám bệnh tại đây..."
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
                <Button variant="contained" color="primary" fullWidth>
                  Lưu ghi chú
                </Button>
              </Paper>
            </Stack>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default ExaminationRoomPage;
