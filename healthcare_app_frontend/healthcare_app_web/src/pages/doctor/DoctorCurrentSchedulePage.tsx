import React, { useState, useEffect } from "react";
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
  addDays,
  startOfWeek,
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
import { getWorkSchedule } from "../../services/workSchedule_service.ts";

// Enum TypeDay - phù hợp với mô hình UML
enum TypeDay {
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
  SATURDAY = "SATURDAY",
  SUNDAY = "SUNDAY",
}

// Interface Shift - phù hợp với mô hình UML
interface Shift {
  id: number;
  shift: number;
  start: string; // LocalTime biểu diễn dưới dạng chuỗi (HH:mm)
  end: string; // LocalTime biểu diễn dưới dạng chuỗi (HH:mm)
  status: boolean;
}

// Interface WorkSchedule - phù hợp với mô hình UML
interface WorkSchedule {
  id: number;
  doctorId: number; // Tham chiếu đến thực thể Doctor
  typeDay: TypeDay;
  shift: Shift;
  status: boolean;
  // Các trường bổ sung cho mục đích UI
  isAvailable: boolean;
  roomId?: string;
  patientId?: number;
  appointmentStatus?: "WAITING" | "IN_PROGRESS" | "DONE" | "CANCELLED";
}

// Interface cho lịch làm việc được nhóm theo ngày (cho mục đích UI)
interface DateSchedule {
  date: string; // Ngày ở định dạng dd-MM-yyyy
  workSchedules: WorkSchedule[];
}

// Định nghĩa các ca cố định
const SHIFTS: Record<string, Shift> = {
  CA1: { id: 1, shift: 1, start: "08:00", end: "12:00", status: true },
  CA2: { id: 2, shift: 2, start: "13:00", end: "17:00", status: true },
};

// Định nghĩa các ngày trong tuần với nhãn
const DAYS_OF_WEEK = [
  { key: TypeDay.MONDAY, label: "Thứ 2" },
  { key: TypeDay.TUESDAY, label: "Thứ 3" },
  { key: TypeDay.WEDNESDAY, label: "Thứ 4" },
  { key: TypeDay.THURSDAY, label: "Thứ 5" },
  { key: TypeDay.FRIDAY, label: "Thứ 6" },
  { key: TypeDay.SATURDAY, label: "Thứ 7" },
  { key: TypeDay.SUNDAY, label: "Chủ nhật" },
];

