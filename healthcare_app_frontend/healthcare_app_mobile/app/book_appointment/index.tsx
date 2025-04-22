import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";
import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format, addDays, parseISO, isToday } from "date-fns";
import {
  createAppointment,
  getDoctorsFreeStartTime,
} from "../../services/appointment/booking_service";
import {
  getAllTypeDiseases,
  getAllDoctorByTypeDiseaseName,
} from "../../services/authenticate/typeDisease_service";
import { getWorkScheduleByDoctorAndExactDate } from "../../services/authenticate/workSchedule_service";
import {
  formatDateToString,
  formatTimeFromTimeString,
} from "../../utils/dateUtils";

// Các kiểu dữ liệu cho API
interface Service {
  id: number;
  name: string;
}

interface Doctor {
  id: number;
  name: string;
  serviceId: number;
}

interface TimeSlot {
  id: number;
  time: string;
  workScheduleId?: number;
}

// Định nghĩa cấu trúc ca làm việc giống như ở phiên bản web
const SHIFTS = {
  CA1: { id: 1, shift: "Ca 1", start: "07:00", end: "11:00" },
  CA2: { id: 2, shift: "Ca 2", start: "13:00", end: "17:00" },
};

export default function BookAppointmentScreen() {
  const router = useRouter();
  const user = useSelector((state: any) => state.user.user);

  // Các state cho quy trình đặt lịch khám
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<Service | null>(null); // Lưu trữ đối tượng dịch vụ đầy đủ
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null); // Lưu trữ đối tượng bác sĩ đầy đủ
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<number | null>(null);
  const [selectedWorkScheduleId, setSelectedWorkScheduleId] = useState<
    number | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);

  // Các state cho dữ liệu API
  const [services, setServices] = useState<Service[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [loadingTimeSlots, setLoadingTimeSlots] = useState(false);

  // State cho phân trang bác sĩ
  const [currentPage, setCurrentPage] = useState(0);
  const doctorsPerPage = 6; // Số bác sĩ hiển thị mỗi trang

  // Lấy danh sách các dịch vụ từ API - sử dụng getAllTypeDiseases thay vì getAllServices
  useEffect(() => {
    setLoadingServices(true);

    const fetchServices = async () => {
      try {
        const response = await getAllTypeDiseases();
        // lọc các dịch vụ đang hoạt động
        const activeServices = response.data.data.filter(
          (service) => service.status === true
        );
        setServices(activeServices || []);
      } catch (error) {
        console.error("Error fetching services:", error);
        Alert.alert("Lỗi", "Không thể lấy danh sách dịch vụ");
      } finally {
        setLoadingServices(false);
      }
    };

    fetchServices();
  }, []);

  // Lấy danh sách bác sĩ dựa trên dịch vụ đã chọn
  useEffect(() => {
    if (selectedService) {
      setLoadingDoctors(true);

      // fetch doctor theo service
      const fetchDoctors = async () => {
        try {
          const response = await getAllDoctorByTypeDiseaseName(
            selectedService.name
          );
          setDoctors(response.data.data || []);
        } catch (error) {
          console.error("Error fetching doctors:", error);
          Alert.alert("Lỗi", "Không thể lấy danh sách bác sĩ");
          setDoctors([]);
        } finally {
          setLoadingDoctors(false);
        }
      };

      fetchDoctors();
    }
  }, [selectedService]);

  // Lấy khung giờ khám dựa trên ngày đã chọn
  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      setLoadingTimeSlots(true);
      const fetchTimeSlots = async () => {
        try {
          const formattedDate = formatDateToString(selectedDate);

          // Sử dụng userId từ đối tượng bác sĩ
          const response = await getWorkScheduleByDoctorAndExactDate(
            selectedDoctor.userId,
            formattedDate
          );

          const workSchedules = response.data.data;
          if (
            !workSchedules ||
            !Array.isArray(workSchedules) ||
            workSchedules.length === 0
          ) {
            setTimeSlots([]);
            return;
          }

          // Lọc ra các khung giờ có sẵn để đặt lịch
          const availableSlots = workSchedules.filter(
            (schedule) => schedule.status !== false
          );

          // Chuyển đổi dữ liệu lịch làm việc thành định dạng hiển thị cho người dùng
          // Mỗi slot sẽ có id, thời gian hiển thị và workScheduleId để sử dụng khi đặt lịch
          const allSlots = availableSlots.map((slot, index) => ({
            id: index + 1,
            time:
              formatTimeFromTimeString(slot.shift.start, "string") +
              " - " +
              formatTimeFromTimeString(slot.shift.end, "string"),
            workScheduleId: slot.id,
          }));

          setTimeSlots(allSlots);
        } catch (error) {
          // Xử lý lỗi khi không thể lấy dữ liệu từ API
          console.error("Error fetching time slots:", error);
          Alert.alert(
            "Lỗi",
            "Không thể lấy danh sách khung giờ khám. Vui lòng thử lại sau."
          );
          setTimeSlots([]);
        } finally {
          setLoadingTimeSlots(false);
        }
      };

      fetchTimeSlots();
    }
  }, [selectedDoctor, selectedDate]);

  // Đặt lại các lựa chọn tiếp theo khi các lựa chọn trước đó thay đổi
  useEffect(() => {
    setSelectedDoctor(null);
    setSelectedTimeSlot(null);
    setSelectedWorkScheduleId(null);
  }, [selectedService]);

  useEffect(() => {
    setSelectedTimeSlot(null);
    setSelectedWorkScheduleId(null);
  }, [selectedDate, selectedDoctor]);

  // Xử lý lựa chọn ngày từ date picker
  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || new Date();
    setShowDatePicker(Platform.OS === "ios");

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (currentDate >= today && currentDate <= addDays(today, 14)) {
      setSelectedDate(currentDate);
    } else if (currentDate < today) {
      Alert.alert("Thông báo", "Không thể chọn ngày trong quá khứ");
    } else {
      Alert.alert("Thông báo", "Chỉ có thể đặt lịch trong vòng 14 ngày tới");
    }
  };

  // Xử lý lựa chọn khung giờ
  const handleTimeSlotSelection = (slotId: number, workScheduleId?: number) => {
    setSelectedTimeSlot(slotId);
    if (workScheduleId) {
      setSelectedWorkScheduleId(workScheduleId);
    }
  };

  // Kiểm tra xem một khung giờ có nên bị vô hiệu hóa không (thời gian đã qua)
  const isTimeSlotDisabled = (timeString: string): boolean => {
    // Kiểm tra xem ngày đã chọn có phải ngày trong quá khứ không
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      // Nếu là ngày quá khứ, vô hiệu hóa tất cả các khung giờ
      return true;
    }

    // Nếu không phải ngày hôm nay, cho phép tất cả các khung giờ
    if (!isToday(selectedDate)) return false;

    // Nếu là ngày hôm nay, kiểm tra xem thời gian kết thúc của slot đã qua chưa
    const now = new Date();

    // Trích xuất giờ kết thúc từ chuỗi thời gian (định dạng: "HH:MM - HH:MM")
    const endTimeStr = timeString.split(" - ")[1];
    const [hoursStr, minutesStr] = endTimeStr.split(":");
    const slotEndHour = parseInt(hoursStr, 10);
    const slotEndMinute = parseInt(minutesStr, 10);

    // So sánh thời gian hiện tại với thời gian kết thúc của slot
    if (now.getHours() > slotEndHour) {
      return true;
    }
    if (now.getHours() === slotEndHour && now.getMinutes() >= slotEndMinute) {
      return true;
    }

    return false;
  };

  // Cập nhật hàm handleBookAppointment để chuyển hướng đến màn hình thanh toán
  const handleBookAppointment = async () => {
    // console.log(
    //   "Selected Service:",
    //   selectedService,
    //   "Selected Doctor:",
    //   selectedDoctor,
    //   "Selected Date:",
    //   format(selectedDate, "dd/MM/yyyy"),
    //   "Selected Time Slot:",
    //   selectedTimeSlot,
    //   "Selected Work Schedule ID:",
    //   selectedWorkScheduleId
    // );
    if (
      !selectedDoctor ||
      !selectedTimeSlot ||
      // !user?.patientId ||
      !selectedWorkScheduleId
    ) {
      Alert.alert("Thông báo", "Vui lòng chọn đầy đủ thông tin");
      return;
    }

    // Không cần tìm bác sĩ vì chúng ta đã có đối tượng đầy đủ
    router.push({
      pathname: "/book_appointment/payment-checkout",
      params: {
        workScheduleId: selectedWorkScheduleId,
        userId: user.userId,
        doctorName: `${selectedDoctor.firstName} ${selectedDoctor.lastName}`,
        serviceName: selectedService?.name,
        dateAppointment: format(selectedDate, "dd/MM/yyyy"),
        timeAppointment: timeSlots.find((slot) => slot.id === selectedTimeSlot)
          ?.time,
      },
    });
  };

  // Modify the doctor selection handler to navigate to date-time selection screen
  const handleDoctorSelection = (doctor) => {
    setSelectedDoctor(doctor);
    // Navigate to the date-time selection screen with doctor info
    router.push({
      pathname: "/book_appointment/date-time-selection",
      params: {
        doctorId: doctor.userId,
        doctorName: `${doctor.firstName} ${doctor.lastName}`,
        serviceName: selectedService?.name,
        serviceId: selectedService?.id,
      },
    });
  };

  // Tính toán tổng số trang
  const totalPages = Math.ceil(doctors.length / doctorsPerPage);

  // Lấy danh sách bác sĩ cho trang hiện tại
  const paginatedDoctors = doctors.slice(
    currentPage * doctorsPerPage,
    (currentPage + 1) * doctorsPerPage
  );

  // Hàm chuyển trang
  const goToPage = (pageNumber) => {
    if (pageNumber >= 0 && pageNumber < totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Reset trang khi chọn dịch vụ mới
  useEffect(() => {
    setCurrentPage(0);
  }, [selectedService]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Chọn dịch vụ</Text>
          {loadingServices ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color="#26b9c8" />
              <Text style={styles.loadingText}>
                Đang tải danh sách dịch vụ...
              </Text>
            </View>
          ) : (
            <View style={styles.optionsContainer}>
              {services.map((service) => (
                <TouchableOpacity
                  key={service.id}
                  style={[
                    styles.optionItem,
                    selectedService?.id === service.id && styles.selectedOption,
                  ]}
                  onPress={() => setSelectedService(service)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selectedService?.id === service.id &&
                        styles.selectedOptionText,
                    ]}
                  >
                    {service.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {selectedService && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. Chọn bác sĩ</Text>
            {loadingDoctors ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color="#26b9c8" />
                <Text style={styles.loadingText}>
                  Đang tải danh sách bác sĩ...
                </Text>
              </View>
            ) : (
              <>
                <View style={styles.optionsContainer}>
                  {paginatedDoctors.map((doctor) => (
                    <TouchableOpacity
                      key={doctor.id}
                      style={[
                        styles.doctorCard,
                        selectedDoctor?.userId === doctor.userId &&
                          styles.selectedOption,
                      ]}
                      onPress={() => handleDoctorSelection(doctor)}
                    >
                      <Text
                        style={[
                          styles.doctorName,
                          selectedDoctor?.userId === doctor.userId &&
                            styles.selectedOptionText,
                        ]}
                      >
                        {doctor.firstName} {doctor.lastName}
                      </Text>
                    </TouchableOpacity>
                  ))}
                  {doctors.length === 0 && (
                    <Text style={styles.noDataText}>
                      Không có bác sĩ cho dịch vụ này
                    </Text>
                  )}
                </View>

                {doctors.length > doctorsPerPage && (
                  <View style={styles.paginationContainer}>
                    <TouchableOpacity
                      style={[
                        styles.paginationButton,
                        currentPage === 0 && styles.disabledPaginationButton,
                      ]}
                      onPress={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 0}
                    >
                      <Text style={styles.paginationButtonText}>Trước</Text>
                    </TouchableOpacity>

                    <View style={styles.pageIndicator}>
                      <Text style={styles.pageText}>
                        {currentPage + 1} / {totalPages}
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={[
                        styles.paginationButton,
                        currentPage === totalPages - 1 &&
                          styles.disabledPaginationButton,
                      ]}
                      onPress={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages - 1}
                    >
                      <Text style={styles.paginationButtonText}>Tiếp</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </>
            )}
          </View>
        )}
      </ScrollView>

      {/* Phần chân trang chứa nút "Xác nhận đặt lịch" */}
      <View style={styles.footer}>
        {/* 
          Nút xác nhận đặt lịch:
          - Nút sẽ bị vô hiệu hóa (mờ đi) nếu chưa chọn bác sĩ hoặc khung giờ
          - Thuộc tính disabled sẽ ngăn người dùng nhấn nút khi:
            + Chưa chọn bác sĩ
            + Chưa chọn khung giờ
            + Hoặc đang trong quá trình xử lý gửi yêu cầu (isLoading = true)
        */}
        <TouchableOpacity
          style={[
            styles.bookButton,
            (!selectedDoctor || !selectedTimeSlot) && styles.disabledButton,
          ]}
          disabled={!selectedDoctor || !selectedTimeSlot || isLoading}
          onPress={handleBookAppointment}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <MaterialIcons name="event-available" size={20} color="#fff" />
              <Text style={styles.bookButtonText}>Xác nhận đặt lịch</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -8,
  },
  optionItem: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    margin: 8,
    minWidth: "45%",
    alignItems: "center",
  },
  selectedOption: {
    borderColor: "#26b9c8",
    backgroundColor: "#e0f7fa",
  },
  optionText: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
  },
  selectedOptionText: {
    color: "#26b9c8",
    fontWeight: "bold",
  },
  dateSelector: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
  },
  dateText: {
    fontSize: 16,
    marginLeft: 12,
  },
  timeSlotContainer: {
    marginTop: 8,
  },
  timeSlotGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -4,
  },
  timeSlot: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    margin: 4,
    width: "30%",
    alignItems: "center",
  },
  selectedTimeSlot: {
    borderColor: "#26b9c8",
    backgroundColor: "#e0f7fa",
  },
  timeSlotText: {
    fontSize: 13,
  },
  selectedTimeSlotText: {
    color: "#26b9c8",
    fontWeight: "bold",
  },
  disabledTimeSlot: {
    borderColor: "#ddd",
    backgroundColor: "#f5f5f5",
    opacity: 0.6,
  },
  disabledTimeSlotText: {
    color: "#999",
  },
  reasonInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    textAlignVertical: "top",
    minHeight: 100,
  },
  footer: {
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  bookButton: {
    backgroundColor: "#26b9c8",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 8,
  },
  disabledButton: {
    opacity: 0.6,
    backgroundColor: "#aaa",
  },
  bookButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 8,
  },
  noDataText: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
    textAlign: "center",
    padding: 12,
    width: "100%",
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
    fontSize: 14,
  },
  dateTimeContainer: {
    marginBottom: 16,
  },
  subSectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: "#555",
  },
  timeSlotSection: {
    marginTop: 16,
  },
  doctorCard: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    width: "100%",
  },
  doctorName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  paginationButton: {
    backgroundColor: "#26b9c8",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginHorizontal: 8,
  },
  disabledPaginationButton: {
    backgroundColor: "#ccc",
    opacity: 0.6,
  },
  paginationButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  pageIndicator: {
    paddingHorizontal: 16,
  },
  pageText: {
    fontSize: 14,
    color: "#666",
  },
});
