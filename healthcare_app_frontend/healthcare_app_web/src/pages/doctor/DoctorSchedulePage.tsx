import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Checkbox,
  Stack,
  Grid,
} from "@mui/material";
import {
  addDays,
  format,
  startOfWeek,
  endOfWeek,
  addWeeks,
  subWeeks,
} from "date-fns";
import { vi } from "date-fns/locale";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import SaveIcon from "@mui/icons-material/Save";
import EventRepeatIcon from "@mui/icons-material/EventRepeat";
import { formatDateToString } from "../../utils/dateUtils";
import { addWorkSchedule } from "../../services/workSchedule_service";

// Định nghĩa các ca làm việc theo mô hình Shift trong schedule.md
// - id: ID của ca làm việc
// - shift: Giá trị shift được lưu vào database (1 hoặc 2)
// - start: Thời gian bắt đầu ca làm việc
// - end: Thời gian kết thúc ca làm việc
const SHIFTS = {
  CA1: { id: 1, shift: 1, start: "08:00", end: "12:00" },
  CA2: { id: 2, shift: 2, start: "13:00", end: "17:00" },
};

// Định nghĩa các ngày trong tuần theo enum TypeDay trong schedule.md
// - key: Giá trị enum TypeDay để lưu vào database
// - label: Tên hiển thị của ngày trong tuần
const DAYS_OF_WEEK = [
  { key: "MONDAY", label: "Thứ 2" },
  { key: "TUESDAY", label: "Thứ 3" },
  { key: "WEDNESDAY", label: "Thứ 4" },
  { key: "THURSDAY", label: "Thứ 5" },
  { key: "FRIDAY", label: "Thứ 6" },
  { key: "SATURDAY", label: "Thứ 7" },
  { key: "SUNDAY", label: "Chủ nhật" },
];

// Interface định nghĩa cấu trúc dữ liệu cho một ngày trong lịch làm việc
// - dayOfWeek: Enum TypeDay (MONDAY, TUESDAY, etc.) theo schedule.md
// - dayIndex: Chỉ số của ngày trong tuần (0-6)
// - date: Đối tượng Date chứa thông tin ngày tháng đầy đủ
// - shifts: Object chứa trạng thái chọn/không chọn của các ca làm việc
interface ScheduleItem {
  typeDay: string;
  dayIndex: number;
  date: Date;
  shifts: {
    shift1: boolean; // true nếu ca 1 được chọn, false nếu không
    shift2: boolean; // true nếu ca 2 được chọn, false nếu không
  };
}

