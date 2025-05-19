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
import {
  getMedicalRecord,
  getMedicalRecordPrevious,
} from "../services/appointment/medical_record_service";
import { formatCreatedAtDate } from "../utils/dateUtils";
import { getPatientInfo } from "../services/authenticate/user_service";
import { MedicalRecord, MedicalHistoryRecord, ApiDrug } from "../types/medical";
import { User } from "../types/user";

/**
 * Màn hình hiển thị chi tiết hồ sơ bệnh án của một cuộc hẹn cụ thể
 * và lịch sử khám bệnh trước đó của bệnh nhân
 */
export default function MedicalRecordDetailsScreen() {
  // Lấy thông tin từ tham số URL và Redux store
  const { appointmentId, patientId, doctorName, dateAppointment } =
    useLocalSearchParams();
  const user = useSelector((state: any) => state.user.user) as User;

  // State quản lý tab và dữ liệu
  const [activeTab, setActiveTab] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [patient, setPatient] = useState<User | null>(null);
  const [currentMedicalRecord, setCurrentMedicalRecord] =
    useState<MedicalRecord | null>(null);
  const [medicalHistory, setMedicalHistory] = useState<MedicalHistoryRecord[]>(
    []
  );
  const [expandedRecords, setExpandedRecords] = useState<number[]>([]);

  // Lấy dữ liệu khi component được mount
  useEffect(() => {
    const fetchData = async () => {
      if (!appointmentId) {
        setError("ID cuộc hẹn không hợp lệ");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Lấy thông tin hồ sơ bệnh án của cuộc hẹn hiện tại
        const recordResponse = await getMedicalRecord(Number(appointmentId));

        if (recordResponse.data) {
          const apiData = recordResponse.data;

          // Định dạng lại thông tin hồ sơ bệnh án hiện tại
          const formattedRecord: MedicalRecord = {
            id: apiData.medical_record?.id || 0,
            doctorName: apiData.doctor?.doctor
              ? `BS. ${apiData.doctor.doctor.lastName} ${apiData.doctor.doctor.firstName}`
              : (doctorName as string) || "", // Sử dụng tham số doctorName
            appointmentId: appointmentId as string,
            diagnosisDisease: apiData.medical_record?.diagnosisDisease || "",
            note: apiData.medical_record?.note || "",
            reExaminationDate: apiData.medical_record?.reExaminationDate || "",
            dateAppointment:
              apiData.doctor?.dateAppointment ||
              (dateAppointment as string) ||
              "", // Sử dụng tham số dateAppointment
            drugs: (apiData.drugs || []).map((drugItem: any) => ({
              drug: {
                id: drugItem?.id?.drug?.id || 0,
                drugName: drugItem?.id?.drug?.drugName || "",
                unit: drugItem?.id?.drug?.unit || "",
              },
              howUse: drugItem?.howUse || "",
              quantity: drugItem?.quantity || 0,
            })),
            status:
              apiData.medical_record?.bookAppointment?.status || "WAITING",
          };

          setCurrentMedicalRecord(formattedRecord);
        } else {
          // Nếu không có dữ liệu từ API, tạo một record tạm thời từ params
          const tempRecord: MedicalRecord = {
            id: 0,
            doctorName: (doctorName as string) || "",
            appointmentId: appointmentId as string,
            diagnosisDisease: "",
            note: "",
            reExaminationDate: "",
            dateAppointment: (dateAppointment as string) || "",
            drugs: [],
            status: "WAITING",
          };
          setCurrentMedicalRecord(tempRecord);
        }

        // Lấy thông tin bệnh nhân và lịch sử khám bệnh
        const patientUserId = (patientId as string) || user?.userId;
        if (patientUserId) {
          // Lấy lịch sử khám bệnh của bệnh nhân
          const historyResponse = await getMedicalRecordPrevious(
            patientUserId,
            Number(appointmentId)
          );

          if (historyResponse.data && Array.isArray(historyResponse.data)) {
            // Định dạng lại thông tin lịch sử khám bệnh
            const formattedHistory: MedicalHistoryRecord[] =
              historyResponse.data.map((item: any) => {
                const doctorFirstName = item.doctor?.doctor?.firstName || "";
                const doctorLastName = item.doctor?.doctor?.lastName || "";
                const doctorName =
                  `BS. ${doctorLastName} ${doctorFirstName}`.trim();

                return {
                  id: item.medicalRecord?.id || 0,
                  doctorName,
                  diagnosisDisease: item.medicalRecord?.diagnosisDisease || "",
                  dateAppointment: item.doctor?.dateAppointment || "",
                  status: item.medicalRecord?.bookAppointment?.status || "",
                  appointmentId: item.medicalRecord?.bookAppointment?.id,
                  drugs: item.drugs || [],
                  note: item.medicalRecord?.note || "",
                  reExaminationDate:
                    item.medicalRecord?.reExaminationDate || "",
                };
              });

            setMedicalHistory(formattedHistory);
          }

          // Lấy thông tin bệnh nhân nếu cần thiết
          if (!user || patientId !== user.userId) {
            try {
              const patientResponse = await getPatientInfo(patientUserId);
              if (patientResponse.data && patientResponse.data.data) {
                setPatient(patientResponse.data.data);
              }
            } catch (error) {
              console.error("Error fetching patient info:", error);
            }
          } else {
            setPatient(user);
          }
        }
      } catch (error) {
        console.error("Error fetching medical record:", error);
        setError("Không thể tải hồ sơ bệnh án");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [appointmentId, patientId, doctorName, dateAppointment, user]);

  /**
   * Xử lý mở/thu gọn chi tiết hồ sơ bệnh án trong lịch sử
   * @param recordId ID hồ sơ bệnh án cần mở/thu gọn
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
   * Render danh sách thuốc trong hồ sơ bệnh án
   * @param drugs Danh sách thuốc cần hiển thị
   * @returns Component hiển thị danh sách thuốc
   */
  const renderDrugsList = (drugs: ApiDrug[] | any[]) => {
    if (!drugs || drugs.length === 0) {
      return (
        <Text style={styles.noDataText}>Không có thuốc nào được kê đơn</Text>
      );
    }

    return (
      <View style={styles.medicineTable}>
        {/* Header bảng thuốc */}
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Tên thuốc</Text>
          <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Cách dùng</Text>
          <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Số lượng</Text>
          <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Đơn vị</Text>
        </View>
        {/* Danh sách thuốc */}
        {drugs.map((drug, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={[styles.tableCell, { flex: 2 }]}>
              {drug.drug?.drugName || drug.id?.drug?.drugName || ""}
            </Text>
            <Text style={[styles.tableCell, { flex: 2 }]}>
              {drug.howUse || ""}
            </Text>
            <Text style={[styles.tableCell, { flex: 1, textAlign: "center" }]}>
              {drug.quantity || ""}
            </Text>
            <Text style={[styles.tableCell, { flex: 1 }]}>
              {drug.drug?.unit || drug.id?.drug?.unit || ""}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  /**
   * Render nội dung tab ca khám hiện tại
   * @returns Component hiển thị thông tin ca khám hiện tại
   */
  const renderCurrentAppointmentTab = () => {
    if (!currentMedicalRecord) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Không có hồ sơ bệnh án cho cuộc hẹn này
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.tabContent}>
        {/* Thông tin lịch hẹn */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>THÔNG TIN LỊCH HẸN</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Ngày khám:</Text>
            <Text style={styles.detailValue}>
              {formatCreatedAtDate(currentMedicalRecord.dateAppointment)}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Bác sĩ khám:</Text>
            <Text style={styles.detailValue}>
              {currentMedicalRecord.doctorName}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Mã lịch khám:</Text>
            <Text style={styles.detailValue}>
              {currentMedicalRecord.appointmentId}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Phần chẩn đoán */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>CHẨN ĐOÁN</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Bệnh được chẩn đoán:</Text>
            <Text style={styles.detailValue}>
              {currentMedicalRecord.diagnosisDisease || "-"}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Ghi chú:</Text>
            <Text style={styles.detailValue}>
              {currentMedicalRecord.note || "-"}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Ngày tái khám:</Text>
            <Text style={styles.detailValue}>
              {currentMedicalRecord.reExaminationDate ||
                "Không có lịch tái khám"}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Danh sách thuốc */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>THUỐC ĐIỀU TRỊ</Text>
          {renderDrugsList(currentMedicalRecord.drugs)}
        </View>
      </View>
    );
  };

  /**
   * Render nội dung tab lịch sử khám bệnh
   * @returns Component hiển thị lịch sử khám bệnh
   */
  const renderHistoryTab = () => {
    if (medicalHistory.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Không có lịch sử khám bệnh</Text>
        </View>
      );
    }

    return (
      <View style={styles.tabContent}>
        {medicalHistory.map((record) => (
          <View key={record.id} style={styles.recordItem}>
            {/* Phần header của mỗi bản ghi lịch sử */}
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
                {/* Thông tin lịch hẹn */}
                <View style={styles.detailsSection}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Ngày khám:</Text>
                    <Text style={styles.detailValue}>
                      {formatCreatedAtDate(record.dateAppointment)}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Bác sĩ khám:</Text>
                    <Text style={styles.detailValue}>{record.doctorName}</Text>
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
                    <Text style={styles.detailLabel}>Bệnh được chẩn đoán:</Text>
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

                {/* Phần thuốc điều trị */}
                <View style={styles.detailsSection}>
                  <Text style={styles.detailSectionTitle}>THUỐC ĐIỀU TRỊ</Text>
                  {renderDrugsList(record.drugs)}
                </View>
              </View>
            )}
          </View>
        ))}
      </View>
    );
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

  // Hiển thị giao diện chính
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Thẻ thông tin bệnh nhân */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>THÔNG TIN BỆNH NHÂN</Text>
          {patient ? (
            <View style={styles.patientInfoContainer}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Họ tên:</Text>
                <Text style={styles.infoValue}>
                  {patient.lastName} {patient.firstName}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Mã bệnh nhân:</Text>
                <Text style={styles.infoValue}>{patient.userId}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Giới tính:</Text>
                <Text style={styles.infoValue}>
                  {patient.sex ? "Nam" : "Nữ"}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Ngày sinh:</Text>
                <Text style={styles.infoValue}>{patient.dob}</Text>
              </View>
            </View>
          ) : (
            <Text style={styles.noDataText}>Không có thông tin bệnh nhân</Text>
          )}
        </View>

        {/* Thanh điều hướng tab */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 0 && styles.activeTabButton,
            ]}
            onPress={() => setActiveTab(0)}
          >
            <MaterialIcons
              name="medical-information"
              size={18}
              color={activeTab === 0 ? "#0056b3" : "#6c757d"}
              style={styles.tabIcon}
            />
            <Text
              style={[styles.tabText, activeTab === 0 && styles.activeTabText]}
            >
              Ca Khám Hiện Tại
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 1 && styles.activeTabButton,
            ]}
            onPress={() => setActiveTab(1)}
          >
            <MaterialIcons
              name="history"
              size={18}
              color={activeTab === 1 ? "#0056b3" : "#6c757d"}
              style={styles.tabIcon}
            />
            <Text
              style={[styles.tabText, activeTab === 1 && styles.activeTabText]}
            >
              Lịch Sử Khám Bệnh
            </Text>
          </TouchableOpacity>
        </View>

        {/* Nội dung tab - hiển thị tab đang được chọn */}
        {activeTab === 0 ? renderCurrentAppointmentTab() : renderHistoryTab()}
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
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  tabButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTabButton: {
    borderBottomColor: "#0056b3",
  },
  tabText: {
    fontSize: 14,
    color: "#6c757d",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#0056b3",
    fontWeight: "600",
  },
  tabIcon: {
    marginRight: 4,
  },
  tabContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
    color: "#333",
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
    paddingVertical: 12,
  },
  emptyContainer: {
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#6c757d",
    textAlign: "center",
  },
  recordItem: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  recordHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
  },
  recordHeaderContent: {
    flex: 1,
  },
  recordDate: {
    fontSize: 13,
    color: "#0056b3",
    marginBottom: 2,
  },
  recordDiagnosis: {
    fontSize: 15,
    fontWeight: "600",
    color: "#212529",
    marginBottom: 2,
  },
  recordDoctor: {
    fontSize: 13,
    color: "#6c757d",
  },
  recordDetails: {
    padding: 12,
    backgroundColor: "#f8f9fa",
    borderTopWidth: 1,
    borderTopColor: "#e9ecef",
  },
  detailsSection: {
    marginBottom: 12,
  },
  detailSectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 8,
    color: "#495057",
  },
});
