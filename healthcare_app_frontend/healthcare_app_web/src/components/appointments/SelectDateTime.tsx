import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  CircularProgress,
  Card,
  CardContent,
  Stack,
  Alert,
} from "@mui/material";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useTranslation } from "react-i18next";
import { format, addDays, isBefore, isToday } from "date-fns";
import {
  formatDateToString,
  parseDateTimeFromString,
  formatTime,
  formatTimeFromTimeString,
} from "../../utils/dateUtils";
import { getWorkScheduleByDoctorAndExactDate } from "../../services/authenticate/workSchedule_service";
import { getAppointmentPatientDetail } from "../../services/appointment/booking_service";
import DoctorDetails from "./DoctorDetails"; // Import DoctorDetails component

/**
 * Props cho component SelectDateTime
 * @param doctor - Thông tin bác sĩ được chọn
 * @param onSelect - Hàm callback khi người dùng chọn ngày và ca khám
 * @param onBack - Hàm callback khi người dùng quay lại bước trước
 */
interface SelectDateTimeProps {
  doctor: any;
  onSelect: (date: Date, shift: any, workScheduleTarget: object) => void;
  patientId?: string; // Add patientId prop
  // onBack: () => void;
}

// Loại bỏ định nghĩa SHIFTS cố định

/**
 * Component cho phép bệnh nhân chọn ngày và ca khám
 * Hiển thị lịch để chọn ngày và các ca khám có sẵn trong ngày đó
 */
