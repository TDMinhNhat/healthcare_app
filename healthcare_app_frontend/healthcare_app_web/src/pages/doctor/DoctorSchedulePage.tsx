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
  Tooltip,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { addDays, format, parse } from "date-fns";
import { vi } from "date-fns/locale"; // Import Vietnamese locale from date-fns
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SaveIcon from "@mui/icons-material/Save";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTranslation } from "react-i18next";
import { formatDateToString, parseDateFromString } from "../../utils/dateUtils";
import { addWorkSchedule } from "../../services/workSchedule_service.ts";

// Tạo mảng các ngày trong 14 ngày tới, trừ ngày hiện tại
const generateDates = () => {
  const dates = [];
  const today = new Date();

  // Bắt đầu từ ngày mai (i = 1)
  for (let i = 1; i <= 14; i++) {
    const date = addDays(today, i);
    dates.push({
      date, // Đối tượng Date gốc
      formattedDate: formatDateToString(date), // Chuỗi ngày theo định dạng dd-MM-yyyy
      displayDate: format(date, "EEE dd/MM", { locale: vi }), // Hiển thị ngày với định dạng tiếng Việt
    });
  }

  return dates;
};

// Định nghĩa kiểu dữ liệu cho một khung giờ làm việc
interface TimeSlot {
  id: number;
  startTime: string; // Thời gian bắt đầu (định dạng HH:mm)
  endTime: string; // Thời gian kết thúc (định dạng HH:mm)
  isAvailable: boolean;
}

// Định nghĩa kiểu dữ liệu cho lịch làm việc của một ngày
interface DateSchedule {
  id: number;
  date: string; // Ngày làm việc (định dạng dd-MM-yyyy)
  timeSlots: TimeSlot[];
}

// Format time string to ensure 24h format display
const formatTimeDisplay = (timeString: string): string => {
  // Time is already in 24h format, just ensure consistent display
  return timeString;
};

