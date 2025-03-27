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
import { ROUTING } from "../../constants/routing"; // Import hằng số ROUTING
import {
  format,
  addDays, // Thêm số ngày vào ngày hiện tại
  startOfWeek, // Trả về ngày thứ 2 của tuần
  addWeeks,
  subWeeks,
} from "date-fns";
import { vi } from "date-fns/locale";
import {
  formatDateToString,
  parseDateFromString,
  parseDateTimeFromString,
  formatTime,
} from "../../utils/dateUtils";
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
 * 4. Bảng lịch hiển thị 2 ca làm việc (sáng và chiều) cho 7 ngày trong tuần
 * 5. Với mỗi ngày và ca:
 *    - Kiểm tra xem có lịch làm việc không (hasShift1, hasShift2)
 *    - Nếu có, hiển thị số lượng cuộc hẹn (totalBook/maxSlots) và các nút thao tác
 *    - Nếu không, hiển thị "Không có ca"
 * 6. Người dùng có thể:
 *    - Di chuyển giữa các tuần bằng nút điều hướng
 *    - Chọn ngày cụ thể từ lịch để chuyển đến tuần chứa ngày đó
 *    - Xem chi tiết cuộc hẹn cho từng ca
 *    - Tiến hành khám bệnh (chỉ cho ngày hiện tại hoặc tương lai)
 *
 * Lưu ý: Trạng thái ca làm việc được xác định dựa trên:
 * - Sự tồn tại của lịch làm việc cho ngày và ca đó
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

  useEffect(() => {
    // Gọi API để lấy lịch làm việc của bác sĩ trong khoảng thời gian của tuần hiện tại
    async function fetchData() {
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
          // console.log("Mục:", item);
          // Kiểm tra dữ liệu hợp lệ
          if (!item.dateAppointment) {
            console.error("Thiếu ngày hẹn trong mục lịch làm việc:", item);
            return; // Bỏ qua mục này nếu thiếu ngày hẹn
          }

          // Chuyển đổi định dạng ngày từ API (yyyy-MM-dd) sang định dạng UI (dd-MM-yyyy)
          const dateFromAPI = item.dateAppointment;
          // Chuyển thành dd-MM-yyyy
          // console.log("Chuỗi ngày:", dateFromAPI);
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
        // console.log("Bản đồ lịch mới:", newScheduleMap);
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
    // console.log("Kiểm tra ca 1 cho ngày:", schedules);
    // console.log("Bản đồ lịch", scheduleMap);
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
    // Lấy lịch làm việc cho ca đã chọn
    const schedule =
      shift === 1 ? getShift1Schedule(date) : getShift2Schedule(date);

    if (schedule) {
      // Điều hướng sử dụng ID lịch làm việc thực tế
      navigate(`${ROUTING.DOCTOR}/${ROUTING.SCHEDULE}/${schedule.id}`);
    } else {
      console.error("Không tìm thấy thông tin ca làm việc");
    }
  };

  // Xử lý điều hướng đến phòng khám
  const handleExamination = (date: string, shift: number) => {
    // Lấy lịch làm việc cho ca đã chọn
    const schedule =
      shift === 1 ? getShift1Schedule(date) : getShift2Schedule(date);

    // Điều hướng đến phòng khám ảo
    if (schedule && schedule.id) {
      console.log(
        `Đang chuyển hướng đến phòng khám với ID lịch: ${schedule.id}`
      );

      // Tạo URL sử dụng hằng số ROUTING và thay thế tham số
      const examRoomPath = ROUTING.EXAMINATION_ROOM.replace(
        ":scheduleId",
        schedule.id.toString()
      );

      // Mở trang khám bệnh trong tab mới với định tuyến phù hợp
      window.open(examRoomPath, "_blank");
    } else {
      console.error(
        "Không tìm thấy thông tin ca làm việc hoặc ID không hợp lệ",
        schedule
      );
      // Hiển thị cảnh báo cho người dùng
      alert(
        "Không thể mở phòng khám do thiếu thông tin lịch làm việc. Vui lòng thử lại."
      );
    }
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

    // Kiểm tra xem ngày đã qua chưa
    const isDateInPast = isPastDate(date);

    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          p: 0.5,
          gap: 0.75,
        }}
      >
        {/* Chip hiển thị số cuộc hẹn - kích thước lớn */}
        <Chip
          label={`${shiftSchedule.totalBook}/${shiftSchedule.maxSlots} cuộc hẹn`}
          size="small"
          sx={{
            bgcolor: "background.paper",
            color: "success.main",
            border: `1px solid success.main`,
            fontSize: "0.8rem",
            fontWeight: "bold",
            width: "135px",
            height: "28px",
          }}
        />

        {/* Container nút với bố cục dọc và nút lớn hơn */}
        <Stack
          direction="column"
          spacing={0.5}
          sx={{ width: "100%", maxWidth: "135px" }}
        >
          <Button
            variant="outlined"
            size="small"
            color="primary"
            onClick={() => handleAppointmentClick(date, shift)}
            sx={{
              fontSize: "0.8rem",
              py: 0.25,
              height: "28px",
              fontWeight: "bold",
            }}
          >
            Chi tiết
          </Button>

          <Button
            variant="contained"
            size="small"
            color="success"
            onClick={() => handleExamination(date, shift)}
            disabled={isDateInPast}
            title={isDateInPast ? "Không thể khám cho ngày đã qua" : ""}
            sx={{
              fontSize: "0.8rem",
              py: 0.25,
              height: "28px",
              fontWeight: "bold",
              ...(isDateInPast && {
                opacity: 0.6,
                cursor: "not-allowed", // Vô hiệu hóa nút
              }),
            }}
          >
            {isDateInPast ? "Đã qua" : "Khám"}
          </Button>
        </Stack>
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
        {/* 
          Cấu trúc bảng lịch làm việc:
          - Bảng được chia thành 2 hàng cho 2 ca làm việc (sáng và chiều)
          - Mỗi cột đại diện cho một ngày trong tuần (từ thứ 2 đến chủ nhật)
          
          Luồng logic hiển thị:
          1. Dữ liệu lịch làm việc được lưu trữ trong scheduleMap (object ánh xạ ngày → WorkSchedule[])
          2. Với mỗi ô trong bảng (ngày + ca):
             a. Kiểm tra ngày đó có ca tương ứng không (hasShift1/hasShift2)
             b. Nếu không có ca → Hiển thị "Không có ca"
             c. Nếu có ca → Lấy thông tin lịch làm việc (getShift1Schedule/getShift2Schedule)
             d. Hiển thị thông tin số cuộc hẹn đã đặt và tổng số chỗ (shiftSchedule.totalBook/maxSlots)
          3. Xử lý tương tác:
             a. Nút "Chi tiết" → Điều hướng đến trang chi tiết ca khám
             b. Nút "Khám" → Mở phòng khám ảo trong tab mới
             c. Nếu ngày đã qua (isPastDate) → Vô hiệu hóa nút "Khám" và hiển thị "Đã qua"
        */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold", width: "100px" }}>
                  Ca làm việc
                </TableCell>

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
                Hàng cho ca 1 (Sáng) 
                - Hiển thị thời gian ca làm việc từ dữ liệu thực tế
                - Thời gian được lấy từ hàm getShift1Time (tìm ca sáng đầu tiên trong tuần)
              */}
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>
                  Ca 1 (Sáng)
                  <Typography
                    variant="caption"
                    display="block"
                    color="textSecondary"
                  >
                    {/* 
                      Hiển thị thông tin ca 1 từ dữ liệu động:
                      1. Tìm ngày đầu tiên trong tuần có ca 1
                      2. Lấy thời gian bắt đầu và kết thúc từ ngày đó
                      3. Nếu không tìm thấy ca nào, hiển thị rỗng
                    */}
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

                {/* 
                  Các ô trạng thái cho ca 1 của từng ngày
                  - Mỗi ô gọi renderShiftStatus để hiển thị trạng thái ca làm việc
                  - Truyền vào: có lịch không, ngày nào, và số ca (1)
                */}
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

              {/* 
                Hàng cho ca 2 (Chiều)
                - Tương tự như ca 1 nhưng áp dụng cho ca chiều
                - Sử dụng hàm hasShift2 và getShift2Schedule để lấy thông tin
              */}
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>
                  Ca 2 (Chiều)
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
