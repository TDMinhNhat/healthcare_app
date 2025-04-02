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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getAppointmentPatientDetail } from "@/services/appointment/booking_service";
import { format } from "date-fns";
import {
  AntDesign,
  Ionicons,
  MaterialIcons,
  FontAwesome,
} from "@expo/vector-icons";

export default function AppointmentDetailsScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { appointmentId } = params;
  const [appointment, setAppointment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get user from Redux store
  const user = useSelector((state: any) => state.user.user);

  // Format time from time string
  const formatTimeFromTimeString = (timeStr: string): string => {
    try {
      if (!timeStr) return "00:00";

      // Parse HH:mm format
      const [hours, minutes] = timeStr.split(":").map(Number);

      // Create a new date and set hours and minutes
      const date = new Date();
      date.setHours(hours);
      date.setMinutes(minutes);

      // Format as 12-hour time (hh:mm a)
      return format(date, "hh:mm a");
    } catch (error) {
      console.error("Error formatting time:", error);
      return "00:00"; // Default time if parsing fails
    }
  };

  // Convert status to display text
  const getStatus = (status: string) => {
    switch (status) {
      case "WAITING":
        return "Đang chờ";
      case "IN_PROGRESS":
        return "Đang khám";
      case "DONE":
        return "Đã hoàn thành";
      case "CANCEL":
        return "Đã hủy";
      default:
        return "Không xác định";
    }
  };

  // Get color based on appointment status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Đang chờ":
        return "#ff9800"; // Warning/orange
      case "Đang khám":
        return "#4caf50"; // Success/green
      case "Đã hoàn thành":
        return "#2196f3"; // Info/blue
      case "Đã hủy":
        return "#f44336"; // Error/red
      default:
        return "#9e9e9e"; // Default/grey
    }
  };

  // Check if appointment is eligible for online consultation
  const canJoinExamination = (status: string) => {
    return status === "Đang khám" || status === "Đang chờ";
  };

  // Handle joining video call
  const handleJoinExamination = () => {
    if (!appointment) return;

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

  // Handle viewing medical record
  const handleViewMedicalRecord = () => {
    Alert.alert(
      "Thông báo",
      "Tính năng xem hồ sơ bệnh án đang được phát triển.",
      [{ text: "Đóng" }]
    );
  };

  useEffect(() => {
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
          time: `${formatTimeFromTimeString(
            result.work_schedule.shift.start
          )} - ${formatTimeFromTimeString(result.work_schedule.shift.end)}`,
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
          hasMedicalRecord: true, // Assuming this for now
        };

        setAppointment(data);
      } catch (error) {
        console.error("Error fetching appointment details:", error);
        setError("Lỗi khi tải thông tin cuộc hẹn");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointmentDetails();
  }, [appointmentId, user]);

  // Render loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196f3" />
        <Text style={styles.loadingText}>Đang tải thông tin cuộc hẹn...</Text>
      </SafeAreaView>
    );
  }

  // Render error state
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
      {/* Header */}
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
        {/* Appointment Status Card */}
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

          {/* Appointment numerical order */}
          <View style={styles.numericalOrderContainer}>
            <Text style={styles.numericalOrderText}>
              Số Thứ Tự Khám: {appointment.patientInfo.numericalOrder}
            </Text>
          </View>

          {/* Appointment details */}
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

          {/* Action buttons */}
          <View style={styles.actionContainer}>
            {canJoinExamination(appointment.status) && (
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

        {/* Doctor Information Card */}
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

        {/* Important Notes */}
        <View style={styles.notesCard}>
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
        </View>
      </ScrollView>
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
    gap: 10,
    marginTop: 8,
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
});
