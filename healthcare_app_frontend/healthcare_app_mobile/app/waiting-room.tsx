import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { AntDesign, Ionicons } from "@expo/vector-icons"; // Import biểu tượng từ thư viện Expo
import { useSelector } from "react-redux"; // Import hook để lấy dữ liệu từ Redux store
import { io } from "socket.io-client"; // Import thư viện Socket.IO để kết nối real-time

export default function WaitingRoomScreen() {
  const params = useLocalSearchParams(); // Lấy tham số từ URL
  const router = useRouter();
  const user = useSelector((state: any) => state.user.user); // Lấy thông tin người dùng từ Redux store

  // Các state cho Socket
  const [currentExamNumber, setCurrentExamNumber] = useState<number>(0); // Số thứ tự đang khám
  const [loading, setLoading] = useState<boolean>(true); // Trạng thái đang tải
  const [socket, setSocket] = useState<any>(null); // Kết nối socket

  // Lấy các thông tin cần thiết từ tham số URL
  const {
    doctorId,
    appointmentId,
    doctorName,
    dateAppointment,
    numericalOrder,
    workScheduleId,
  } = params;

  const host = process.env.EXPO_PUBLIC_HOST_ID; // Lấy địa chỉ máy chủ từ biến môi trường

  // Kết nối Socket khi component được mount
  useEffect(() => {
    // Khởi tạo kết nối socket mới
    const newSocket = io(`ws://${host}:8081`, {
      path: "/chat",
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 10,
      autoConnect: false,
    });

    setSocket(newSocket);
    newSocket.connect();

    // Khi kết nối thành công đến máy chủ
    newSocket.on("connect", () => {
      console.log("Socket connected to the server");

      // Tham gia vào hàng đợi chờ
      newSocket.emit("joinWaitingQueue", {
        scheduleId: workScheduleId,
        userId: user.userId,
        numericalOrder: numericalOrder,
        name: `${numericalOrder}_${user.firstName} ${user.lastName}`,
        doctorName: doctorName,
        dateAppointment: dateAppointment,
        appointmentId: appointmentId,
      });

      setLoading(false);
    });

    // Lắng nghe sự kiện bác sĩ tham gia
    newSocket.on("doctorJoined", (data) => {
      console.log("Doctor joined the waiting room:", data);

      // Gửi lại thông tin bệnh nhân khi bác sĩ tham gia
      newSocket.emit("joinWaitingQueue", {
        scheduleId: workScheduleId,
        userId: user.userId,
        numericalOrder: numericalOrder,
        name: `${numericalOrder}_${user.firstName} ${user.lastName}`,
        doctorName: doctorName,
        dateAppointment: dateAppointment,
        appointmentId: appointmentId,
      });
    });

    // Lắng nghe cập nhật hàng đợi bệnh nhân đang khám hiện tại
    newSocket.on("queueUpdate", (data) => {
      console.log("Queue update:", data);
      setLoading(false);
      setCurrentExamNumber(data.numericalOrder || currentExamNumber);
    });

    // Lắng nghe sự kiện được bác sĩ chấp nhận
    newSocket.on("patientAccepted", (data) => {
      if (data.patientId === user.userId) {
        setLoading(false);
        console.log("You've been accepted by the doctor");

        // Chuyển hướng đến phòng khám với các tham số
        if (data.roomLink) {
          const roomLink = new URL(data.roomLink);
          roomLink.searchParams.append(
            "patientName",
            `${numericalOrder}_${user.firstName} ${user.lastName}`
          );
          roomLink.searchParams.append("userId", user.userId);
          const link = roomLink.toString();

          // Mở đường dẫn trực tiếp trong trình duyệt
          Linking.openURL(link).catch((err) => {
            console.error("Không thể mở đường dẫn:", err);
            Alert.alert("Lỗi", "Không thể mở phòng khám trực tuyến");
          });
          router.back();
        }
      }
    });

    // Lắng nghe sự kiện bị xóa khỏi phòng khám
    newSocket.on("removePatient", (data) => {
      if (data.userId === user.userId) {
        setLoading(false);
        router.back();
        newSocket.disconnect();
      }
    });

    // Xử lý lỗi kết nối
    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      setLoading(false);
      Alert.alert("Lỗi kết nối", "Không thể kết nối đến máy chủ");
    });

    // Dọn dẹp khi component unmount
    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);

  // Xử lý rời khỏi phòng chờ
  const handleLeaveRoom = () => {
    if (socket) {
      socket.disconnect();
    }
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Phần đầu trang */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleLeaveRoom} style={styles.backButton}>
          <AntDesign name="arrowleft" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Phòng chờ khám bệnh</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        {/* Hiển thị thông tin cuộc hẹn */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Thông tin cuộc hẹn</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Bác sĩ:</Text>
            <Text style={styles.infoValue}>{doctorName}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Ngày khám:</Text>
            <Text style={styles.infoValue}>{dateAppointment}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Số thứ tự:</Text>
            <Text style={styles.infoValue}>{numericalOrder}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Stt đang khám:</Text>
            {loading ? (
              <ActivityIndicator size="small" color="#2196f3" />
            ) : (
              <Text style={[styles.infoValue, styles.currentNumber]}>
                {currentExamNumber || "0"}
              </Text>
            )}
          </View>

          {/* Hiển thị trạng thái chờ */}
          <View style={styles.statusContainer}>
            <View style={styles.statusIndicator} />
            <Text style={styles.statusText}>Đang chờ bác sĩ</Text>
          </View>
        </View>

        {/* Thông báo chờ */}
        <View style={styles.waitingMessageContainer}>
          <Ionicons name="time-outline" size={40} color="#2196f3" />
          <Text style={styles.waitingTitle}>Vui lòng đợi</Text>
          <Text style={styles.waitingMessage}>
            Bác sĩ sẽ kết nối với bạn trong thời gian sớm nhất. Vui lòng không
            rời khỏi phòng chờ.
          </Text>
        </View>

        {/* Nút rời khỏi phòng chờ */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.leaveButton}
            onPress={handleLeaveRoom}
          >
            <Text style={styles.leaveButtonText}>Rời khỏi phòng chờ</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  infoLabel: {
    width: 80,
    fontSize: 15,
    color: "#757575",
  },
  infoValue: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
  },
  currentNumber: {
    color: "#1976d2",
    fontWeight: "bold",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e3f2fd",
    padding: 10,
    borderRadius: 4,
    marginTop: 8,
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#2196f3",
    marginRight: 8,
  },
  statusText: {
    color: "#1565c0",
    fontWeight: "500",
  },
  waitingMessageContainer: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  waitingTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 12,
  },
  waitingMessage: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
    color: "#616161",
  },
  buttonContainer: {
    marginTop: "auto",
    padding: 16,
  },
  leaveButton: {
    backgroundColor: "#f44336",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  leaveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
