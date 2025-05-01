import React, { useEffect, useState, useRef } from "react";
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
import VideoCallIcon from "@mui/icons-material/VideoCall";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import BookAppointment from "../../components/appointments/BookAppointment";
import { getAppointmentPatientBookInWeek } from "../../services/appointment/booking_service";
import { io, Socket } from "socket.io-client";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { viVN } from "@mui/x-date-pickers/locales";
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
import {
  formatDateToString,
  formatTime,
  formatTimeFromTimeString,
} from "../../utils/dateUtils";
import { ROUTING } from "../../constants/routing";

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

// Enum để định nghĩa các khoảng thời gian trong ngày - giống DoctorCurrentSchedulePage
enum TimePeriod {
  MORNING = "morning", // Buổi sáng
  AFTERNOON = "afternoon", // Buổi chiều
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
  workScheduleId: number; // ID của lịch làm việc
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
  numericalOrder?: number; // Số thứ tự
}

// Định nghĩa giao diện Shift để phù hợp với mô hình UML
interface Shift {
  id: number; // ID của ca
  shift: number; // Số thứ tự ca (1 hoặc 2)
  start: string; // Thời gian bắt đầu, định dạng: HH:mm
  end: string; // Thời gian kết thúc, định dạng: HH:mm
  status: boolean; // Trạng thái hoạt động của ca
}

const AppointmentPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showBooking, setShowBooking] = useState(false);
  const user = useSelector((state: any) => state.user.user);
  const getUserId = user.userId;

  // Các state quản lý hiển thị lịch
  const [today] = useState(new Date()); // Ngày hiện tại
  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(today, { weekStartsOn: 1 }) // Bắt đầu tuần từ thứ 2
  );
  const [calendarOpen, setCalendarOpen] = useState(false); // Trạng thái hiển thị modal calendar
  const [currentDate, setCurrentDate] = useState(new Date()); // Ngày hiện tại đang chọn

  // State quản lý dữ liệu lịch hẹn
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  // Hàm lấy lịch hẹn có thể sử dụng lại
  const fetchAppointments = async () => {
    try {
      // Tính toán ngày cuối tuần một cách chính xác sử dụng date-fns để đảm bảo tính nhất quán
      const weekEnd = addDays(currentWeekStart, 6);

      console.log("Bắt đầu lấy dữ liệu cho tuần:", {
        start: formatDateToString(currentWeekStart),
        end: formatDateToString(weekEnd),
      });

      // Xóa lịch hẹn trong khi đang tải
      setAppointments([]);

      const response = await getAppointmentPatientBookInWeek(
        getUserId,
        formatDateToString(currentWeekStart),
        formatDateToString(weekEnd)
      );

      if (!response?.data?.data) {
        console.log("Không nhận được dữ liệu lịch hẹn");
        setAppointments([]);
        return;
      }

      const result = response.data.data;
      console.log("Phản hồi API cho tuần:", {
        startDate: formatDateToString(currentWeekStart),
        data: result,
      });

      // Nếu không có kết quả, đặt mảng rỗng
      if (!result || result.length === 0) {
        console.log("Không tìm thấy lịch hẹn nào trong tuần này");
        setAppointments([]);
        return;
      }

      const appointmentsData = result.map((item: any) => ({
        id: item.book_appointment.id,
        workScheduleId: item.work_schedule.id,
        date: item.work_schedule.dateAppointment,
        startTime: formatTimeFromTimeString(
          item.work_schedule.shift.start,
          "string"
        ),
        endTime: formatTimeFromTimeString(
          item.work_schedule.shift.end,
          "string"
        ),
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

      console.log("Đặt lịch hẹn cho tuần:", {
        count: appointmentsData.length,
        dates: appointmentsData.map((a) => a.date),
      });

      setAppointments(appointmentsData);
    } catch (error) {
      console.error("Lỗi khi lấy lịch hẹn:", error);
      setAppointments([]);
    }
  };

  // Lấy dữ liệu lịch hẹn khi component được render hoặc tuần thay đổi
  useEffect(() => {
    fetchAppointments();
  }, [currentWeekStart, getUserId]);

  // Xử lý khi người dùng muốn đặt lịch hẹn mới
  const handleBookingClick = () => {
    setShowBooking(true);
  };

  // Xử lý khi người dùng đóng form đặt lịch
  const handleBookingClose = () => {
    setShowBooking(false);
    fetchAppointments(); // Tải lại lịch hẹn sau khi đóng form
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

  // Xử lý chuyển đến tuần trước - xử lý an toàn hơn
  const handlePrevWeek = () => {
    console.log("Di chuyển đến tuần trước");
    const newWeekStart = subWeeks(currentWeekStart, 1);
    console.log("Ngày bắt đầu tuần mới:", formatDateToString(newWeekStart));

    // Xóa lịch hẹn hiện tại để tránh hiển thị dữ liệu cũ
    setAppointments([]);

    // Cập nhật ngày bắt đầu tuần - sử dụng đối tượng ngày thực tế, không phải hàm
    setCurrentWeekStart(newWeekStart);
  };

  // Xử lý chuyển đến tuần sau - xử lý an toàn hơn
  const handleNextWeek = () => {
    console.log("Di chuyển đến tuần tiếp theo");
    const newWeekStart = addWeeks(currentWeekStart, 1);
    console.log("Ngày bắt đầu tuần mới:", formatDateToString(newWeekStart));

    // Xóa lịch hẹn hiện tại
    setAppointments([]);

    // Cập nhật ngày bắt đầu tuần
    setCurrentWeekStart(newWeekStart);
  };

  // Xử lý quay về tuần hiện tại - xử lý an toàn hơn
  const handleGoToCurrentWeek = () => {
    console.log("Di chuyển đến tuần hiện tại");
    const newWeekStart = startOfWeek(today, { weekStartsOn: 1 });
    console.log(
      "Ngày bắt đầu tuần hiện tại:",
      formatDateToString(newWeekStart)
    );

    // Xóa lịch hẹn hiện tại
    setAppointments([]);

    // Cập nhật ngày bắt đầu tuần
    setCurrentWeekStart(newWeekStart);
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

  // Xử lý khi người dùng chọn một ngày từ lịch - sửa chữa đoạn này
  const handleDateSelect = (date: Date) => {
    setCurrentDate(date);

    // Lấy tuần chứa ngày đã chọn (bắt đầu từ thứ 2)
    const weekStart = startOfWeek(date, { weekStartsOn: 1 });
    console.log(
      "Ngày bắt đầu tuần của ngày được chọn:",
      formatDateToString(weekStart)
    );

    // Xóa lịch hẹn
    setAppointments([]);

    // Đặt ngày bắt đầu tuần mới
    setCurrentWeekStart(weekStart);
    setCalendarOpen(false);
  };

  // Xác định xem một cuộc hẹn có đủ điều kiện để tham gia phòng khám trực tuyến hay không
  // Chỉ các cuộc hẹn có trạng thái "ĐANG CHỜ" hoặc "ĐANG KHÁM" mới có thể tham gia
  const canJoinExamination = (
    status: string,
    date: string,
    startTime: string,
    endTime: string
  ) => {
    // Kiểm tra trạng thái cuộc hẹn
    const validStatus = status === "IN_PROGRESS" || status === "WAITING";
    if (!validStatus) return false;

    // Kiểm tra ngày hiện tại có trùng với ngày hẹn không
    const today = new Date();
    const appointmentDate = date.split("-").reverse().join("-"); // Chuyển từ dd-MM-yyyy sang yyyy-MM-dd
    const isSameDate = today.toISOString().split("T")[0] === appointmentDate;
    if (!isSameDate) return false;

    // Kiểm tra thời gian hiện tại có nằm trong khoảng thời gian của ca khám không
    const currentHour = today.getHours();
    const currentMinute = today.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;

    const [startHour, startMinute] = startTime.split(":").map(Number);
    const startTimeInMinutes = startHour * 60 + startMinute;

    const [endHour, endMinute] = endTime.split(":").map(Number);
    const endTimeInMinutes = endHour * 60 + endMinute;

    return (
      currentTimeInMinutes >= startTimeInMinutes &&
      currentTimeInMinutes <= endTimeInMinutes
    );
    // return true;
  };

  // Điều hướng đến trang chi tiết cuộc hẹn khi người dùng nhấp vào một cuộc hẹn cụ thể
  const handleAppointmentClick = (appointmentId: number) => {
    navigate(`/patient/appointments/${appointmentId}`);
  };

  // Xử lý sự kiện khi người dùng muốn tham gia phòng khám trực tuyến
  // Điều hướng người dùng đến phòng chờ khám với thông tin bác sĩ và số thứ tự
  const handleJoinExamination = (
    appointmentId: number,
    workScheduleId: number,
    dateAppointment: string,
    event: React.MouseEvent,
    doctorId?: number,
    doctorName?: string,
    numericalOrder?: number
  ) => {
    event.stopPropagation();

    navigate(`${ROUTING.PATIENT}/wating-room/${workScheduleId}`, {
      state: {
        doctorId: doctorId,
        appointmentId: appointmentId,
        dateAppointment: dateAppointment,
        doctorName: doctorName,
        numericalOrder: numericalOrder,
      },
    });
  };

  // Xác định một ca làm việc thuộc về buổi sáng hay chiều - giống DoctorCurrentSchedulePage
  const getShiftPeriod = (startTime: string): TimePeriod => {
    // Phân tích giờ từ chuỗi thời gian (VD: "08:00")
    const startHour = parseInt(startTime.split(":")[0]);
    if (startHour < 12) return TimePeriod.MORNING;
    return TimePeriod.AFTERNOON;
  };

  // Lấy tất cả lịch hẹn cho một khoảng thời gian nhất định (sáng/chiều)
  const getAppointmentsForDateAndPeriod = (
    date: string,
    period: TimePeriod
  ): Appointment[] => {
    return appointments.filter((appointment) => {
      // Kiểm tra xem lịch hẹn có phải trên ngày đã chỉ định không
      if (appointment.date !== date) return false;

      // Kiểm tra xem lịch hẹn có thuộc khoảng thời gian đã chỉ định không
      return getShiftPeriod(appointment.startTime) === period;
    });
  };

  // Hiển thị lịch hẹn cho một ngày và khoảng thời gian cụ thể
  const renderPeriodAppointments = (date: string, period: TimePeriod) => {
    const filteredAppointments = getAppointmentsForDateAndPeriod(date, period);

    // Nếu không có lịch hẹn trong khoảng thời gian này
    if (filteredAppointments.length === 0) {
      return (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            width: "100%",
            py: 2,
          }}
        >
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontStyle: "italic" }}
          >
            Không có lịch hẹn
          </Typography>
        </Box>
      );
    }

    // Hiển thị tất cả lịch hẹn trong khoảng thời gian
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
          width: "100%",
          py: 1,
        }}
      >
        {filteredAppointments.map((appointment) =>
          renderAppointmentItem(appointment)
        )}
      </Box>
    );
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
    const isExaminationEligible = canJoinExamination(
      appointment.status,
      appointment.date,
      appointment.startTime,
      appointment.endTime
    );

    // Xác định nội dung tooltip dựa trên tình trạng cuộc hẹn
    const getTooltipContent = () => {
      if (
        appointment.status !== "WAITING" &&
        appointment.status !== "IN_PROGRESS"
      ) {
        return "Chỉ có thể tham gia khám khi trạng thái là Đang chờ hoặc Đang khám";
      }

      const today = new Date();
      const appointmentDate = appointment.date.split("-").reverse().join("-");
      if (today.toISOString().split("T")[0] !== appointmentDate) {
        return "Chỉ có thể tham gia khám vào đúng ngày hẹn";
      }

      const currentHour = today.getHours();
      const currentMinute = today.getMinutes();
      const currentTimeInMinutes = currentHour * 60 + currentMinute;

      const [startHour, startMinute] = appointment.startTime
        .split(":")
        .map(Number);
      const startTimeInMinutes = startHour * 60 + startMinute;

      const [endHour, endMinute] = appointment.endTime.split(":").map(Number);
      const endTimeInMinutes = endHour * 60 + endMinute;

      if (currentTimeInMinutes < startTimeInMinutes) {
        return `Chỉ có thể tham gia khám từ ${appointment.startTime}`;
      }

      if (currentTimeInMinutes > endTimeInMinutes) {
        return "Đã quá thời gian khám";
      }

      return "Nhấp để tham gia phòng khám";
    };

    // Hiển thị thông tin lịch hẹn với tooltip
    return (
      <Tooltip
        key={appointment.id}
        title={
          <>
            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
              STT: {appointment.numericalOrder}
            </Typography>
            <Typography variant="body2">
              Bác sĩ: {appointment.doctorName}
            </Typography>
            <Typography variant="body2">
              Thời gian: {appointment.startTime} - {appointment.endTime}
            </Typography>
            <Typography variant="body2">
              Lý do: {appointment.reason || "Không có"}
            </Typography>
            {!isExaminationEligible && (
              <Typography
                variant="body2"
                sx={{ color: "orange", fontWeight: "bold", mt: 1 }}
              >
                {getTooltipContent()}
              </Typography>
            )}
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
          onClick={() => handleAppointmentClick(appointment.workScheduleId)}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <Box>
              {/* Hiển thị ID và tên bác sĩ */}
              <Typography
                variant="body2"
                sx={{ fontWeight: "bold", color: colors.text }}
              >
                STT: {appointment.numericalOrder}
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
                {appointment.startTime} - {appointment.endTime}
              </Typography>
              <Typography
                variant="caption"
                sx={{ display: "block", color: colors.text }}
              >
                {appointment.reason || "Không có lý do"}
              </Typography>
            </Box>

            {isExaminationEligible && (
              <IconButton
                size="small"
                color="primary"
                onClick={(e) =>
                  handleJoinExamination(
                    appointment.id,
                    appointment.workScheduleId,
                    appointment.date,
                    e,
                    appointment.doctorId,
                    appointment.doctorName,
                    appointment.numericalOrder
                  )
                }
                sx={{
                  bgcolor: "rgba(25, 118, 210, 0.1)",
                  "&:hover": { bgcolor: "rgba(25, 118, 210, 0.2)" },
                }}
              >
                <VideoCallIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
        </Paper>
      </Tooltip>
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
            {/* Điều hướng lịch */}
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

            {/* Hiển thị lịch tuần */}
            <Paper sx={{ mb: 3, overflow: "auto" }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{ fontWeight: "bold", width: "100px" }}
                      ></TableCell>

                      {/* 
                        Tiêu đề các ngày trong tuần
                        - Mỗi cột hiển thị tên thứ và ngày tháng
                        - weekDays là mảng chứa thông tin các ngày từ currentWeekStart 
                      */}
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
                    {/* Ca sáng - Buổi sáng */}
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Sáng
                        {/* <Typography
                          variant="caption"
                          display="block"
                          color="textSecondary"
                        >
                          7:00 - 12:00
                        </Typography> */}
                      </TableCell>

                      {weekDays.map((day) => (
                        <TableCell
                          key={`${day.formattedDate}-morning`}
                          align="center"
                          sx={{
                            // verticalAlign: "top",
                            p: 1,
                            alignItems: "center",
                          }}
                        >
                          {renderPeriodAppointments(
                            day.formattedDate,
                            TimePeriod.MORNING
                          )}
                        </TableCell>
                      ))}
                    </TableRow>

                    {/* Ca chiều - Buổi chiều */}
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Chiều
                        {/* <Typography
                          variant="caption"
                          display="block"
                          color="textSecondary"
                        >
                          13:00 - 17:00
                        </Typography> */}
                      </TableCell>

                      {weekDays.map((day) => (
                        <TableCell
                          key={`${day.formattedDate}-afternoon`}
                          align="center"
                          sx={{
                            // verticalAlign: "top",
                            p: 1,
                            alignItems: "center",
                          }}
                        >
                          {renderPeriodAppointments(
                            day.formattedDate,
                            TimePeriod.AFTERNOON
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>

            {/* Modal Lịch */}
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
                {/* <Box sx={{ display: "flex", alignItems: "center" }}>
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
                </Box> */}
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
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default AppointmentPage;
