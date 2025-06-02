import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { LiveRole, ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useParams, useNavigate } from "react-router"; // Thêm useNavigate
import { useSelector } from "react-redux";
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
import {
  getAppointmentPatientDetail,
  getPatientDoneInWorkSchedule,
} from "./../services/appointment/booking_service";
import { ROUTING } from "../constants/routing";
import MedicalRecordModal from "../components/medical/MedicalRecordModal";
import { set } from "date-fns";

// Giao diện cho bệnh nhân trong hàng đợi
interface PatientQueueItem {
  userId: string;
  name: string;
  appointmentId?: number;
  numericalOrder?: number;
  doctorName?: string;
  dateAppointment?: string;
  bookAppointmentId?: number;
}

// Thêm interface cho bệnh nhân đã khám xong
interface DonePatientItem {
  patient: {
    userId: string;
    firstName: string;
    lastName: string;
  };
  bookAppointment: {
    id: number;
    numericalOrder: number;
    status: string;
  };
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
  // Lấy tên hiển thị của bệnh nhân từ URL nếu có (bác sĩ thì không cần)
  const patientNameFromURL = searchParams.get("patientName");
  const userIdFromURL = searchParams.get("userId");

  // Sử dụng scheduleId làm roomID cho Zego
  const roomID = scheduleId;

  const user = useSelector((state) => state.user?.user);
  const userId = user?.userId || userIdFromURL; // Lấy userId từ Redux store hoặc từ URL nếu có
  const userName =
    user?.firstName + " " + user?.lastName ||
    patientNameFromURL ||
    "Người dùng";

  // Cập nhật: xác định vai trò người dùng từ tham số role
  const [isPatient, setIsPatient] = useState(
    searchParams.get("role") === "patient"
  );

  // State cho hàng đợi bệnh nhân
  const [patientQueue, setPatientQueue] = useState<PatientQueueItem[]>([]);
  const [bookAppointment, setBookAppointment] = useState<object>();
  // Thêm trạng thái để theo dõi nếu phòng đã được khởi tạo
  const [isRoomInitialized, setIsRoomInitialized] = useState<boolean>(false);

  // Trạng thái cho bệnh nhân đang khám hiện tại. hiển thị UI bệnh nhân đang khám
  const [currentPatient, setCurrentPatient] = useState<PatientQueueItem | null>(
    null
  );
  // Để sử dụng cho callback onUserJoin
  // Để đồng bộ giữa việc bệnh nhân vào phòng và hiển thị UI.
  const [isShowCurrentPatient, setIsShowCurrentPatient] = useState(false);
  // Trạng thái cho modal hồ sơ y tế
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<
    number | null
  >(null);
  // Trạng thái cho danh sách bệnh nhân đã khám xong
  const [examinedPatients, setExaminedPatients] = useState<PatientQueueItem[]>(
    []
  );
  // Thêm state cho danh sách bệnh nhân đã khám từ API
  const [donePatients, setDonePatients] = useState<DonePatientItem[]>([]);

