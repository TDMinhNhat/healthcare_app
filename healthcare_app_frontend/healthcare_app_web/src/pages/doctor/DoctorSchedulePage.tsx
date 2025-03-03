import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Alert,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Stack,
  Grid,
} from "@mui/material";
import { addDays, format } from "date-fns";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SaveIcon from "@mui/icons-material/Save";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import ClearIcon from "@mui/icons-material/Clear";
import { useTranslation } from "react-i18next";
import { formatDateToString, parseDateFromString } from "../../utils/dateUtils";

// Tạo các khung giờ từ 7:00 sáng đến 9:00 tối với khoảng thời gian 30 phút
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 7; hour <= 21; hour++) {
    const hourString = hour.toString().padStart(2, "0");
    slots.push(`${hourString}:00`);
    if (hour < 21) {
      slots.push(`${hourString}:30`);
    }
  }
  return slots;
};

// Mảng chứa tất cả các khung giờ có thể trong ngày
const timeSlots = generateTimeSlots();

// Tạo mảng các ngày trong 7 ngày tới
const generateDates = () => {
  const dates = [];
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const date = addDays(today, i);
    dates.push({
      date, // Đối tượng Date gốc
      formattedDate: formatDateToString(date), // Chuỗi ngày theo định dạng dd-MM-yyyy
      displayDate: format(date, "EEE dd/MM"), // Chuỗi hiển thị ngắn gọn với thứ và ngày tháng
    });
  }

  return dates;
};

// Định nghĩa kiểu dữ liệu cho một khung giờ làm việc
interface ScheduleSlot {
  id: number; // ID khung giờ
  date: string; // Ngày làm việc (định dạng dd-MM-yyyy)
  startTime: string; // Thời gian bắt đầu (định dạng HH:mm)
  endTime: string; // Thời gian kết thúc (định dạng HH:mm)
  isAvailable: boolean; // Trạng thái khả dụng của khung giờ
}

// Định nghĩa kiểu dữ liệu cho lịch làm việc của một ngày
interface DateSchedule {
  id: number; // ID lịch ngày
  date: string; // Ngày làm việc (định dạng dd-MM-yyyy)
  timeSlots: {
    // Mảng các khung giờ trong ngày
    id: number;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
  }[];
}