const DoctorCurrentSchedulePage: React.FC = () => {
  // Lưu trữ ngày hiện tại
  const [today] = useState(new Date());

  // State lưu ngày bắt đầu của tuần hiện tại (mặc định là thứ 2)
  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(today, { weekStartsOn: 1 })
  );

  // State lưu trữ lịch làm việc
  const [schedule, setSchedule] = useState<DateSchedule[]>([]);

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
    // Gọi API để lấy lịch làm việc của bác sĩ
    async function fetchData() {
      if (!user?.user?.userId) return;

      try {
        const response = await getWorkSchedule(user.user.userId);
        const result = response.data.data;

        // Tạo mảng lưu trữ lịch theo ngày
        let dateSchedules: DateSchedule[] = [];

        // Xử lý dữ liệu trả về từ API
        result.forEach((item: any) => {
          const [day, month, year, hour, minute, second] =
            item.workSchedule.start.split("-");
          const date: Date = new Date(year, month - 1, day);
          const dateStr = formatDateToString(date);

          const start: Date = parseDateTimeFromString(item.workSchedule.start);
          const end: Date = parseDateTimeFromString(item.workSchedule.end);

          // Xác định ca làm việc dựa trên giờ bắt đầu
          const shiftNumber = start.getHours() < 12 ? 1 : 2;
          const shift = { ...(shiftNumber === 1 ? SHIFTS.CA1 : SHIFTS.CA2) };

          // Xác định ngày trong tuần
          const dayOfWeek = date.getDay();
          const typeDayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Chuyển đổi thành chỉ mục 0-6 (Thứ 2=0, Chủ nhật=6)
          const typeDay = Object.values(TypeDay)[typeDayIndex];

          // Tạo đối tượng WorkSchedule
          const workSchedule: WorkSchedule = {
            id: item.id || Math.floor(Math.random() * 1000), // Tạo ID ngẫu nhiên nếu không được cung cấp
            doctorId: user.user.userId,
            typeDay: typeDay,
            shift: shift,
            status: true,
            isAvailable: item.isAvailable,
            roomId: item.isAvailable
              ? undefined
              : `P${100 + Math.floor(Math.random() * 20)}`,
            patientId: item.isAvailable
              ? undefined
              : 1000 + Math.floor(Math.random() * 1000),
            appointmentStatus: item.isAvailable
              ? undefined
              : (["WAITING", "IN_PROGRESS", "DONE", "CANCELLED"][
                  Math.floor(Math.random() * 4)
                ] as any),
          };

          // Tìm lịch theo ngày hoặc tạo mới
          let dateSchedule = dateSchedules.find((ds) => ds.date === dateStr);
          if (dateSchedule) {
            dateSchedule.workSchedules.push(workSchedule);
          } else {
            dateSchedules.push({
              date: dateStr,
              workSchedules: [workSchedule],
            });
          }
        });

        setSchedule(dateSchedules);
      } catch (error) {
        console.log(error);
      }
    }

    fetchData();
  }, [currentWeekStart, user?.user?.userId]);

  // Tìm tất cả các work schedules cho một ngày cụ thể
  const getSchedulesForDate = (date: string): WorkSchedule[] => {
    const dateSchedule = schedule.find((s) => s.date === date);
    return dateSchedule ? dateSchedule.workSchedules : [];
  };

  // Kiểm tra xem một ngày có ca 1 không
  const hasShift1 = (date: string): boolean => {
    const schedules = getSchedulesForDate(date);
    return schedules.some((schedule) => schedule.shift.shift === 1);
  };

  // Kiểm tra xem ca 1 có sẵn sàng không
  const isShift1Available = (date: string): boolean => {
    const schedules = getSchedulesForDate(date);
    const shift1Schedules = schedules.filter(
      (schedule) => schedule.shift.shift === 1
    );
    return shift1Schedules.some((schedule) => schedule.isAvailable);
  };

  // Kiểm tra xem một ngày có ca 2 không
  const hasShift2 = (date: string): boolean => {
    const schedules = getSchedulesForDate(date);
    return schedules.some((schedule) => schedule.shift.shift === 2);
  };

  // Kiểm tra xem ca 2 có sẵn sàng không
  const isShift2Available = (date: string): boolean => {
    const schedules = getSchedulesForDate(date);
    const shift2Schedules = schedules.filter(
      (schedule) => schedule.shift.shift === 2
    );
    return shift2Schedules.some((schedule) => schedule.isAvailable);
  };

  // Hiển thị trạng thái ca làm việc cùng với thông tin phòng
  const renderShiftStatus = (
    hasShift: boolean,
    isAvailable: boolean,
    date: string,
    shift: 1 | 2
  ) => {
    if (!hasShift) {
      return (
        <Box sx={{ textAlign: "center" }}>
          <Chip
            label="Không có ca"
            size="small"
            variant="outlined"
            sx={{
              color: "text.disabled",
              borderColor: "text.disabled",
              fontSize: "0.75rem",
            }}
          />
        </Box>
      );
    }

    // Lấy các lịch làm việc cho ca cụ thể
    const schedules = getSchedulesForDate(date);
    const shiftSchedules = schedules.filter((s) => s.shift.shift === shift);

    // Nếu không có cuộc hẹn nào, hiển thị trạng thái "Còn trống"
    if (isAvailable || shiftSchedules.every((s) => s.isAvailable)) {
      return (
        <Box sx={{ textAlign: "center" }}>
          <Paper
            elevation={0}
            sx={{
              border: "1px solid",
              borderColor: "success.main",
              bgcolor: "success.50",
              py: 0.5,
              px: 1,
              display: "inline-block",
              minWidth: "120px",
            }}
          >
            <Typography variant="body2" fontWeight="medium">
              Còn trống
            </Typography>
          </Paper>
        </Box>
      );
    }

    // Hiển thị các cuộc hẹn đã được lên lịch
    return (
      <Box
        sx={{
          textAlign: "center",
          minHeight: "100px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {shiftSchedules
          .filter((s) => !s.isAvailable)
          .map((s, index) => {
            const getStatusColor = () => {
              switch (s.appointmentStatus) {
                case "WAITING":
                  return { bg: "#e3f2fd", border: "#2196f3", text: "#0d47a1" };
                case "IN_PROGRESS":
                  return { bg: "#ede7f6", border: "#673ab7", text: "#311b92" };
                case "DONE":
                  return { bg: "#e8f5e9", border: "#4caf50", text: "#1b5e20" };
                case "CANCELLED":
                  return { bg: "#ffebee", border: "#f44336", text: "#b71c1c" };
                default:
                  return { bg: "#f5f5f5", border: "#9e9e9e", text: "#212121" };
              }
            };

            const colors = getStatusColor();

            return (
              <Paper
                key={`${date}-${shift}-${index}`}
                sx={{
                  p: 1,
                  mb: 1,
                  backgroundColor: colors.bg,
                  borderLeft: `4px solid ${colors.border}`,
                  width: "100%",
                }}
              >
                {s.roomId && (
                  <Typography variant="body2" sx={{ color: colors.text }}>
                    Phòng: <strong>{s.roomId}</strong>
                  </Typography>
                )}
              </Paper>
            );
          })}
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
                    {SHIFTS.CA1.start} - {SHIFTS.CA1.end}
                  </Typography>
                </TableCell>

                {/* Các ô trạng thái cho ca 1 của từng ngày */}
                {weekDays.map((day) => (
                  <TableCell
                    key={`${day.formattedDate}-shift1`}
                    align="center"
                    sx={{ verticalAlign: "top", p: 1 }}
                  >
                    {renderShiftStatus(
                      hasShift1(day.formattedDate),
                      isShift1Available(day.formattedDate),
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
                    {SHIFTS.CA2.start} - {SHIFTS.CA2.end}
                  </Typography>
                </TableCell>

                {/* Các ô trạng thái cho ca 2 của từng ngày */}
                {weekDays.map((day) => (
                  <TableCell
                    key={`${day.formattedDate}-shift2`}
                    align="center"
                    sx={{ verticalAlign: "top", p: 1 }}
                  >
                    {renderShiftStatus(
                      hasShift2(day.formattedDate),
                      isShift2Available(day.formattedDate),
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

      {/* Thêm chú thích trạng thái lịch hẹn */}
      <Box mt={2} display="flex" justifyContent="center">
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                bgcolor: "#2196f3",
                borderRadius: "50%",
                mr: 1,
              }}
            />
            <Typography variant="caption">Chờ khám</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                bgcolor: "#673ab7",
                borderRadius: "50%",
                mr: 1,
              }}
            />
            <Typography variant="caption">Đang khám</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                bgcolor: "#4caf50",
                borderRadius: "50%",
                mr: 1,
              }}
            />
            <Typography variant="caption">Đã khám</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                bgcolor: "#f44336",
                borderRadius: "50%",
                mr: 1,
              }}
            />
            <Typography variant="caption">Đã hủy</Typography>
          </Box>
        </Stack>
      </Box>

      {/* <Alert severity="info" sx={{ width: "auto", mt: 2 }}>
        <Typography variant="body2">
          Các lịch hẹn sẽ hiển thị mã phòng khám và ID bệnh nhân khi đã được đặt
          lịch. Màu sắc thể hiện trạng thái của lịch hẹn.
        </Typography>
      </Alert> */}
    </Box>
  );
};

export default DoctorCurrentSchedulePage;
