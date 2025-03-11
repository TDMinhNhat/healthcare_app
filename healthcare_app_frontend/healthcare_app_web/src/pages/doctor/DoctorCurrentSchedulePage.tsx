import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Box,
  Typography,
  Paper,
  Chip,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Stack,
  Modal,
  Button,
} from "@mui/material";
// Import DatePicker từ MUI X
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { viVN } from "@mui/x-date-pickers/locales";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import DateRangeIcon from "@mui/icons-material/DateRange";
import CloseIcon from "@mui/icons-material/Close";
import HomeIcon from "@mui/icons-material/Home";
import {
  format,
  addDays, // Thêm số ngày vào ngày hiện tại
  startOfWeek, // trả về ngày thứ 2 của tuần
  addWeeks,
  subWeeks,
  getYear,
  getMonth,
  isSameDay,
} from "date-fns";
import { vi } from "date-fns/locale";
import {
  formatDateToString,
  parseDateFromString,
  parseDateTimeFromString,
  formatTime,
} from "../../utils/dateUtils";
import { getWorkScheduleBetweenDate } from "../../services/authenticate/workSchedule_service.ts";

// Interface Shift - phù hợp với mô hình cơ sở dữ liệu
interface Shift {
  id: number;
  shift: number;
  start: string; // LocalTime biểu diễn dưới dạng chuỗi (HH:mm)
  end: string; // LocalTime biểu diễn dưới dạng chuỗi (HH:mm)
  status: boolean;
  createdAt?: string; // Thêm theo mô hình
  updatedAt?: string; // Thêm theo mô hình
}

// Interface Doctor - đơn giản hóa từ API
interface Doctor {
  id: number;
  // Các thông tin khác của bác sĩ nếu cần
}

// Interface WorkSchedule - phù hợp với mô hình cơ sở dữ liệu
interface WorkSchedule {
  id: number;
  doctor: Doctor;
  shift: Shift;
  maxSlots: number;
  dateAppointment: string; // LocalDate dạng chuỗi (yyyy-MM-dd)
  createdAt?: string;
  updatedAt?: string;
  status: boolean;
  // Thông tin cuộc hẹn
  totalBook?: number; // Số lượng cuộc hẹn hiện tại
}

// Map date strings (dd-MM-yyyy) to arrays of work schedules - more efficient structure
type ScheduleMap = Record<string, WorkSchedule[]>;

// Định nghĩa các ngày trong tuần với nhãn
const DAYS_OF_WEEK = [
  { key: "MONDAY", label: "Thứ 2" },
  { key: "TUESDAY", label: "Thứ 3" },
  { key: "WEDNESDAY", label: "Thứ 4" },
  { key: "THURSDAY", label: "Thứ 5" },
  { key: "FRIDAY", label: "Thứ 6" },
  { key: "SATURDAY", label: "Thứ 7" },
  { key: "SUNDAY", label: "Chủ nhật" },
];

