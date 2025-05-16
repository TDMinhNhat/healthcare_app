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
import { ROUTING } from "../../constants/routing"; // Import hằng số ROUTING
import {
  format,
  addDays, // Thêm số ngày vào ngày hiện tại
  startOfWeek, // Trả về ngày thứ 2 của tuần
  addWeeks,
  subWeeks,
} from "date-fns";
import { vi } from "date-fns/locale";
import { formatDateToString, parseDateFromString } from "../../utils/dateUtils";
import { getWorkScheduleBetweenDate } from "../../services/authenticate/workSchedule_service.ts";

/**
 * DoctorCurrentSchedulePage - Trang hiển thị lịch làm việc của bác sĩ
 *
 * Luồng hiển thị ca khám:
 * 1. Khi trang được tải, hệ thống sẽ hiển thị lịch làm việc của tuần hiện tại (bắt đầu từ thứ 2)
 * 2. Dữ liệu lịch làm việc được lấy từ API getWorkScheduleBetweenDate với userId của bác sĩ
 *    và khoảng thời gian của tuần hiện tại
 * 3. Dữ liệu được chuyển đổi và lưu vào state scheduleMap, là một map ánh xạ từ ngày (string)
 *    đến danh sách lịch làm việc (WorkSchedule[])
 * 4. Bảng lịch hiển thị theo khoảng thời gian (sáng và chiều) cho 7 ngày trong tuần:
 *    - Mỗi ô có thể hiển thị nhiều ca làm việc trong cùng khoảng thời gian (sáng/chiều)
 *    - Các ca được phân loại dựa vào thời gian bắt đầu hoặc ID ca
 * 5. Với mỗi ngày và khoảng thời gian:
 *    - Kiểm tra xem có ca làm việc không (hasShiftsForPeriod)
 *    - Nếu có, hiển thị tất cả ca cho khoảng thời gian đó với số lượng cuộc hẹn và nút thao tác
 *    - Nếu không, hiển thị "Không có ca"
 * 6. Người dùng có thể:
 *    - Di chuyển giữa các tuần bằng nút điều hướng
 *    - Chọn ngày cụ thể từ lịch để chuyển đến tuần chứa ngày đó
 *    - Click vào thẻ ca khám để xem chi tiết cuộc hẹn
 *    - Nhấn nút "Khám" để tiến hành khám bệnh (chỉ cho ngày hiện tại hoặc tương lai)
 *
 * Lưu ý: Trạng thái ca làm việc được xác định dựa trên:
 * - Sự tồn tại của lịch làm việc cho ngày và khoảng thời gian đó
 * - Ngày đã qua hay chưa (isPastDate)
 * - Số lượng cuộc hẹn đã đặt và tổng số chỗ
 */

// Giao diện Shift - phù hợp với mô hình cơ sở dữ liệu
interface Shift {
  id: number;
  shift: number;
  start: string; // LocalTime biểu diễn dưới dạng chuỗi (HH:mm)
  end: string; // LocalTime biểu diễn dưới dạng chuỗi (HH:mm)
  status: boolean;
  createdAt?: string; // Thêm theo mô hình
  updatedAt?: string; // Thêm theo mô hình
}

// Giao diện Doctor - đơn giản hóa từ API
interface Doctor {
  id: number;
  // Các thông tin khác của bác sĩ nếu cần
}

// Giao diện WorkSchedule - phù hợp với mô hình cơ sở dữ liệu
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

// Ánh xạ chuỗi ngày (dd-MM-yyyy) đến mảng lịch làm việc - cấu trúc hiệu quả hơn
type ScheduleMap = Record<string, WorkSchedule[]>;

// Kiểm tra xem một ngày đã qua hay chưa (dùng để kiểm soát nút "Khám")
const isPastDate = (dateString: string): boolean => {
  // Chuyển đổi chuỗi ngày thành đối tượng Date
  const date = parseDateFromString(dateString);
  // So sánh với ngày hiện tại (loại bỏ giờ, phút, giây)
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Đặt giờ, phút, giây, mili giây về 0
  return date < today;
};

