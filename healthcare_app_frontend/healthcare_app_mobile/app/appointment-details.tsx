import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  getAppointmentPatientDetail,
  cancelAppointment,
} from "@/services/appointment/booking_service";
import { getPatientBankAccount } from "@/services/authenticate/user_service";
import {
  AntDesign,
  Ionicons,
  MaterialIcons,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import {
  formatTimeFromTimeString,
  parseDateTimeFromString,
} from "@/utils/dateUtils";

export default function AppointmentDetailsScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { appointmentId } = params;
  const [appointment, setAppointment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [cancellationSuccess, setCancellationSuccess] = useState(false);
  const [hasBankAccount, setHasBankAccount] = useState<boolean>(false);

  // Lấy thông tin người dùng từ Redux store
  const user = useSelector((state: any) => state.user.user);

  // Trợ giúp định dạng thời gian chuyển đổi từ định dạng "HH:MM" sang "HH-MM" để sử dụng với formatTimeFromTimeString
  const formatTimeForDisplay = (timeStr: string): string => {
    try {
      if (!timeStr) return "00:00";
      // Chuyển đổi HH:MM sang định dạng HH-MM-00 cho tiện ích hiện tại
      const [hours, minutes] = timeStr.split(":");
      return formatTimeFromTimeString(`${hours}-${minutes}-00`, "string");
    } catch (error) {
      console.error("Error formatting time:", error);
      return "00:00";
    }
  };

  // Chuyển đổi trạng thái thành văn bản hiển thị
  const getStatus = (status: string) => {
    switch (status) {
      case "WAITING":
        return "Đang chờ";
      case "IN_PROGRESS":
        return "Đang khám";
      case "DONE":
        return "Đã hoàn thành";
      case "CANCELLED":
        return "Đã hủy";
      default:
        return "Không xác định";
    }
  };

  // Lấy màu sắc dựa trên trạng thái lịch hẹn
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Đang chờ":
        return "#ff9800"; // Cảnh báo/màu cam
      case "Đang khám":
        return "#4caf50"; // Thành công/màu xanh lá
      case "Đã hoàn thành":
        return "#2196f3"; // Thông tin/màu xanh dương
      case "Đã hủy":
        return "#f44336"; // Lỗi/màu đỏ
      default:
        return "#9e9e9e"; // Mặc định/màu xám
    }
  };

  // Kiểm tra xem lịch hẹn có đủ điều kiện tham gia tư vấn trực tuyến không
  const canJoinExamination = (
    status: string,
    appointmentDate: string,
    startTime: string,
    endTime: string
  ) => {
    // Kiểm tra trạng thái cuộc hẹn
    if (status !== "Đang khám" && status !== "Đang chờ") return false;

    // Kiểm tra ngày hiện tại có phải là ngày của cuộc hẹn không
    const today = new Date();

    // Chuyển đổi ngày của cuộc hẹn từ chuỗi sang đối tượng Date
    const dateParts = appointmentDate.split("-");
    if (dateParts.length !== 3) return false;

    const day = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]) - 1; // Tháng trong JS bắt đầu từ 0
    const year = parseInt(dateParts[2]);

    if (
      today.getDate() !== day ||
      today.getMonth() !== month ||
      today.getFullYear() !== year
    ) {
      return false;
    }

    // Kiểm tra thời gian hiện tại có nằm trong khoảng thời gian của ca làm việc không
    const currentTime = today.getHours() * 60 + today.getMinutes(); // Thời gian hiện tại tính bằng phút

    // Chuyển đổi thời gian bắt đầu và kết thúc thành phút trong ngày
    // Định dạng ban đầu: "HH:MM" hoặc "h:MM AM/PM"
    let shiftStartTime, shiftEndTime;

    // Xử lý cho cả định dạng 24h và 12h
    if (startTime.includes(":")) {
      // Định dạng 24h
      const [startHour, startMinute] = startTime.split(":").map(Number);
      const [endHour, endMinute] = endTime.split(":").map(Number);

      shiftStartTime = startHour * 60 + startMinute;
      shiftEndTime = endHour * 60 + endMinute;
    } else {
      // Trường hợp khác - sử dụng một hàm phân tích chung
      // Đây là một cách đơn giản, có thể cần xử lý phức tạp hơn tùy theo định dạng thời gian
      try {
        const startDate = new Date(`01/01/2023 ${startTime}`);
        const endDate = new Date(`01/01/2023 ${endTime}`);

        shiftStartTime = startDate.getHours() * 60 + startDate.getMinutes();
        shiftEndTime = endDate.getHours() * 60 + endDate.getMinutes();
      } catch (error) {
        console.error("Error parsing time:", error);
        return false;
      }
    }

    // Cho phép tham gia nếu thời gian hiện tại nằm trong khoảng thời gian của ca làm việc
    return currentTime >= shiftStartTime && currentTime <= shiftEndTime;
    // return true;
  };

  // Xử lý tham gia cuộc gọi video
  const handleJoinExamination = () => {
    if (!appointment) return;

    // Lấy thông tin thời gian từ appointment
    const time = appointment.time.split(" - ");
    const startTime = time[0]?.trim();
    const endTime = time[1]?.trim();

    if (
      !canJoinExamination(
        appointment.status,
        appointment.date,
        startTime,
        endTime
      )
    ) {
      Alert.alert(
        "Không thể tham gia",
        "Bạn chỉ có thể tham gia khám trong ngày hẹn và trong khoảng thời gian của ca làm việc.",
        [{ text: "Đóng" }]
      );
      return;
    }

    try {
      router.push({
        pathname: "/waiting-room",
        params: {
          doctorId: appointment.doctorInfo.id,
          appointmentId: appointment.id,
          dateAppointment: appointment.date,
          doctorName: appointment.doctorInfo.name,
          numericalOrder: appointment.patientInfo.numericalOrder,
          workScheduleId: appointment.workScheduleId,
        },
      });
    } catch (error) {
      console.error("Navigation error:", error);
      Alert.alert("Lỗi", "Không thể vào phòng khám.", [{ text: "OK" }]);
    }
  };

  /**
   * Xử lý xem hồ sơ bệnh án
   * Điều hướng đến màn hình chi tiết hồ sơ bệnh án khi người dùng nhấn vào nút "Hồ sơ bệnh án"
   */
  const handleViewMedicalRecord = () => {
    if (!appointment) return;

    try {
      router.push({
        pathname: "/medical-record-details",
        params: {
          appointmentId: appointment.id, // ID cuộc hẹn để lấy thông tin hồ sơ bệnh án
          patientId: appointment.patientInfo.id, // ID bệnh nhân để lấy lịch sử khám bệnh
          doctorName: appointment.doctorInfo.name, // Tên bác sĩ
          dateAppointment: appointment.date, // Ngày khám
        },
      });
    } catch (error) {
      console.error("Navigation error:", error);
      Alert.alert("Lỗi", "Không thể mở hồ sơ bệnh án.", [{ text: "Đóng" }]);
    }
  };

  /**
   * Kiểm tra xem cuộc hẹn có thể huỷ hay không
   * Chỉ cho phép huỷ nếu đặt trong vòng 24h và có trạng thái Đang chờ và có tài khoản ngân hàng
   */
  const canCancelAppointment = (createdAt: string, status: string) => {
    // Kiểm tra trạng thái cuộc hẹn
    if (status !== "Đang chờ") return false;

    try {
      // Sử dụng hàm từ dateUtils để parse chuỗi ngày đặt lịch hẹn
      const createdDate = parseDateTimeFromString(createdAt);
      const now = new Date();

      // Tính thời gian chênh lệch (milliseconds)
      const timeDiff = now.getTime() - createdDate.getTime();
      const hoursDiff = timeDiff / (1000 * 60 * 60);

      // Chỉ cho phép huỷ nếu đặt trong vòng 24h
      return hoursDiff <= 24;
    } catch (error) {
      console.error("Lỗi khi xử lý ngày tháng:", error);
      return false;
    }
    // return true;
  };

  /**
   * Mở dialog xác nhận huỷ lịch hẹn
   */
  const handleOpenCancelDialog = () => {
    setOpenCancelDialog(true);
  };

  /**
   * Đóng dialog xác nhận huỷ lịch hẹn
   */
  const handleCloseCancelDialog = () => {
    setOpenCancelDialog(false);
  };

  /**
   * Xử lý huỷ lịch hẹn
   */
  const handleCancelAppointment = async () => {
    try {
      if (!hasBankAccount) {
        Alert.alert(
          "Không thể huỷ lịch hẹn",
          "Bạn cần có tài khoản ngân hàng để có thể huỷ lịch hẹn. Vui lòng cập nhật tài khoản ngân hàng trong thông tin cá nhân.",
          [{ text: "Đã hiểu" }]
        );
        return;
      }
      await cancelAppointment(appointment.id);
      setCancellationSuccess(true);
      setOpenCancelDialog(false);

      // Cập nhật trạng thái cuộc hẹn thành "Đã hủy" trực tiếp trong state
      fetchAppointmentDetails();

      Alert.alert("Thành công", "Cuộc hẹn đã được hủy thành công", [
        { text: "OK" },
      ]);
    } catch (error) {
      console.error("Lỗi khi huỷ lịch hẹn:", error);
      Alert.alert("Lỗi", "Không thể hủy cuộc hẹn. Vui lòng thử lại sau.", [
        { text: "Đóng" },
      ]);
    }
  };
  const fetchAppointmentDetails = async () => {
    if (!appointmentId || !user?.userId) {
      setError("Thông tin cuộc hẹn không hợp lệ");
      setLoading(false);
      return;
    }

    try {
      const response = await getAppointmentPatientDetail(
        user.userId,
        Number(appointmentId)
      );

      if (!response?.data?.data) {
        setError("Không tìm thấy thông tin cuộc hẹn");
        setLoading(false);
        return;
      }

      const result = response.data.data;

      const data = {
        id: result.book_appointment.id,
        workScheduleId: result.work_schedule.id,
        date: result.work_schedule.dateAppointment,
        time: `${formatTimeForDisplay(
          result.work_schedule.shift.start
        )} - ${formatTimeForDisplay(result.work_schedule.shift.end)}`,
        status: getStatus(result.book_appointment.status),
        patientInfo: {
          id: result.book_appointment.patientId,
          numericalOrder: result.book_appointment.numericalOrder,
        },
        doctorInfo: {
          id: result.work_schedule.doctor.userId,
          name: `${result.work_schedule.doctor.firstName} ${result.work_schedule.doctor.lastName}`,
          typeDisease: result.work_schedule.doctor.typeDisease.name,
          avatar: result.work_schedule.doctor.avatar || null,
          specialization:
            result.work_schedule.doctor.specialization || "Bác sĩ",
        },
        hasMedicalRecord: true, // Giả định điều này hiện tại
        createdAt: result.book_appointment.createdAt, // Đảm bảo có trường createdAt
      };

      setAppointment(data);
    } catch (error) {
      console.error("Error fetching appointment details:", error);
      setError("Lỗi khi tải thông tin cuộc hẹn");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointmentDetails();

    // Check if patient has bank account
    const checkBankAccount = async () => {
      try {
        const response = await getPatientBankAccount(user.userId);
        // If response status is 200, patient has bank account
        setHasBankAccount(response.data.code === 200);
      } catch (error) {
        console.error("Error checking bank account:", error);
        setHasBankAccount(false);
      }
    };

    checkBankAccount();
  }, [appointmentId, user, cancellationSuccess]);

  // Hiển thị trạng thái đang tải
  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196f3" />
        <Text style={styles.loadingText}>Đang tải thông tin cuộc hẹn...</Text>
      </SafeAreaView>
    );
  }

  // Hiển thị trạng thái lỗi
  if (error || !appointment) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>
          {error || "Không có thông tin cuộc hẹn"}
        </Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Quay lại</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Tiêu đề */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButtonHeader}
        >
          <AntDesign name="arrowleft" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết cuộc hẹn</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Thẻ trạng thái lịch hẹn */}
        <View style={styles.card}>
          <View style={styles.appointmentHeader}>
            <Text style={styles.cardTitle}>
              Thông tin cuộc hẹn #{appointment.id}
            </Text>
            <View
              style={[
                styles.statusChip,
                { backgroundColor: getStatusColor(appointment.status) },
              ]}
            >
              <Text style={styles.statusText}>{appointment.status}</Text>
            </View>
          </View>

          {/* Số thứ tự khám */}
          <View style={styles.numericalOrderContainer}>
            <Text style={styles.numericalOrderText}>
              Số Thứ Tự Khám: {appointment.patientInfo.numericalOrder}
            </Text>
          </View>

          {/* Chi tiết lịch hẹn */}
          <View style={styles.detailRow}>
            <Ionicons name="calendar" size={22} color="#2196f3" />
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>Ngày khám</Text>
              <Text style={styles.detailValue}>{appointment.date}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="time" size={22} color="#2196f3" />
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>Thời gian</Text>
              <Text style={styles.detailValue}>{appointment.time}</Text>
            </View>
          </View>

          <View style={styles.reasonContainer}>
            <Text style={styles.reasonLabel}>Lý do khám bệnh</Text>
            <Text style={styles.reasonValue}>
              {appointment.doctorInfo.typeDisease}
            </Text>
          </View>

          {/* Nút hành động */}
          <View style={styles.actionContainer}>
            {appointment.status === "Đang chờ" && !hasBankAccount ? (
              <TouchableOpacity
                style={[styles.cancelButton, { opacity: 0.6 }]}
                onPress={() =>
                  Alert.alert(
                    "Không thể huỷ lịch hẹn",
                    "Bạn cần có tài khoản ngân hàng để có thể huỷ lịch hẹn. Vui lòng cập nhật tài khoản ngân hàng trong thông tin cá nhân.",
                    [{ text: "Đã hiểu" }]
                  )
                }
              >
                <MaterialCommunityIcons name="cancel" size={20} color="#fff" />
                <Text style={styles.buttonText}>Huỷ lịch hẹn</Text>
              </TouchableOpacity>
            ) : (
              canCancelAppointment(
                appointment.createdAt,
                appointment.status
              ) && (
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={handleOpenCancelDialog}
                >
                  <MaterialCommunityIcons
                    name="cancel"
                    size={20}
                    color="#fff"
                  />
                  <Text style={styles.buttonText}>Huỷ lịch hẹn</Text>
                </TouchableOpacity>
              )
            )}

            {canJoinExamination(
              appointment.status,
              appointment.date,
              appointment.time.split(" - ")[0]?.trim(),
              appointment.time.split(" - ")[1]?.trim()
            ) && (
              <TouchableOpacity
                style={styles.joinButton}
                onPress={handleJoinExamination}
              >
                <Ionicons name="videocam" size={20} color="#fff" />
                <Text style={styles.buttonText}>Tham gia khám</Text>
              </TouchableOpacity>
            )}
            {appointment.hasMedicalRecord && (
              <TouchableOpacity
                style={styles.recordButton}
                onPress={handleViewMedicalRecord}
              >
                <MaterialIcons name="description" size={20} color="#fff" />
                <Text style={styles.buttonText}>Hồ sơ bệnh án</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Thẻ thông tin bác sĩ */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Thông tin bác sĩ phụ trách</Text>

          <View style={styles.doctorInfoContainer}>
            {appointment.doctorInfo.avatar ? (
              <Image
                source={{ uri: appointment.doctorInfo.avatar }}
                style={styles.doctorAvatar}
                defaultSource={require("@/assets/images/logo.png")}
              />
            ) : (
              <View style={styles.doctorAvatarFallback}>
                <FontAwesome name="user-md" size={30} color="#757575" />
              </View>
            )}

            <View style={styles.doctorDetails}>
              <Text style={styles.doctorName}>
                {appointment.doctorInfo.name}
              </Text>

              <View style={styles.specialtyRow}>
                <Ionicons name="medical" size={16} color="#757575" />
                <Text style={styles.doctorSpecialty}>
                  {appointment.doctorInfo.specialization}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Lưu ý quan trọng */}
        {/* <View style={styles.notesCard}>
          <Text style={styles.notesTitle}>Lưu ý quan trọng:</Text>

          <View style={styles.noteItem}>
            <Text style={styles.noteText}>
              • Vui lòng đến trước giờ hẹn 15 phút để hoàn tất thủ tục đăng ký.
            </Text>
          </View>

          <View style={styles.noteItem}>
            <Text style={styles.noteText}>
              • Mang theo giấy tờ tùy thân, thẻ bảo hiểm y tế (nếu có) và các
              kết quả xét nghiệm, chẩn đoán trước đó (nếu có).
            </Text>
          </View>

          <View style={styles.noteItem}>
            <Text style={styles.noteText}>
              • Nếu cần hủy hoặc thay đổi lịch hẹn, vui lòng thông báo trước ít
              nhất 24 giờ qua hotline của bệnh viện.
            </Text>
          </View>
        </View> */}
      </ScrollView>

      {/* Modal xác nhận huỷ lịch hẹn */}
      <Modal
        visible={openCancelDialog}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseCancelDialog}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Xác nhận huỷ lịch hẹn</Text>
            <Text style={styles.modalContent}>
              Bạn có chắc chắn muốn huỷ lịch hẹn khám này không? Thao tác này
              không thể hoàn tác.
            </Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={handleCloseCancelDialog}
              >
                <Text style={styles.modalCancelButtonText}>Hủy bỏ</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalConfirmButton}
                onPress={handleCancelAppointment}
              >
                <Text style={styles.modalConfirmButtonText}>Xác nhận huỷ</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  backButtonHeader: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    margin: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  appointmentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  statusChip: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 16,
  },
  statusText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  numericalOrderContainer: {
    backgroundColor: "#e3f2fd",
    padding: 8,
    borderRadius: 8,
    marginBottom: 16,
  },
  numericalOrderText: {
    color: "#1565c0",
    fontWeight: "500",
    fontSize: 15,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  detailTextContainer: {
    marginLeft: 10,
  },
  detailLabel: {
    fontSize: 12,
    color: "#757575",
  },
  detailValue: {
    fontSize: 16,
    color: "#212121",
    fontWeight: "500",
  },
  reasonContainer: {
    marginTop: 8,
    marginBottom: 16,
  },
  reasonLabel: {
    fontSize: 12,
    color: "#757575",
    marginBottom: 4,
  },
  reasonValue: {
    fontSize: 16,
    color: "#212121",
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 8,
  },
  cancelButton: {
    backgroundColor: "#f44336",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  joinButton: {
    backgroundColor: "#4caf50",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  recordButton: {
    backgroundColor: "#2196f3",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 6,
  },
  doctorInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  doctorAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  doctorAvatarFallback: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
  },
  doctorDetails: {
    marginLeft: 16,
    flex: 1,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2196f3",
    marginBottom: 6,
  },
  specialtyRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  doctorSpecialty: {
    marginLeft: 8,
    fontSize: 14,
    color: "#424242",
  },
  notesCard: {
    backgroundColor: "#e3f2fd",
    borderRadius: 8,
    padding: 16,
    margin: 12,
    marginTop: 4,
  },
  notesTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#1565c0",
  },
  noteItem: {
    marginBottom: 8,
  },
  noteText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#333",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#f44336",
    textAlign: "center",
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: "#2196f3",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  backButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 20,
    width: "90%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  modalContent: {
    fontSize: 16,
    marginBottom: 20,
    color: "#555",
    lineHeight: 22,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  modalCancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  modalCancelButtonText: {
    color: "#555",
    fontWeight: "500",
  },
  modalConfirmButton: {
    backgroundColor: "#f44336",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 4,
  },
  modalConfirmButtonText: {
    color: "white",
    fontWeight: "500",
  },
});
