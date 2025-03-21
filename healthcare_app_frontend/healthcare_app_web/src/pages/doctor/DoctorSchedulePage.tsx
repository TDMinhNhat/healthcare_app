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
import {
  getWorkScheduleBetweenDate,
  addMultipleWorkSchedule,
} from "../../services/authenticate/workSchedule_service";
import { parse } from "date-fns/esm";

// Interface Shift - phù hợp với mô hình cơ sở dữ liệu
interface Shift {
  id: number;
  shift: number;
  start: string;
  end: string;
  status?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Định nghĩa các ngày trong tuần theo enum TypeDay trong schedule.md
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
interface ScheduleItem {
  dayIndex: number; // Index of the day in the week (0-6)
  date: Date;
  selectedShifts: number[]; // Array of selected shift numbers (1, 2)
}

const DoctorSchedulePage = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const doctorId = user?.userId;

  // Lưu trữ ngày hiện tại để tính toán giới hạn tuần
  const [today] = useState(new Date());

  // State lưu ngày bắt đầu của tuần hiện tại (mặc định là thứ 2)
  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(today, { weekStartsOn: 1 })
  );

  // State lưu trữ lịch làm việc của cả tuần hiện tại
  const [weekSchedule, setWeekSchedule] = useState<ScheduleItem[]>([]);

  // State lưu trữ thông báo thành công để hiển thị cho người dùng
  const [successMessage, setSuccessMessage] = useState("");

  // State lưu trữ thông báo lỗi để hiển thị cho người dùng
  const [errorMessage, setErrorMessage] = useState("");

  // State lưu trữ lịch làm việc của tuần trước để có thể áp dụng lại
  const [prevWeekSchedule, setPrevWeekSchedule] = useState<ScheduleItem[]>([]);

  // Khởi tạo lịch làm việc khi tuần hiện tại thay đổi
  useEffect(() => {
    const initScheduleAndFetchData = async () => {
      // Tạo dữ liệu cho 7 ngày trong tuần mới
      const newWeekSchedule: ScheduleItem[] = [];
      for (let i = 0; i < 7; i++) {
        const currentDate = addDays(currentWeekStart, i);
        newWeekSchedule.push({
          dayIndex: i,
          date: currentDate,
          selectedShifts: [], // Empty array for selected shifts
        });
      }

      // Cập nhật state với lịch trống mới cho tuần hiện tại
      setWeekSchedule(newWeekSchedule);

      // Sau đó, nếu có doctorId, gọi API để lấy dữ liệu lịch làm việc đã đăng ký
      if (doctorId) {
        const weekStart = currentWeekStart;
        const weekEnd = addDays(currentWeekStart, 6);

        try {
          // Gọi API để lấy lịch làm việc từ fromDate đến toDate
          const response = await getWorkScheduleBetweenDate(
            doctorId,
            formatDateToString(weekStart),
            formatDateToString(weekEnd)
          );

          const data = response?.data?.data || [];
          // console.log(
          //   "Data fetched for week:",
          //   formatDateToString(weekStart),
          //   "to",
          //   formatDateToString(weekEnd),
          //   data
          // );

          // Cập nhật lịch làm việc với dữ liệu từ API
          if (data.length > 0) {
            const updatedSchedule = [...newWeekSchedule];
            console.log("Update schedule with data:", updatedSchedule);
            // Process each item in the response
            data.forEach((item: any) => {
              // console.log("Processing item:", item);
              // console.log("Date:", item.workSchedule.shift.shift);
              // Extract date from the response
              const appointmentDate = parse(
                item.workSchedule.dateAppointment,
                "dd-MM-yyyy",
                new Date()
              );
              // Find the day index in the week schedule
              const dayIndex = updatedSchedule.findIndex(
                (day) =>
                  day.date.getDate() === appointmentDate.getDate() &&
                  day.date.getMonth() === appointmentDate.getMonth() &&
                  day.date.getFullYear() === appointmentDate.getFullYear()
              );

              // If the day is found in current week schedule
              if (dayIndex !== -1) {
                // Check which shift is set in the response and update accordingly
                if (
                  item.workSchedule.shift &&
                  item.workSchedule.shift.shift === 1
                ) {
                  if (!updatedSchedule[dayIndex].selectedShifts.includes(1)) {
                    console.log("Shift 1 found for day:", dayIndex);
                    updatedSchedule[dayIndex].selectedShifts.push(1);
                  }
                } else if (
                  item.workSchedule.shift &&
                  item.workSchedule.shift.shift === 2
                ) {
                  if (!updatedSchedule[dayIndex].selectedShifts.includes(2)) {
                    updatedSchedule[dayIndex].selectedShifts.push(2);
                  }
                }
              }
            });
            console.log("Updated schedule with data:", updatedSchedule);
            // Update the week schedule state with the fetched data
            setWeekSchedule(updatedSchedule);
          }
        } catch (error) {
          console.error("Error fetching work schedule:", error);
          setErrorMessage("Lỗi khi tải lịch làm việc");
          setTimeout(() => setErrorMessage(""), 3000);
        }
      }
    };

    initScheduleAndFetchData();
  }, [currentWeekStart, doctorId]);

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

      // Cập nhật tuần mới
      setCurrentWeekStart(startOfWeek(today, { weekStartsOn: 1 }));
      // console.log(
      //   "Navigating to previous week:",
      //   format(startOfWeek(today, { weekStartsOn: 1 }), "dd/MM/yyyy")
      // );
    }
  };

  // Chuyển đến tuần tiếp theo (bị giới hạn ở tuần kế tiếp)
  const handleNextWeek = () => {
    // Chỉ cho phép chuyển đến tuần kế tiếp, không xa hơn
    if (!isNextWeek()) {
      // Lưu lịch làm việc hiện tại trước khi chuyển tuần
      setPrevWeekSchedule([...weekSchedule]);

      // Cập nhật tuần mới
      const nextWeekStart = startOfWeek(addWeeks(today, 1), {
        weekStartsOn: 1,
      });
      setCurrentWeekStart(nextWeekStart);
      // console.log(
      //   "Navigating to next week:",
      //   format(nextWeekStart, "dd/MM/yyyy")
      // );
    }
  };

  // Áp dụng lịch làm việc của tuần trước cho tuần hiện tại
  const handleApplyPrevWeek = () => {
    if (prevWeekSchedule.length > 0) {
      const newSchedule = weekSchedule.map((day, index) => ({
        ...day,
        selectedShifts: [...prevWeekSchedule[index].selectedShifts],
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
  const toggleShift = (dayIndex: number, shiftNumber: number) => {
    const newSchedule = [...weekSchedule];
    const daySchedule = newSchedule[dayIndex];

    if (daySchedule.selectedShifts.includes(shiftNumber)) {
      // Remove shift if already selected
      daySchedule.selectedShifts = daySchedule.selectedShifts.filter(
        (shift) => shift !== shiftNumber
      );
    } else {
      // Add shift if not selected
      daySchedule.selectedShifts.push(shiftNumber);
    }

    setWeekSchedule(newSchedule);
  };

  // Chọn tất cả ca 1 cho mọi ngày trong tuần
  const selectAllShift1 = () => {
    const newSchedule = weekSchedule.map((day) => ({
      ...day,
      selectedShifts: [...new Set([...day.selectedShifts, 1])],
    }));
    setWeekSchedule(newSchedule);
  };

  // Chọn tất cả ca 2 cho mọi ngày trong tuần
  const selectAllShift2 = () => {
    const newSchedule = weekSchedule.map((day) => ({
      ...day,
      selectedShifts: [...new Set([...day.selectedShifts, 2])],
    }));
    setWeekSchedule(newSchedule);
  };

  // Chọn tất cả các ca làm việc cho mọi ngày trong tuần
  const selectAllShifts = () => {
    const newSchedule = weekSchedule.map((day) => ({
      ...day,
      selectedShifts: [1, 2],
    }));
    setWeekSchedule(newSchedule);
  };

  // Bỏ chọn tất cả các ca làm việc
  const clearAllSelections = () => {
    const newSchedule = weekSchedule.map((day) => ({
      ...day,
      selectedShifts: [],
    }));
    setWeekSchedule(newSchedule);
  };

  // Xử lý lưu lịch làm việc vào database
  const handleSaveSchedule = async () => {
    try {
      if (!doctorId) {
        setErrorMessage("Không tìm thấy thông tin người dùng");
        return;
      }

      // Tạo mảng chứa tất cả các ca làm việc cần lưu
      const schedulesToSave = [];

      // Duyệt qua từng ngày trong tuần
      for (const day of weekSchedule) {
        // Định dạng ngày thành dd-MM-yyyy theo yêu cầu API
        const formattedDate = format(day.date, "dd-MM-yyyy");

        // Thêm tất cả các ca được chọn vào danh sách cần lưu
        for (const shiftNumber of day.selectedShifts) {
          schedulesToSave.push({
            doctorId: doctorId,
            shift: shiftNumber,
            maxSlots: 10, // Số lượng slot mặc định
            dateAppointment: formattedDate,
          });
        }
      }

      // Kiểm tra nếu không có ca làm việc nào được chọn
      if (schedulesToSave.length === 0) {
        setErrorMessage("Chưa chọn ca làm việc nào");
        return;
      }

      // Gọi API để lưu tất cả các lịch làm việc một lúc
      const response = await addMultipleWorkSchedule(schedulesToSave);

      // Kiểm tra kết quả trả về từ API
      if (response && response.data && response.data.code === 200) {
        // Hiển thị thông báo thành công
        setSuccessMessage("Lưu lịch làm việc thành công");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        throw new Error("Không thể lưu lịch làm việc");
      }
    } catch (error) {
      console.error("Error saving schedule:", error);
      setErrorMessage("Lỗi khi lưu lịch làm việc");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  // Hàm tạo lại lịch làm việc cho tuần hiện tại (dùng cho nút hủy)
  const resetWeekSchedule = async () => {
    // Tạo lại lịch làm việc của tuần hiện tại
    const weekStart = currentWeekStart;
    const weekEnd = addDays(currentWeekStart, 6);

    try {
      // Tạo dữ liệu trống cho 7 ngày trong tuần
      const newWeekSchedule: ScheduleItem[] = [];
      for (let i = 0; i < 7; i++) {
        const currentDate = addDays(currentWeekStart, i);
        newWeekSchedule.push({
          dayIndex: i,
          date: currentDate,
          selectedShifts: [],
        });
      }

      setWeekSchedule(newWeekSchedule);

      // Nếu có doctorId, tải lại dữ liệu từ API
      if (doctorId) {
        const response = await getWorkScheduleBetweenDate(
          doctorId,
          formatDateToString(weekStart),
          formatDateToString(weekEnd)
        );

        const data = response?.data?.data || [];

        if (data.length > 0) {
          const updatedSchedule = [...newWeekSchedule];

          data.forEach((item: any) => {
            const appointmentDate = new Date(item.dateAppointment);

            const dayIndex = updatedSchedule.findIndex(
              (day) =>
                day.date.getDate() === appointmentDate.getDate() &&
                day.date.getMonth() === appointmentDate.getMonth() &&
                day.date.getFullYear() === appointmentDate.getFullYear()
            );

            if (dayIndex !== -1) {
              if (item.shift && item.shift.shift === 1) {
                if (!updatedSchedule[dayIndex].selectedShifts.includes(1)) {
                  updatedSchedule[dayIndex].selectedShifts.push(1);
                }
              } else if (item.shift && item.shift.shift === 2) {
                if (!updatedSchedule[dayIndex].selectedShifts.includes(2)) {
                  updatedSchedule[dayIndex].selectedShifts.push(2);
                }
              }
            }
          });
          console.log("Reset schedule with data:", updatedSchedule);
          setWeekSchedule(updatedSchedule);
        }
      }
    } catch (error) {
      console.error("Error resetting schedule:", error);
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
                    key={`day-${day.dayIndex}`}
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
                    07:00 - 11:00
                  </Typography>
                </TableCell>

                {/* Các ô checkbox cho ca 1 của từng ngày */}
                {weekSchedule.map((day) => (
                  <TableCell key={`${day.dayIndex}-shift1`} align="center">
                    <Checkbox
                      checked={day.selectedShifts.includes(1)}
                      onChange={() => toggleShift(day.dayIndex, 1)}
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
                    13:00 - 17:00
                  </Typography>
                </TableCell>

                {/* Các ô checkbox cho ca 2 của từng ngày */}
                {weekSchedule.map((day) => (
                  <TableCell key={`${day.dayIndex}-shift2`} align="center">
                    <Checkbox
                      checked={day.selectedShifts.includes(2)}
                      onChange={() => toggleShift(day.dayIndex, 2)}
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
        <Button variant="outlined" onClick={resetWeekSchedule}>
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
