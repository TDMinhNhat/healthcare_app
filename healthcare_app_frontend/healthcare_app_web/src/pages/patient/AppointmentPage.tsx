import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  IconButton,
  Stack,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import DateRangeIcon from "@mui/icons-material/DateRange";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import BookAppointment from "../../components/appointments/BookAppointment";

// Import DatePicker components
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { viVN } from "@mui/x-date-pickers/locales";

// Import date-fns functions
import {
  format,
  addDays,
  startOfWeek,
  addWeeks,
  subWeeks,
  getYear,
  getMonth,
} from "date-fns";
import { vi } from "date-fns/locale";
import { formatDateToString, formatTime } from "../../utils/dateUtils";

// Định nghĩa TypeDay enum để phù hợp với mô hình UML
enum TypeDay {
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
  SATURDAY = "SATURDAY",
  SUNDAY = "SUNDAY",
}

// Định nghĩa các ngày trong tuần sử dụng enum TypeDay
const DAYS_OF_WEEK = [
  { key: TypeDay.MONDAY, label: "Thứ 2" },
  { key: TypeDay.TUESDAY, label: "Thứ 3" },
  { key: TypeDay.WEDNESDAY, label: "Thứ 4" },
  { key: TypeDay.THURSDAY, label: "Thứ 5" },
  { key: TypeDay.FRIDAY, label: "Thứ 6" },
  { key: TypeDay.SATURDAY, label: "Thứ 7" },
  { key: TypeDay.SUNDAY, label: "Chủ nhật" },
];

// Định nghĩa giao diện Appointment - lịch hẹn khám bệnh của bệnh nhân
interface Appointment {
  id: number;
  date: string; // Định dạng: dd-MM-yyyy
  startTime: string; // Định dạng: HH:mm
  endTime: string; // Định dạng: HH:mm
  status: "WAITING" | "IN_PROGRESS" | "DONE" | "CANCELLED"; // Trạng thái cuộc hẹn
  doctorName: string; // Tên bác sĩ
  specialization: string; // Chuyên khoa
  reason?: string; // Lý do khám
  // Thêm trường để phù hợp với WorkSchedule
  doctorId?: number; // ID của bác sĩ
  typeDay?: TypeDay; // Ngày trong tuần
  shiftId?: number; // ID ca khám
}

// Định nghĩa giao diện Shift để phù hợp với mô hình UML
interface Shift {
  id: number; // ID của ca
  shift: number; // Số thứ tự ca (1 hoặc 2)
  start: string; // Thời gian bắt đầu, định dạng: HH:mm
  end: string; // Thời gian kết thúc, định dạng: HH:mm
  status: boolean; // Trạng thái hoạt động của ca
}

// Định nghĩa các ca làm việc cố định để khớp với lịch của bác sĩ
const SHIFTS: Record<string, Shift> = {
  CA1: { id: 1, shift: 1, start: "08:00", end: "12:00", status: true }, // Ca sáng
  CA2: { id: 2, shift: 2, start: "13:00", end: "17:00", status: true }, // Ca chiều
};

const AppointmentPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showBooking, setShowBooking] = useState(false);
  const user = useSelector((state: any) => state.user.user);

  // Các state quản lý hiển thị lịch
  const [today] = useState(new Date()); // Ngày hiện tại
  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(today, { weekStartsOn: 1 }) // Bắt đầu tuần từ thứ 2
  );
  const [calendarOpen, setCalendarOpen] = useState(false); // Trạng thái hiển thị modal calendar
  const [currentDate, setCurrentDate] = useState(new Date()); // Ngày hiện tại đang chọn
  const [currentMonth, setCurrentMonth] = useState(getMonth(new Date())); // Tháng hiện tại
  const [currentYear, setCurrentYear] = useState(getYear(new Date())); // Năm hiện tại

  // State quản lý dữ liệu lịch hẹn
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  // Lấy dữ liệu lịch hẹn khi component được render
  useEffect(() => {
    (async () => {
      const getUserId = user.userId;
      console.log(getUserId);

      // Lấy dữ liệu lịch hẹn mẫu
      const mockData = getMockAppointments();
      setAppointments(mockData);
    })();
  }, []);

  // Xử lý khi người dùng muốn đặt lịch hẹn mới
  const handleBookingClick = () => {
    setShowBooking(true);
  };

  // Xử lý khi người dùng đóng form đặt lịch
  const handleBookingClose = () => {
    setShowBooking(false);
  };

  // Các hàm điều hướng lịch
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

  // Lấy danh sách các ngày trong tuần
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

  // Các hàm xử lý modal lịch
  // Mở modal chọn ngày
  const handleOpenCalendar = () => {
    setCalendarOpen(true);
  };

  // Đóng modal chọn ngày
  const handleCloseCalendar = () => {
    setCalendarOpen(false);
  };

  // Xử lý khi người dùng chọn một ngày từ lịch
  const handleDateSelect = (date: Date) => {
    setCurrentDate(date);
    // Lấy tuần chứa ngày đã chọn (bắt đầu từ thứ 2)
    const weekStart = startOfWeek(date, { weekStartsOn: 1 });
    setCurrentWeekStart(weekStart);
    setCalendarOpen(false);
  };

  // Tạo dữ liệu lịch hẹn mẫu
  const getMockAppointments = (): Appointment[] => {
    // Get current date and format it
    const currentDate = new Date();

    // Get dates for this week (starting from Monday)
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });

    // Create mock appointments
    return [
      // WAITING appointments
      {
        id: 1,
        date: formatDateToString(addDays(weekStart, 0)), // Monday
        startTime: "09:00",
        endTime: "09:30",
        status: "WAITING",
        doctorName: "Dr. Nguyễn Văn A",
        specialization: "Tim mạch",
        reason: "Khám định kỳ",
      },
      {
        id: 2,
        date: formatDateToString(addDays(weekStart, 2)), // Wednesday
        startTime: "10:30",
        endTime: "11:00",
        status: "WAITING",
        doctorName: "Dr. Trần Thị B",
        specialization: "Da liễu",
        reason: "Phát ban trên da",
      },

      // IN_PROGRESS appointments
      {
        id: 3,
        date: formatDateToString(currentDate), // Today
        startTime: "08:45",
        endTime: "09:15",
        status: "IN_PROGRESS",
        doctorName: "Dr. Lê Văn C",
        specialization: "Nội tiết",
        reason: "Tiểu đường",
      },

      // DONE appointments
      {
        id: 4,
        date: formatDateToString(addDays(weekStart, -2)), // Last week
        startTime: "14:00",
        endTime: "14:30",
        status: "DONE",
        doctorName: "Dr. Phạm Thị D",
        specialization: "Tai mũi họng",
        reason: "Viêm xoang",
      },
      {
        id: 5,
        date: formatDateToString(addDays(weekStart, -1)), // Yesterday
        startTime: "15:30",
        endTime: "16:00",
        status: "DONE",
        doctorName: "Dr. Hoàng Văn E",
        specialization: "Mắt",
        reason: "Khám mắt định kỳ",
      },

      // CANCELLED appointments
      {
        id: 6,
        date: formatDateToString(addDays(weekStart, 3)), // Thursday
        startTime: "13:30",
        endTime: "14:00",
        status: "CANCELLED",
        doctorName: "Dr. Ngô Thị F",
        specialization: "Thần kinh",
        reason: "Đau đầu thường xuyên",
      },

      // Add more appointments for current week
      {
        id: 7,
        date: formatDateToString(addDays(weekStart, 1)), // Tuesday
        startTime: "11:00",
        endTime: "11:30",
        status: "WAITING",
        doctorName: "Dr. Đặng Văn G",
        specialization: "Cơ xương khớp",
        reason: "Đau lưng mãn tính",
      },
      {
        id: 8,
        date: formatDateToString(addDays(weekStart, 4)), // Friday
        startTime: "09:30",
        endTime: "10:00",
        status: "WAITING",
        doctorName: "Dr. Mai Thị H",
        specialization: "Dinh dưỡng",
        reason: "Tư vấn chế độ ăn",
      },
      {
        id: 9,
        date: formatDateToString(addDays(weekStart, 1)), // Tuesday
        startTime: "14:30",
        endTime: "15:00",
        status: "CANCELLED",
        doctorName: "Dr. Vũ Văn I",
        specialization: "Nhi khoa",
        reason: "Khám tổng quát cho trẻ",
      },
    ];
  };

  // Lọc lịch hẹn cho một ngày và ca cụ thể
  const getAppointmentsForDateAndShift = (date: string, shift: 1 | 2) => {
    const filtered = appointments.filter((appointment) => {
      // Kiểm tra xem lịch hẹn có phải trên ngày đã chỉ định không
      if (appointment.date !== date) return false;

      // Kiểm tra xem lịch hẹn có thuộc ca đã chỉ định không
      const hour = parseInt(appointment.startTime.split(":")[0]);
      if (shift === 1 && hour >= 8 && hour < 12) {
        return true;
      }
      if (shift === 2 && hour >= 13 && hour < 17) {
        return true;
      }

      return false;
    });

    return filtered;
  };

  // Navigate to appointment details page
  const handleAppointmentClick = (appointmentId: number) => {
    navigate(`/patient/appointments/${appointmentId}`);
  };

  // Hiển thị thông tin cuộc hẹn với ID, lý do khám và tên bác sĩ
  const renderAppointmentItem = (appointment: Appointment) => {
    // Lấy màu sắc tương ứng với trạng thái lịch hẹn
    const getStatusColor = () => {
      switch (appointment.status) {
        case "WAITING": // Đang chờ khám
          return { bg: "#e3f2fd", border: "#2196f3", text: "#0d47a1" };
        case "IN_PROGRESS": // Đang khám
          return { bg: "#ede7f6", border: "#673ab7", text: "#311b92" };
        case "DONE": // Đã khám xong
          return { bg: "#e8f5e9", border: "#4caf50", text: "#1b5e20" };
        case "CANCELLED": // Đã hủy
          return { bg: "#ffebee", border: "#f44336", text: "#b71c1c" };
        default:
          return { bg: "#f5f5f5", border: "#9e9e9e", text: "#212121" };
      }
    };

    const colors = getStatusColor();

    // Hiển thị thông tin lịch hẹn với tooltip
    return (
      <Tooltip
        title={
          <>
            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
              ID: {appointment.id}
            </Typography>
            <Typography variant="body2">
              Bác sĩ: {appointment.doctorName}
            </Typography>
            <Typography variant="body2">
              Lý do: {appointment.reason || "Không có"}
            </Typography>
          </>
        }
        arrow
      >
        <Paper
          sx={{
            p: 1,
            mb: 1,
            backgroundColor: colors.bg,
            borderLeft: `4px solid ${colors.border}`,
            cursor: "pointer",
            "&:hover": {
              boxShadow: 1,
              opacity: 0.9,
            },
          }}
          onClick={() => handleAppointmentClick(appointment.id)}
        >
          {/* Hiển thị ID và tên bác sĩ */}
          <Typography
            variant="body2"
            sx={{ fontWeight: "bold", color: colors.text }}
          >
            STT: {appointment.id}
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: colors.text, fontWeight: "medium" }}
          >
            BS: {appointment.doctorName.split(" ").pop()}
          </Typography>
          <Typography
            variant="caption"
            sx={{ display: "block", color: colors.text }}
          >
            {appointment.reason || "Không có lý do"}
          </Typography>
        </Paper>
      </Tooltip>
    );
  };

  // Hiển thị chip trạng thái cuộc hẹn
  const renderAppointmentStatus = (status: string) => {
    let color = "default";
    let label = "Không xác định";

    switch (status) {
      case "WAITING":
        color = "primary";
        label = "Chờ khám";
        break;
      case "IN_PROGRESS":
        color = "info";
        label = "Đang khám";
        break;
      case "DONE":
        color = "success";
        label = "Đã khám";
        break;
      case "CANCELLED":
        color = "error";
        label = "Đã hủy";
        break;
    }

    return (
      <Chip
        color={color as any}
        label={label}
        size="small"
        sx={{ fontSize: "0.625rem", height: "20px" }}
      />
    );
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography
          variant="h5"
          component="h1"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <CalendarMonthIcon sx={{ mr: 1, fontSize: 24 }} />
          {t("patient.appointments.title")}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleBookingClick}
          disabled={showBooking}
        >
          {t("patient.appointments.book_new")}
        </Button>
      </Box>

      {showBooking ? (
        <Paper sx={{ p: 3, mb: 3 }}>
          <BookAppointment
            onClose={handleBookingClose}
            patientId={user.userId}
          />
        </Paper>
      ) : (
        <Paper sx={{ width: "100%", mb: 3 }}>
          <Box sx={{ p: 3 }}>
            {/* Calendar Navigation */}
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
                      <Typography
                        variant="caption"
                        display="block"
                        color="primary"
                      >
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

            {/* Weekly Calendar View */}
            <Paper sx={{ mb: 3, overflow: "auto" }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{ fontWeight: "bold", width: "100px" }}
                      ></TableCell>

                      {/* Day column headers */}
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
                    {/* Ca 1 appointments row */}
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

                      {weekDays.map((day) => (
                        <TableCell
                          key={`${day.formattedDate}-ca1`}
                          align="center"
                          sx={{ verticalAlign: "top", p: 1 }}
                        >
                          {/* Display Ca 1 appointments */}
                          <Box
                            sx={{
                              minHeight: "100px",
                              display: "flex",
                              flexDirection: "column",
                            }}
                          >
                            {getAppointmentsForDateAndShift(
                              day.formattedDate,
                              1
                            ).length > 0 ? (
                              getAppointmentsForDateAndShift(
                                day.formattedDate,
                                1
                              ).map((appointment) => (
                                <Box key={appointment.id}>
                                  {renderAppointmentItem(appointment)}
                                </Box>
                              ))
                            ) : (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ fontStyle: "italic", py: 3 }}
                              >
                                Không có lịch hẹn
                              </Typography>
                            )}
                          </Box>
                        </TableCell>
                      ))}
                    </TableRow>

                    {/* Ca 2 appointments row */}
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

                      {weekDays.map((day) => (
                        <TableCell
                          key={`${day.formattedDate}-ca2`}
                          align="center"
                          sx={{ verticalAlign: "top", p: 1 }}
                        >
                          {/* Display Ca 2 appointments */}
                          <Box
                            sx={{
                              minHeight: "100px",
                              display: "flex",
                              flexDirection: "column",
                            }}
                          >
                            {getAppointmentsForDateAndShift(
                              day.formattedDate,
                              2
                            ).length > 0 ? (
                              getAppointmentsForDateAndShift(
                                day.formattedDate,
                                2
                              ).map((appointment) => (
                                <Box key={appointment.id}>
                                  {renderAppointmentItem(appointment)}
                                </Box>
                              ))
                            ) : (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ fontStyle: "italic", py: 3 }}
                              >
                                Không có lịch hẹn
                              </Typography>
                            )}
                          </Box>
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
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
                    viVN.components.MuiLocalizationProvider.defaultProps
                      .localeText
                  }
                >
                  <DateCalendar
                    value={currentDate}
                    onChange={(newDate) => handleDateSelect(newDate as Date)}
                    sx={{ width: 320 }}
                  />
                </LocalizationProvider>

                <Box
                  sx={{
                    mt: 2,
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <Button onClick={handleCloseCalendar}>Đóng</Button>
                </Box>
              </Paper>
            </Modal>

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

            {/* <Alert severity="info" sx={{ mt: 2 }}>
              Đây là lịch hẹn khám của bạn. Bạn có thể xem các cuộc hẹn với đủ
              trạng thái trên lịch.
            </Alert> */}
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default AppointmentPage;
