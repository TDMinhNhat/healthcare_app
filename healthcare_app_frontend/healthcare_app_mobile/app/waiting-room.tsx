import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { AntDesign, Ionicons } from "@expo/vector-icons";

export default function WaitingRoomScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();

  const {
    doctorId,
    appointmentId,
    doctorName,
    dateAppointment,
    numericalOrder,
    workScheduleId,
  } = params;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <AntDesign name="arrowleft" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Phòng chờ khám bệnh</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
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

          <View style={styles.statusContainer}>
            <View style={styles.statusIndicator} />
            <Text style={styles.statusText}>Đang chờ bác sĩ</Text>
          </View>
        </View>

        <View style={styles.waitingMessageContainer}>
          <Ionicons name="time-outline" size={40} color="#2196f3" />
          <Text style={styles.waitingTitle}>Vui lòng đợi</Text>
          <Text style={styles.waitingMessage}>
            Bác sĩ sẽ kết nối với bạn trong thời gian sớm nhất. Vui lòng không
            rời khỏi phòng chờ.
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.leaveButton}
            onPress={() => router.back()}
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
