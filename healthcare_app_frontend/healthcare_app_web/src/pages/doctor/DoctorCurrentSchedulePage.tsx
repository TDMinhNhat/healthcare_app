import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, Grid, Chip, Alert } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { format, addDays } from "date-fns";
import { useTranslation } from "react-i18next";
import { formatDateToString, parseDateFromString, parseDateTimeFromString, formatTime } from "../../utils/dateUtils";
import { getWorkSchedule } from "../../services/workSchedule_service.ts";
import { data } from "react-router";

// Định nghĩa kiểu dữ liệu cho một khung giờ làm việc
interface ScheduleSlot {
  id: number;
  date: string; // Ngày làm việc (định dạng dd-MM-yyyy)
  startTime: string; // Thời gian bắt đầu (định dạng HH:mm)
  endTime: string; // Thời gian kết thúc (định dạng HH:mm)
  isAvailable: boolean; // Trạng thái khả dụng của khung giờ (true: còn trống, false: đã có lịch hẹn)
}

// Định nghĩa kiểu dữ liệu cho lịch làm việc của một ngày
interface DateSchedule {
  id: number; // ID lịch ngày
  date: string; // Ngày làm việc (định dạng dd-MM-yyyy)
  timeSlots: {
    startTime: string;
    endTime: string;
    isAvailable: boolean;
  }[];
}

// Tạo mảng các ngày trong 7 ngày tới để hiển thị
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

