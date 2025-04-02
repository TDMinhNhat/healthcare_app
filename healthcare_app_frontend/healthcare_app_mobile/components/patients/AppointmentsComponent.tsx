import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  FlatList,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";
import {
  AntDesign,
  MaterialIcons,
  Ionicons,
  FontAwesome,
} from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { getAppointmentPatientBookInWeek } from "@/services/appointment/booking_service";
import {
  addDays,
  startOfWeek,
  addWeeks,
  subWeeks,
  format,
  parse,
} from "date-fns";
import { vi } from "date-fns/locale";

// Định nghĩa enum TypeDay - Các ngày trong tuần
enum TypeDay {
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
  SATURDAY = "SATURDAY",
  SUNDAY = "SUNDAY",
}

// Định nghĩa các khoảng thời gian trong ngày (sáng, chiều)
enum TimePeriod {
  MORNING = "morning",
  AFTERNOON = "afternoon",
}

// Định nghĩa các ngày trong tuần và nhãn hiển thị tương ứng
const DAYS_OF_WEEK = [
  { key: TypeDay.MONDAY, label: "T2" },
  { key: TypeDay.TUESDAY, label: "T3" },
  { key: TypeDay.WEDNESDAY, label: "T4" },
  { key: TypeDay.THURSDAY, label: "T5" },
  { key: TypeDay.FRIDAY, label: "T6" },
  { key: TypeDay.SATURDAY, label: "T7" },
  { key: TypeDay.SUNDAY, label: "CN" },
];

// Định nghĩa interface cho thông tin cuộc hẹn
interface Appointment {
  id: number; // ID của cuộc hẹn
  workScheduleId: number; // ID lịch làm việc
  date: string; // Ngày hẹn (dạng chuỗi dd-MM-yyyy)
  startTime: string; // Thời gian bắt đầu
  endTime: string; // Thời gian kết thúc
  status: "WAITING" | "IN_PROGRESS" | "DONE" | "CANCELLED"; // Trạng thái cuộc hẹn
  doctorName: string; // Tên bác sĩ
  specialization: string; // Chuyên khoa của bác sĩ
  reason?: string; // Lý do khám bệnh
  doctorId?: number; // ID của bác sĩ
  typeDay?: TypeDay; // Ngày trong tuần
  shiftId?: number; // ID của ca làm việc
  numericalOrder?: number; // Số thứ tự khám
}