const SelectDateTime: React.FC<SelectDateTimeProps> = ({
  doctor,
  onSelect,
  patientId,
  // onBack,
}) => {
  const { t } = useTranslation();

  // State lưu ngày được chọn, mặc định là ngày hiện tại
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  // State lưu ca khám được chọn
  const [selectedShift, setSelectedShift] = useState<string>("");
  const [selectedShiftInfo, setSelectedShiftInfo] = useState<any>(null);

  // State lưu danh sách các ca khám có sẵn
  const [availableShifts, setAvailableShifts] = useState<
    {
      id: number;
      shift: string;
      start: string;
      end: string;
      isAvailable: boolean;
    }[]
  >([]);

  // State cho trạng thái loading khi đang tải dữ liệu
  const [loading, setLoading] = useState(false);

  // State lưu thông báo lỗi nếu có
  const [error, setError] = useState<string | null>(null);

  // State để kiểm soát trạng thái đã đặt lịch
  const [hasExistingAppointment, setHasExistingAppointment] =
    useState<boolean>(false);

  // State để kiểm tra xem có lịch làm việc nào trong ngày đã chọn không
  const [hasWorkSchedules, setHasWorkSchedules] = useState<boolean>(true);

  // State lưu trữ thông tin lịch làm việc
  const [workSchedules, setWorkSchedules] = useState<any>(null);
  // lịch được chọn
  const [workScheduleTarget, setWorkScheduleTarget] = useState<any>(null);

  /**
   * Gọi API để lấy danh sách ca khám mỗi khi ngày hoặc bác sĩ thay đổi
   */
  useEffect(() => {
    if (selectedDate && doctor) {
      fetchAvailableShifts(selectedDate);
    }
  }, [selectedDate, doctor]);

  /**
   * Hàm gọi API lấy danh sách ca làm việc của bác sĩ theo ngày
   * Đã sửa để xử lý linh hoạt các ca làm việc theo dữ liệu từ API
   * @param date - Ngày cần kiểm tra lịch
   */
  const fetchAvailableShifts = async (date: Date) => {
    try {
      setLoading(true);
      setError(null);
      setHasWorkSchedules(true); // Reset state khi bắt đầu fetch dữ liệu mới

      // Gọi API lấy thông tin lịch làm việc của bác sĩ theo ngày
      const result = await getWorkScheduleByDoctorAndExactDate(
        doctor.userId,
        formatDateToString(date)
      )
        .then((response) => response.data.data)
        .catch((error) => {
          console.log(error);
          return null;
        });
      // lọc ra lịch có status true
      const filteredResult = result.filter((item: any) => item.status === true);
      setWorkSchedules(filteredResult);

      // Kiểm tra dữ liệu trả về từ API
      if (!result || !Array.isArray(result)) {
        setAvailableShifts([]);
        setHasWorkSchedules(false); // Không có lịch làm việc nào cho ngày này
        return;
      }

      // Kiểm tra xem có lịch làm việc nào trong ngày đã chọn không
      if (result.length === 0) {
        setAvailableShifts([]);
        setHasWorkSchedules(false);
        return;
      }

      // Tạo map để nhóm các lịch làm việc theo shift id
      const shiftsMap = new Map();

      // Nhóm các lịch làm việc theo shift id
      filteredResult.forEach((item: any) => {
        if (!shiftsMap.has(item.shift.id)) {
          shiftsMap.set(item.shift.id, {
            id: item.shift.id,
            shift: `Ca ${item.shift.shift}`,
            start: item.shift.start,
            end: item.shift.end,
            isAvailable: true,
          });
        }
      });

      // Chuyển map thành mảng để hiển thị
      const shifts = Array.from(shiftsMap.values());

      setAvailableShifts(shifts);
    } catch (err) {
      console.error("Không thể lấy lịch khám của bác sĩ:", err);
      setError("Không thể tải các ca khám khả dụng. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Xử lý khi người dùng chọn một ngày mới
   * Reset ca khám đã chọn và tải lại danh sách ca khám
   * @param date - Ngày được chọn mới
   */
  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    setSelectedShift("");
  };

  /**
   * Xử lý khi người dùng chọn một ca khám
   * @param shift - Ca khám được chọn
   * @param shiftInfo - Thông tin chi tiết của ca khám
   */
  const handleShiftSelect = async (shift: string, shiftInfo: any) => {
    // Tìm và lưu thông tin lịch làm việc tương ứng với ca được chọn
    const shiftId = shiftInfo.id;
    const selectedWorkSchedule = workSchedules.find(
      (item: any) => item.shift.id === shiftId
    );

    // Kiểm tra xem bệnh nhân đã có lịch khám trong ca này chưa
    try {
      const response = await getAppointmentPatientDetail(
        patientId,
        selectedWorkSchedule.id
      );

      // Nếu API trả về mã 200, nghĩa là đã có lịch khám
      if (response.data.code === 200) {
        setHasExistingAppointment(true);
        setError(
          "Bạn đã có lịch khám trong khung giờ này. Vui lòng chọn khung giờ khác."
        );
        return;
      }
    } catch (error) {
      // Nếu API trả về lỗi, nghĩa là chưa có lịch khám
      setHasExistingAppointment(false);
      setError(null);
    }

    setWorkScheduleTarget(selectedWorkSchedule);
    setSelectedShift(shift);
    setSelectedShiftInfo(shiftInfo);
  };

  /**
   * Xử lý khi người dùng bấm nút tiếp tục
   * Gọi callback với ngày và ca khám đã chọn
   */
  const handleContinue = () => {
    if (selectedDate && selectedShift) {
      onSelect(selectedDate, selectedShiftInfo, workScheduleTarget);
    }
  };

  /**
   * Kiểm tra xem một ngày có bị vô hiệu hóa không
   * Vô hiệu hóa các ngày trong quá khứ và ngày xa hơn 30 ngày tính từ hiện tại
   * @param date - Ngày cần kiểm tra
   * @returns true nếu ngày bị vô hiệu hóa, ngược lại false
   */
  const shouldDisableDate = (date: Date) => {
    const today = new Date();
    const maxDate = addDays(today, 30); // Thay đổi từ 14 ngày thành 30 ngày (1 tháng)

    return (isBefore(date, today) && !isToday(date)) || isBefore(maxDate, date);
  };

  /**
   * Kiểm tra xem một ca khám có bị vô hiệu hóa không
   * Vô hiệu hóa ca đã qua trong ngày hiện tại hoặc ca không còn trống
   * @param shift - Ca khám cần kiểm tra
   * @returns true nếu ca khám bị vô hiệu hóa, ngược lại false
   */
  const isShiftDisabled = (shift: any) => {
    // Nếu ca không còn trống, vô hiệu hóa
    if (!shift.isAvailable) {
      return true;
    }

    // Chỉ kiểm tra thời gian cho ngày hiện tại
    if (!selectedDate || !isToday(selectedDate)) return false;

    const now = new Date();
    const shiftEndHour = parseInt(shift.end.split(":")[0]);

    // Vô hiệu hóa ca nếu đã qua giờ kết thúc
    if (now.getHours() >= shiftEndHour) {
      return true;
    }

    return false;
  };

  return (
    <Box>
      {/* Tiêu đề trang */}
      <Typography variant="h6" gutterBottom>
        {t("patient.appointments.select_date_time")}
      </Typography>

      {/* Include DoctorDetails component */}
      <Box sx={{ mb: 3 }}>
        <DoctorDetails doctor={doctor} />
      </Box>

      {/* Hiển thị thông báo lỗi nếu có */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Bố cục lưới: bên trái là lịch, bên phải là danh sách ca khám */}
      <Grid container spacing={3}>
        {/* Phần chọn ngày khám bên trái */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              {t("patient.appointments.select_date")}
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateCalendar
                value={selectedDate}
                onChange={handleDateChange}
                disablePast
                shouldDisableDate={shouldDisableDate}
              />
            </LocalizationProvider>
          </Paper>
        </Grid>

        {/* Phần chọn ca khám bên phải */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: "100%" }}>
            <Typography variant="subtitle1" gutterBottom>
              Chọn ca khám
            </Typography>

            {selectedDate && (
              <Box>
                {/* Hiển thị ngày đã chọn */}
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  {format(selectedDate, "EEEE, MMMM d, yyyy")}
                </Typography>

                {/* Hiển thị loading hoặc danh sách ca khám */}
                {loading ? (
                  <Box
                    sx={{ display: "flex", justifyContent: "center", my: 4 }}
                  >
                    <CircularProgress size={24} />
                  </Box>
                ) : (
                  <Stack spacing={2} sx={{ mb: 2, minHeight: "200px" }}>
                    {availableShifts.length > 0 ? (
                      // Hiển thị các ca khám có sẵn
                      availableShifts.map((shift) => (
                        <Card
                          key={shift.id}
                          variant={
                            selectedShift === shift.shift
                              ? "outlined"
                              : "elevation"
                          }
                          sx={{
                            cursor: isShiftDisabled(shift)
                              ? "not-allowed"
                              : "pointer",
                            bgcolor:
                              selectedShift === shift.shift
                                ? "primary.50"
                                : "background.paper",
                            border:
                              selectedShift === shift.shift
                                ? "1px solid"
                                : "none",
                            borderColor: "primary.main",
                            opacity: isShiftDisabled(shift) ? 0.6 : 1,
                          }}
                          onClick={() =>
                            !isShiftDisabled(shift) &&
                            handleShiftSelect(shift.shift, shift)
                          }
                        >
                          <CardContent>
                            {/* Tên ca khám */}
                            <Typography variant="h6" component="div">
                              {shift.shift}
                            </Typography>
                            {/* Thời gian ca khám */}
                            <Typography variant="body2" color="text.secondary">
                              Thời gian:{" "}
                              {formatTimeFromTimeString(shift.start, "string")}{" "}
                              - {formatTimeFromTimeString(shift.end, "string")}
                            </Typography>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      // Hiển thị thông báo khi không có ca khám nào khả dụng
                      <Typography
                        color="text.secondary"
                        sx={{ py: 3, textAlign: "center" }}
                      >
                        {!hasWorkSchedules
                          ? "Bác sĩ không có lịch làm việc trong ngày này"
                          : t("patient.appointments.no_available_slots")}
                      </Typography>
                    )}
                  </Stack>
                )}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Các nút điều hướng */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
        {/* Nút quay lại */}
        {/* <Button onClick={onBack}>{t("common.back")}</Button> */}
        {/* Nút tiếp tục - vô hiệu hóa nếu chưa chọn đủ thông tin hoặc đã có lịch */}
        <Button
          variant="contained"
          color="primary"
          disabled={!selectedDate || !selectedShift || hasExistingAppointment}
          onClick={handleContinue}
        >
          {t("common.continue")}
        </Button>
      </Box>
    </Box>
  );
};

export default SelectDateTime;
