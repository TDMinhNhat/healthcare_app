import {
  Box,
  Typography,
  Container,
  Paper,
  Divider,
  Avatar,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router";
import { useEffect, useLayoutEffect, useState } from "react";
import PersonIcon from "@mui/icons-material/Person";
import { ROUTING } from "../../constants/routing";
import { io, Socket } from "socket.io-client";
import { da } from "date-fns/locale";

/**
 * Trang Phòng Chờ Khám Bệnh dành cho bệnh nhân
 *
 * Luồng hoạt động:
 * 1. Hiển thị giao diện phòng chờ cho bệnh nhân với thông tin số thứ tự
 * 2. Kết nối với server qua socket.io để nhận cập nhật thời gian thực về hàng đợi
 * 3. Tự động cập nhật số thứ tự người đang được khám
 * 4. Khi đến lượt bệnh nhân, được bác sĩ chấp nhận và tự động chuyển hướng đến phòng khám
 *    với số thứ tự kèm theo trong tên người dùng
 *
 * Dữ liệu đầu vào:
 * - scheduleId: ID của lịch hẹn (từ URL params)
 * - doctorName: Tên bác sĩ (từ location state)
 * - numericalOrder: Số thứ tự của bệnh nhân (từ location state)
 * - userId: ID người dùng (từ Redux store)
 *
 * Kết quả:
 * - Hiển thị trạng thái chờ khám cho bệnh nhân
 * - Cập nhật số thứ tự đang được khám theo thời gian thực
 * - Khi được bác sĩ tiếp nhận, chuyển hướng đến phòng khám thông qua đường link có số thứ tự
 *
 * Hướng dẫn kiểm thử:
 * - Trang sử dụng kết nối socket.io để nhận thông báo thời gian thực
 * - Nếu kết nối socket thất bại, sẽ chuyển sang chế độ mô phỏng (simulateQueueUpdate)
 * - Trong chế độ mô phỏng, số thứ tự sẽ tự động tăng mỗi 10s và chuyển hướng khi đến lượt
 */
export default function WaitingRoomPage() {
  const user = useSelector((state: any) => state.user.user);
  const userId = user.userId;
  const { scheduleId } = useParams<{ scheduleId: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const { appointmentId, dateAppointment, doctorName, numericalOrder } =
    location.state as {
      appointmentId: string;
      dateAppointment: string;
      doctorName: string;
      numericalOrder: number;
    };

  // Các trạng thái cho phòng chờ
  const [currentExamNumber, setCurrentExamNumber] = useState<number>(0); // Số thứ tự đang được khám
  const [loading, setLoading] = useState<boolean>(true); // Đang tải dữ liệu

  // Dùng socket như state để tránh việc mất kết nối khi component re-render
  // Hoặc tránh tạo kết nối mới mỗi khi component re-render
  const [socket, setSocket] = useState<Socket>(
    io(`wss://${import.meta.env.VITE_HOST}`, {
      path: "/chat",
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 10,
      autoConnect: false,
    })
  );

  // State for dialog control
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [roomLinkData, setRoomLinkData] = useState<string>("");

  // Handle joining the room
  const handleJoinRoom = () => {
    window.open(roomLinkData, "_blank");
    navigate(`${ROUTING.PATIENT}`);
    setDialogOpen(false);
  };

  // Handle dialog close without joining
  const handleClose = () => {
    setDialogOpen(false);
    navigate(`${ROUTING.PATIENT}`);
  };

  // Handle canceling participation in the waiting queue
  const handleCancelParticipation = () => {
    // Emit event to notify server that patient is canceling
    socket.emit("cancelWaitingQueue", {
      scheduleId,
      userId: userId,
      numericalOrder: numericalOrder,
      name: `${numericalOrder}_${user.firstName} ${user.lastName}`,
      doctorName: doctorName,
      dateAppointment: dateAppointment,
      appointmentId: appointmentId,
    });
    socket.disconnect();
    setDialogOpen(false);
    // Navigate back to patient dashboard
    navigate(`${ROUTING.PATIENT}`);
  };

  useEffect(() => {
    socket.connect();
    // Khi kết nối thành công
    socket.on("connect", () => {
      console.log("Socket connected to the server");
      console.log(
        "param",
        dateAppointment,
        doctorName,
        appointmentId,
        scheduleId
      );

      // Gửi thông báo tham gia hàng đợi với số thứ tự trong tên
      socket.emit("joinWaitingQueue", {
        scheduleId,
        userId: userId,
        numericalOrder: numericalOrder,
        name: `${numericalOrder}_${user.firstName} ${user.lastName}`,
        doctorName: doctorName,
        dateAppointment: dateAppointment,
        appointmentId: appointmentId,
      });
      setLoading(false);
    });

    // Lắng nghe sự kiện khi bác sĩ vào phòng đợi
    socket.on("doctorJoined", (data) => {
      console.log("Doctor joined the waiting room:", data);
      // Gửi lại thông tin của bệnh nhân để bác sĩ nhận được ngay lập tức
      socket.emit("joinWaitingQueue", {
        scheduleId,
        userId: userId,
        numericalOrder: numericalOrder,
        name: `${numericalOrder}_${user.firstName} ${user.lastName}`,
        doctorName: doctorName,
        dateAppointment: dateAppointment,
        appointmentId: appointmentId,
      });
    });

    // Lắng nghe sự kiện cập nhật số thứ tự hiện tại
    socket.on("queueUpdate", (data) => {
      console.log(data);
      setLoading(false);
      setCurrentExamNumber(data.numericalOrder ?? currentExamNumber);
    });

    // Lắng nghe sự kiện khi bác sĩ chấp nhận bệnh nhân này
    socket.on("patientAccepted", (data) => {
      if (data.patientId === userId) {
        setLoading(false);
        console.log(
          "You've been accepted by the doctor. Joining examination room..."
        );

        // Thêm số thứ tự vào URL khi chuyển hướng
        const roomLink = new URL(data.roomLink);
        roomLink.searchParams.append(
          "patientName",
          `${numericalOrder}_${user.firstName} ${user.lastName}`
        );
        roomLink.searchParams.append("userId", user.userId);
        const link = roomLink.toString();
        console.log("Link to the room:", link);

        // Lưu link và mở dialog thay vì dùng alert
        setRoomLinkData(link);
        setDialogOpen(true);
      }
    });

    // Lắng nghe sự kiện khi bị bác sĩ xoá khỏi phòng chờ
    socket.on("removePatient", (data) => {
      if (data.userId === userId) {
        setLoading(false);
        navigate(`${ROUTING.PATIENT}`);
        // navigate(`${ROUTING.PATIENT}/${ROUTING.PATIENT_APPOINTMENT}`);
        // window.close();
        // socket.disconnect();
      }
    });

    // Xử lý lỗi kết nối
    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      setLoading(false);
    });

    // Cleanup function
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 2 }}>
        <Typography variant="h4" gutterBottom>
          Phòng Chờ Khám Bệnh
        </Typography>
        <Typography variant="subtitle1">
          {doctorName ? `Cuộc hẹn với Bác sĩ ${doctorName}` : "Đang chờ bác sĩ"}
        </Typography>
      </Box>

      <Paper
        elevation={3}
        sx={{
          p: 4,
          textAlign: "center",
          maxWidth: 600,
          mx: "auto",
          bgcolor: "background.paper",
        }}
      >
        {loading ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              my: 4,
            }}
          >
            <CircularProgress />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Đang tải thông tin hàng đợi...
            </Typography>
          </Box>
        ) : (
          <>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                mx: "auto",
                mb: 2,
                bgcolor: "primary.main",
              }}
            >
              <PersonIcon sx={{ fontSize: 50 }} />
            </Avatar>

            <Typography variant="h5" gutterBottom>
              Vui lòng chờ đến lượt của bạn
            </Typography>

            <Box sx={{ my: 3 }}>
              <Typography variant="body1" color="text.secondary">
                Bác sĩ sẽ gặp bạn sớm. Vui lòng ở lại trang này.
              </Typography>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
            >
              <Typography variant="subtitle1">Số thứ tự của bạn:</Typography>
              <Typography variant="h6" color="primary.main" fontWeight="bold">
                {numericalOrder}
              </Typography>
            </Box>

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
            >
              <Typography variant="subtitle1">
                Số thứ tự đang được khám:
              </Typography>
              <Typography variant="h6" color="text.primary" fontWeight="bold">
                {currentExamNumber}
              </Typography>
            </Box>

            {/* Thêm nút huỷ tham gia hàng chờ */}
            <Box sx={{ mt: 4 }}>
              <Button
                variant="outlined"
                color="error"
                onClick={handleCancelParticipation}
                fullWidth
              >
                Huỷ tham gia hàng chờ
              </Button>
            </Box>
          </>
        )}
      </Paper>

      {/* Dialog xác nhận tham gia phòng khám */}
      <Dialog
        open={dialogOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Thông báo từ phòng khám"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bác sĩ đã sẵn sàng để khám cho bạn. Bạn sẽ được chuyển đến phòng
            khám ngay bây giờ.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleJoinRoom} color="primary" autoFocus>
            Tham gia ngay
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