const DoctorSchedulePage = () => {
  const { t } = useTranslation();
  // Lưu trữ lịch làm việc của bác sĩ
  const [schedule, setSchedule] = useState<DateSchedule[]>([]);

  // Lưu trữ các khung giờ đã chọn theo dạng Map: key là ngày, value là Set các thời gian bắt đầu
  const [selectedSlots, setSelectedSlots] = useState<Map<string, Set<string>>>(
    new Map()
  );

  const [errorMessage, setErrorMessage] = useState(""); // Thông báo lỗi
  const [successMessage, setSuccessMessage] = useState(""); // Thông báo thành công
  const dates = generateDates(); // Tạo mảng 7 ngày tới

  // Khởi tạo trạng thái ban đầu khi component được tải
  useEffect(() => {
    // Tạo Map rỗng để lưu trữ các slot đã chọn cho mỗi ngày
    const initialSelectedSlots = new Map<string, Set<string>>();

    dates.forEach(({ formattedDate }) => {
      initialSelectedSlots.set(formattedDate, new Set<string>());
    });

    // Tải dữ liệu lịch trình từ state hiện tại
    setSelectedSlots(loadScheduleData());
  }, []);

  // Tải dữ liệu lịch làm việc từ state schedule hiện tại
  const loadScheduleData = () => {
    // Tạo Map mới để lưu trữ dữ liệu đã tải
    const loadedSlots = new Map<string, Set<string>>();

    // Duyệt qua 7 ngày tới
    dates.forEach(({ formattedDate }) => {
      // Khởi tạo Set rỗng cho mỗi ngày
      loadedSlots.set(formattedDate, new Set<string>());

      // Tìm lịch làm việc cho ngày cụ thể trong state schedule
      const dateSchedule = schedule.find((s) => s.date === formattedDate);
      if (dateSchedule) {
        // Thêm tất cả thời gian bắt đầu vào Set tương ứng
        dateSchedule.timeSlots.forEach((slot) => {
          loadedSlots.get(formattedDate)?.add(slot.startTime);
        });
      }
    });

    return loadedSlots;
  };

  // Tính toán thời gian kết thúc (sau 30 phút) từ thời gian bắt đầu
  const calculateEndTime = (startTime: string): string => {
    const [hours, minutes] = startTime.split(":").map(Number);
    let newMinutes = minutes + 30;
    let newHours = hours;

    // Xử lý khi phút vượt quá 59
    if (newMinutes >= 60) {
      newHours += 1;
      newMinutes -= 60;
    }

    // Định dạng lại thời gian thành chuỗi HH:mm
    return `${newHours.toString().padStart(2, "0")}:${newMinutes
      .toString()
      .padStart(2, "0")}`;
  };

  // Xử lý việc chọn hoặc bỏ chọn một khung giờ cụ thể
  const handleToggleSlot = (date: string, time: string) => {
    setSelectedSlots((prevSelectedSlots) => {
      // Tạo bản sao của Map hiện tại để không thay đổi trực tiếp state
      const newSelectedSlots = new Map(prevSelectedSlots);
      // Lấy Set các khung giờ của ngày cụ thể
      const dateSlots = new Set(newSelectedSlots.get(date) || []);

      // Nếu khung giờ đã tồn tại, xóa nó; ngược lại thêm vào
      if (dateSlots.has(time)) {
        dateSlots.delete(time);
      } else {
        dateSlots.add(time);
      }

      // Cập nhật lại Map với Set đã được thay đổi
      newSelectedSlots.set(date, dateSlots);
      return newSelectedSlots;
    });
  };

  // Chọn tất cả các ngày cho một khung giờ cụ thể
  const handleSelectAllForTime = (time: string) => {
    setSelectedSlots((prevSelectedSlots) => {
      const newSelectedSlots = new Map(prevSelectedSlots);

      // Duyệt qua tất cả các ngày
      dates.forEach(({ formattedDate }) => {
        const dateSlots = new Set(newSelectedSlots.get(formattedDate) || []);
        // Thêm khung giờ cụ thể vào tất cả các ngày
        dateSlots.add(time);
        newSelectedSlots.set(formattedDate, dateSlots);
      });

      return newSelectedSlots;
    });
  };

  // Xóa một khung giờ cụ thể khỏi tất cả các ngày
  const handleClearAllForTime = (time: string) => {
    setSelectedSlots((prevSelectedSlots) => {
      const newSelectedSlots = new Map(prevSelectedSlots);

      // Duyệt qua tất cả các ngày
      dates.forEach(({ formattedDate }) => {
        const dateSlots = new Set(newSelectedSlots.get(formattedDate) || []);
        // Xóa khung giờ cụ thể khỏi tất cả các ngày
        dateSlots.delete(time);
        newSelectedSlots.set(formattedDate, dateSlots);
      });

      return newSelectedSlots;
    });
  };

  // Chọn tất cả các khung giờ cho một ngày cụ thể
  const handleSelectAllForDate = (date: string) => {
    setSelectedSlots((prevSelectedSlots) => {
      const newSelectedSlots = new Map(prevSelectedSlots);
      // Tạo Set mới để chứa tất cả các khung giờ
      const dateSlots = new Set<string>();

      // Thêm tất cả các khung giờ vào Set (trừ 21:00 vì không thể bắt đầu khung giờ cuối)
      timeSlots.forEach((time) => {
        if (time !== "21:00") {
          dateSlots.add(time);
        }
      });

      // Cập nhật Map với tất cả khung giờ cho ngày cụ thể
      newSelectedSlots.set(date, dateSlots);
      return newSelectedSlots;
    });
  };

  // Xóa tất cả các khung giờ cho một ngày cụ thể
  const handleClearAllForDate = (date: string) => {
    setSelectedSlots((prevSelectedSlots) => {
      const newSelectedSlots = new Map(prevSelectedSlots);
      // Đặt Set rỗng cho ngày cụ thể
      newSelectedSlots.set(date, new Set<string>());
      return newSelectedSlots;
    });
  };

  // Lưu lịch làm việc vào state schedule
  const handleSaveSchedule = () => {
    // Tạo mảng lịch làm việc mới từ các khung giờ đã chọn
    const newSchedule: DateSchedule[] = [];
    let nextId = 1; // ID tăng dần cho mỗi khung giờ

    // Duyệt qua Map các khung giờ đã chọn
    selectedSlots.forEach((timeSet, date) => {
      // Chỉ xử lý các ngày có ít nhất một khung giờ
      if (timeSet.size > 0) {
        // Tạo mảng các đối tượng khung giờ
        const timeSlotsArray = Array.from(timeSet).map((startTime) => ({
          id: nextId++,
          startTime,
          endTime: calculateEndTime(startTime), // Tính thời gian kết thúc
          isAvailable: true, // Mặc định khung giờ khả dụng
        }));

        // Thêm lịch làm việc cho ngày này vào mảng kết quả
        newSchedule.push({
          id: newSchedule.length + 1,
          date,
          timeSlots: timeSlotsArray,
        });
      }
    });

    // Cập nhật state schedule
    setSchedule(newSchedule);
    // Hiển thị thông báo thành công
    setSuccessMessage(t("doctor.schedule.success_saved"));
    // Tự động ẩn thông báo sau 3 giây
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  // Kiểm tra xem một khung giờ cụ thể có được chọn hay không
  const isSlotSelected = (date: string, time: string) => {
    return selectedSlots.get(date)?.has(time) || false;
  };

  // Nhóm các khung giờ thành các hàng để hiển thị UI đẹp hơn
  const groupTimeSlots = (slots: string[]) => {
    // Loại bỏ khung giờ 21:00 vì không thể bắt đầu slot cuối
    const filteredSlots = slots.filter((time) => time !== "21:00");
    const rows = [];
    const itemsPerRow = 6; // Số khung giờ trên mỗi hàng

    // Chia mảng thành các nhóm nhỏ
    for (let i = 0; i < filteredSlots.length; i += itemsPerRow) {
      rows.push(filteredSlots.slice(i, i + itemsPerRow));
    }

    return rows;
  };

  // Mảng các hàng khung giờ đã được nhóm
  const timeSlotRows = groupTimeSlots(timeSlots);

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ display: "flex", alignItems: "center", mb: 3 }}
      >
        <CalendarMonthIcon sx={{ mr: 1 }} />
        {t("doctor.schedule.title")}
      </Typography>

      {/* Hiển thị thông báo thành công nếu có */}
      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}

      {/* Hiển thị thông báo lỗi nếu có */}
      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}

      {/* Hướng dẫn sử dụng */}
      <Box sx={{ mb: 2 }}>
        <Alert severity="info">{t("doctor.schedule.matrix_info")}</Alert>
      </Box>

      {/* Hiển thị từng ngày và các khung giờ tương ứng */}
      {dates.map((dateInfo, dateIndex) => (
        <Paper key={dateInfo.formattedDate} sx={{ mb: 3, p: 2 }}>
          {/* Tiêu đề ngày và các nút điều khiển */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography
              variant="h6"
              component="h2"
              sx={{ display: "flex", alignItems: "center" }}
            >
              <CalendarMonthIcon sx={{ mr: 1 }} />
              {dateInfo.displayDate}
              {/* Hiển thị ngày dạng ngắn */}
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                ({format(dateInfo.date, "EEEE")}){/* Hiển thị tên thứ đầy đủ */}
              </Typography>
            </Typography>

            {/* Nút chọn tất cả và xóa tất cả cho ngày này */}
            <Stack direction="row" spacing={1}>
              <Tooltip title={t("doctor.schedule.select_all_for_day")}>
                <Button
                  size="small"
                  variant="outlined"
                  color="primary"
                  startIcon={<EventAvailableIcon />}
                  onClick={() => handleSelectAllForDate(dateInfo.formattedDate)}
                >
                  {t("doctor.schedule.select_all")}
                </Button>
              </Tooltip>
              <Tooltip title={t("doctor.schedule.clear_all_for_day")}>
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  startIcon={<ClearIcon />}
                  onClick={() => handleClearAllForDate(dateInfo.formattedDate)}
                >
                  {t("doctor.schedule.clear_all")}
                </Button>
              </Tooltip>
            </Stack>
          </Box>

          {/* Hiển thị các hàng khung giờ cho ngày này */}
          {timeSlotRows.map((row, rowIndex) => (
            <Grid
              container
              spacing={1}
              key={`${dateInfo.formattedDate}-row-${rowIndex}`}
              sx={{ mb: 2 }}
            >
              {/* Hiển thị từng khung giờ trong một hàng */}
              {row.map((time) => {
                const isSelected = isSlotSelected(dateInfo.formattedDate, time);
                const endTime = calculateEndTime(time);
                return (
                  <Grid
                    item
                    xs={6}
                    sm={4}
                    md={2}
                    key={`${dateInfo.formattedDate}-${time}`}
                  >
                    {/* Ô hiển thị một khung giờ */}
                    <Paper
                      elevation={isSelected ? 2 : 0}
                      sx={{
                        border: isSelected ? "2px solid" : "1px solid",
                        borderColor: isSelected ? "primary.main" : "divider",
                        bgcolor: isSelected ? "primary.50" : "background.paper",
                        p: 1,
                        textAlign: "center",
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                        transition: "all 0.2s",
                        "&:hover": {
                          bgcolor: isSelected ? "primary.100" : "grey.100",
                          transform: "scale(1.02)",
                        },
                      }}
                      onClick={() =>
                        handleToggleSlot(dateInfo.formattedDate, time)
                      }
                    >
                      {/* Hiển thị thời gian bắt đầu và kết thúc */}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mb: 0.5,
                        }}
                      >
                        <AccessTimeIcon sx={{ fontSize: 16, mr: 0.5 }} />
                        <Typography variant="body2" fontWeight="medium">
                          {time} - {endTime}
                        </Typography>
                      </Box>
                      {/* Checkbox thể hiện trạng thái đã chọn */}
                      <Checkbox
                        checked={isSelected}
                        size="small"
                        color="primary"
                        sx={{ p: 0 }}
                      />
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
          ))}
        </Paper>
      ))}

      {/* Nút lưu lịch làm việc */}
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          onClick={handleSaveSchedule}
          size="large"
        >
          {t("doctor.schedule.save_schedule")}
        </Button>
      </Box>
    </Box>
  );
};

export default DoctorSchedulePage;