  // Kết nối socket cho giao tiếp thời gian thực
  const [socket, setSocket] = useState<Socket>(
    io(`wss://${import.meta.env.VITE_HOST}`, {
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
            console.log("appointment detail", res.data.data);
            setBookAppointment(res.data.data);

            // Emit socket event with the data we just received
            socket.emit("patientJoinRoom", {
              scheduleId,
              numericalOrder: res.data.data?.book_appointment?.numericalOrder,
              userId: userId,
              name: patientNameFromURL || userName,
              doctorName:
                res.data.data?.work_schedule?.doctor?.firstName +
                " " +
                res.data.data?.work_schedule?.doctor?.lastName,
              dateAppointment: res.data.data?.work_schedule?.dateAppointment,
            });
          } catch (error) {
            console.error("Error fetching appointment details:", error);
            // Emit socket event even if there's an error, just without numerical order
            // socket.emit("patientJoinRoom", {
            //   scheduleId,
            //   numericalOrder: undefined,
            //   userId: userId,
            //   name: patientNameFromURL || userName,
            // });
          }
        };
        fetchAppointmentDetails();

        socket.on("patientDone", (data) => {
          console.log("Bác sĩ đã hoàn tất khám bệnh:", data);

          // Solution 2: Try delayed disconnect and close
          // socket.disconnect();
          // window.close();
        });

        // Lắng nghe sự kiện bác sĩ rời khỏi phòng khám
        // socket.on("doctorLeaveRoom", () => {
        //   console.log("Bác sĩ đã rời khỏi phòng khám");
        //   navigate(`${ROUTING.PATIENT}/${ROUTING.APPOINTMENTS}`);
        // });
      } else {
        // Xử lý socket dành riêng cho bác sĩ
        console.log("Bác sĩ đã kết nối với socket:", socket.id);
        socket.emit("doctorJoinRoom", {
          scheduleId,
          doctorId: userId,
        });

        // Chỉ bác sĩ mới cần yêu cầu danh sách hàng đợi bệnh nhân
        socket.emit("getPatientQueue", { scheduleId });

        // Lắng nghe sự kiện khi bệnh nhân huỷ tham gia hàng đợi
        socket.on("listenCancelWaitingQueue", (data) => {
          console.log("Bệnh nhân huỷ tham gia:", data);
          // Xoá bệnh nhân khỏi hàng đợi
          setPatientQueue((prevQueue) =>
            prevQueue.filter((patient) => patient.userId !== data.userId)
          );
        });
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
  }, [
    scheduleId,
    userId,
    isPatient,
    patientNameFromURL,
    userName,
    navigate,
    socket,
  ]);

  // Fetch danh sách bệnh nhân đã khám
  useEffect(() => {
    // Chỉ bác sĩ mới cần fetch danh sách bệnh nhân đã khám
    if (!isPatient && scheduleId) {
      const fetchDonePatients = async () => {
        try {
          const response = await getPatientDoneInWorkSchedule(scheduleId);
          if (response.data?.code === 200 && response.data?.data) {
            setDonePatients(response.data.data);
          }
        } catch (error) {
          console.error("Error fetching done patients:", error);
        }
      };

      fetchDonePatients();
    }
  }, [isPatient, scheduleId]);

  // Tạo đường link phòng khám cho bệnh nhân sử dụng role thay vì roomID
  const generateRoomLink = () => {
    return (
      window.location.protocol +
      "//" +
      // window.location.host +
      `healthcare-web-tau.vercel.app` +
      window.location.pathname +
      "?role=patient"
    );
  };

  // Hàm lưu thông tin bệnh nhân đang khám vào localStorage
  const saveCurrentPatientToStorage = (patient: PatientQueueItem | null) => {
    const storageKey = `currentPatient_${scheduleId}`;
    if (patient) {
      localStorage.setItem(storageKey, JSON.stringify(patient));
    } else {
      localStorage.removeItem(storageKey);
    }
  };

  // Hàm load thông tin bệnh nhân đang khám từ localStorage
  const loadCurrentPatientFromStorage = (): PatientQueueItem | null => {
    const storageKey = `currentPatient_${scheduleId}`;
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.error("Error parsing stored patient data:", error);
        localStorage.removeItem(storageKey);
      }
    }
    return null;
  };

  // Load current patient từ localStorage khi component mount
  useEffect(() => {
    if (!isPatient) {
      const storedPatient = loadCurrentPatientFromStorage();
      if (storedPatient) {
        setCurrentPatient(storedPatient);
        setSelectedAppointmentId(storedPatient.appointmentId || 0);
      }
    }
  }, [isPatient]);

  // Tiếp nhận bệnh nhân vào phòng khám
  const acceptPatient = (patient: PatientQueueItem) => {
    // Đánh dấu bệnh nhân đã được tiếp nhận
    const updatedQueue = patientQueue.filter(
      (p) => p.userId !== patient.userId
    );
    setPatientQueue(updatedQueue);

    // Set current patient in examination
    setCurrentPatient(patient);
    // Lưu thông tin bệnh nhân vào localStorage
    saveCurrentPatientToStorage(patient);
    console.log("Patient accepted:", patient);

    // Set appointment ID for medical record
    // Vấn đề ở đây - cần đảm bảo chúng ta đang đặt một appointmentId hợp lệ
    // Nếu bệnh nhân có thuộc tính bookAppointmentId, sử dụng nó; nếu không thì dùng userId làm phương án dự phòng
    setSelectedAppointmentId(patient.appointmentId || 0);

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

  // Mở modal hồ sơ y tế
  const handleOpenMedicalRecord = () => {
    if (currentPatient) {
      // Log all parameters being passed to modal to debug
      console.log("Modal parameters:", {
        appointmentId: selectedAppointmentId,
        patientId: currentPatient.userId,
        isDoctor: true,
        infoAppointment: {
          doctorName: currentPatient.doctorName,
          dateAppointment: currentPatient.dateAppointment,
        },
      });

      // Check for missing required values
      if (!selectedAppointmentId) {
        console.error("Missing appointmentId for medical record modal");
        // Fallback to bookAppointmentId or set a default value
        setSelectedAppointmentId(currentPatient.bookAppointmentId || 0);
      }

      if (!currentPatient.userId) {
        console.error("Missing patientId for medical record modal");
        return; // Don't open modal if patient ID is missing
      }
    } else {
      console.error("Cannot open medical record: No current patient selected");
      return; // Don't open modal if no patient is selected
    }

    setIsModalOpen(true);
  };

  // Xóa bệnh nhân khỏi hàng đợi
  const removePatient = (id: number) => {
    const data = patientQueue.filter((patient) => patient.userId === id);
    setPatientQueue(patientQueue.filter((patient) => patient.userId !== id));

    // Gửi thông báo xóa bệnh nhân khỏi hàng đợi
    socket.emit("removeWaitingQueue", data[0]);
  };

  // Xử lý hoàn thành khám bệnh, chuyển bệnh nhân vào danh sách đã khám
  const finishExamination = () => {
    if (currentPatient) {
      // Thêm bệnh nhân vào danh sách đã khám thông qua state
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
      // Xóa thông tin bệnh nhân khỏi localStorage
      saveCurrentPatientToStorage(null);

      // Close medical record if open
      if (isModalOpen) {
        setIsModalOpen(false);
      }

      // Refresh danh sách bệnh nhân đã khám sau một khoảng thời gian ngắn
      // để đảm bảo backend đã xử lý xong
      if (!isPatient && scheduleId) {
        setTimeout(() => {
          getPatientDoneInWorkSchedule(scheduleId)
            .then((response) => {
              if (response.data?.code === 200 && response.data?.data) {
                setDonePatients(response.data.data);
              }
            })
            .catch((error) => {
              console.error("Error fetching updated done patients:", error);
            });
        }, 1000); // Đợi 1 giây để đảm bảo backend đã cập nhật
      }
    }
  };

  // Cài đặt cuộc gọi video Zego cho bác sĩ và bệnh nhân
  const myMeeting = useCallback(
    async (element) => {
      if (!element) return;
      // Tránh khởi tạo phòng nếu user out room
      if (isRoomInitialized) return;

      try {
        // Tạo Kit Token
        const appID = Number(import.meta.env.VITE_APP_ID);
        const serverSecret = import.meta.env.VITE_SERVER_SECRET;

        // Xác định tên hiển thị - sử dụng tên có số thứ tự nếu là bệnh nhân
        const displayName =
          isPatient && patientNameFromURL ? patientNameFromURL : userName;

        console.log("Preparing to join room with:", {
          appID,
          serverSecret,
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
          maxUsers: 2,
          showRemoveUserButton: !isPatient,
          showPreJoinView: false,
          showLeavingView: false,
          // tự ra khỏi phòng
          onLeaveRoom() {
            // gửi sự kiện bác sĩ rời khỏi phòng khám
            // socket.emit("doctorLeaveRoom", {
            //   scheduleId,
            //   doctorId: userId,
            // });
            console.log("You have left the room");
            socket.disconnect();
            // setTimeout để thư viện nó xoá được user trong room
            setTimeout(() => {
              window.close();
            }, 500);
          },
          // bệnh nhân bị xoá khỏi phòng (run khi bạn bị xoá khỏi phòng)
          onYouRemovedFromRoom() {
            console.log("You have been removed from the room");
            socket.disconnect();
            setTimeout(() => {
              window.close();
            }, 500);
          },
          onUserJoin: (userList) => {
            console.log("User joined:", userList);
            setIsShowCurrentPatient(true);

            // Set current patient from userList if doctor and patient joins
            if (!isPatient) {
              // Tìm bệnh nhân trong userList (user không phải là bác sĩ)
              const patientInRoom = userList.find(
                (user) => user.userID !== userId
              );

              if (patientInRoom) {
                // Tạo đối tượng patient từ thông tin userList
                const patientFromUserList: PatientQueueItem = {
                  userId: patientInRoom.userID,
                  name: patientInRoom.userName,
                  // Các thông tin khác sẽ được giữ từ currentPatient nếu có
                  appointmentId: currentPatient?.appointmentId,
                  numericalOrder: currentPatient?.numericalOrder,
                  doctorName: currentPatient?.doctorName,
                  dateAppointment: currentPatient?.dateAppointment,
                  bookAppointmentId: currentPatient?.bookAppointmentId,
                };

                setCurrentPatient(patientFromUserList);
                saveCurrentPatientToStorage(patientFromUserList);
              } else if (currentPatient) {
                // Nếu không tìm thấy bệnh nhân mới nhưng có currentPatient, vẫn lưu localStorage
                saveCurrentPatientToStorage(currentPatient);
              }
            }
          },
          // khi bệnh nhân rời khỏi phòng thì set null cho currentPatient
          onUserLeave: (userList) => {
            console.log("User left:", userList);

            // Xóa ngay bệnh nhân đang khám khi có bất kỳ bệnh nhân nào rời khỏi phòng
            if (!isPatient) {
              console.log(
                "A patient has left the room, clearing current patient"
              );
              setCurrentPatient(null);
              setIsShowCurrentPatient(false);
              // Xóa thông tin bệnh nhân khỏi localStorage
              saveCurrentPatientToStorage(null);
            }
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
          {currentPatient && isShowCurrentPatient && (
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
                    onClick={() => handleOpenMedicalRecord()}
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
                      disabled={currentPatient !== null && isShowCurrentPatient}
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
          <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
            Đã Khám Xong
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box>
            {/* Hiển thị danh sách bệnh nhân đã khám từ API */}
            {donePatients.map((item, index) => (
              <Paper
                key={`done-${item.patient.userId}-${index}`}
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
                  {`${item.patient.firstName} ${item.patient.lastName}`}
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
                  {item.bookAppointment.numericalOrder && (
                    <Chip
                      label={`STT: ${item.bookAppointment.numericalOrder}`}
                      size="small"
                      variant="outlined"
                      sx={{ ml: 1 }}
                    />
                  )}
                </Box>
              </Paper>
            ))}

            {/* Hiển thị bệnh nhân đã khám trong phiên hiện tại (nhưng chưa được cập nhật từ API) */}
            {examinedPatients
              .filter(
                (local) =>
                  !donePatients.some(
                    (api) => api.patient.userId === local.userId
                  )
              )
              .map((patient, index) => (
                <Paper
                  key={`examined-${patient.userId}-${index}`}
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
                    {patient.numericalOrder && (
                      <Chip
                        label={`STT: ${patient.numericalOrder}`}
                        size="small"
                        variant="outlined"
                        sx={{ ml: 1 }}
                      />
                    )}
                  </Box>
                </Paper>
              ))}

            {/* Hiển thị thông báo nếu không có bệnh nhân nào đã khám */}
            {donePatients.length === 0 && examinedPatients.length === 0 && (
              <Typography color="text.secondary">
                Chưa có bệnh nhân nào được khám xong
              </Typography>
            )}
          </Box>

          {/* Modal hồ sơ y tế */}
          {currentPatient && (
            <MedicalRecordModal
              open={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              appointmentId={selectedAppointmentId || 0}
              isDoctor={true}
              patientId={currentPatient?.userId}
              infoAppointment={{
                doctorName: currentPatient?.doctorName || "Doctor",
                dateAppointment:
                  currentPatient?.dateAppointment || new Date().toISOString(),
              }}
            />
          )}
        </Paper>
      )}
    </Box>
  );
}