const DoctorCurrentSchedulePage: React.FC = () => {
  const navigate = useNavigate();
  // Lưu trữ ngày hiện tại
  const [today] = useState(new Date());

  // State lưu ngày bắt đầu của tuần hiện tại (mặc định là thứ 2)
  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(today, { weekStartsOn: 1 })
  );

  // Replace DateSchedule[] with a more efficient mapping
  const [scheduleMap, setScheduleMap] = useState<ScheduleMap>({});

  // State cho modal calendar
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(getMonth(new Date()));
  const [currentYear, setCurrentYear] = useState(getYear(new Date()));

  // Lấy thông tin người dùng
  const user = JSON.parse((sessionStorage.getItem("user") as string) || "{}");

  // Tạo mảng các ngày trong tuần hiện tại
  const getDaysInWeek = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = addDays(currentWeekStart, i);
      days.push({
        date, // Đối tượng Date gốc
        formattedDate: formatDateToString(date), // Chuỗi ngày theo định dạng dd-MM-yyyy
        displayDate: format(date, "dd/MM"), // Chuỗi hiển thị ngắn gọn với ngày tháng
      });
    }
    return days;
  };

  // Mảng các ngày trong tuần hiện tại
  const weekDays = getDaysInWeek();

  // Xử lý chuyển đến tuần trước
  const handlePrevWeek = () => {
    setCurrentWeekStart(subWeeks(currentWeekStart, 1));
  };

  // Xử lý chuyển đến tuần sau
  const handleNextWeek = () => {
    setCurrentWeekStart(addWeeks(currentWeekStart, 1));
  };

  // Xử lý quay về tuần hiện tại
  const handleGoToCurrentWeek = () => {
    setCurrentWeekStart(startOfWeek(today, { weekStartsOn: 1 }));
  };

  // Định dạng hiển thị khoảng thời gian của tuần hiện tại
  const formatWeekRange = () => {
    const weekEnd = addDays(currentWeekStart, 6);
    return `${format(currentWeekStart, "dd/MM/yyyy")} - ${format(
      weekEnd,
      "dd/MM/yyyy"
    )}`;
  };

  // Kiểm tra xem có đang ở tuần hiện tại không
  const isCurrentWeek = () => {
    const actualWeekStart = startOfWeek(today, { weekStartsOn: 1 }).getTime();
    return currentWeekStart.getTime() === actualWeekStart;
  };

  useEffect(() => {
    // Gọi API để lấy lịch làm việc của bác sĩ trong khoảng thời gian của tuần hiện tại
    async function fetchData() {
      if (!user?.userId) return;

      try {
        // Tính ngày bắt đầu và kết thúc của tuần hiện tại
        const startDate = format(currentWeekStart, "dd-MM-yyyy");
        const endDate = format(addDays(currentWeekStart, 6), "dd-MM-yyyy");

        // Gọi API với khoảng thời gian của tuần
        const response = await getWorkScheduleBetweenDate(
          user.userId,
          startDate,
          endDate
        );
        const result = response.data.data || [];
        console.log("Work schedules:", result);

        // Tạo object để lưu trữ lịch theo ngày - cấu trúc đơn giản hơn
        const newScheduleMap: ScheduleMap = {};

        // Xử lý dữ liệu trả về từ API
        result.forEach((i: any) => {
          const item = i.workSchedule;
          console.log("Item:", item);
          // Kiểm tra dữ liệu hợp lệ
          if (!item.dateAppointment) {
            console.error("Thiếu ngày hẹn trong mục lịch làm việc:", item);
            return; // Bỏ qua mục này nếu thiếu ngày hẹn
          }

          // Chuyển đổi định dạng ngày từ API (yyyy-MM-dd) sang định dạng UI (dd-MM-yyyy)
          const dateFromAPI = item.dateAppointment;
          const [year, month, day] = dateFromAPI.split("-");
          const date = new Date(
            parseInt(year),
            parseInt(month) - 1,
            parseInt(day)
          );
          const dateStr = formatDateToString(date); // Chuyển thành dd-MM-yyyy

          // Xử lý thông tin ca làm việc từ API
          const shiftData = item.shift;

          // Kiểm tra dữ liệu ca làm việc tồn tại
          if (!shiftData) {
            console.error("Thiếu thông tin ca làm việc:", item);
            return; // Bỏ qua mục này nếu thiếu thông tin ca
          }

          // Chuyển đổi định dạng thời gian nếu cần
          const formatTimeString = (timeStr: string) => {
            // Nếu định dạng là "hh-mm-ss", chuyển thành "hh:mm"
            if (timeStr.includes("-")) {
              return timeStr.split("-").slice(0, 2).join(":");
            }
            return timeStr; // Giữ nguyên nếu đã đúng định dạng
          };

          // Tạo đối tượng Shift (đảm bảo đúng theo cấu trúc mô hình)
          const shift: Shift = {
            id: shiftData.id,
            shift: shiftData.shift,
            start: formatTimeString(shiftData.start),
            end: formatTimeString(shiftData.end),
            status: shiftData.status,
            createdAt: shiftData.createdAt,
            updatedAt: shiftData.updatedAt,
          };

          // Tính toán số chỗ trống còn lại (mô phỏng, thực tế sẽ từ API)
          const totalBook = item?.detail?.information?.total_book ?? 0;

          // Tạo đối tượng WorkSchedule phù hợp với mô hình và UI
          const workSchedule: WorkSchedule = {
            id: item.id,
            doctor: item.doctor,
            shift: shift,
            maxSlots: item.maxSlots,
            dateAppointment: item.dateAppointment,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            status: item.status,
            totalBook: totalBook,
          };

          // Thêm vào map theo ngày - đơn giản và hiệu quả hơn
          if (!newScheduleMap[dateStr]) {
            newScheduleMap[dateStr] = [];
          }
          newScheduleMap[dateStr].push(workSchedule);
        });

        setScheduleMap(newScheduleMap);
      } catch (error) {
        console.error("Lỗi khi lấy lịch làm việc:", error);
      }
    }

    fetchData();
  }, [currentWeekStart, user?.userId]);

  // Tìm tất cả các lịch làm việc cho một ngày cụ thể - truy cập nhanh O(1)
  const getSchedulesForDate = (date: string): WorkSchedule[] => {
    return scheduleMap[date] || [];
  };

  // Kiểm tra xem một ngày có ca 1 không
  const hasShift1 = (date: string): boolean => {
    const schedules = getSchedulesForDate(date);
    return schedules.some((schedule) => schedule.shift.shift === 1);
  };

  // Kiểm tra xem một ngày có ca 2 không
  const hasShift2 = (date: string): boolean => {
    const schedules = getSchedulesForDate(date);
    return schedules.some((schedule) => schedule.shift.shift === 2);
  };

  // Lấy thông tin ca 1 cho ngày cụ thể
  const getShift1Schedule = (date: string): WorkSchedule | undefined => {
    const schedules = getSchedulesForDate(date);
    return schedules.find((schedule) => schedule.shift.shift === 1);
  };

  // Lấy thông tin ca 2 cho ngày cụ thể
  const getShift2Schedule = (date: string): WorkSchedule | undefined => {
    const schedules = getSchedulesForDate(date);
    return schedules.find((schedule) => schedule.shift.shift === 2);
  };

  // Lấy thông tin thời gian ca 1 (nếu có)
  const getShift1Time = (
    date: string
  ): { start: string; end: string } | null => {
    const shift1 = getShift1Schedule(date);
    return shift1 ? { start: shift1.shift.start, end: shift1.shift.end } : null;
  };

  // Lấy thông tin thời gian ca 2 (nếu có)
  const getShift2Time = (
    date: string
  ): { start: string; end: string } | null => {
    const shift2 = getShift2Schedule(date);
    return shift2 ? { start: shift2.shift.start, end: shift2.shift.end } : null;
  };

  // Xử lý chuyển hướng đến trang chi tiết ca khám
  const handleAppointmentClick = (date: string, shift: number) => {
    // Tạo ID cuộc hẹn từ ngày và ca làm việc
    const appointmentId = `${date.replace(/-/g, "")}-${shift}`;
    navigate(`/doctor/appointments/${appointmentId}`);
  };

  // Hiển thị trạng thái ca làm việc
  const renderShiftStatus = (hasShift: boolean, date: string, shift: 1 | 2) => {
    if (!hasShift) {
      return (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            width: "100%",
            py: 1,
          }}
        >
          <Chip
            label="Không có ca"
            size="small"
            variant="outlined"
            sx={{
              color: "text.disabled",
              borderColor: "text.disabled",
              fontSize: "0.75rem",
              width: "120px",
              height: "30px",
              justifyContent: "center",
            }}
          />
        </Box>
      );
    }

    // Lấy thông tin ca làm việc
    const shiftSchedule =
      shift === 1 ? getShift1Schedule(date) : getShift2Schedule(date);

    if (!shiftSchedule) return null;

    // Calculate fill rate for color indication
    const fillRate = shiftSchedule.totalBook / shiftSchedule.maxSlots;
    let textColor = "#333";

    if (fillRate >= 0.8) {
      textColor = "#d32f2f"; // Red text when nearly full
    } else if (fillRate >= 0.5) {
      textColor = "#ed6c02"; // Orange text when half full
    }

    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          width: "100%",
          py: 1,
        }}
      >
        <Button
          variant="contained"
          onClick={() => handleAppointmentClick(date, shift)}
          sx={{
            backgroundColor: "#f5f5f5",
            color: textColor,
            border: "1px solid #ddd",
            boxShadow: 1,
            "&:hover": {
              backgroundColor: "#e0e0e0",
              boxShadow: 2,
            },
            textTransform: "none",
            width: "120px",
            height: "30px",
            padding: "4px 8px",
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: "medium" }}>
            {shiftSchedule.totalBook}/{shiftSchedule.maxSlots} cuộc hẹn
          </Typography>
        </Button>
      </Box>
    );
  };

  // Mở calendar modal
  const handleOpenCalendar = () => {
    setCalendarOpen(true);
  };

  // Đóng calendar modal
  const handleCloseCalendar = () => {
    setCalendarOpen(false);
  };

  // Chuyển đến tháng trước
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  // Chuyển đến tháng sau
  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Xử lý khi chọn ngày từ calendar
  const handleDateSelect = (date: Date) => {
    setCurrentDate(date);
    // Lấy tuần chứa ngày đã chọn (từ thứ 2)
    const weekStart = startOfWeek(date, { weekStartsOn: 1 });
    setCurrentWeekStart(weekStart);
    setCalendarOpen(false);
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* Tiêu đề trang */}
      <Typography
        variant="h5"
        component="h1"
        gutterBottom
        sx={{ display: "flex", alignItems: "center", mb: 2 }}
      >
        <CalendarMonthIcon sx={{ mr: 1, fontSize: 20 }} />
        Lịch Làm Việc Hiện Tại
      </Typography>

      {/* Thông báo thông tin - chỉ xem */}
      <Box sx={{ mb: 2 }}>
        <Alert severity="info" sx={{ py: 0.5 }}>
          Đây là lịch làm việc của bác sĩ. Bạn chỉ có thể xem, không thể chỉnh
          sửa trực tiếp.
        </Alert>
      </Box>

      {/* Điều hướng theo tuần */}
      <Paper sx={{ mb: 3, p: 2 }}>
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          justifyContent="center"
        >
          <IconButton onClick={handlePrevWeek} aria-label="Tuần trước">
            <NavigateBeforeIcon />
          </IconButton>

          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="h6" sx={{ textAlign: "center" }}>
              {formatWeekRange()}
              {isCurrentWeek() && (
                <Typography variant="caption" display="block" color="primary">
                  Tuần hiện tại
                </Typography>
              )}
            </Typography>

            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                size="small"
                onClick={handleGoToCurrentWeek}
                disabled={isCurrentWeek()}
              >
                Tuần hiện tại
              </Button>

              <Button
                startIcon={<DateRangeIcon />}
                variant="outlined"
                size="small"
                onClick={handleOpenCalendar}
              >
                Chọn ngày
              </Button>
            </Stack>
          </Stack>

          <IconButton onClick={handleNextWeek} aria-label="Tuần sau">
            <NavigateNextIcon />
          </IconButton>
        </Stack>
      </Paper>

      {/* Calendar Modal */}
      <Modal
        open={calendarOpen}
        onClose={handleCloseCalendar}
        aria-labelledby="modal-calendar"
        aria-describedby="modal-choose-date"
      >
        <Paper
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "auto",
            maxWidth: "90%",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 2,
            borderRadius: 1,
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 1 }}
          >
            <Typography variant="h6" component="h2">
              Chọn ngày
            </Typography>
            <IconButton onClick={handleCloseCalendar} size="small">
              <CloseIcon fontSize="small" />
            </IconButton>
          </Stack>

          <LocalizationProvider
            dateAdapter={AdapterDateFns}
            adapterLocale={vi}
            localeText={
              viVN.components.MuiLocalizationProvider.defaultProps.localeText
            }
          >
            <DateCalendar
              value={currentDate}
              onChange={(newDate) => handleDateSelect(newDate as Date)}
              sx={{ width: 320 }}
            />
          </LocalizationProvider>

          <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
            <Button onClick={handleCloseCalendar}>Đóng</Button>
          </Box>
        </Paper>
      </Modal>

      {/* Bảng lịch làm việc theo tuần */}
      <Paper sx={{ mb: 3, overflow: "auto" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold", width: "100px" }}>
                  Ca làm việc
                </TableCell>

                {/* Tiêu đề các ngày trong tuần */}
                {weekDays.map((day, index) => (
                  <TableCell
                    key={day.formattedDate}
                    align="center"
                    sx={{ fontWeight: "bold", minWidth: "150px" }}
                  >
                    {DAYS_OF_WEEK[index].label}
                    <Typography variant="body2" color="textSecondary">
                      {day.displayDate}
                    </Typography>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {/* Hàng cho ca 1 */}
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>
                  Ca 1
                  <Typography
                    variant="caption"
                    display="block"
                    color="textSecondary"
                  >
                    {/* Hiển thị thông tin ca 1 từ dữ liệu động */}
                    {weekDays.some((day) => hasShift1(day.formattedDate))
                      ? weekDays
                          .map((day) => getShift1Time(day.formattedDate))
                          .filter(Boolean)[0]?.start
                      : ""}{" "}
                    -{" "}
                    {weekDays.some((day) => hasShift1(day.formattedDate))
                      ? weekDays
                          .map((day) => getShift1Time(day.formattedDate))
                          .filter(Boolean)[0]?.end
                      : ""}
                  </Typography>
                </TableCell>

                {/* Các ô trạng thái cho ca 1 của từng ngày */}
                {weekDays.map((day) => (
                  <TableCell
                    key={`${day.formattedDate}-shift1`}
                    align="center"
                    sx={{ verticalAlign: "center", p: 1 }}
                  >
                    {renderShiftStatus(
                      hasShift1(day.formattedDate),
                      day.formattedDate,
                      1
                    )}
                  </TableCell>
                ))}
              </TableRow>

              {/* Hàng cho ca 2 */}
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>
                  Ca 2
                  <Typography
                    variant="caption"
                    display="block"
                    color="textSecondary"
                  >
                    {/* Hiển thị thông tin ca 2 từ dữ liệu động */}
                    {weekDays.some((day) => hasShift2(day.formattedDate))
                      ? weekDays
                          .map((day) => getShift2Time(day.formattedDate))
                          .filter(Boolean)[0]?.start
                      : ""}{" "}
                    -{" "}
                    {weekDays.some((day) => hasShift2(day.formattedDate))
                      ? weekDays
                          .map((day) => getShift2Time(day.formattedDate))
                          .filter(Boolean)[0]?.end
                      : ""}
                  </Typography>
                </TableCell>

                {/* Các ô trạng thái cho ca 2 của từng ngày */}
                {weekDays.map((day) => (
                  <TableCell
                    key={`${day.formattedDate}-shift2`}
                    align="center"
                    sx={{ verticalAlign: "center", p: 1 }}
                  >
                    {renderShiftStatus(
                      hasShift2(day.formattedDate),
                      day.formattedDate,
                      2
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default DoctorCurrentSchedulePage;
