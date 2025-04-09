import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useSelector } from "react-redux";
import { PieChart, BarChart } from "react-native-gifted-charts";

// Dữ liệu mẫu cho thuốc
const MOCK_MEDICATIONS = [
  {
    drug: {
      id: 1,
      drugName: "Amlodipine",
      unit: "viên",
    },
    howUse: "Uống 1 viên mỗi ngày vào buổi sáng",
    quantity: 30,
  },
  {
    drug: {
      id: 2,
      drugName: "Losartan",
      unit: "viên",
    },
    howUse: "Uống 1 viên mỗi ngày vào buổi tối",
    quantity: 30,
  },
  {
    drug: {
      id: 3,
      drugName: "Vitamin C",
      unit: "viên",
    },
    howUse: "Uống 1 viên mỗi ngày sau bữa sáng",
    quantity: 60,
  },
];

export default function DashboardTab() {
  const user = useSelector((state: any) => state.user.user);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [patientData, setPatientData] = useState<any | null>(null);
  // State lưu trữ danh sách thuốc
  const [medications, setMedications] = useState<any[] | null>(null);
  // State quản lý trạng thái loading của danh sách thuốc
  const [medicationsLoading, setMedicationsLoading] = useState<boolean>(true);

  // Lấy chiều rộng màn hình
  const screenWidth = Dimensions.get("window").width;
  const chartWidth = screenWidth - 74; // Tính toán dựa trên padding của màn hình và card

  // useEffect để lấy dữ liệu thống kê bệnh nhân
  useEffect(() => {
    const fetchPatientData = async () => {
      // Kiểm tra xem có thông tin người dùng không
      if (!user?.userId) {
        setError("Không tìm thấy thông tin người dùng");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Dữ liệu giả lập
        const data = {
          appointmentStats: {
            total: 12,
            completed: 10,
            upcoming: 2,
            cancelled: 1,
          },
          weeklyAppointments: {
            monday: 2,
            tuesday: 1,
            wednesday: 3,
            thursday: 0,
            friday: 2,
            saturday: 4,
            sunday: 0,
          },
        };
        setPatientData(data);
        setError(null);
      } catch (err) {
        setError("Không thể tải dữ liệu bệnh nhân");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [user]);

  // useEffect để lấy danh sách thuốc
  useEffect(() => {
    const fetchMedications = async () => {
      // Kiểm tra xem có thông tin người dùng không
      if (!user?.userId) {
        setError("Không tìm thấy thông tin người dùng");
        setMedicationsLoading(false);
        return;
      }

      try {
        setMedicationsLoading(true);
        // Giả lập độ trễ cuả API call
        await new Promise((resolve) => setTimeout(resolve, 500));
        setMedications(MOCK_MEDICATIONS);
      } catch (err) {
        console.error(err);
      } finally {
        setMedicationsLoading(false);
      }
    };

    fetchMedications();
  }, [user]);

  // Hiển thị loading khi đang tải dữ liệu
  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#26b9c8" />
        <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
      </SafeAreaView>
    );
  }

  // Hiển thị thông báo lỗi nếu có
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Hiển thị loading nếu chưa có dữ liệu bệnh nhân
  if (!patientData) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
      </SafeAreaView>
    );
  }

  // Phân rã dữ liệu thống kê
  const { appointmentStats, weeklyAppointments } = patientData;

  // Dữ liệu cho biểu đồ tròn thể hiện thống kê lịch hẹn
  const pieChartData = [
    {
      value: appointmentStats.completed,
      text: `${appointmentStats.completed}`,
      color: "#4caf50",
      label: "Đã hoàn thành",
      legendFontSize: 12,
      legendFontColor: "#333",
    },
    {
      value: appointmentStats.upcoming,
      text: `${appointmentStats.upcoming}`,
      color: "#2196f3",
      label: "Sắp tới",
      legendFontSize: 12,
      legendFontColor: "#333",
    },
    {
      value: appointmentStats.cancelled,
      text: `${appointmentStats.cancelled}`,
      color: "#f44336",
      label: "Đã hủy",
      legendFontSize: 12,
      legendFontColor: "#333",
    },
  ];

  // Dữ liệu cho biểu đồ cột thể hiện lịch hẹn trong tuần
  const barChartData = [
    {
      value: weeklyAppointments.monday,
      label: "T2",
      frontColor: "#26b9c8",
      topLabelComponent: () => (
        <Text
          style={{
            color: "#333",
            fontSize: 11,
            fontWeight: "600",
            marginBottom: 4,
          }}
        >
          {weeklyAppointments.monday}
        </Text>
      ),
    },
    {
      value: weeklyAppointments.tuesday,
      label: "T3",
      topLabelComponent: () => (
        <Text
          style={{
            color: "#333",
            fontSize: 11,
            fontWeight: "600",
            marginBottom: 4,
          }}
        >
          {weeklyAppointments.tuesday}
        </Text>
      ),
    },
    {
      value: weeklyAppointments.wednesday,
      label: "T4",
      frontColor: "#26b9c8",
      topLabelComponent: () => (
        <Text
          style={{
            color: "#333",
            fontSize: 11,
            fontWeight: "600",
            marginBottom: 4,
          }}
        >
          {weeklyAppointments.wednesday}
        </Text>
      ),
    },
    {
      value: weeklyAppointments.thursday,
      label: "T5",
      topLabelComponent: () => (
        <Text
          style={{
            color: "#333",
            fontSize: 11,
            fontWeight: "600",
            marginBottom: 4,
          }}
        >
          {weeklyAppointments.thursday}
        </Text>
      ),
    },
    {
      value: weeklyAppointments.friday,
      label: "T6",
      frontColor: "#26b9c8",
      topLabelComponent: () => (
        <Text
          style={{
            color: "#333",
            fontSize: 11,
            fontWeight: "600",
            marginBottom: 4,
          }}
        >
          {weeklyAppointments.friday}
        </Text>
      ),
    },
    {
      value: weeklyAppointments.saturday,
      label: "T7",
      topLabelComponent: () => (
        <Text
          style={{
            color: "#333",
            fontSize: 11,
            fontWeight: "600",
            marginBottom: 4,
          }}
        >
          {weeklyAppointments.saturday}
        </Text>
      ),
    },
    {
      value: weeklyAppointments.sunday,
      label: "CN",
      topLabelComponent: () => (
        <Text
          style={{
            color: "#333",
            fontSize: 11,
            fontWeight: "600",
            marginBottom: 4,
          }}
        >
          {weeklyAppointments.sunday}
        </Text>
      ),
    },
  ];

  // Render UI chính
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.pageTitle}>Bảng điều khiển</Text>

        {/* Thống kê lịch hẹn - Biểu đồ tròn */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Thống kê lịch hẹn</Text>
          <Text style={styles.totalAppointments}>
            Tổng số lịch hẹn: {appointmentStats.total}
          </Text>
          <View style={styles.chartContainer}>
            <PieChart
              data={pieChartData}
              donut
              radius={80}
              textSize={12}
              textColor="#000"
              showText
              textBackgroundRadius={26}
              textBackgroundColor={"#fff"}
              showValuesAsLabels={true}
              focusOnPress={true}
              centerLabelComponent={() => {
                return (
                  <Text
                    style={{ fontSize: 16, color: "#333", fontWeight: "600" }}
                  >
                    {appointmentStats.total}
                  </Text>
                );
              }}
            />
            {/* Chú thích biểu đồ */}
            <View style={styles.legendContainer}>
              {pieChartData.map((item, index) => (
                <View key={index} style={styles.legendItem}>
                  <View
                    style={[
                      styles.legendColorBox,
                      { backgroundColor: item.color },
                    ]}
                  />
                  <Text style={styles.legendText}>
                    {item.label} - {item.value}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Thống kê lịch hẹn trong tuần - Biểu đồ cột */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Thống kê lịch hẹn trong tuần</Text>
          <View style={styles.chartContainer}>
            <BarChart
              data={barChartData}
              width={chartWidth}
              barWidth={26}
              noOfSections={3}
              barBorderRadius={4}
              frontColor="lightgray"
              spacing={14}
              yAxisThickness={0}
              xAxisThickness={0}
              hideRules
              xAxisLabelTextStyle={{ color: "#333", fontSize: 12 }}
              isAnimated
            />
          </View>
        </View>

        {/* Danh sách toa thuốc */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Toa thuốc</Text>
          {medicationsLoading ? (
            <ActivityIndicator size="small" color="#26b9c8" />
          ) : medications && medications.length > 0 ? (
            <View style={styles.medicationsContainer}>
              {/* Tiêu đề bảng thuốc */}
              <View style={styles.medicationHeader}>
                <Text style={[styles.medicationHeaderText, { flex: 2 }]}>
                  Tên thuốc
                </Text>
                <Text style={[styles.medicationHeaderText, { flex: 1 }]}>
                  Số lượng
                </Text>
                <Text style={[styles.medicationHeaderText, { flex: 1 }]}>
                  Đơn vị
                </Text>
              </View>
              {/* Danh sách các thuốc */}
              {medications.map((med, index) => (
                <View key={index} style={styles.medicationRow}>
                  <Text style={[styles.medicationText, { flex: 2 }]}>
                    {med.drug.drugName}
                  </Text>
                  <Text style={[styles.medicationText, { flex: 1 }]}>
                    {med.quantity}
                  </Text>
                  <Text style={[styles.medicationText, { flex: 1 }]}>
                    {med.drug.unit}
                  </Text>
                </View>
              ))}
              {/* Phần hướng dẫn cách dùng thuốc */}
              <View style={styles.howUseContainer}>
                <Text style={styles.howUseTitle}>Cách dùng:</Text>
                {medications.map((med, index) => (
                  <Text key={`usage-${index}`} style={styles.howUseText}>
                    - {med.drug.drugName}: {med.howUse}
                  </Text>
                ))}
              </View>
            </View>
          ) : (
            <Text style={styles.emptyText}>
              Không có thuốc nào đang được sử dụng
            </Text>
          )}
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
  scrollContent: {
    padding: 16,
    paddingBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
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
  retryButton: {
    backgroundColor: "#26b9c8",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  totalAppointments: {
    fontSize: 16,
    fontWeight: "600",
    color: "#26b9c8",
    textAlign: "center",
    marginBottom: 12,
  },
  medicationsContainer: {
    marginTop: 8,
  },
  medicationHeader: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginBottom: 6,
  },
  medicationHeaderText: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#555",
  },
  medicationRow: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  medicationText: {
    fontSize: 14,
    color: "#333",
  },
  howUseContainer: {
    marginTop: 12,
    padding: 10,
    backgroundColor: "#f8f8f8",
    borderRadius: 6,
  },
  howUseTitle: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#555",
  },
  howUseText: {
    fontSize: 14,
    color: "#444",
    marginBottom: 5,
  },
  emptyText: {
    textAlign: "center",
    color: "#666",
    fontStyle: "italic",
    padding: 20,
  },
  chartContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
  },
  legendContainer: {
    width: "100%",
    flexDirection: "column",
    justifyContent: "center",
    marginTop: 20,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  legendColorBox: {
    width: 14,
    height: 14,
    borderRadius: 3,
    marginRight: 10,
  },
  legendText: {
    fontSize: 12,
    color: "#333",
  },
});
