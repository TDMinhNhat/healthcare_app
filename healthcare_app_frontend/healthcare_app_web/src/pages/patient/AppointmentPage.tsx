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
import {
  formatDateToString,
  formatTime,
  formatTimeFromTimeString,
} from "../../utils/dateUtils";
import { ROUTING } from "../../constants/routing";

/**
 * Trang Quản Lý Lịch Hẹn Khám Bệnh dành cho bệnh nhân
 *
 * Luồng hiển thị lịch hẹn khám bệnh:
 * 1. Khi trang được tải, hệ thống sẽ hiển thị lịch hẹn của tuần hiện tại (bắt đầu từ thứ 2)
 * 2. Dữ liệu lịch hẹn được lấy từ API getAppointmentPatientBookInWeek với userId của bệnh nhân
 *    và khoảng thời gian của tuần hiện tại (từ thứ 2 đến chủ nhật)
 * 3. Dữ liệu trả về được xử lý và chuyển đổi thành mảng appointments chứa các thông tin chi tiết:
 *    - ID lịch hẹn, ngày hẹn, thời gian bắt đầu và kết thúc
 *    - Trạng thái cuộc hẹn (WAITING, IN_PROGRESS, DONE, CANCELLED)
 *    - Thông tin bác sĩ, chuyên khoa, lý do khám
 *    - Số thứ tự khám và thông tin ca làm việc
 * 4. Bảng lịch hiển thị 2 ca làm việc (sáng và chiều) cho 7 ngày trong tuần
 * 5. Các cuộc hẹn được hiển thị với màu sắc khác nhau theo trạng thái:
 *    - Xanh dương: Đang chờ khám (WAITING)
 *    - Tím: Đang khám (IN_PROGRESS)
 *    - Xanh lá: Đã khám xong (DONE)
 *    - Đỏ: Đã hủy (CANCELLED)
 * 6. Người dùng có thể:
 *    - Di chuyển giữa các tuần bằng nút điều hướng
 *    - Chọn ngày cụ thể từ lịch để xem lịch hẹn của tuần đó
 *    - Đặt lịch hẹn mới thông qua form đặt lịch
 *    - Xem chi tiết lịch hẹn bằng cách nhấp vào thẻ cuộc hẹn
 *    - Vào phòng khám trực tuyến (nếu cuộc hẹn đang trong trạng thái chờ hoặc đang khám)
 *
 * Xử lý hiển thị:
 * - Mỗi cuộc hẹn được hiển thị trong một thẻ (Paper) với thông tin ngắn gọn
 * - Tooltip hiển thị thêm thông tin chi tiết khi di chuột qua thẻ cuộc hẹn
 * - Nút video call chỉ hiển thị cho các cuộc hẹn đang chờ hoặc đang khám
 * - Màu sắc và viền thẻ trực quan giúp phân biệt trạng thái cuộc hẹn
 */

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

// Định nghĩa các ca làm việc cố định để khớp với lịch của bác sĩ
const SHIFTS: Record<string, Shift> = {
  CA1: { id: 1, shift: 1, start: "07:00", end: "11:00", status: true }, // Ca sáng
  CA2: { id: 2, shift: 2, start: "13:00", end: "17:00", status: true }, // Ca chiều
};

/**
 * Trang Quản Lý Lịch Hẹn Khám Bệnh dành cho bệnh nhân
 *
 * Luồng hoạt động:
 * 1. Hiển thị danh sách các lịch hẹn của bệnh nhân với trạng thái khác nhau (sắp tới, đã khám, đã hủy)
 * 2. Cho phép bệnh nhân đặt lịch hẹn mới thông qua form đặt lịch
 * 3. Cho phép bệnh nhân xem chi tiết lịch hẹn đã đặt
 * 4. Cho phép bệnh nhân hủy lịch hẹn nếu lịch hẹn chưa diễn ra
 * 5. Cho phép bệnh nhân vào phòng chờ khi đến thời gian hẹn
 *
 * Kết quả:
 * - Hiển thị trạng thái lịch hẹn của bệnh nhân trong bảng lịch tuần
 * - Đặt lịch mới thành công và hiển thị trong danh sách
 *
 * Xử lý dữ liệu:
 * - Sử dụng React Query để quản lý việc gọi API và cache dữ liệu
 * - Cập nhật trạng thái lịch hẹn theo thời gian thực qua socket.io (nếu cần)
 * - Xử lý phân trang cho danh sách lịch hẹn khi quá nhiều
 * - Lưu trữ form đặt lịch trong local storage để tránh mất dữ liệu khi reload
 */

const AppointmentPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showBooking, setShowBooking] = useState(false);
  const user = useSelector((state: any) => state.user.user);
  const getUserId = user.userId;

  // Socket connection
  // const [socket, setSocket] = useState<Socket>(
  //   io("ws://localhost:8081", {
  //     path: "/schedule",
  //     transports: ["websocket", "polling"],
  //     reconnection: true,
  //     reconnectionAttempts: 10,
  //     autoConnect: false,
  //   })
  // );

  // Các state quản lý hiển thị lịch
  const [today] = useState(new Date()); // Ngày hiện tại
  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(today, { weekStartsOn: 1 }) // Bắt đầu tuần từ thứ 2
  );
  const [calendarOpen, setCalendarOpen] = useState(false); // Trạng thái hiển thị modal calendar
  const [currentDate, setCurrentDate] = useState(new Date()); // Ngày hiện tại đang chọn

  // State quản lý dữ liệu lịch hẹn
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  // Fetch appointments function that can be reused
  const fetchAppointments = async () => {
    try {
      // Calculate the end of week properly using date-fns for consistency
      const weekEnd = addDays(currentWeekStart, 6);

      console.log("Starting fetch for week:", {
        start: formatDateToString(currentWeekStart),
        end: formatDateToString(weekEnd),
      });

      // Clear appointments during loading
      setAppointments([]);

      const response = await getAppointmentPatientBookInWeek(
        getUserId,
        formatDateToString(currentWeekStart),
        formatDateToString(weekEnd)
      );

      if (!response?.data?.data) {
        console.log("No appointments data received");
        setAppointments([]);
        return;
      }

      const result = response.data.data;
      console.log("API response for week:", {
        startDate: formatDateToString(currentWeekStart),
        data: result,
      });

      // If no results, set empty array
      if (!result || result.length === 0) {
        console.log("No appointments found for this week");
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

      console.log("Setting appointments for week:", {
        count: appointmentsData.length,
        dates: appointmentsData.map((a) => a.date),
      });

      setAppointments(appointmentsData);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setAppointments([]);
    }
  };

  // Lấy dữ liệu lịch hẹn khi component được render hoặc tuần thay đổi
  useEffect(() => {
    fetchAppointments();
  }, [currentWeekStart, getUserId]);

  // Xử lý kết nối socket và lắng nghe các sự kiện
  useEffect(() => {
    if (!getUserId) return;

    // socket.connect();

    // // Khi kết nối thành công
    // socket.on("connect", () => {
    //   console.log("Socket connected to the server");

    //   // Đăng ký nhận cập nhật về lịch hẹn cho bệnh nhân này
    //   socket.emit("joinPatientAppointments", {
    //     patientId: getUserId,
    //   });
    // });

    // // Lắng nghe sự kiện khi có lịch hẹn được cập nhật
    // socket.on("appointmentUpdated", (data) => {
    //   console.log("Lịch hẹn được cập nhật:", data);
    //   if (data.patientId === getUserId) {
    //     fetchAppointments();
    //   }
    // });

    // // Xử lý lỗi kết nối
    // socket.on("connect_error", (error) => {
    //   console.error("Socket connection error:", error);
    // });

    // Cleanup function khi component unmount
    return () => {
      // if (socket) {
      //   // socket.emit("leavePatientAppointments", {
      //   //   patientId: getUserId,
      //   // });
      //   socket.disconnect();
      //   console.log("Socket disconnected");
      // }
    };
  }, [getUserId]); // Chỉ kết nối lại khi userId thay đổi

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

  // Xử lý chuyển đến tuần trước - handle more safely
  const handlePrevWeek = () => {
    console.log("Moving to previous week");
    const newWeekStart = subWeeks(currentWeekStart, 1);
    console.log("New week start:", formatDateToString(newWeekStart));

    // Clear current appointments to avoid showing stale data
    setAppointments([]);

    // Update week start - use the actual date object, not a function
    setCurrentWeekStart(newWeekStart);
  };

  // Xử lý chuyển đến tuần sau - handle more safely
  const handleNextWeek = () => {
    console.log("Moving to next week");
    const newWeekStart = addWeeks(currentWeekStart, 1);
    console.log("New week start:", formatDateToString(newWeekStart));

    // Clear current appointments
    setAppointments([]);

    // Update week start
    setCurrentWeekStart(newWeekStart);
  };

  // Xử lý quay về tuần hiện tại - handle more safely
  const handleGoToCurrentWeek = () => {
    console.log("Moving to current week");
    const newWeekStart = startOfWeek(today, { weekStartsOn: 1 });
    console.log("Current week start:", formatDateToString(newWeekStart));

    // Clear current appointments
    setAppointments([]);

    // Update week start
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

  // Xử lý khi người dùng chọn một ngày từ lịch - fix this too
  const handleDateSelect = (date: Date) => {
    setCurrentDate(date);

    // Lấy tuần chứa ngày đã chọn (bắt đầu từ thứ 2)
    const weekStart = startOfWeek(date, { weekStartsOn: 1 });
    console.log("Selected date week start:", formatDateToString(weekStart));

    // Clear appointments
    setAppointments([]);

    // Set new week start
    setCurrentWeekStart(weekStart);
    setCalendarOpen(false);
  };

  // Lọc lịch hẹn cho một ngày và ca cụ thể
  const getAppointmentsForDateAndShift = (date: string, shift: 1 | 2) => {
    const filtered = appointments.filter((appointment) => {
      // Kiểm tra xem lịch hẹn có phải trên ngày đã chỉ định không
      if (appointment.date !== date) return false;

      // Kiểm tra xem lịch hẹn có thuộc ca đã chỉ định không
      // const hour = parseInt(appointment.startTime.split(":")[0]);
      if (shift === 1 && appointment.shiftId === 1) {
        return true;
      }
      if (shift === 2 && appointment.shiftId === 2) {
        return true;
      }

      return false;
    });

    return filtered;
  };

  // Điều hướng đến trang chi tiết cuộc hẹn khi người dùng nhấp vào một cuộc hẹn cụ thể
  const handleAppointmentClick = (appointmentId: number) => {
    navigate(`/patient/appointments/${appointmentId}`);
  };

  // Xác định xem một cuộc hẹn có đủ điều kiện để tham gia phòng khám trực tuyến hay không
  // Chỉ các cuộc hẹn có trạng thái "ĐANG CHỜ" hoặc "ĐANG KHÁM" mới có thể tham gia
  const canJoinExamination = (status: string) => {
    return status === "IN_PROGRESS" || status === "WAITING";
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
    const isExaminationEligible = canJoinExamination(appointment.status);

    // Hiển thị thông tin lịch hẹn với tooltip
    return (
      <Tooltip
        title={
          <>
            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
              STT: {appointment.numericalOrder}
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
              {/* 
                Cấu trúc bảng lịch hẹn:
                - Bảng được chia thành 2 hàng cho 2 ca khám (sáng và chiều) 
                - Mỗi cột đại diện cho một ngày trong tuần (từ thứ 2 đến chủ nhật)
                
                Luồng logic hiển thị lịch hẹn:
                1. Dữ liệu lịch hẹn được lưu trong mảng appointments (đã được phân loại theo ngày và ca)
                2. Với mỗi ô trong bảng (ngày + ca):
                   a. Gọi getAppointmentsForDateAndShift(date, shift) để lọc các cuộc hẹn thuộc ngày và ca đó
                   b. Nếu không có cuộc hẹn → Hiển thị "Không có lịch hẹn"
                   c. Nếu có cuộc hẹn → Hiển thị danh sách các cuộc hẹn bằng renderAppointmentItem()
                3. Mỗi cuộc hẹn được hiển thị với:
                   a. Màu sắc khác nhau tùy theo trạng thái (WAITING, IN_PROGRESS, DONE, CANCELLED)
                   b. Số thứ tự, tên bác sĩ và lý do khám
                   c. Nút tham gia phòng khám (chỉ hiển thị khi cuộc hẹn đang chờ hoặc đang khám)
                4. Tương tác:
                   a. Nhấp vào cuộc hẹn → Xem chi tiết cuộc hẹn
                   b. Nhấp nút video call → Tham gia phòng khám trực tuyến
              */}
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
                    {/* 
                      Ca 1 appointments row
                      - Hiển thị tất cả lịch hẹn của ca sáng cho mỗi ngày
                      - Thời gian ca cố định lấy từ SHIFTS.CA1
                    */}
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Ca 1
                        <Typography
                          variant="caption"
                          display="block"
                          color="textSecondary"
                        >
                          {formatTime(SHIFTS.CA1.start)} -{" "}
                          {formatTime(SHIFTS.CA1.end)}
                        </Typography>
                      </TableCell>

                      {weekDays.map((day) => (
                        <TableCell
                          key={`${day.formattedDate}-ca1`}
                          align="center"
                          sx={{ verticalAlign: "top", p: 1 }}
                        >
                          {/* 
                            Hiển thị lịch hẹn ca 1:
                            1. Gọi getAppointmentsForDateAndShift để lọc cuộc hẹn theo ngày và ca
                            2. Nếu có cuộc hẹn → Map qua từng cuộc hẹn và render bằng renderAppointmentItem()
                            3. Nếu không có → Hiển thị thông báo "Không có lịch hẹn"
                            
                            Mỗi thẻ cuộc hẹn hiển thị:
                            - Số thứ tự và tên bác sĩ rút gọn
                            - Lý do khám
                            - Màu sắc tương ứng với trạng thái (xanh dương, tím, xanh lá, đỏ)
                            - Nút tham gia (chỉ hiển thị nếu trạng thái là WAITING hoặc IN_PROGRESS)
                          */}
                          <Box
                            sx={{
                              minHeight: "100px",
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
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
                                sx={{
                                  fontStyle: "italic",
                                  py: 3,
                                  alignItems: "center",
                                }}
                              >
                                Không có lịch hẹn
                              </Typography>
                            )}
                          </Box>
                        </TableCell>
                      ))}
                    </TableRow>

                    {/* 
                      Ca 2 appointments row
                      - Tương tự như ca 1 nhưng áp dụng cho ca chiều
                      - Thời gian cố định lấy từ SHIFTS.CA2
                      - Logic hiển thị tương tự ca 1
                    */}
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Ca 2
                        <Typography
                          variant="caption"
                          display="block"
                          color="textSecondary"
                        >
                          {formatTime(SHIFTS.CA2.start)} -{" "}
                          {formatTime(SHIFTS.CA2.end)}
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
