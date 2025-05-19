import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSelector } from "react-redux";
import { MaterialIcons, Ionicons, FontAwesome } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format, addDays, isToday } from "date-fns";
import { getWorkScheduleByDoctorAndExactDate } from "../../services/authenticate/workSchedule_service";
import {
  formatDateToString,
  formatTimeFromTimeString,
} from "../../utils/dateUtils";
import { getDoctorInfo } from "../../services/authenticate/user_service";
import { getAppointmentPatientDetail } from "../../services/appointment/booking_service"; // Import the correct API function

interface TimeSlot {
  id: number;
  time: string;
  workScheduleId?: number;
}

export default function DateTimeSelectionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const user = useSelector((state: any) => state.user.user);

  // Extract parameters
  const doctorId = params.doctorId as string;
  const doctorName = params.doctorName as string;
  const serviceName = params.serviceName as string;
  const serviceId = params.serviceId as string;

  // States for date and time selection
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<number | null>(null);
  const [selectedWorkScheduleId, setSelectedWorkScheduleId] = useState<
    number | null
  >(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loadingTimeSlots, setLoadingTimeSlots] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasExistingAppointment, setHasExistingAppointment] = useState(false); // Add state for tracking existing appointments
  const [appointmentError, setAppointmentError] = useState<string | null>(null); // Add state for error messages

  // States for doctor information
  const [doctorDetails, setDoctorDetails] = useState<any>(null);
  const [loadingDoctorDetails, setLoadingDoctorDetails] = useState(true);

  // Fetch doctor details using the same API as web version
  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        setLoadingDoctorDetails(true);
        const response = await getDoctorInfo(doctorId);
        if (response.data && response.data.data) {
          setDoctorDetails(response.data.data);
          console.log("Doctor details:", response.data.data);
        }
      } catch (error) {
        console.error("Error fetching doctor details:", error);
        Alert.alert("Lỗi", "Không thể tải thông tin chi tiết của bác sĩ");
      } finally {
        setLoadingDoctorDetails(false);
      }
    };

    if (doctorId) {
      fetchDoctorDetails();
    }
  }, [doctorId]);

  // Fetch time slots based on selected date
  useEffect(() => {
    if (doctorId && selectedDate) {
      setLoadingTimeSlots(true);
      const fetchTimeSlots = async () => {
        try {
          const formattedDate = formatDateToString(selectedDate);
          const response = await getWorkScheduleByDoctorAndExactDate(
            doctorId,
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

          // Filter available slots
          const availableSlots = workSchedules.filter(
            (schedule) => schedule.status !== false
          );

          // Convert work schedule data to time slots
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
  }, [doctorId, selectedDate]);

  // Handle date selection
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

  // Handle time slot selection
  const handleTimeSlotSelection = async (
    slotId: number,
    workScheduleId?: number
  ) => {
    if (!workScheduleId) return;

    try {
      setIsLoading(true);
      setAppointmentError(null);

      // Check if patient already has an appointment for this time slot
      const response = await getAppointmentPatientDetail(
        user.userId, // Use patient ID from Redux state
        workScheduleId
      );

      // If API returns status 200, it means there's already an appointment
      if (response.data.code === 200) {
        setHasExistingAppointment(true);
        setAppointmentError(
          "Bạn đã có lịch khám vào khung giờ này. Vui lòng chọn khung giờ khác."
        );
        Alert.alert(
          "Thông báo",
          "Bạn đã có lịch khám vào khung giờ này. Vui lòng chọn khung giờ khác."
        );
        return;
      }
      // Update selected time slot and work schedule ID
      setSelectedTimeSlot(slotId);
      setSelectedWorkScheduleId(workScheduleId);
    } catch (error) {
      // If API returns an error, it means there's no appointment yet
      setHasExistingAppointment(false);
      setAppointmentError(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Check if a time slot should be disabled
  const isTimeSlotDisabled = (timeString: string): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return true;
    }

    if (!isToday(selectedDate)) return false;

    const now = new Date();

    // Extract end time from time string
    const endTimeStr = timeString.split(" - ")[1];
    const [hoursStr, minutesStr] = endTimeStr.split(":");
    const slotEndHour = parseInt(hoursStr, 10);
    const slotEndMinute = parseInt(minutesStr, 10);

    // Compare current time with slot end time
    if (now.getHours() > slotEndHour) {
      return true;
    }
    if (now.getHours() === slotEndHour && now.getMinutes() >= slotEndMinute) {
      return true;
    }

    return false;
  };

  // Handle continuing to payment
  const handleContinueToPayment = () => {
    if (!selectedTimeSlot || !selectedWorkScheduleId) {
      Alert.alert("Thông báo", "Vui lòng chọn giờ khám");
      return;
    }

    if (hasExistingAppointment) {
      Alert.alert(
        "Thông báo",
        "Lịch khám vào khung giờ này đã được đặt. Vui lòng chọn khung giờ khác."
      );
      return;
    }

    router.push({
      pathname: "/book_appointment/payment-checkout",
      params: {
        workScheduleId: selectedWorkScheduleId,
        userId: user.userId,
        doctorName: doctorName,
        serviceName: serviceName,
        dateAppointment: format(selectedDate, "dd/MM/yyyy"),
        timeAppointment: timeSlots.find((slot) => slot.id === selectedTimeSlot)
          ?.time,
      },
    });
  };

  // Handle going back
  const handleGoBack = () => {
    router.back();
  };

  // Helper function to render certificate items
  const renderCertificates = () => {
    const certificates = doctorDetails?.certificates || [];
    if (certificates.length === 0) {
      return <Text style={styles.noDataText}>Chưa cập nhật</Text>;
    }

    return certificates.map((cert, index) => (
      <View key={index} style={styles.credentialItem}>
        <Text style={styles.credentialValue}>• {cert.certName}</Text>
      </View>
    ));
  };

  // Helper function to render education items
  const renderEducation = () => {
    const education = doctorDetails?.educations || [];
    if (education.length === 0) {
      return <Text style={styles.noDataText}>Chưa cập nhật</Text>;
    }

    return education.map((edu, index) => (
      <View key={index} style={styles.credentialItem}>
        <Text style={styles.credentialValue}>• {edu.schoolName}</Text>
        {edu.startDate && edu.endDate && (
          <Text style={styles.dateText}>
            ({edu.startDate} - {edu.endDate})
          </Text>
        )}
      </View>
    ));
  };

  // Helper function to render experience items
  const renderExperience = () => {
    const experience = doctorDetails?.experiences || [];
    if (experience.length === 0) {
      return <Text style={styles.noDataText}>Chưa cập nhật</Text>;
    }

    return experience.map((exp, index) => (
      <View key={index} style={styles.credentialItem}>
        <Text style={styles.credentialValue}>• {exp.companyName}</Text>
        {exp.startDate && exp.endDate && (
          <Text style={styles.dateText}>
            ({exp.startDate} - {exp.endDate})
          </Text>
        )}
      </View>
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Doctor Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin bác sĩ</Text>

          {loadingDoctorDetails ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color="#26b9c8" />
              <Text style={styles.loadingText}>
                Đang tải thông tin bác sĩ...
              </Text>
            </View>
          ) : doctorDetails ? (
            <View style={styles.doctorInfoContainer}>
              <View style={styles.doctorHeader}>
                {doctorDetails.doctor?.avatar ? (
                  <Image
                    source={{ uri: doctorDetails.doctor.avatar }}
                    style={styles.doctorAvatar}
                    defaultSource={require("@/assets/images/logo.png")}
                  />
                ) : (
                  <View style={styles.doctorAvatarFallback}>
                    <FontAwesome name="user-md" size={40} color="#26b9c8" />
                  </View>
                )}

                <View style={styles.doctorNameContainer}>
                  <Text style={styles.doctorName}>{doctorName}</Text>
                  <Text style={styles.doctorSpecialty}>
                    {doctorDetails.doctor?.specialization ||
                      "Bác sĩ chuyên khoa"}
                  </Text>
                  <View style={styles.serviceContainer}>
                    <MaterialIcons
                      name="medical-services"
                      size={16}
                      color="#26b9c8"
                    />
                    <Text style={styles.serviceText}>{serviceName}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.divider} />

              {/* Doctor Education */}
              <View style={styles.credentialSection}>
                <View style={styles.credentialHeader}>
                  <MaterialIcons name="school" size={20} color="#26b9c8" />
                  <Text style={styles.credentialLabel}>Học vấn:</Text>
                </View>
                {renderEducation()}
              </View>

              <View style={styles.divider} />

              {/* Doctor Experience */}
              <View style={styles.credentialSection}>
                <View style={styles.credentialHeader}>
                  <MaterialIcons name="work" size={20} color="#26b9c8" />
                  <Text style={styles.credentialLabel}>Kinh nghiệm:</Text>
                </View>
                {renderExperience()}
              </View>

              <View style={styles.divider} />

              {/* Doctor Certificates */}
              <View style={styles.credentialSection}>
                <View style={styles.credentialHeader}>
                  <MaterialIcons name="stars" size={20} color="#26b9c8" />
                  <Text style={styles.credentialLabel}>Chứng chỉ:</Text>
                </View>
                {renderCertificates()}
              </View>
            </View>
          ) : (
            <Text style={styles.noDataText}>
              Không tìm thấy thông tin bác sĩ
            </Text>
          )}
        </View>

        {/* Date Selection Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chọn ngày và giờ khám</Text>

          {/* Date picker */}
          <View style={styles.dateTimeContainer}>
            <Text style={styles.subSectionTitle}>Ngày khám:</Text>
            <TouchableOpacity
              style={styles.dateSelector}
              onPress={() => setShowDatePicker(true)}
            >
              <MaterialIcons name="event" size={24} color="#26b9c8" />
              <Text style={styles.dateText}>
                {format(selectedDate, "dd/MM/yyyy")}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display="default"
                onChange={handleDateChange}
                minimumDate={new Date()}
                maximumDate={addDays(new Date(), 14)}
              />
            )}
          </View>

          {/* Time slots */}
          <View style={styles.timeSlotSection}>
            <Text style={styles.subSectionTitle}>Giờ khám:</Text>
            {loadingTimeSlots ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color="#26b9c8" />
                <Text style={styles.loadingText}>
                  Đang tải khung giờ khám...
                </Text>
              </View>
            ) : (
              <View style={styles.timeSlotContainer}>
                {timeSlots.length > 0 ? (
                  <View style={styles.timeSlotGrid}>
                    {timeSlots.map((slot) => {
                      const isDisabled = isTimeSlotDisabled(slot.time);
                      return (
                        <TouchableOpacity
                          key={slot.id}
                          style={[
                            styles.timeSlot,
                            selectedTimeSlot === slot.id &&
                              styles.selectedTimeSlot,
                            isDisabled && styles.disabledTimeSlot,
                          ]}
                          onPress={() =>
                            !isDisabled &&
                            handleTimeSlotSelection(
                              slot.id,
                              slot.workScheduleId
                            )
                          }
                          disabled={isDisabled}
                        >
                          <Text
                            style={[
                              styles.timeSlotText,
                              selectedTimeSlot === slot.id &&
                                styles.selectedTimeSlotText,
                              isDisabled && styles.disabledTimeSlotText,
                            ]}
                          >
                            {slot.time}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                ) : (
                  <Text style={styles.noDataText}>
                    Không có khung giờ khám cho ngày này
                  </Text>
                )}
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Footer with Back and Continue buttons */}
      <View style={styles.footer}>
        <View style={styles.footerButtonsContainer}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <MaterialIcons name="arrow-back" size={20} color="#26b9c8" />
            <Text style={styles.backButtonText}>Quay lại</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.continueButton,
              !selectedTimeSlot && styles.disabledButton,
            ]}
            disabled={!selectedTimeSlot || isLoading}
            onPress={handleContinueToPayment}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Text style={styles.continueButtonText}>Tiếp tục</Text>
                <MaterialIcons name="arrow-forward" size={20} color="#fff" />
              </>
            )}
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
  doctorInfoContainer: {
    paddingVertical: 8,
  },
  doctorHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  doctorAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  doctorAvatarFallback: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#e0f7fa",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  doctorNameContainer: {
    flex: 1,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  doctorSpecialty: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  serviceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  serviceText: {
    fontSize: 14,
    color: "#26b9c8",
    marginLeft: 6,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 12,
  },
  credentialSection: {
    marginVertical: 8,
  },
  credentialHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  credentialLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginLeft: 8,
  },
  credentialItem: {
    marginLeft: 28,
    marginBottom: 8,
  },
  credentialValue: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },
  dateText: {
    fontSize: 12,
    color: "#777",
    marginTop: 2,
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
  timeSlotSection: {
    marginTop: 16,
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
  noDataText: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
    marginLeft: 28,
    marginBottom: 8,
  },
  footer: {
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  footerButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#26b9c8",
    flex: 1,
    marginRight: 10,
  },
  backButtonText: {
    color: "#26b9c8",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 8,
  },
  continueButton: {
    backgroundColor: "#26b9c8",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
  },
  disabledButton: {
    opacity: 0.6,
    backgroundColor: "#aaa",
  },
  continueButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginRight: 8,
  },
});