// Kiểm tra xem ngày hiện tại có trùng với ngày của ca làm việc không
const isExactDate = (dateString: string): boolean => {
  // Chuyển đổi chuỗi ngày thành đối tượng Date
  const date = parseDateFromString(dateString);
  // Lấy ngày hiện tại (loại bỏ giờ, phút, giây)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  // So sánh ngày hiện tại với ngày ca làm việc
  return date.getTime() === today.getTime();
};

// Kiểm tra xem thời gian hiện tại có nằm trong khung giờ của ca làm việc không
const isWithinShiftHours = (shift: Shift): boolean => {
  // Lấy thời gian hiện tại
  const now = new Date();
  const currentDate = new Date();

  // Tạo đối tượng Date cho thời gian bắt đầu và kết thúc ca làm việc
  const startTime = new Date(currentDate);
  const endTime = new Date(currentDate);

  // Đặt giờ và phút cho thời gian bắt đầu
  const [startHour, startMinute] = shift.start.split(":").map(Number);
  startTime.setHours(startHour, startMinute, 0);

  // Đặt giờ và phút cho thời gian kết thúc
  const [endHour, endMinute] = shift.end.split(":").map(Number);
  endTime.setHours(endHour, endMinute, 0);

  // Kiểm tra xem thời gian hiện tại có nằm trong khoảng thời gian ca làm việc không
  return now >= startTime && now <= endTime;
};

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

// Enum để định nghĩa các khoảng thời gian trong ngày
enum TimePeriod {
  MORNING = "morning", // Buổi sáng
  AFTERNOON = "afternoon", // Buổi chiều
}

