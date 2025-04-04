import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

// Component hiển thị màn hình xác nhận đặt lịch khám thành công
const AppointmentConfirmation = () => {
  // Khởi tạo router để điều hướng ứng dụng
  const router = useRouter();
  // Lấy các tham số được truyền qua URL
  const params = useLocalSearchParams();

  // Lấy thông tin chi tiết lịch hẹn từ params
  const doctorName = params.doctorName as string; // Tên bác sĩ
  const service = params.service as string; // Dịch vụ khám
  const dateAppointment = params.dateAppointment as string; // Ngày khám
  const timeAppointment = params.timeAppointment as string; // Giờ khám

  // Xử lý khi người dùng nhấn nút "Hoàn tất"
  const handleDone = () => {
    // Điều hướng đến trang danh sách lịch hẹn
    router.replace("/(tabs)/appointments");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Biểu tượng đặt lịch thành công */}
        <View style={styles.iconContainer}>
          <MaterialIcons name="check-circle" size={80} color="#4CAF50" />
        </View>

        <Text style={styles.title}>Đặt lịch thành công!</Text>

        <Text style={styles.message}>
          Lịch hẹn của bạn đã được xác nhận. Bạn có thể xem chi tiết lịch hẹn
          tại mục 'Lịch hẹn'.
        </Text>

        <View style={styles.appointmentDetailsCard}>
          <Text style={styles.detailsTitle}>Thông tin lịch hẹn</Text>

          <View style={styles.detailRow}>
            <MaterialIcons name="person" size={20} color="#26b9c8" />
            <Text style={styles.detailLabel}>Bác sĩ:</Text>
            <Text style={styles.detailValue}>{doctorName}</Text>
          </View>

          <View style={styles.detailRow}>
            <MaterialIcons name="medical-services" size={20} color="#26b9c8" />
            <Text style={styles.detailLabel}>Dịch vụ:</Text>
            <Text style={styles.detailValue}>{service}</Text>
          </View>

          <View style={styles.detailRow}>
            <MaterialIcons name="event" size={20} color="#26b9c8" />
            <Text style={styles.detailLabel}>Ngày khám:</Text>
            <Text style={styles.detailValue}>{dateAppointment}</Text>
          </View>

          <View style={styles.detailRow}>
            <MaterialIcons name="access-time" size={20} color="#26b9c8" />
            <Text style={styles.detailLabel}>Giờ khám:</Text>
            <Text style={styles.detailValue}>{timeAppointment}</Text>
          </View>
        </View>

        <View style={styles.reminderContainer}>
          <MaterialIcons name="notifications" size={24} color="#26b9c8" />
          <Text style={styles.reminderText}>
            Bạn sẽ nhận được thông báo nhắc lịch trước thời gian khám 24 giờ.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
          <Text style={styles.doneButtonText}>Hoàn tất</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  contentContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  appointmentDetailsCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    width: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#26b9c8",
    marginBottom: 16,
    textAlign: "center",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  detailLabel: {
    fontSize: 15,
    color: "#555",
    marginLeft: 10,
    width: 90,
  },
  detailValue: {
    flex: 1,
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
  },
  reminderContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e0f7fa",
    padding: 16,
    borderRadius: 8,
    marginVertical: 16,
    width: "90%",
  },
  reminderText: {
    marginLeft: 12,
    flex: 1,
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
  },
  footer: {
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  doneButton: {
    backgroundColor: "#26b9c8",
    paddingVertical: 14,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  doneButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default AppointmentConfirmation;
