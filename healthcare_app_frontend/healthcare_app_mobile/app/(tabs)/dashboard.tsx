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
  FlatList,
} from "react-native";
import { useSelector } from "react-redux";
import { PieChart, BarChart } from "react-native-gifted-charts";
import { format } from "date-fns";
import { Ionicons } from "@expo/vector-icons";

// Interface for appointments
interface Appointment {
  id: number;
  workScheduleId: number;
  date: string;
  startTime: string;
  endTime: string;
  status: "WAITING" | "IN_PROGRESS" | "DONE" | "CANCELLED";
  doctorName: string;
  specialization: string;
  reason?: string;
  doctorId?: number;
  numericalOrder?: number;
}

export default function DashboardTab() {
  const user = useSelector((state: any) => state.user.user);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // State để theo dõi chế độ xem thời gian (tháng hoặc năm)
  const [timeView, setTimeView] = useState<"month" | "year">("month");

  // Tách các trạng thái dữ liệu riêng biệt
  const [appointmentStats, setAppointmentStats] = useState({
    total: 0,
    completed: 0,
    upcoming: 0,
    cancelled: 0,
  });

  const [monthlyAppointments, setMonthlyAppointments] = useState({
    jan: 0,
    feb: 0,
    mar: 0,
    apr: 0,
    may: 0,
    jun: 0,
    jul: 0,
    aug: 0,
    sep: 0,
    oct: 0,
    nov: 0,
    dec: 0,
  });

  const [yearlyAppointments, setYearlyAppointments] = useState<
    Record<string, number>
  >({});

  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState<boolean>(true);
  const [appointmentsError, setAppointmentsError] = useState<string | null>(
    null
  );

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
        // Giả lập gọi API với độ trễ để tăng tính thực tế
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Dữ liệu mẫu cho thống kê lịch hẹn - giống với web version
        setAppointmentStats({
          total: 12, // Tổng số lịch hẹn
          completed: 10, // Số lịch hẹn đã hoàn thành
          upcoming: 2, // Số lịch hẹn sắp tới
          cancelled: 1, // Số lịch hẹn đã hủy
        });

        // Giả lập gọi API lấy dữ liệu theo tháng với độ trễ
        await new Promise((resolve) => setTimeout(resolve, 200));

        // Dữ liệu mẫu cho lịch hẹn theo tháng - giống với web version
        setMonthlyAppointments({
          jan: 5,
          feb: 3,
          mar: 7,
          apr: 2,
          may: 4,
          jun: 6,
          jul: 8,
          aug: 4,
          sep: 3,
          oct: 5,
          nov: 2,
          dec: 1,
        });

        // Giả lập gọi API lấy dữ liệu theo năm với độ trễ
        await new Promise((resolve) => setTimeout(resolve, 200));

        // Dữ liệu mẫu cho lịch hẹn theo năm - giống với web version
        setYearlyAppointments({
          "2020": 25,
          "2021": 30,
          "2022": 45,
          "2023": 38,
          "2024": 12,
        });

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

  // Lấy dữ liệu lịch hẹn hôm nay - giống với web version
  useEffect(() => {
    const fetchTodayAppointments = async () => {
      // Kiểm tra ID người dùng tồn tại
      if (!user?.userId) {
        setAppointmentsError("Không tìm thấy thông tin người dùng");
        setAppointmentsLoading(false);
        return;
      }

      try {
        setAppointmentsLoading(true);
        // Giả lập gọi API với độ trễ 500ms
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Ngày hôm nay dưới định dạng dd-MM-yyyy
        const today = format(new Date(), "dd-MM-yyyy");

        // Dữ liệu mẫu cho lịch hẹn hôm nay - giống với web version
        const mockAppointments: Appointment[] = [
          {
            id: 1,
            workScheduleId: 101,
            date: today,
            startTime: "09:00",
            endTime: "09:30",
            status: "WAITING",
            doctorName: "Bác sĩ Nguyễn Văn A",
            specialization: "Tim mạch",
            reason: "Khám tim mạch định kỳ",
            doctorId: 201,
            numericalOrder: 5,
          },
          {
            id: 2,
            workScheduleId: 102,
            date: today,
            startTime: "14:30",
            endTime: "15:00",
            status: "WAITING",
            doctorName: "Bác sĩ Trần Thị B",
            specialization: "Da liễu",
            reason: "Khám da liễu",
            doctorId: 202,
            numericalOrder: 12,
          },
          {
            id: 3,
            workScheduleId: 103,
            date: today,
            startTime: "16:00",
            endTime: "16:30",
            status: "IN_PROGRESS",
            doctorName: "Bác sĩ Lê Văn C",
            specialization: "Nội khoa",
            reason: "Tái khám",
            doctorId: 203,
            numericalOrder: 8,
          },
        ];

        setTodayAppointments(mockAppointments);
        setAppointmentsError(null);
      } catch (err) {
        setAppointmentsError("Không thể tải dữ liệu lịch hẹn");
        console.error(err);
      } finally {
        setAppointmentsLoading(false);
      }
    };

    fetchTodayAppointments();
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

  // Lấy dữ liệu biểu đồ dựa trên chế độ xem đã chọn
  const getChartData = () => {
    if (timeView === "month") {
      // Dữ liệu lịch hẹn theo tháng
      return {
        labels: [
          "T1",
          "T2",
          "T3",
          "T4",
          "T5",
          "T6",
          "T7",
          "T8",
          "T9",
          "T10",
          "T11",
          "T12",
        ],
        values: [
          monthlyAppointments.jan,
          monthlyAppointments.feb,
          monthlyAppointments.mar,
          monthlyAppointments.apr,
          monthlyAppointments.may,
          monthlyAppointments.jun,
          monthlyAppointments.jul,
          monthlyAppointments.aug,
          monthlyAppointments.sep,
          monthlyAppointments.oct,
          monthlyAppointments.nov,
          monthlyAppointments.dec,
        ],
        title: "Thống kê lịch hẹn trong năm (theo tháng)",
      };
    } else {
      // Dữ liệu lịch hẹn theo năm
      const yearKeys = Object.keys(yearlyAppointments).sort();
      return {
        labels: yearKeys,
        values: yearKeys.map((year) => yearlyAppointments[year]),
        title: "Thống kê lịch hẹn theo năm",
      };
    }
  };

  const chartData = getChartData();

  // Chuẩn bị dữ liệu biểu đồ cột
  const barData = chartData.labels.map((label, index) => ({
    value: chartData.values[index],
    label: label,
    frontColor: "#2196f3",
    topLabelComponent: () => (
      <Text
        style={{
          color: "#333",
          fontSize: 11,
          fontWeight: "600",
          marginBottom: 4,
        }}
      >
        {chartData.values[index]}
      </Text>
    ),
  }));

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

        {/* Thống kê lịch hẹn theo tháng/năm - Biểu đồ cột */}
        <View style={styles.card}>
          <View style={styles.chartHeaderContainer}>
            <Text style={styles.cardTitle}>{chartData.title}</Text>
            <View style={styles.timeViewToggle}>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  timeView === "month" && styles.toggleButtonActive,
                ]}
                onPress={() => setTimeView("month")}
              >
                <Text
                  style={[
                    styles.toggleText,
                    timeView === "month" && styles.toggleTextActive,
                  ]}
                >
                  Tháng
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  timeView === "year" && styles.toggleButtonActive,
                ]}
                onPress={() => setTimeView("year")}
              >
                <Text
                  style={[
                    styles.toggleText,
                    timeView === "year" && styles.toggleTextActive,
                  ]}
                >
                  Năm
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.chartContainer}>
            <BarChart
              data={barData}
              // width={chartWidth}
              barWidth={timeView === "year" ? 30 : 20} // Độ rộng của cột
              noOfSections={4} // Số lượng phần trong trục Y
              barBorderRadius={4}
              frontColor="#2196f3"
              spacing={timeView === "year" ? 20 : 8}
              yAxisThickness={0} // Độ dày của trục Y
              xAxisThickness={0} // Độ dày của trục X
              hideRules // Ẩn các đường kẻ
              xAxisLabelTextStyle={{ color: "#333", fontSize: 12 }}
              // isAnimated
            />
          </View>
        </View>

        {/* Lịch hẹn hôm nay */}
        <View style={styles.card}>
          <View style={styles.appointmentHeaderContainer}>
            <Ionicons name="calendar" size={22} color="#333" />
            <Text
              style={[styles.cardTitle, { marginLeft: 8, marginBottom: 0 }]}
            >
              Lịch hẹn hôm nay
            </Text>
          </View>

          {appointmentsLoading ? (
            <View style={styles.loadingIndicator}>
              <ActivityIndicator size="small" color="#26b9c8" />
            </View>
          ) : appointmentsError ? (
            <Text style={styles.errorText}>{appointmentsError}</Text>
          ) : todayAppointments.length > 0 ? (
            <FlatList
              data={todayAppointments}
              scrollEnabled={false}
              keyExtractor={(item) => item.id.toString()}
              ItemSeparatorComponent={() => (
                <View style={styles.appointmentDivider} />
              )}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.appointmentItem}
                  activeOpacity={0.7}
                  onPress={() => {
                    console.log(`Appointment ${item.id} selected`);
                  }}
                >
                  <View style={styles.appointmentHeader}>
                    <Text style={styles.doctorName}>
                      STT: {item.numericalOrder} - {item.doctorName}
                    </Text>
                  </View>
                  <View style={styles.appointmentDetail}>
                    <Ionicons name="time-outline" size={16} color="#666" />
                    <Text style={styles.detailText}>
                      {item.startTime} - {item.endTime}
                    </Text>
                  </View>
                  <View style={styles.appointmentDetail}>
                    <Ionicons name="medkit-outline" size={16} color="#666" />
                    <Text style={styles.detailText}>
                      {item.specialization} - {item.reason}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          ) : (
            <Text style={styles.emptyText}>Không có lịch hẹn nào hôm nay</Text>
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
  chartHeaderContainer: {
    flexDirection: "column",
    marginBottom: 12,
  },
  timeViewToggle: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    overflow: "hidden",
    alignSelf: "flex-start",
    marginTop: 8,
  },
  toggleButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  toggleButtonActive: {
    backgroundColor: "#2196f3",
  },
  toggleText: {
    fontSize: 14,
    color: "#666",
  },
  toggleTextActive: {
    color: "white",
    fontWeight: "500",
  },
  appointmentHeaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  appointmentItem: {
    paddingVertical: 12,
  },
  appointmentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  appointmentDetail: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  detailText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
  },
  appointmentDivider: {
    height: 1,
    backgroundColor: "#eee",
  },
  loadingIndicator: {
    padding: 20,
    alignItems: "center",
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