const DoctorSchedulePage = () => {
  // Lưu trữ ngày hiện tại để tính toán giới hạn tuần
  const [today] = useState(new Date());

  // State lưu ngày bắt đầu của tuần hiện tại (mặc định là thứ 2)
  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(today, { weekStartsOn: 1 })
  );

  // State lưu trữ lịch làm việc của cả tuần hiện tại
  // Mỗi phần tử trong mảng là một đối tượng ScheduleItem đại diện cho một ngày
  const [weekSchedule, setWeekSchedule] = useState<ScheduleItem[]>([]);

  // State lưu trữ thông báo thành công để hiển thị cho người dùng
  const [successMessage, setSuccessMessage] = useState("");

  // State lưu trữ thông báo lỗi để hiển thị cho người dùng
  const [errorMessage, setErrorMessage] = useState("");

  // State lưu trữ lịch làm việc của tuần trước để có thể áp dụng lại
  const [prevWeekSchedule, setPrevWeekSchedule] = useState<ScheduleItem[]>([]);

  // Khởi tạo lịch làm việc khi tuần hiện tại thay đổi
  useEffect(() => {
    initializeWeekSchedule();
  }, [currentWeekStart]);

  // Khởi tạo lịch làm việc cho tuần được chọn với tất cả ca làm việc là chưa được chọn (false)
  const initializeWeekSchedule = () => {
    const newWeekSchedule: ScheduleItem[] = [];

    // Tạo dữ liệu cho 7 ngày trong tuần
    for (let i = 0; i < 7; i++) {
      const currentDate = addDays(currentWeekStart, i);
      newWeekSchedule.push({
        typeDay: DAYS_OF_WEEK[i].key,
        dayIndex: i,
        date: currentDate,
        shifts: {
          shift1: false,
          shift2: false,
        },
      });
    }

    setWeekSchedule(newWeekSchedule);
  };

  // Kiểm tra xem có đang ở tuần hiện tại không (tuần có chứa ngày hôm nay)
  const isCurrentWeek = () => {
    const currentWeekStartTime = startOfWeek(today, {
      weekStartsOn: 1,
    }).getTime();
    return currentWeekStart.getTime() === currentWeekStartTime;
  };

  // Kiểm tra xem có đang ở tuần kế tiếp không (tuần sau tuần hiện tại)
  const isNextWeek = () => {
    const nextWeekStartTime = startOfWeek(addWeeks(today, 1), {
      weekStartsOn: 1,
    }).getTime();
    return currentWeekStart.getTime() === nextWeekStartTime;
  };

  // Chuyển đến tuần trước đó (bị giới hạn ở tuần hiện tại)
  const handlePrevWeek = () => {
    // Chỉ cho phép chuyển về tuần hiện tại, không sớm hơn
    if (!isCurrentWeek()) {
      // Lưu lịch làm việc hiện tại trước khi chuyển tuần
      setPrevWeekSchedule([...weekSchedule]);
      setCurrentWeekStart(startOfWeek(today, { weekStartsOn: 1 }));
    }
  };

  // Chuyển đến tuần tiếp theo (bị giới hạn ở tuần kế tiếp)
  const handleNextWeek = () => {
    // Chỉ cho phép chuyển đến tuần kế tiếp, không xa hơn
    if (!isNextWeek()) {
      // Lưu lịch làm việc hiện tại trước khi chuyển tuần
      setPrevWeekSchedule([...weekSchedule]);
      setCurrentWeekStart(startOfWeek(addWeeks(today, 1), { weekStartsOn: 1 }));
    }
  };

  // Áp dụng lịch làm việc của tuần trước cho tuần hiện tại
  const handleApplyPrevWeek = () => {
    if (prevWeekSchedule.length > 0) {
      const newSchedule = weekSchedule.map((day, index) => ({
        ...day,
        shifts: { ...prevWeekSchedule[index].shifts },
      }));

      setWeekSchedule(newSchedule);
      setSuccessMessage("Áp dụng lịch tuần trước thành công");
      setTimeout(() => setSuccessMessage(""), 3000);
    } else {
      setErrorMessage("Không có dữ liệu lịch tuần trước");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  // Bật/tắt một ca làm việc cụ thể cho một ngày
  const toggleShift = (dayIndex: number, shift: "shift1" | "shift2") => {
    const newSchedule = [...weekSchedule];
    newSchedule[dayIndex].shifts[shift] = !newSchedule[dayIndex].shifts[shift];
    setWeekSchedule(newSchedule);
  };

  // Chọn tất cả ca 1 cho mọi ngày trong tuần
  const selectAllShift1 = () => {
    const newSchedule = weekSchedule.map((day) => ({
      ...day,
      shifts: { ...day.shifts, shift1: true },
    }));
    setWeekSchedule(newSchedule);
  };

  // Chọn tất cả ca 2 cho mọi ngày trong tuần
  const selectAllShift2 = () => {
    const newSchedule = weekSchedule.map((day) => ({
      ...day,
      shifts: { ...day.shifts, shift2: true },
    }));
    setWeekSchedule(newSchedule);
  };

  // Chọn tất cả các ca làm việc cho mọi ngày trong tuần
  const selectAllShifts = () => {
    const newSchedule = weekSchedule.map((day) => ({
      ...day,
      shifts: { shift1: true, shift2: true },
    }));
    setWeekSchedule(newSchedule);
  };

  // Bỏ chọn tất cả các ca làm việc
  const clearAllSelections = () => {
    const newSchedule = weekSchedule.map((day) => ({
      ...day,
      shifts: { shift1: false, shift2: false },
    }));
    setWeekSchedule(newSchedule);
  };

  // Xử lý lưu lịch làm việc vào database
  // Sử dụng cấu trúc theo mô hình WorkSchedule trong schedule.md
  const handleSaveSchedule = async () => {
    try {
      // Lấy thông tin người dùng (bác sĩ) từ session storage
      const user = JSON.parse(sessionStorage.getItem("user") || "{}");
      const doctorId = user?.user?.userId;

      if (!doctorId) {
        setErrorMessage("Không tìm thấy thông tin người dùng");
        return;
      }

      // Tạo mảng chứa các promise gọi API để lưu lịch làm việc
      const savePromises = [];

      // Duyệt qua từng ngày trong tuần
      for (const day of weekSchedule) {
        // Lấy ngày định dạng để lưu vào database (nếu cần)
        const formattedDate = formatDateToString(day.date);

        // Lấy giá trị TypeDay cho ngày này (MONDAY, TUESDAY, v.v.)
        const typeDay = day.typeDay; // Sử dụng trực tiếp enum TypeDay

        // Nếu ca 1 được chọn, thêm vào danh sách cần lưu
        if (day.shifts.shift1) {
          const data = {
            doctorId: doctorId,
            typeDay: typeDay, // Sử dụng trực tiếp enum TypeDay
            shift: SHIFTS.CA1.shift, // Sử dụng giá trị shift (1)
            // Các trường khác theo yêu cầu của API
          };

          savePromises.push(addWorkSchedule(data));
        }

        // Nếu ca 2 được chọn, thêm vào danh sách cần lưu
        if (day.shifts.shift2) {
          const data = {
            doctorId: doctorId,
            typeDay: typeDay, // Sử dụng trực tiếp enum TypeDay
            shift: SHIFTS.CA2.shift, // Sử dụng giá trị shift (2)
            // Các trường khác theo yêu cầu của API
          };

          savePromises.push(addWorkSchedule(data));
        }
      }

      // Kiểm tra nếu không có ca làm việc nào được chọn
      if (savePromises.length === 0) {
        setErrorMessage("Chưa chọn ca làm việc nào");
        return;
      }

      // Thực thi tất cả các lệnh lưu
      await Promise.all(savePromises);

      // Hiển thị thông báo thành công
      setSuccessMessage("Lưu lịch làm việc thành công");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error saving schedule:", error);
      setErrorMessage("Lỗi khi lưu lịch làm việc");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  // Định dạng hiển thị khoảng thời gian của tuần hiện tại
  const formatWeekRange = () => {
    const weekEnd = addDays(currentWeekStart, 6);
    return `${format(currentWeekStart, "dd/MM/yyyy")} - ${format(
      weekEnd,
      "dd/MM/yyyy"
    )}`;
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Tiêu đề trang */}
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ display: "flex", alignItems: "center", mb: 3 }}
      >
        <CalendarMonthIcon sx={{ mr: 1 }} />
        Thêm Lịch Làm Việc
      </Typography>

      {/* Hiển thị thông báo thành công hoặc lỗi */}
      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}

      {/* Điều hướng tuần và các nút thao tác hàng loạt */}
      <Paper sx={{ mb: 3, p: 2 }}>
        <Grid container spacing={2} alignItems="center">
          {/* Phần chọn tuần */}
          <Grid item xs={12} md={6}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <IconButton
                onClick={handlePrevWeek}
                aria-label="Tuần trước"
                disabled={isCurrentWeek()}
                sx={{
                  color: isCurrentWeek() ? "text.disabled" : "inherit",
                  "&:hover": {
                    color: isCurrentWeek() ? "text.disabled" : "primary.main",
                  },
                }}
              >
                <NavigateBeforeIcon />
              </IconButton>

              <Typography
                variant="h6"
                sx={{ flexGrow: 1, textAlign: "center" }}
              >
                {formatWeekRange()}
                {isCurrentWeek() && (
                  <Typography variant="caption" display="block" color="primary">
                    Tuần hiện tại
                  </Typography>
                )}
                {isNextWeek() && (
                  <Typography
                    variant="caption"
                    display="block"
                    color="secondary"
                  >
                    Tuần kế tiếp
                  </Typography>
                )}
              </Typography>

              <IconButton
                onClick={handleNextWeek}
                aria-label="Tuần sau"
                disabled={isNextWeek()}
                sx={{
                  color: isNextWeek() ? "text.disabled" : "inherit",
                  "&:hover": {
                    color: isNextWeek() ? "text.disabled" : "primary.main",
                  },
                }}
              >
                <NavigateNextIcon />
              </IconButton>
            </Stack>
          </Grid>

          {/* Các nút thao tác hàng loạt */}
          <Grid item xs={12} md={6}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1}
              justifyContent="flex-end"
            >
              <Button
                variant="outlined"
                startIcon={<EventRepeatIcon />}
                onClick={handleApplyPrevWeek}
                size="small"
              >
                Áp dụng tuần trước
              </Button>

              <Button variant="outlined" onClick={selectAllShift1} size="small">
                Chọn tất cả ca 1
              </Button>

              <Button variant="outlined" onClick={selectAllShift2} size="small">
                Chọn tất cả ca 2
              </Button>

              <Button variant="outlined" onClick={selectAllShifts} size="small">
                Chọn tất cả
              </Button>

              <Button
                variant="outlined"
                color="error"
                onClick={clearAllSelections}
                size="small"
              >
                Bỏ chọn tất cả
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* Bảng lịch làm việc theo tuần */}
      <Paper sx={{ mb: 3, overflow: "auto" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold", width: "100px" }}>
                  Ca
                </TableCell>

                {/* Tiêu đề các ngày trong tuần */}
                {weekSchedule.map((day) => (
                  <TableCell
                    key={day.typeDay}
                    align="center"
                    sx={{ fontWeight: "bold", minWidth: "120px" }}
                  >
                    {DAYS_OF_WEEK[day.dayIndex].label}
                    <Typography variant="body2" color="textSecondary">
                      {format(day.date, "dd/MM")}
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

                {/* Các ô checkbox cho ca 1 của từng ngày */}
                {weekSchedule.map((day) => (
                  <TableCell key={`${day.typeDay}-shift1`} align="center">
                    <Checkbox
                      checked={day.shifts.shift1}
                      onChange={() => toggleShift(day.dayIndex, "shift1")}
                    />
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

                {/* Các ô checkbox cho ca 2 của từng ngày */}
                {weekSchedule.map((day) => (
                  <TableCell key={`${day.typeDay}-shift2`} align="center">
                    <Checkbox
                      checked={day.shifts.shift2}
                      onChange={() => toggleShift(day.dayIndex, "shift2")}
                    />
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Các nút tác vụ chính */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
        <Button variant="outlined" onClick={() => initializeWeekSchedule()}>
          Hủy
        </Button>

        <Button
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          onClick={handleSaveSchedule}
        >
          Lưu lịch
        </Button>
      </Box>
    </Box>
  );
};

export default DoctorSchedulePage;