const DoctorCurrentSchedulePage: React.FC = () => {
  const { t } = useTranslation(); // Hook dịch ngôn ngữ
  // State lưu trữ lịch làm việc của bác sĩ
  const [schedule, setSchedule] = useState<DateSchedule[]>([]);
  // Mảng các ngày để hiển thị (7 ngày tính từ ngày hiện tại)
  const dates = generateDates();
  const user: object = JSON.parse(sessionStorage.getItem("user") as string || "{}");

  useEffect(() => {
    // Trong thực tế, ở đây sẽ gọi API để lấy lịch làm việc của bác sĩ
    // Hiện tại đang sử dụng dữ liệu giả lập mockSavedSchedule
    async function fetchData() {
      const result = await getWorkSchedule(user.user.userId).then((response) => response.data.data).catch(error => {
        console.log(error);
        return null;
      })

      var dateSchedule: DateSchedule[] = [];
      result.map((item: object, index: any) => {
        const [day, month, year, hour, minute, second] = item.workSchedule.start.split("-");
        const date: Date = new Date(year, month - 1, day);

        const start: Date = parseDateTimeFromString(item.workSchedule.start);
        const end: Date = parseDateTimeFromString(item.workSchedule.end);

        // Lọc tìm kiếm date ngày làm việc ca đó phù hợp
        let element = dateSchedule.find(schedule => schedule.date === formatDateToString(date));
        if(element) {
          element.timeSlots.push(
            { 
              startTime: `${formatTime(start.getHours().toString())}:${formatTime(start.getMinutes().toString())}`,
              endTime: `${formatTime(end.getHours().toString())}:${formatTime(end.getMinutes().toString())}`, 
              isAvailable: item.isAvailable 
            }
          )
        } else {
          dateSchedule.push({
            id: index,
            date: formatDateToString(date),
            timeSlots: [
              { 
                startTime: `${formatTime(start.getHours().toString())}:${formatTime(start.getMinutes().toString())}`,
                endTime: `${formatTime(end.getHours().toString())}:${formatTime(end.getMinutes().toString())}`, 
                isAvailable: item.isAvailable 
              }
            ]
          })
        }
      })

      setSchedule(dateSchedule)
    }

    fetchData();
  }, []);

  // Nhóm các khung giờ thành các hàng để hiển thị UI đẹp hơn
  const groupTimeSlots = (slots: ScheduleSlot[]) => {
    const rows = [];
    const itemsPerRow = 6; // Thay đổi từ 8 xuống 6 khung giờ trên mỗi hàng

    // Chia mảng thành các nhóm nhỏ
    for (let i = 0; i < slots.length; i += itemsPerRow) {
      rows.push(slots.slice(i, i + itemsPerRow));
    }

    return rows;
  };

  // Tìm tất cả các khung giờ cho một ngày cụ thể
  const getSlotsForDate = (date: string): ScheduleSlot[] => {
    const dateSchedule = schedule.find((s) => s.date === date);
    return dateSchedule
      ? dateSchedule.timeSlots.map((slot) => ({
          ...slot,
          date: dateSchedule.date,
        }))
      : [];
  };

  return (
    <Box sx={{ p: 2 }}>
      {" "}
      {/* Giảm padding từ 3 xuống 2 */}
      {/* Tiêu đề trang */}
      <Typography
        variant="h5" // Giảm kích thước tiêu đề từ h4 xuống h5
        component="h1"
        gutterBottom
        sx={{ display: "flex", alignItems: "center", mb: 2 }} // Giảm margin bottom
      >
        <CalendarMonthIcon sx={{ mr: 1, fontSize: 20 }} />{" "}
        {/* Giảm kích thước icon */}
        {t("doctor.schedule.current_schedule")}
      </Typography>
      {/* Thông báo thông tin - chỉ xem, không chỉnh sửa */}
      <Box sx={{ mb: 2 }}>
        {" "}
        {/* Giảm margin bottom */}
        <Alert severity="info" sx={{ py: 0.5 }}>
          {" "}
          {/* Giảm padding theo chiều dọc */}
          {t("doctor.schedule.view_only_info")}
        </Alert>
      </Box>
      {/* Hiển thị lịch làm việc cho từng ngày */}
      {dates.map((dateInfo) => {
        // Lấy tất cả khung giờ cho ngày hiện tại
        const slots = getSlotsForDate(dateInfo.formattedDate);
        // Nhóm các khung giờ để hiển thị theo hàng
        const slotGroups = groupTimeSlots(slots);

        return (
          <Paper key={dateInfo.formattedDate} sx={{ mb: 1.5, p: 1 }}>
            {" "}
            {/* Giảm margin và padding */}
            {/* Tiêu đề ngày */}
            <Box sx={{ mb: 0.5 }}>
              {" "}
              {/* Giảm margin bottom */}
              <Typography
                variant="subtitle1" // Giảm kích thước từ h6 xuống subtitle1
                component="h2"
                sx={{ display: "flex", alignItems: "center" }}
              >
                <CalendarMonthIcon sx={{ mr: 0.5, fontSize: 18 }} />{" "}
                {/* Giảm kích thước icon và margin */}
                {dateInfo.displayDate}
                <Typography
                  variant="caption" // Giảm kích thước từ body2 xuống caption
                  color="text.secondary"
                  sx={{ ml: 0.5 }} // Giảm margin left
                >
                  ({format(dateInfo.date, "EEEE")})
                </Typography>
              </Typography>
            </Box>
            {/* Hiển thị các khung giờ hoặc thông báo nếu không có khung giờ nào */}
            {slots.length > 0 ? (
              slotGroups.map((group, groupIndex) => (
                <Grid
                  container
                  spacing={0.5} // Giảm spacing từ 1 xuống 0.5
                  key={`${dateInfo.formattedDate}-group-${groupIndex}`}
                  sx={{ mb: 0.5 }} // Giảm margin bottom
                >
                  {/* Hiển thị từng khung giờ trong nhóm */}
                  {group.map((slot) => (
                    <Grid
                      item
                      xs={4} // 3 items per row on extra small screens (12/3 = 4 units per item)
                      sm={4} // 3 items per row on small screens (12/3 = 4 units per item)
                      md={2} // 6 items per row on medium screens (12/6 = 2 units per item)
                      key={`${dateInfo.formattedDate}-${slot.id}`}
                    >
                      {/* Thẻ hiển thị thông tin khung giờ */}
                      <Paper
                        elevation={0}
                        sx={{
                          border: "1px solid",
                          borderColor: slot.isAvailable
                            ? "success.main"
                            : "error.main",
                          bgcolor: slot.isAvailable ? "success.50" : "error.50",
                          p: 0.5, // Giảm padding từ 1 xuống 0.5
                          textAlign: "center",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          height: "100%",
                          minHeight: 36, // Thêm chiều cao tối thiểu để đảm bảo hiển thị đẹp hơn
                        }}
                      >
                        {/* Hiển thị thời gian bắt đầu và kết thúc */}
                        <Typography
                          variant="caption" // Sử dụng variant nhỏ hơn
                          fontWeight="medium"
                          sx={{ fontSize: "0.65rem" }} // Giảm kích thước font chữ
                        >
                          {slot.startTime}-{slot.endTime}
                        </Typography>
                        {/* Hiển thị trạng thái khung giờ (khả dụng hoặc đã đặt) */}
                        <Chip
                          label={
                            slot.isAvailable
                              ? t("doctor.schedule.available")
                              : t("doctor.schedule.booked")
                          }
                          color={slot.isAvailable ? "success" : "error"}
                          size="small"
                          sx={{
                            height: 18,
                            fontSize: "0.6rem",
                            "& .MuiChip-label": {
                              px: 0.5, // Giảm padding theo chiều ngang của label
                            },
                          }} // Giảm kích thước chip hơn nữa
                        />
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              ))
            ) : (
              // Hiển thị thông báo khi không có khung giờ nào cho ngày này
              <Alert severity="info" sx={{ mt: 0.5, py: 0.5 }}>
                {" "}
                {/* Giảm padding và margin */}
                {t("doctor.schedule.no_schedule_for_date")}
              </Alert>
            )}
          </Paper>
        );
      })}
    </Box>
  );
};

export default DoctorCurrentSchedulePage;