const DoctorCurrentSchedulePage: React.FC = () => {
  const navigate = useNavigate();
  // Lưu trữ ngày hiện tại
  const [today] = useState(new Date());

  // State lưu ngày bắt đầu của tuần hiện tại (mặc định là thứ 2)
  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(today, { weekStartsOn: 1 })
  );

  // Thay thế DateSchedule[] bằng cách ánh xạ hiệu quả hơn
  const [scheduleMap, setScheduleMap] = useState<ScheduleMap>({});

  // State cho modal lịch
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  // Lấy thông tin người dùng
  const user = JSON.parse((localStorage.getItem("user") as string) || "{}");
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

  // Fetch data function to reuse
  const fetchScheduleData = async () => {
    if (!user?.userId) return;

    try {
      // Tính ngày bắt đầu và kết thúc của tuần hiện tại
      const startDate = format(currentWeekStart, "dd-MM-yyyy");
      const endDate = format(addDays(currentWeekStart, 6), "dd-MM-yyyy");
      console.log("Ngày bắt đầu:", startDate);
      console.log("Ngày kết thúc:", endDate);
      // Gọi API với khoảng thời gian của tuần
      const response = await getWorkScheduleBetweenDate(
        user.userId,
        startDate,
        endDate
      );
      const result = response.data.data || [];
      console.log("Lịch làm việc:", result);

      // Tạo object để lưu trữ lịch theo ngày - cấu trúc đơn giản hơn
      const newScheduleMap: ScheduleMap = {};

      // Xử lý dữ liệu trả về từ API
      result.forEach((i: any) => {
        const item = i.workSchedule;
        // Kiểm tra dữ liệu hợp lệ
        if (!item.dateAppointment) {
          console.error("Thiếu ngày hẹn trong mục lịch làm việc:", item);
          return; // Bỏ qua mục này nếu thiếu ngày hẹn
        }

        // Chuyển đổi định dạng ngày từ API (yyyy-MM-dd) sang định dạng UI (dd-MM-yyyy)
        const dateFromAPI = item.dateAppointment;

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
        };

        // Tính toán số chỗ trống còn lại (mô phỏng, thực tế sẽ từ API)
        const totalBook = i?.detail?.information?.total_book ?? 0;

        // Tạo đối tượng WorkSchedule phù hợp với mô hình và UI
        const workSchedule: WorkSchedule = {
          id: item.id,
          doctor: item.doctor,
          shift: shift,
          maxSlots: item.maxSlots,
          dateAppointment: item.dateAppointment,
          status: item.status,
          totalBook: totalBook,
        };

        // Thêm vào map theo ngày - đơn giản và hiệu quả hơn
        if (!newScheduleMap[dateFromAPI]) {
          newScheduleMap[dateFromAPI] = [];
        }
        newScheduleMap[dateFromAPI].push(workSchedule);
      });

      // Sort theo thời gian ca làm việc bằng cách trực tiếp parse giờ và phút
      Object.keys(newScheduleMap).forEach((date) => {
        newScheduleMap[date].sort((a, b) => {
          // Parse thời gian từ format "HH:mm"
          const [hoursA, minutesA] = a.shift.start.split(":").map(Number);
          const [hoursB, minutesB] = b.shift.start.split(":").map(Number);

          // So sánh giờ trước
          if (hoursA !== hoursB) {
            return hoursA - hoursB;
          }
          // Nếu giờ bằng nhau, so sánh phút
          return minutesA - minutesB;
        });
      });
      setScheduleMap(newScheduleMap);
    } catch (error) {
      console.error("Lỗi khi lấy lịch làm việc:", error);
    }
  };

  // Gọi API để lấy lịch làm việc ban đầu và khi tuần thay đổi
  useEffect(() => {
    fetchScheduleData();
  }, [currentWeekStart, user?.userId]);

  // Tìm tất cả các lịch làm việc cho một ngày cụ thể - truy cập nhanh O(1)
  const getSchedulesForDate = (date: string): WorkSchedule[] => {
    return scheduleMap[date] || [];
  };

  // Xác định một ca làm việc thuộc về buổi sáng hay chiều
  // Hỗ trợ cả cách phân loại theo ID ca và theo giờ bắt đầu
  const getShiftPeriod = (shift: Shift): TimePeriod => {
    // Cách 1: Dựa vào ID ca (1: sáng, 2: chiều)
    // if (shift.shift === 1) return TimePeriod.MORNING;
    // if (shift.shift === 2) return TimePeriod.AFTERNOON;

    // Cách 2: Dựa vào thời gian (nếu thêm ca mới không theo quy tắc ID)
    // Phân tích giờ từ chuỗi thời gian (VD: "08:00")
    const startHour = parseInt(shift.start.split(":")[0]);
    if (startHour < 12) return TimePeriod.MORNING;
    return TimePeriod.AFTERNOON;
  };

  // Lấy tất cả ca làm việc cho một khoảng thời gian nhất định (sáng/chiều)
  const getShiftsForPeriod = (
    date: string,
    period: TimePeriod
  ): WorkSchedule[] => {
    const schedules = getSchedulesForDate(date);
    return schedules.filter(
      (schedule) => getShiftPeriod(schedule.shift) === period
    );
  };

  // Xử lý chuyển đến phòng khám trực tuyến
  const handleStartExamination = (shiftSchedule: WorkSchedule) => {
    if (!shiftSchedule || !shiftSchedule.id) {
      alert(
        "Không thể mở phòng khám do thiếu thông tin lịch làm việc. Vui lòng thử lại."
      );
      return;
    }

    // Kiểm tra xem ngày hiện tại có đúng là ngày của ca làm việc không
    if (!isExactDate(shiftSchedule.dateAppointment)) {
      alert("Chỉ có thể vào phòng khám đúng ngày diễn ra ca khám");
      return;
    }

    // Kiểm tra xem thời gian hiện tại có nằm trong khung giờ của ca làm việc không
    if (!isWithinShiftHours(shiftSchedule.shift)) {
      alert(
        "Chỉ có thể vào phòng khám trong khung giờ làm việc từ " +
          shiftSchedule.shift.start +
          " đến " +
          shiftSchedule.shift.end
      );
      return;
    }

    // Tạo URL phòng khám và mở tab mới
    const examRoomPath = ROUTING.EXAMINATION_ROOM.replace(
      ":scheduleId",
      shiftSchedule.id.toString()
    );
    window.open(examRoomPath, "_blank");
  };

  // Hiển thị trạng thái các ca làm việc cho một khoảng thời gian (sáng/chiều)
  // Hỗ trợ hiển thị nhiều ca trong cùng một khoảng thời gian
  const renderPeriodStatus = (date: string, period: TimePeriod) => {
    const shifts = getShiftsForPeriod(date, period);

    // Nếu không có ca nào trong khoảng thời gian này
    if (shifts.length === 0) {
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

    // Hiển thị tất cả ca trong khoảng thời gian
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
          width: "100%",
        }}
      >
        {shifts.map((shiftSchedule, index) => {
          // Lấy thông tin thời gian ca làm việc
          const shiftTime = {
            start: shiftSchedule.shift.start,
            end: shiftSchedule.shift.end,
          };

          // Kiểm tra xem ngày đã qua chưa
          const isDateInPast = isPastDate(date);

          // Xử lý click vào card để xem chi tiết
          const handleCardClick = (event: React.MouseEvent) => {
            // Chỉ xử lý khi click vào card, không xử lý khi click vào nút khám
            if ((event.target as HTMLElement).closest("button")) {
              return;
            }

            // Điều hướng đến trang chi tiết ca khám
            if (shiftSchedule) {
              navigate(
                `${ROUTING.DOCTOR}/${ROUTING.SCHEDULE}/${shiftSchedule.id}`
              );
            }
          };

          return (
            <Box
              key={`${date}-${shiftSchedule.id}`}
              onClick={handleCardClick}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                p: 1,
                gap: 1,
                borderRadius: 1,
                background:
                  "linear-gradient(to bottom, rgba(236, 246, 253, 0.3), rgba(236, 246, 253, 0.8))",
                border: "1px solid rgba(25, 118, 210, 0.12)",
                cursor: "pointer",
                transition: "all 0.2s ease",
                "&:hover": {
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              {/* Thời gian ca làm việc với style nổi bật hơn */}
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: "bold",
                  color: "primary.main",
                  bgcolor: "rgba(255, 255, 255, 0.8)",
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 5,
                  border: "1px solid rgba(25, 118, 210, 0.2)",
                }}
              >
                {shiftTime.start} - {shiftTime.end}
              </Typography>

              {/* Chip hiển thị số cuộc hẹn - thiết kế mới */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Typography
                  variant="caption"
                  sx={{ fontWeight: "medium", color: "text.secondary" }}
                >
                  Cuộc hẹn:
                </Typography>
                <Chip
                  label={`${shiftSchedule.totalBook}/${shiftSchedule.maxSlots}`}
                  size="small"
                  color="success"
                  sx={{
                    fontWeight: "bold",
                    height: "24px",
                    minWidth: "60px",
                  }}
                />
              </Box>

              {/* Chỉ giữ lại nút Khám với thiết kế cải tiến */}
              <Button
                variant="contained"
                size="small"
                color="success"
                fullWidth
                onClick={(e) => {
                  e.stopPropagation();
                  handleStartExamination(shiftSchedule);
                }}
                disabled={isDateInPast}
                title={isDateInPast ? "Không thể khám cho ngày đã qua" : ""}
                sx={{
                  borderRadius: 2,
                  fontSize: "0.8rem",
                  fontWeight: "bold",
                  py: 0.5,
                  ...(isDateInPast && {
                    bgcolor: "grey.400",
                    opacity: 0.8,
                    cursor: "not-allowed",
                  }),
                }}
              >
                {isDateInPast ? "Đã qua" : "Khám"}
              </Button>
            </Box>
          );
        })}
      </Box>
    );
  };

  // Mở modal lịch
  const handleOpenCalendar = () => {
    setCalendarOpen(true);
  };

  // Đóng modal lịch
  const handleCloseCalendar = () => {
    setCalendarOpen(false);
  };

  // Xử lý khi chọn ngày từ lịch
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

      {/* Modal lịch */}
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
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Sáng</TableCell>

                {weekDays.map((day) => (
                  <TableCell
                    key={`${day.formattedDate}-morning`}
                    align="center"
                    sx={{ verticalAlign: "center", p: 1 }}
                  >
                    {renderPeriodStatus(day.formattedDate, TimePeriod.MORNING)}
                  </TableCell>
                ))}
              </TableRow>

              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Chiều</TableCell>

                {weekDays.map((day) => (
                  <TableCell
                    key={`${day.formattedDate}-afternoon`}
                    align="center"
                    sx={{ verticalAlign: "center", p: 1 }}
                  >
                    {renderPeriodStatus(
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
    </Box>
  );
};

export default DoctorCurrentSchedulePage;
