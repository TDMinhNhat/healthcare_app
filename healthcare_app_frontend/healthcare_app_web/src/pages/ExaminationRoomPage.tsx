import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { LiveRole, ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useParams, useNavigate } from "react-router"; // Thêm useNavigate
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
import MedicalInformationIcon from "@mui/icons-material/MedicalInformation";
import DoneIcon from "@mui/icons-material/Done";
import { getAppointmentPatientDetail } from "./../services/appointment/booking_service";
import { ROUTING } from "../constants/routing";
// Import component MedicalRecordModal
import MedicalRecordModal from "../components/medical/MedicalRecordModal";

// Giao diện cho bệnh nhân trong hàng đợi

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
 * 5. Cuộc gọi video diễn ra giữa bác sĩ và bệnh nhân
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
  // Thêm navigate function
  const navigate = useNavigate();
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
  const [bookAppointment, setBookAppointment] = useState<object>();
  // Thêm trạng thái để theo dõi nếu phòng đã được khởi tạo
  const [isRoomInitialized, setIsRoomInitialized] = useState<boolean>(false);

  // Trạng thái cho bệnh nhân đang khám hiện tại
  const [currentPatient, setCurrentPatient] = useState<object | null>(null);
  // Trạng thái cho modal hồ sơ y tế
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<
    number | null
  >(null);
  // Thêm trạng thái cho bệnh nhân đã khám
  const [examinedPatients, setExaminedPatients] = useState<object[]>([]);

  // Kết nối socket cho giao tiếp thời gian thực
  const [socket, setSocket] = useState<Socket>(
    io("ws://localhost:8081", {
      path: "/chat",
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 10,
      autoConnect: false,
    })
  );

  // Khởi tạo kết nối socket với xử lý riêng cho bác sĩ và bệnh nhân
  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log("Kết nối socket thành công");
      if (isPatient) {
        const fetchAppointmentDetails = async () => {
          try {
            const res = await getAppointmentPatientDetail(userId, scheduleId);
            // console.log(res.data.data);
            setBookAppointment(res.data.data);

            // Emit socket event with the data we just received
            socket.emit("patientJoinRoom", {
              scheduleId,
              numericalOrder: res.data.data?.book_appointment?.numericalOrder,
              userId: userId,
              name: patientNameFromURL || userName,
            });
          } catch (error) {
            console.error("Error fetching appointment details:", error);
            // Emit socket event even if there's an error, just without numerical order
            socket.emit("patientJoinRoom", {
              scheduleId,
              numericalOrder: undefined,
              userId: userId,
              name: patientNameFromURL || userName,
            });
          }
        };
        fetchAppointmentDetails();

        // Lắng nghe sự kiện bác sĩ đã khám xong.
        socket.on("finishExamination", (data) => {
          console.log("Đã khám xong, chuyển về trang lịch hẹn");
          navigate(`${ROUTING.PATIENT}/${ROUTING.APPOINTMENTS}`);
        });

        // Lắng nghe sự kiện bác sĩ rời khỏi phòng khám
        socket.on("doctorLeaveRoom", () => {
          console.log("Bác sĩ đã rời khỏi phòng khám");
          navigate(`${ROUTING.PATIENT}/${ROUTING.APPOINTMENTS}`);
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
        setPatientQueue((prev) => {
          // Tìm vị trí của bệnh nhân trong hàng đợi
          const existingIndex = prev.findIndex(
            (patient) => patient.userId === data.userId
          );
          // Nếu đã tồn tại, thì cập nhật thông tin bệnh nhân
          if (existingIndex !== -1) {
            // Tạo bản sao mới của hàng đợi
            const updatedQueue = [...prev];
            // Cập nhật thông tin bệnh nhân
            updatedQueue[existingIndex] = data;
            return updatedQueue;
          } else {
            // Thêm bệnh nhân mới vào cuối hàng đợi
            return [...prev, data];
          }
        });
      });
    }

    socket.on("connect_error", (error) => {
      console.error("Lỗi kết nối socket:", error);
    });

    return () => {
      socket.disconnect();
    };
  }, [scheduleId, userId, isPatient, patientNameFromURL, userName, navigate]);

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
  const acceptPatient = (patient) => {
    // Đánh dấu bệnh nhân đã được tiếp nhận
    const updatedQueue = patientQueue.filter(
      (p) => p.userId !== patient.userId
    );
    setPatientQueue(updatedQueue);

    // Set current patient in examination
    setCurrentPatient(patient);

    // Set appointment ID for medical record
    // Vấn đề ở đây - cần đảm bảo chúng ta đang đặt một appointmentId hợp lệ
    // Nếu bệnh nhân có thuộc tính bookAppointmentId, sử dụng nó; nếu không thì dùng userId làm phương án dự phòng
    setSelectedAppointmentId(patient.bookAppointmentId || patient.userId);

    // Send notification to the patient with the room link
    if (socket) {
      const roomLink = generateRoomLink();
      socket.emit("acceptPatient", {
        patientId: patient.userId,
        scheduleId,
        roomLink,
        numericalOrder: patient.numericalOrder,
        patientName: patient.name, // Đảm bảo tên bệnh nhân (có số thứ tự) được gửi đi
      });
    }
  };

  // Open medical record modal
  const handleOpenMedicalRecord = () => {
    if (currentPatient) {
      // Đảm bảo chúng ta có một appointmentId hợp lệ trước khi mở modal
      if (!selectedAppointmentId && currentPatient.userId) {
        setSelectedAppointmentId(currentPatient.userId);
      }
      setIsModalOpen(true);
    }
  };

  // Remove patient from queue - Xóa bệnh nhân khỏi hàng đợi
  const removePatient = (id: number) => {
    const data = patientQueue.filter((patient) => patient.userId === id);
    setPatientQueue(patientQueue.filter((patient) => patient.userId !== id));

    // Gửi thông báo xóa bệnh nhân khỏi hàng đợi
    socket.emit("removeWaitingQueue", data[0]);
  };

  // xử lí hoàn thành khám bệnh, chuyển bệnh nhân vào danh sách đã khám
  const finishExamination = () => {
    if (currentPatient) {
      // Thêm bệnh nhân vào danh sách đã khám
      setExaminedPatients([
        ...examinedPatients,
        {
          ...currentPatient,
        },
      ]);

      socket.emit("finishExamination", {
        currentPatient,
      });

      // Clear current patient
      setCurrentPatient(null);

      // Close medical record if open
      if (isModalOpen) {
        setIsModalOpen(false);
      }
    }
  };

  // Cài đặt cuộc gọi Zego - Cập nhật để xử lý cho cả bác sĩ và bệnh nhân
  const myMeeting = useCallback(
    async (element) => {
      if (!element) return;
      // Tránh khởi tạo phòng nếu user out room
      if (isRoomInitialized) return;

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
          showLeavingView: false,
          onLeaveRoom() {
            if (isPatient) {
              navigate(`${ROUTING.PATIENT}/${ROUTING.APPOINTMENTS}`);
            } else {
              // bác sĩ rời phòng khám thì đóng luôn tab đang mở hiện tại
              window.close();
              // gửi sự kiện bác sĩ rời khỏi phòng khám
              socket.emit("doctorLeaveRoom", {
                scheduleId,
                doctorId: userId,
              });
            }
            console.log("You have left the room");
            socket.disconnect();
          },
          // bác sĩ xoá bệnh nhân ra khỏi phòng dợi
          onYouRemovedFromRoom() {
            console.log("You have been removed from the room");
            socket.disconnect();
            navigate(`${ROUTING.PATIENT}/${ROUTING.APPOINTMENTS}`);
          },
        });

        // Đánh dấu phòng đã được khởi tạo
        setIsRoomInitialized(true);
      } catch (error) {
        console.error("Error joining room:", error);
      }
    },
    [
      isPatient,
      patientNameFromURL,
      userName,
      userId,
      roomID,
      isRoomInitialized,
      socket,
      navigate, // Add navigate to dependency array
    ]
  );

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
          {/* Bệnh nhân đang khám hiện tại */}
          {currentPatient && (
            <>
              <Typography variant="h5" gutterBottom>
                Bệnh Nhân Đang Khám
              </Typography>
              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  mb: 3,
                  borderRadius: 1,
                  backgroundColor: "#f0f7ff",
                  border: "1px solid #b3d8ff",
                }}
              >
                <Typography
                  variant="subtitle1"
                  component="span"
                  sx={{ fontWeight: "bold", display: "block", mb: 1 }}
                >
                  {currentPatient.name}
                </Typography>
                <Chip
                  label="Đang khám"
                  color="primary"
                  variant="outlined"
                  size="small"
                  sx={{ mr: 1, mb: 1 }}
                />
                <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<MedicalInformationIcon fontSize="small" />}
                    onClick={handleOpenMedicalRecord}
                    sx={{ flex: 1, py: 0.5, fontSize: "0.8rem" }}
                  >
                    Hồ Sơ
                  </Button>
                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    startIcon={<DoneIcon fontSize="small" />}
                    onClick={finishExamination}
                    sx={{ flex: 1, py: 0.5, fontSize: "0.8rem" }}
                  >
                    Hoàn Tất
                  </Button>
                </Box>
              </Paper>
              <Divider sx={{ mb: 2 }} />
            </>
          )}

          <Typography variant="h5" gutterBottom>
            Hàng Đợi Bệnh Nhân
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {/* Danh sách bệnh nhân trong hàng đợi */}
          <Box>
            {patientQueue.length > 0 ? (
              patientQueue.map((patient, index) => (
                <Paper
                  key={index}
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
                      onClick={() => removePatient(patient.userId)}
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

          {/* Danh sách bệnh nhân đã khám */}
          {examinedPatients.length > 0 && (
            <>
              <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
                Đã Khám Xong
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box>
                {examinedPatients.map((patient, index) => (
                  <Paper
                    key={`examined-${index}`}
                    elevation={1}
                    sx={{
                      p: 2,
                      mb: 1,
                      borderRadius: 1,
                      backgroundColor: "#f5fff5",
                      border: "1px solid #c8e6c9",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      component="span"
                      sx={{ fontWeight: "bold", display: "block" }}
                    >
                      {patient.name}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Chip
                        label="Đã khám"
                        color="success"
                        variant="outlined"
                        size="small"
                      />
                    </Box>
                  </Paper>
                ))}
              </Box>
            </>
          )}

          {/* Modal hồ sơ y tế */}
          <MedicalRecordModal
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            appointmentId={selectedAppointmentId}
            isDoctor={true}
            roomId={roomID}
          />
        </Paper>
      )}
    </Box>
  );
}