const DoctorSchedulePage = () => {
  const { t } = useTranslation();
  const dates = generateDates();

  // State cho ngày đã chọn
  const [selectedDate, setSelectedDate] = useState<string>(
    dates[0]?.formattedDate || ""
  );

  // State cho các time slots đã thêm
  const [schedule, setSchedule] = useState<DateSchedule[]>([]);

  // State cho dialog thêm time slot mới - Sử dụng định dạng 24h
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("08:30");

  // State cho thông báo
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Lấy các time slots cho ngày đã chọn
  const getTimeSlotsForSelectedDate = (): TimeSlot[] => {
    const dateSchedule = schedule.find((s) => s.date === selectedDate);
    return dateSchedule?.timeSlots || [];
  };

  // Mở dialog thêm time slot với giờ mặc định theo định dạng 24h
  const handleOpenAddDialog = () => {
    setStartTime("08:00");
    setEndTime("08:30");
    setOpenAddDialog(true);
  };

  // Đóng dialog thêm time slot
  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  // Thêm time slot mới
  const handleAddTimeSlot = () => {
    // Validate time input
    if (!startTime || !endTime) {
      setErrorMessage(t("doctor.schedule.error_select_times"));
      return;
    }

    // Check if start time is before end time
    if (startTime >= endTime) {
      setErrorMessage(t("doctor.schedule.error_invalid_time_range"));
      return;
    }

    setSchedule((prevSchedule) => {
      const newSchedule = [...prevSchedule];
      const dateIndex = newSchedule.findIndex((s) => s.date === selectedDate);

      // Create new time slot
      const newTimeSlot: TimeSlot = {
        id: Date.now(), // Use timestamp as temporary ID
        startTime,
        endTime,
        isAvailable: true,
      };

      if (dateIndex >= 0) {
        // Date exists, add new time slot
        const existingSlots = newSchedule[dateIndex].timeSlots;

        // Check for overlapping slots
        const hasOverlap = existingSlots.some(
          (slot) =>
            (startTime >= slot.startTime && startTime < slot.endTime) ||
            (endTime > slot.startTime && endTime <= slot.endTime) ||
            (startTime <= slot.startTime && endTime >= slot.endTime)
        );

        if (hasOverlap) {
          setErrorMessage(t("doctor.schedule.error_time_slot_overlap"));
          return prevSchedule;
        }

        newSchedule[dateIndex].timeSlots = [...existingSlots, newTimeSlot].sort(
          (a, b) => a.startTime.localeCompare(b.startTime)
        );
      } else {
        // Create new date entry
        newSchedule.push({
          id: Date.now(),
          date: selectedDate,
          timeSlots: [newTimeSlot],
        });
      }

      setErrorMessage("");
      setOpenAddDialog(false);
      setSuccessMessage(t("doctor.schedule.success_added"));
      setTimeout(() => setSuccessMessage(""), 3000);
      return newSchedule;
    });
  };

  // Xóa time slot
  const handleDeleteTimeSlot = (slotId: number) => {
    setSchedule((prevSchedule) => {
      const newSchedule = [...prevSchedule];
      const dateIndex = newSchedule.findIndex((s) => s.date === selectedDate);

      if (dateIndex >= 0) {
        // Filter out the deleted time slot
        newSchedule[dateIndex].timeSlots = newSchedule[
          dateIndex
        ].timeSlots.filter((slot) => slot.id !== slotId);

        // If no time slots left for this date, remove the date entry
        if (newSchedule[dateIndex].timeSlots.length === 0) {
          newSchedule.splice(dateIndex, 1);
        }
      }

      return newSchedule;
    });
  };

  // Lưu lịch làm việc
  const handleSaveSchedule = () => {
    // Tại đây có thể thêm code để lưu lịch làm việc vào database
    const user: object = JSON.parse(sessionStorage.getItem("user") as string)

    schedule.map((item) => {
      const getDate: string = item.date;
      item.timeSlots.map(async (time: TimeSlot) => {
        const data = {
          doctorId: user.user.userId,
          timeStart: getDate + "-" + time.startTime.replace(":", "-") + "-00",
          timeEnd: getDate + "-" + time.endTime.replace(":", "-") + "-00"
        }

        const result: object = await addWorkSchedule(data).then(response => response.data).catch(error => {
          console.log(error);
          return error;
        })

        console.log(result);
      })
    })

    setSuccessMessage(t("doctor.schedule.success_saved"));
    setTimeout(() => setSuccessMessage(""), 3000);
  };

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

      {/* Dropdown chọn ngày */}
      <Paper sx={{ mb: 3, p: 2 }}>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="date-select-label">
            {t("doctor.schedule.select_date")}
          </InputLabel>
          <Select
            labelId="date-select-label"
            id="date-select"
            value={selectedDate}
            label={t("doctor.schedule.select_date")}
            onChange={(e) => setSelectedDate(e.target.value as string)}
          >
            {dates.map((dateInfo) => (
              <MenuItem
                key={dateInfo.formattedDate}
                value={dateInfo.formattedDate}
              >
                {dateInfo.displayDate} (
                {format(dateInfo.date, "EEEE", { locale: vi })})
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Nút thêm slot thời gian mới */}
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddCircleIcon />}
          onClick={handleOpenAddDialog}
        >
          {t("doctor.schedule.add_time_slot")}
        </Button>

        {/* Hiển thị các time slot đã thêm */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            {t("doctor.schedule.time_slots") || "Khung Giờ"}
          </Typography>

          {getTimeSlotsForSelectedDate().length > 0 ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{t("doctor.schedule.start_time")}</TableCell>
                    <TableCell>{t("doctor.schedule.end_time")}</TableCell>
                    <TableCell align="right">
                      {t("common.actions") || "Thao Tác"}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getTimeSlotsForSelectedDate().map((slot) => (
                    <TableRow key={slot.id}>
                      <TableCell>{formatTimeDisplay(slot.startTime)}</TableCell>
                      <TableCell>{formatTimeDisplay(slot.endTime)}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteTimeSlot(slot.id)}
                          size="small"
                          aria-label={t("common.delete")}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Alert severity="info" sx={{ mt: 1 }}>
              {t("doctor.schedule.no_time_slots")}
            </Alert>
          )}
        </Box>
      </Paper>

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

      {/* Dialog thêm time slot mới với input sử dụng định dạng 24h */}
      <Dialog open={openAddDialog} onClose={handleCloseAddDialog}>
        <DialogTitle>{t("doctor.schedule.add_time_slot")}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1, minWidth: "300px" }}>
            <TextField
              label={t("doctor.schedule.start_time")}
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              InputLabelProps={{ shrink: true }}
              // Ensure 5 min steps and force 24h format
              inputProps={{
                step: 300,
                form: {
                  autocomplete: "off", // Disable browser autocomplete which might suggest AM/PM
                },
              }}
              fullWidth
            />
            <TextField
              label={t("doctor.schedule.end_time")}
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              InputLabelProps={{ shrink: true }}
              // Ensure 5 min steps and force 24h format
              inputProps={{
                step: 300,
                form: {
                  autocomplete: "off", // Disable browser autocomplete which might suggest AM/PM
                },
              }}
              fullWidth
            />
            <Typography variant="caption" color="textSecondary">
              Thời gian sử dụng định dạng 24 giờ (00:00 - 23:59)
            </Typography>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog}>{t("common.cancel")}</Button>
          <Button onClick={handleAddTimeSlot} variant="contained">
            {t("common.save")}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DoctorSchedulePage;
