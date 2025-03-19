import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { LiveRole, ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useParams } from "react-router";
import { useSelector } from "react-redux";
import { APP_ID, SERVER_SECRET } from "../constants/zegocloud";
import { io, Socket } from "socket.io-client";
import {
  Box,
  Typography,
  Button,
  Paper,
  IconButton,
  Divider,
  Chip,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";

// Patient interface for queue - Giao diện cho bệnh nhân trong hàng đợi
interface Patient {
  id: number;
  name: string;
  status: string;
}

/**
 * Trang Phòng Khám dành cho bác sĩ và bệnh nhân
 *
 * Luồng hoạt động:
 * 1. Người dùng truy cập vào phòng khám (examination room) dựa trên scheduleId
 * 2. Vai trò được xác định qua tham số URL "role" (doctor hoặc patient)
 * 3. Đối với bác sĩ:
 *    - Hiển thị hàng đợi bệnh nhân bên phải màn hình
 *    - Có thể tiếp nhận bệnh nhân từ hàng đợi vào phòng khám
 *    - Gửi thông báo đến bệnh nhân thông qua socket.io khi được tiếp nhận
 * 4. Đối với bệnh nhân:
 *    - Hiển thị chỉ giao diện video call
 *    - Tham gia cuộc gọi theo link được bác sĩ cung cấp
 * 5. Cuộc gọi video diễn ra giữa bác sĩ và bệnh nhânư
 *
 * Dữ liệu đầu vào:
 * - scheduleId: ID của lịch hẹn (từ URL params)
 * - userId: ID của người dùng (từ Redux store)
 * - userName: Tên của người dùng (từ Redux store)
 * - role: Vai trò người dùng (từ URL query parameter)
 * - patientName: Tên hiển thị của bệnh nhân (từ URL query parameter, nếu là bệnh nhân)
 *
 * Kết quả:
 * - Hiển thị giao diện phòng khám với video call cho cả bác sĩ và bệnh nhân
 * - Chỉ bác sĩ thấy và quản lý được hàng đợi bệnh nhân
 * - Kết nối và liên lạc giữa bác sĩ và bệnh nhân qua socket.io
 *
 * Các tính năng chính:
 * - Video call sử dụng ZegoCloud
 * - Quản lý hàng đợi bệnh nhân
 * - Giao tiếp thời gian thực thông qua Socket.io
 * - Xử lý khác nhau theo vai trò người dùng
 */
export default function ExaminationRoomPage() {
  const { scheduleId } = useParams<{ scheduleId: string }>();
  // Thay đổi: kiểm tra role thay vì roomID
  const [searchParams] = React.useState(
    new URLSearchParams(window.location.search)
  );
  // Sử dụng scheduleId làm roomID cho Zego
  const roomID = scheduleId;

  const user = useSelector((state) => state.user?.user);
  const userId = user?.userId;
  const userName = user?.firstName + " " + user?.lastName;

  // Cập nhật: xác định vai trò người dùng từ tham số role
  const [isPatient, setIsPatient] = useState(
    searchParams.get("role") === "patient"
  );

  // Lấy tên hiển thị của bệnh nhân từ URL nếu có (bác sĩ thì không cần)
  const patientNameFromURL = searchParams.get("patientName");

  // State for patient queue - Trạng thái cho hàng đợi bệnh nhân
  const [patientQueue, setPatientQueue] = useState<object[]>([]);

  // Kết nối socket cho giao tiếp thời gian thực
  const [socket, setSocket] = useState<Socket>(io("ws://localhost:8081", {
    path: "/chat",
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 10,
    autoConnect: false,
  }));

  // Khởi tạo kết nối socket với xử lý riêng cho bác sĩ và bệnh nhân
  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log("Kết nối socket thành công");
      if (isPatient) {
        // Xử lý socket dành riêng cho bệnh nhân
        console.log("Bệnh nhân đã kết nối với socket:", socket.id);
        socket.emit("patientJoinRoom", {
          scheduleId,
          patientId: userId,
          patientName: patientNameFromURL || userName,
        });
      } else {
        // Xử lý socket dành riêng cho bác sĩ
        console.log("Bác sĩ đã kết nối với socket:", socket.id);
        socket.emit("doctorJoinRoom", {
          scheduleId,
          doctorId: userId,
        });

        // Chỉ bác sĩ mới cần yêu cầu danh sách hàng đợi bệnh nhân
        socket.emit("getPatientQueue", { scheduleId });
      }
    });

    // Chỉ thiết lập lắng nghe cập nhật hàng đợi cho bác sĩ
    if (!isPatient) {
      socket.on("patientQueueUpdate", (data) => {
        console.log("Nhận được cập nhật hàng đợi bệnh nhân:", data);
        setPatientQueue([...patientQueue, data]);
      });
    }

    // socketInstance.on("connect_error", (error) => {
    //   console.error("Lỗi kết nối socket:", error);
    // });

    // return () => {
    //   socketInstance.disconnect();
    // };
  }, [scheduleId, userId, isPatient, patientNameFromURL, userName]);

  // Tạo đường link phòng khám cho bệnh nhân sử dụng role thay vì roomID
  const generateRoomLink = () => {
    return (
      window.location.protocol +
      "//" +
      window.location.host +
      window.location.pathname +
      "?role=patient"
    );
  };

  // Accept patient into examination - Tiếp nhận bệnh nhân vào khám
  const acceptPatient = (patient: Patient) => {
    console.log(patient);
    // Đánh dấu bệnh nhân đã được tiếp nhận
    const updatedQueue = patientQueue.filter((p) => p.userId !== patient.userId);
    setPatientQueue(updatedQueue);

    // Send notification to the patient with the room link
    if (socket) {
      const roomLink = generateRoomLink();
      socket.emit("acceptPatient", {
        patientId: patient.userId,
        scheduleId,
        roomLink,
        patientName: patient.name, // Đảm bảo tên bệnh nhân (có số thứ tự) được gửi đi
      });
    }
  };

  // Remove patient from queue - Xóa bệnh nhân khỏi hàng đợi
  const removePatient = (id: number) => {
    const data = patientQueue.filter((patient) => patient.id === id);
    setPatientQueue(patientQueue.filter((patient) => patient.id !== id));

    // Gửi thông báo xóa bệnh nhân khỏi hàng đợi
    socket.emit("removeWaitingQueue", data[0]);
  };

  // Cài đặt cuộc gọi Zego - Cập nhật để xử lý cho cả bác sĩ và bệnh nhân
  const myMeeting = useCallback(async (element) => {
    if (!element) return;

    try {
      // Tạo Kit Token
      const appID = APP_ID;
      const serverSecret = SERVER_SECRET;

      // Xác định tên hiển thị - sử dụng tên có số thứ tự nếu là bệnh nhân
      const displayName =
        isPatient && patientNameFromURL ? patientNameFromURL : userName;

      console.log("Preparing to join room with:", {
        appID,
        roomID,
        userId,
        displayName,
      });

      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        roomID ?? "",
        userId,
        displayName
      );

      // Tạo đối tượng instance từ Kit Token
      const zp = ZegoUIKitPrebuilt.create(kitToken);
      if (!zp) {
        console.error("Failed to create ZegoUIKitPrebuilt instance");
        return;
      }

      // Bắt đầu cuộc gọi
      zp.joinRoom({
        container: element,
        sharedLinks: [
          {
            name: "Link phòng khám",
            url: generateRoomLink(),
          },
        ],
        scenario: {
          mode: ZegoUIKitPrebuilt.GroupCall,
        },
        showRemoveUserButton: !isPatient,
        showPreJoinView: false,
      });
    } catch (error) {
      console.error("Error joining room:", error);
    }
  }, []);

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* Phần khám bệnh trực tuyến */}
      <Box
        className="myCallContainer"
        ref={myMeeting}
        sx={{ width: isPatient ? "100%" : "70%", height: "100%" }}
      />

      {/* Phần hiển thị hàng đợi bệnh nhân - chỉ hiển thị cho bác sĩ */}
      {!isPatient && (
        <Paper
          elevation={0}
          sx={{
            width: "30%",
            p: 3,
            borderLeft: "1px solid #e0e0e0",
            overflowY: "auto",
          }}
        >
          <Typography variant="h5" gutterBottom>
            Hàng Đợi Bệnh Nhân
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {/* Danh sách bệnh nhân trong hàng đợi */}
          <Box>
            {patientQueue.length > 0 ? (
              patientQueue.map((patient) => (
                <Paper
                  key={patient.id}
                  elevation={1}
                  sx={{
                    p: 2,
                    mb: 1,
                    borderRadius: 1,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography
                      variant="subtitle1"
                      component="span"
                      sx={{ fontWeight: "bold", display: "block" }}
                    >
                      {patient.name}
                    </Typography>
                    <Chip
                      label="Đang chờ"
                      color="warning"
                      variant="outlined"
                      size="small"
                    />
                  </Box>
                  <Box>
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      onClick={() => acceptPatient(patient)}
                      startIcon={<CheckCircleIcon />}
                      title="Tiếp nhận bệnh nhân"
                      sx={{ mr: 1 }}
                    >
                      Tiếp nhận
                    </Button>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => removePatient(patient.id)}
                      title="Xóa khỏi hàng đợi"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Paper>
              ))
            ) : (
              <Typography color="text.secondary">
                Không có bệnh nhân trong hàng đợi
              </Typography>
            )}
          </Box>
        </Paper>
      )}
    </Box>
  );
}
