import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { useLocalSearchParams } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { getAllMedicalRecord } from "../../services/appointment/medical_record_service";
import { formatCreatedAtDate } from "../../utils/dateUtils";
import { MedicalHistoryRecord, ApiDrug } from "../../types/medical";
import { User } from "../../types/user";

/**
 * Màn hình hiển thị lịch sử khám bệnh đầy đủ của bệnh nhân
 */
export default function MedicalRecordsScreen() {
  // Lấy thông tin từ tham số URL và Redux store
  const { userId } = useLocalSearchParams();
  const user = useSelector((state: any) => state.user.user) as User;

  // Các state quản lý dữ liệu
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [medicalRecords, setMedicalRecords] = useState<MedicalHistoryRecord[]>(
    []
  );
  const [expandedRecords, setExpandedRecords] = useState<number[]>([]);

  // Lấy dữ liệu khi component được mount
  useEffect(() => {
    const patientId = (userId as string) || user?.userId;
    if (!patientId) {
      setError("ID người dùng không hợp lệ");
      setLoading(false);
      return;
    }

    fetchMedicalRecords(patientId);
  }, [userId, user]);

  /**
   * Lấy tất cả hồ sơ bệnh án của bệnh nhân
   * @param patientId ID của bệnh nhân
   */
  const fetchMedicalRecords = async (patientId: string) => {
    try {
      setLoading(true);
      const response = await getAllMedicalRecord(patientId);

      if (response.data && Array.isArray(response.data)) {
        // Định dạng lại dữ liệu từ API
        const formattedRecords: MedicalHistoryRecord[] = response.data.map(
          (item: any) => {
            const doctor = item.workSchedule?.doctor || {};
            const doctorName = `BS. ${doctor.lastName || ""} ${
              doctor.firstName || ""
            }`.trim();
            const medicalRecord =
              item.medicalRecord && item.medicalRecord.length > 0
                ? item.medicalRecord[0]
                : {};

            return {
              id: medicalRecord.id || 0,
              doctorName,
              diagnosisDisease: medicalRecord.diagnosisDisease || "",
              dateAppointment: item.workSchedule?.dateAppointment || "",
              status: medicalRecord.bookAppointment?.status || "",
              appointmentId: medicalRecord.bookAppointment?.id,
              drugs: item.drugs || [],
              note: medicalRecord.note || "",
              reExaminationDate: medicalRecord.reExaminationDate || "",
            };
          }
        );

        setMedicalRecords(formattedRecords);
      } else {
        setMedicalRecords([]);
      }
    } catch (error) {
      console.error("Error fetching medical records:", error);
      setError("Không thể tải dữ liệu hồ sơ bệnh án");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Xử lý mở rộng/thu gọn chi tiết hồ sơ bệnh án
   * @param recordId ID của hồ sơ bệnh án
   */
  const toggleRecord = (recordId: number) => {
    setExpandedRecords((prev) => {
      if (prev.includes(recordId)) {
        return prev.filter((id) => id !== recordId);
      } else {
        return [...prev, recordId];
      }
    });
  };

  /**
   * Chuyển đổi mã trạng thái thành nhãn tiếng Việt
   * @param status Mã trạng thái
   * @returns Nhãn trạng thái tiếng Việt
   */
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "WAITING":
        return "Đang Chờ";
      case "IN_PROGRESS":
        return "Đang Khám";
      case "DONE":
        return "Đã Hoàn Thành";
      case "CANCELLED":
        return "Đã Hủy";
      default:
        return status;
    }
  };

  // Hiển thị trạng thái đang tải
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0056b3" />
          <Text style={styles.loadingText}>Đang tải hồ sơ bệnh án...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Hiển thị trạng thái lỗi
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Hiển thị danh sách hồ sơ bệnh án
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Thẻ thông tin bệnh nhân */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>THÔNG TIN BỆNH NHÂN</Text>
          <View style={styles.patientInfoContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Họ tên:</Text>
              <Text style={styles.infoValue}>
                {user?.lastName} {user?.firstName}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Mã bệnh nhân:</Text>
              <Text style={styles.infoValue}>{user?.userId}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Giới tính:</Text>
              <Text style={styles.infoValue}>{user?.sex ? "Nam" : "Nữ"}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Ngày sinh:</Text>
              <Text style={styles.infoValue}>{user?.dob}</Text>
            </View>
            {/* <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Điện thoại:</Text>
              <Text style={styles.infoValue}>{user?.phone}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email:</Text>
              <Text style={styles.infoValue}>{user?.email}</Text>
            </View> */}
          </View>
        </View>

        {/* Tiêu đề danh sách hồ sơ bệnh án */}
        <Text style={styles.sectionTitle}>LỊCH SỬ KHÁM BỆNH</Text>

        {/* Hiển thị thông báo khi không có hồ sơ bệnh án */}
        {medicalRecords.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Không có lịch sử khám bệnh</Text>
          </View>
        ) : (
          // Hiển thị danh sách hồ sơ bệnh án
          <View style={styles.recordsContainer}>
            {medicalRecords.map((record) => (
              <View key={record.id} style={styles.recordItem}>
                {/* Phần header có thể nhấn để mở rộng */}
                <TouchableOpacity
                  style={styles.recordHeader}
                  onPress={() => toggleRecord(record.id)}
                >
                  <View style={styles.recordHeaderContent}>
                    <Text style={styles.recordDate}>
                      {formatCreatedAtDate(record.dateAppointment)}
                    </Text>
                    <Text style={styles.recordDiagnosis}>
                      {record.diagnosisDisease || "Không có chẩn đoán"}
                    </Text>
                    <Text style={styles.recordDoctor}>{record.doctorName}</Text>
                  </View>
                  <Ionicons
                    name={
                      expandedRecords.includes(record.id)
                        ? "chevron-up"
                        : "chevron-down"
                    }
                    size={24}
                    color="#555"
                  />
                </TouchableOpacity>

                {/* Phần chi tiết chỉ hiển thị khi mở rộng */}
                {expandedRecords.includes(record.id) && (
                  <View style={styles.recordDetails}>
                    {/* Thông tin cuộc hẹn */}
                    <View style={styles.detailsSection}>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Ngày khám:</Text>
                        <Text style={styles.detailValue}>
                          {formatCreatedAtDate(record.dateAppointment)}
                        </Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Bác sĩ khám:</Text>
                        <Text style={styles.detailValue}>
                          {record.doctorName}
                        </Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Mã lịch khám:</Text>
                        <Text style={styles.detailValue}>
                          {record.appointmentId}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.divider} />

                    {/* Phần chẩn đoán */}
                    <View style={styles.detailsSection}>
                      <Text style={styles.detailSectionTitle}>CHẨN ĐOÁN</Text>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>
                          Bệnh được chẩn đoán:
                        </Text>
                        <Text style={styles.detailValue}>
                          {record.diagnosisDisease || "Không có chẩn đoán"}
                        </Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Ghi chú:</Text>
                        <Text style={styles.detailValue}>
                          {record.note || "Không có ghi chú"}
                        </Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Ngày tái khám:</Text>
                        <Text style={styles.detailValue}>
                          {record.reExaminationDate || "Không có lịch tái khám"}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.divider} />

                    {/* Danh sách thuốc được kê */}
                    <View style={styles.detailsSection}>
                      <Text style={styles.detailSectionTitle}>
                        THUỐC ĐIỀU TRỊ
                      </Text>
                      {record.drugs && record.drugs.length > 0 ? (
                        <View style={styles.medicineTable}>
                          {/* Header của bảng thuốc */}
                          <View style={styles.tableHeader}>
                            <Text style={[styles.tableHeaderCell, { flex: 2 }]}>
                              Tên thuốc
                            </Text>
                            <Text style={[styles.tableHeaderCell, { flex: 2 }]}>
                              Cách dùng
                            </Text>
                            <Text style={[styles.tableHeaderCell, { flex: 1 }]}>
                              Số lượng
                            </Text>
                            <Text style={[styles.tableHeaderCell, { flex: 1 }]}>
                              Đơn vị
                            </Text>
                          </View>
                          {/* Danh sách các thuốc */}
                          {record.drugs.map((drug, index) => (
                            <View key={index} style={styles.tableRow}>
                              <Text style={[styles.tableCell, { flex: 2 }]}>
                                {drug.id?.drug?.drugName || ""}
                              </Text>
                              <Text style={[styles.tableCell, { flex: 2 }]}>
                                {drug.howUse || ""}
                              </Text>
                              <Text
                                style={[
                                  styles.tableCell,
                                  { flex: 1, textAlign: "center" },
                                ]}
                              >
                                {drug.quantity || ""}
                              </Text>
                              <Text style={[styles.tableCell, { flex: 1 }]}>
                                {drug.id?.drug?.unit || ""}
                              </Text>
                            </View>
                          ))}
                        </View>
                      ) : (
                        <Text style={styles.noDataText}>
                          Không có thuốc nào được kê đơn
                        </Text>
                      )}
                    </View>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#555",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#d9534f",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
    color: "#333",
  },
  patientInfoContainer: {
    gap: 8,
  },
  infoRow: {
    flexDirection: "row",
  },
  infoLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#555",
    width: "35%",
  },
  infoValue: {
    fontSize: 15,
    color: "#333",
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
    marginTop: 8,
    color: "#333",
  },
  emptyContainer: {
    padding: 24,
    backgroundColor: "#fff",
    borderRadius: 12,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#6c757d",
  },
  recordsContainer: {
    gap: 12,
  },
  recordItem: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  recordHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  recordHeaderContent: {
    flex: 1,
  },
  recordDate: {
    fontSize: 14,
    color: "#0056b3",
    marginBottom: 4,
  },
  recordDiagnosis: {
    fontSize: 16,
    fontWeight: "600",
    color: "#212529",
    marginBottom: 4,
  },
  recordDoctor: {
    fontSize: 14,
    color: "#6c757d",
  },
  recordDetails: {
    padding: 16,
    backgroundColor: "#f8f9fa",
    borderTopWidth: 1,
    borderTopColor: "#e9ecef",
  },
  detailsSection: {
    marginBottom: 16,
  },
  detailSectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 10,
    color: "#495057",
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 6,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
    width: "40%",
  },
  detailValue: {
    fontSize: 14,
    color: "#333",
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: "#e9ecef",
    marginVertical: 12,
  },
  medicineTable: {
    marginTop: 8,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#e9ecef",
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 4,
  },
  tableHeaderCell: {
    fontSize: 13,
    fontWeight: "700",
    color: "#495057",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  tableCell: {
    fontSize: 13,
    color: "#333",
  },
  noDataText: {
    fontSize: 14,
    color: "#6c757d",
    fontStyle: "italic",
    textAlign: "center",
    padding: 12,
  },
});