export default function AppointmentsComponent() {
  const router = useRouter();
  const user = useSelector((state: any) => state.user.user);

  // Các state quản lý cuộc hẹn và trạng thái tải
  const [appointments, setAppointments] = useState<Appointment[]>([]); // Danh sách các cuộc hẹn
  const [loading, setLoading] = useState(false); // Trạng thái đang tải dữ liệu
  const [error, setError] = useState<string | null>(null); // Lưu trữ lỗi nếu có

  // Các state quản lý ngày tháng
  const [today] = useState(new Date()); // Ngày hiện tại
  const [currentWeekStart, setCurrentWeekStart] = useState(
    // Ngày bắt đầu của tuần hiện tại
    startOfWeek(today, { weekStartsOn: 1 }) // Tuần bắt đầu từ thứ 2 (1)
  );
  const [showDatePicker, setShowDatePicker] = useState(false); // Hiển thị date picker
  const [selectedDate, setSelectedDate] = useState(new Date()); // Ngày đã chọn

  // Chuyển đổi đối tượng Date thành chuỗi định dạng dd-MM-yyyy
  const formatDateToString = (date: Date): string => {
    return format(date, "dd-MM-yyyy");
  };

  // Hàm hỗ trợ định dạng thời gian từ chuỗi
  const formatTime = (time: string): string => {
    try {
      if (time.length <= 1) {
        return `0${time}`; // Thêm số 0 phía trước nếu chỉ có 1 chữ số
      } else {
        return time;
      }
    } catch (error) {
      console.error("Error formatting date:", error);
      return time;
    }
  };

  // Định dạng thời gian từ chuỗi dạng hh-mm-ss thành hh:mm
  const formatTimeFromTimeString = (
    timeString: string,
    type: string = "string"
  ): any => {
    if (type === "string") {
      const time = timeString.split("-");
      return `${formatTime(time[0])}:${formatTime(time[1])}`;
    } else {
      const time = timeString.split("-");
      const date = new Date();
      date.setHours(parseInt(time[0]));
      date.setMinutes(parseInt(time[1]));
      date.setSeconds(parseInt(time[2]));
      return date;
    }
  };

  // Lấy danh sách cuộc hẹn trong tuần hiện tại từ API
  const fetchAppointments = async () => {
    if (!user?.userId) {
      setError("User ID not found");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const weekEnd = addDays(currentWeekStart, 6); // Tìm ngày kết thúc của tuần (sau 6 ngày từ ngày bắt đầu)

      console.log("Fetching appointments for week:", {
        start: formatDateToString(currentWeekStart),
        end: formatDateToString(weekEnd),
      });

      // Gọi API để lấy danh sách cuộc hẹn theo khoảng thời gian
      const response = await getAppointmentPatientBookInWeek(
        user.userId,
        formatDateToString(currentWeekStart),
        formatDateToString(weekEnd)
      );

      if (!response?.data?.data) {
        console.log("No appointment data received");
        setAppointments([]);
        return;
      }

      const result = response.data.data;

      if (!result || result.length === 0) {
        setAppointments([]);
        return;
      }

      // Chuyển đổi dữ liệu từ API thành danh sách các cuộc hẹn
      const appointmentsData = result.map((item: any) => ({
        id: item.book_appointment.id,
        workScheduleId: item.work_schedule.id,
        date: item.work_schedule.dateAppointment,
        startTime: item.work_schedule.shift.start,
        endTime: item.work_schedule.shift.end,
        status: item.book_appointment.status,
        doctorName:
          item.work_schedule.doctor.lastName +
          " " +
          item.work_schedule.doctor.firstName,
        specialization: item.work_schedule.doctor.specialization,
        reason: "Khám " + item.work_schedule.doctor.typeDisease.name,
        doctorId: item.work_schedule.doctor.userId,
        shiftId: item.work_schedule.shift.id,
        numericalOrder: item.book_appointment.numericalOrder,
      }));

      setAppointments(appointmentsData);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setError("Không thể tải lịch hẹn. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  // Tải lại danh sách cuộc hẹn khi tuần hiện tại hoặc ID người dùng thay đổi
  useEffect(() => {
    fetchAppointments();
  }, [currentWeekStart, user?.userId]);

  // Lấy danh sách các ngày trong tuần hiện tại
  const getDaysInWeek = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = addDays(currentWeekStart, i);
      days.push({
        date, // Đối tượng Date
        formattedDate: formatDateToString(date), // Chuỗi dd-MM-yyyy
        displayDate: format(date, "dd/MM"), // Chuỗi dd/MM để hiển thị
        isToday: format(date, "yyyy-MM-dd") === format(today, "yyyy-MM-dd"), // Kiểm tra có phải hôm nay
      });
    }
    return days;
  };

  const weekDays = getDaysInWeek();

  // Các hàm điều hướng tuần
  // Chuyển đến tuần trước
  const handlePrevWeek = () => {
    const newWeekStart = subWeeks(currentWeekStart, 1);
    setCurrentWeekStart(newWeekStart);
  };

  // Chuyển đến tuần sau
  const handleNextWeek = () => {
    const newWeekStart = addWeeks(currentWeekStart, 1);
    setCurrentWeekStart(newWeekStart);
  };

  // Trở lại tuần hiện tại
  const handleGoToCurrentWeek = () => {
    const newWeekStart = startOfWeek(today, { weekStartsOn: 1 });
    setCurrentWeekStart(newWeekStart);
  };

  // Kiểm tra xem có đang ở tuần hiện tại không
  const isCurrentWeek = () => {
    const actualWeekStart = startOfWeek(today, { weekStartsOn: 1 }).getTime();
    return currentWeekStart.getTime() === actualWeekStart;
  };

  // Định dạng khoảng thời gian hiển thị trong tuần (dd/MM/yyyy - dd/MM/yyyy)
  const formatWeekRange = () => {
    const weekEnd = addDays(currentWeekStart, 6);
    return `${format(currentWeekStart, "dd/MM/yyyy")} - ${format(
      weekEnd,
      "dd/MM/yyyy"
    )}`;
  };

  // Các hàm quản lý date picker
  // Mở date picker
  const handleOpenDatePicker = () => {
    setSelectedDate(new Date(currentWeekStart));
    setShowDatePicker(true);
  };

  // Xử lý khi thay đổi ngày trên date picker
  const handleDateChange = (event: any, date?: Date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }

    if (date) {
      setSelectedDate(date);
      const weekStart = startOfWeek(date, { weekStartsOn: 1 });
      setCurrentWeekStart(weekStart);
    }
  };

  // Xác định khoảng thời gian của ca khám (sáng hoặc chiều) dựa vào giờ bắt đầu
  const getShiftPeriod = (startTime: string): TimePeriod => {
    const startHour = parseInt(startTime.split(":")[0]);
    return startHour < 12 ? TimePeriod.MORNING : TimePeriod.AFTERNOON; // Trước 12h là buổi sáng, sau 12h là buổi chiều
  };

  // Lấy các cuộc hẹn trong một ngày cụ thể và một khoảng thời gian (sáng/chiều)
  const getAppointmentsForDateAndPeriod = (
    date: string,
    period: TimePeriod
  ): Appointment[] => {
    return appointments.filter((appointment) => {
      if (appointment.date !== date) return false;
      return getShiftPeriod(appointment.startTime) === period;
    });
  };

  // Kiểm tra xem cuộc hẹn có thể tham gia khám trực tuyến không
  const canJoinExamination = (status: string) => {
    return status === "IN_PROGRESS" || status === "WAITING"; // Chỉ "Đang khám" hoặc "Chờ khám" mới có thể tham gia
  };

  // Xử lý khi nhấp vào một cuộc hẹn để xem chi tiết
  const handleAppointmentClick = (appointmentId: number) => {
    router.push({
      pathname: "/appointment-details",
      params: { appointmentId },
    });
  };

  // Xử lý khi tham gia cuộc gọi video
  const handleJoinExamination = (appointment: Appointment) => {
    router.push({
      pathname: "/waiting-room",
      params: {
        doctorId: appointment.doctorId,
        appointmentId: appointment.id,
        dateAppointment: appointment.date,
        doctorName: appointment.doctorName,
        numericalOrder: appointment.numericalOrder,
        workScheduleId: appointment.workScheduleId,
      },
    });
  };

  // Lấy thông tin hiển thị theo trạng thái cuộc hẹn
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "WAITING":
        return {
          color: "#2196f3",
          text: "Chờ khám",
          bgColor: "#e3f2fd",
          borderColor: "#2196f3",
        };
      case "IN_PROGRESS":
        return {
          color: "#673ab7",
          text: "Đang khám",
          bgColor: "#ede7f6",
          borderColor: "#673ab7",
        };
      case "DONE":
        return {
          color: "#4caf50",
          text: "Đã khám",
          bgColor: "#e8f5e9",
          borderColor: "#4caf50",
        };
      case "CANCELLED":
        return {
          color: "#f44336",
          text: "Đã hủy",
          bgColor: "#ffebee",
          borderColor: "#f44336",
        };
      default:
        return {
          color: "#9e9e9e",
          text: "Không xác định",
          bgColor: "#f5f5f5",
          borderColor: "#9e9e9e",
        };
    }
  };

  // Kiểm tra xem một ngày cụ thể có cuộc hẹn nào không
  const dayHasAppointments = (formattedDate: string): boolean => {
    return appointments.some(
      (appointment) => appointment.date === formattedDate
    );
  };

  // Hiển thị thẻ cuộc hẹn
  const renderAppointmentCard = (appointment: Appointment) => {
    const statusInfo = getStatusInfo(appointment.status);
    const isEligibleForCall = canJoinExamination(appointment.status); // Kiểm tra xem có thể tham gia cuộc gọi video không

    return (
      <TouchableOpacity
        key={appointment.id}
        style={[
          styles.appointmentCard,
          {
            backgroundColor: statusInfo.bgColor,
            borderLeftWidth: 4,
            borderLeftColor: statusInfo.borderColor,
          },
        ]}
        onPress={() => handleAppointmentClick(appointment.workScheduleId)}
      >
        <View style={styles.appointmentContent}>
          <View style={styles.appointmentDetails}>
            <Text style={styles.appointmentNumber}>
              STT: {appointment.numericalOrder}
            </Text>
            <Text style={styles.doctorName}>
              BS: {appointment.doctorName.split(" ").pop()}
            </Text>
            <Text style={styles.appointmentTime}>
              {formatTimeFromTimeString(appointment.startTime)} -{" "}
              {formatTimeFromTimeString(appointment.endTime)}
            </Text>
            <Text style={styles.reasonText}>
              {appointment.reason || "Không có lý do"}
            </Text>
          </View>

          {isEligibleForCall && (
            <TouchableOpacity
              style={styles.videoCallButton}
              onPress={() => handleJoinExamination(appointment)}
            >
              <Ionicons name="videocam" size={22} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  // Xử lý khi nhấn nút đặt lịch mới
  const handleNewAppointment = () => {
    // Sẽ điều hướng đến màn hình đặt lịch hẹn mới
    // Hiện tại chỉ hiển thị thông báo
    Alert.alert("Thông báo", "Tính năng đang được phát triển");
  };

  // Hiển thị một khoảng thời gian (sáng/chiều) của một ngày cụ thể
  const renderDayPeriodSection = (
    date: string,
    periodLabel: string,
    period: TimePeriod
  ) => {
    // Lọc các cuộc hẹn theo ngày và khoảng thời gian
    const periodAppointments = getAppointmentsForDateAndPeriod(date, period);

    return (
      <View style={styles.periodSection}>
        <Text style={styles.periodLabel}>{periodLabel}</Text>
        {periodAppointments.length === 0 ? (
          <Text style={styles.noAppointments}>Không có lịch hẹn</Text>
        ) : (
          periodAppointments.map(renderAppointmentCard)
        )}
      </View>
    );
  };

  // Hiển thị tất cả các cuộc hẹn trong một ngày
  const renderDayAppointments = (dayInfo: any) => {
    return (
      <View style={styles.dayContainer} key={dayInfo.formattedDate}>
        <View style={styles.dayHeader}>
          <Text
            style={[
              styles.dayDate,
              dayInfo.isToday ? styles.currentDayDate : null,
            ]}
          >
            {dayInfo.displayDate}
          </Text>
        </View>
        {renderDayPeriodSection(
          dayInfo.formattedDate,
          "Sáng",
          TimePeriod.MORNING
        )}
        {renderDayPeriodSection(
          dayInfo.formattedDate,
          "Chiều",
          TimePeriod.AFTERNOON
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Phần tiêu đề */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <FontAwesome name="calendar" size={24} color="#26b9c8" />
          <Text style={styles.title}>Lịch hẹn khám bệnh</Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleNewAppointment}
        >
          <AntDesign name="plus" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Đặt lịch</Text>
        </TouchableOpacity>
      </View>

      {/* Điều hướng tuần */}
      <View style={styles.weekNavigation}>
        <TouchableOpacity style={styles.navButton} onPress={handlePrevWeek}>
          <AntDesign name="left" size={20} color="#26b9c8" />
        </TouchableOpacity>

        <View style={styles.weekInfo}>
          <Text style={styles.weekRangeText}>{formatWeekRange()}</Text>
          {isCurrentWeek() && (
            <Text style={styles.currentWeekText}>Tuần hiện tại</Text>
          )}
        </View>

        <TouchableOpacity style={styles.navButton} onPress={handleNextWeek}>
          <AntDesign name="right" size={20} color="#26b9c8" />
        </TouchableOpacity>
      </View>

      {/* Các nút điều khiển tuần */}
      <View style={styles.weekControls}>
        <TouchableOpacity
          style={[
            styles.controlButton,
            isCurrentWeek() ? styles.disabledButton : null,
          ]}
          disabled={isCurrentWeek()}
          onPress={handleGoToCurrentWeek}
        >
          <Text style={styles.controlButtonText}>Tuần hiện tại</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlButton}
          onPress={handleOpenDatePicker}
        >
          <MaterialIcons name="date-range" size={18} color="#26b9c8" />
          <Text style={styles.controlButtonText}>Chọn ngày</Text>
        </TouchableOpacity>
      </View>

      {/* Tiêu đề các ngày trong tuần */}
      <View style={styles.daysHeader}>
        {DAYS_OF_WEEK.map((day, index) => (
          <View
            key={day.key}
            style={[
              styles.dayHeaderItem,
              weekDays[index]?.isToday ? styles.currentDayHeader : null,
            ]}
          >
            <Text
              style={[
                styles.dayHeaderText,
                weekDays[index]?.isToday ? styles.currentDayHeaderText : null,
              ]}
            >
              {day.label}
            </Text>
            <Text
              style={[
                styles.dayHeaderDate,
                weekDays[index]?.isToday ? styles.currentDayHeaderText : null,
              ]}
            >
              {weekDays[index]?.displayDate.split("/")[0]}
            </Text>
          </View>
        ))}
      </View>

      {/* Danh sách cuộc hẹn */}
      {loading ? (
        // Hiển thị thông báo đang tải
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#26b9c8" />
          <Text style={styles.loadingText}>Đang tải lịch hẹn...</Text>
        </View>
      ) : error ? (
        // Hiển thị thông báo lỗi
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={fetchAppointments}
          >
            <Text style={styles.retryButtonText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView style={styles.appointmentsContainer}>
          {appointments.length === 0 ? (
            // Hiển thị thông báo khi không có cuộc hẹn
            <View style={styles.emptyContainer}>
              <Ionicons name="calendar-outline" size={48} color="#ccc" />
              <Text style={styles.emptyText}>
                Không có lịch hẹn trong tuần này
              </Text>
            </View>
          ) : (
            // Lọc và hiển thị chỉ những ngày có cuộc hẹn
            weekDays
              .filter((day) => dayHasAppointments(day.formattedDate))
              .map(renderDayAppointments)
          )}
        </ScrollView>
      )}

      {/* Chú thích các trạng thái */}
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: "#2196f3" }]} />
          <Text style={styles.legendText}>Chờ khám</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: "#673ab7" }]} />
          <Text style={styles.legendText}>Đang khám</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: "#4caf50" }]} />
          <Text style={styles.legendText}>Đã khám</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: "#f44336" }]} />
          <Text style={styles.legendText}>Đã hủy</Text>
        </View>
      </View>

      {/* Modal date picker cho iOS */}
      {Platform.OS === "ios" && showDatePicker && (
        <Modal
          transparent={true}
          visible={showDatePicker}
          animationType="fade"
          onRequestClose={() => setShowDatePicker(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Chọn ngày</Text>
                <TouchableOpacity
                  onPress={() => setShowDatePicker(false)}
                  style={styles.closeButton}
                >
                  <AntDesign name="close" size={20} color="#000" />
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display="spinner"
                onChange={handleDateChange}
                style={styles.datePicker}
              />
              <TouchableOpacity
                style={styles.selectButton}
                onPress={() => {
                  const weekStart = startOfWeek(selectedDate, {
                    weekStartsOn: 1,
                  });
                  setCurrentWeekStart(weekStart);
                  setShowDatePicker(false);
                }}
              >
                <Text style={styles.selectButtonText}>Chọn</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* Date picker cho Android */}
      {Platform.OS === "android" && showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#26b9c8",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 4,
  },
  weekNavigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#fff",
    marginBottom: 8,
  },
  navButton: {
    padding: 8,
  },
  weekInfo: {
    alignItems: "center",
  },
  weekRangeText: {
    fontSize: 15,
    fontWeight: "600",
  },
  currentWeekText: {
    fontSize: 12,
    color: "#26b9c8",
    marginTop: 2,
  },
  weekControls: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 8,
    backgroundColor: "#fff",
    marginBottom: 8,
    gap: 16,
  },
  controlButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#26b9c8",
    borderRadius: 16,
  },
  controlButtonText: {
    color: "#26b9c8",
    marginLeft: 4,
  },
  disabledButton: {
    borderColor: "#ccc",
    opacity: 0.6,
  },
  daysHeader: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  dayHeaderItem: {
    flex: 1,
    alignItems: "center",
  },
  dayHeaderText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
  },
  dayHeaderDate: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 4,
  },
  currentDayHeader: {
    backgroundColor: "#e3f2fd",
    borderRadius: 8,
  },
  currentDayHeaderText: {
    color: "#2196f3",
  },
  appointmentsContainer: {
    flex: 1,
    paddingHorizontal: 8,
  },
  dayContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 12,
    overflow: "hidden",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  dayHeader: {
    backgroundColor: "#f9f9f9",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  dayDate: {
    fontSize: 14,
    fontWeight: "bold",
  },
  currentDayDate: {
    color: "#2196f3",
  },
  periodSection: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  periodLabel: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
    color: "#757575",
  },
  appointmentCard: {
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  appointmentContent: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  appointmentDetails: {
    flex: 1,
  },
  appointmentNumber: {
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 4,
  },
  doctorName: {
    fontSize: 14,
    fontWeight: "500",
  },
  appointmentTime: {
    fontSize: 12,
    color: "#757575",
    marginTop: 4,
  },
  reasonText: {
    fontSize: 12,
    color: "#757575",
    marginTop: 2,
  },
  videoCallButton: {
    backgroundColor: "#2196f3",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  noAppointments: {
    textAlign: "center",
    fontStyle: "italic",
    color: "#9e9e9e",
    padding: 8,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#9e9e9e",
    textAlign: "center",
    marginTop: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
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
  legendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    padding: 12,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 8,
  },
  legendColor: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 4,
  },
  legendText: {
    fontSize: 12,
    color: "#757575",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 4,
  },
  datePicker: {
    width: "100%",
  },
  selectButton: {
    backgroundColor: "#26b9c8",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  selectButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
