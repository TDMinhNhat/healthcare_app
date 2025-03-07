import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  CircularProgress,
} from "@mui/material";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useTranslation } from "react-i18next";
import { format, addDays, isBefore, isToday, addMonths } from "date-fns";
// import { getDoctorAvailability } from "../../services/doctor_service";

interface SelectDateTimeProps {
  doctor: any;
  onSelect: (date: Date, time: string) => void;
  onBack: () => void;
}

const SelectDateTime: React.FC<SelectDateTimeProps> = ({
  doctor,
  onSelect,
  onBack,
}) => {
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedDate && doctor) {
      fetchAvailableTimes(selectedDate);
    }
  }, [selectedDate, doctor]);

  const fetchAvailableTimes = async (date: Date) => {
    try {
      setLoading(true);
      setError(null);

      // Gọi API thật
      // const response = await getDoctorAvailability(doctor.userId);
      // const availableSlots = response.data.data || {};
      // const dateTimes = availableSlots[formattedDate] || [];

      // Sắp xếp các khung giờ theo thứ tự tăng dần
      // const sortedTimes = [...dateTimes].sort();

      // setAvailableTimes(sortedTimes);

      // Tạm thời sử dụng dữ liệu mẫu
      setAvailableTimes([
        "08:00",
        "08:30",
        "09:00",
        "09:30",
        "10:00",
        "10:30",
        "11:00",
        "11:30",
        "13:00",
        "13:30",
        "14:00",
        "14:30",
        "15:00",
        "15:30",
        "16:00",
        "16:30",
        "17:00",
        "17:30",
        "18:00",
        "18:30",
        "19:00",
        "19:30",
      ]);
    } catch (err) {
      console.error("Không thể lấy lịch khám của bác sĩ:", err);
      setError("Không thể tải các khung giờ khả dụng. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    setSelectedTime("");
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleContinue = () => {
    if (selectedDate && selectedTime) {
      onSelect(selectedDate, selectedTime);
    }
  };

  const shouldDisableDate = (date: Date) => {
    // Vô hiệu hóa các ngày trong quá khứ và các ngày cách hơn 14 ngày (2 tuần) tính từ hiện tại
    const today = new Date();
    const maxDate = addDays(today, 14);

    return (isBefore(date, today) && !isToday(date)) || isBefore(maxDate, date);
  };

  // Vô hiệu hóa các khung giờ đã qua trong ngày hôm nay
  const isTimeSlotDisabled = (time: string) => {
    if (!selectedDate || !isToday(selectedDate)) return false;

    const now = new Date();
    const [hours, minutes] = time.split(":").map(Number);
    return (
      now.getHours() > hours ||
      (now.getHours() === hours && now.getMinutes() >= minutes)
    );
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {t("patient.appointments.select_date_time")}
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1">
          {t("patient.appointments.doctor")}: {doctor.firstName}{" "}
          {doctor.lastName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {doctor.specialization}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              {t("patient.appointments.select_date")}
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateCalendar
                value={selectedDate}
                onChange={handleDateChange}
                disablePast
                shouldDisableDate={shouldDisableDate}
              />
            </LocalizationProvider>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: "100%" }}>
            <Typography variant="subtitle1" gutterBottom>
              {t("patient.appointments.select_time")}
            </Typography>

            {selectedDate && (
              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  {format(selectedDate, "EEEE, MMMM d, yyyy")}
                </Typography>

                {loading ? (
                  <Box
                    sx={{ display: "flex", justifyContent: "center", my: 4 }}
                  >
                    <CircularProgress size={24} />
                  </Box>
                ) : (
                  <>
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fill, minmax(70px, 1fr))",
                        gap: 1,
                        mb: 2,
                        minHeight: "200px", // Fixed minimum height
                        maxHeight: "300px", // Maximum height
                        overflowY: "auto", // Add scrolling if needed
                        alignContent: "start", // Start from the top
                        padding: 1,
                        border: "1px solid #eee",
                        borderRadius: 1,
                      }}
                    >
                      {availableTimes.length > 0 ? (
                        availableTimes.map((time) => (
                          <Button
                            key={time}
                            variant={
                              selectedTime === time ? "contained" : "outlined"
                            }
                            size="small"
                            onClick={() => handleTimeSelect(time)}
                            disabled={isTimeSlotDisabled(time)}
                            sx={{
                              height: "36px", // Fixed height for buttons
                              margin: "4px 0", // Consistent vertical spacing
                            }}
                          >
                            {time}
                          </Button>
                        ))
                      ) : (
                        <Typography
                          color="text.secondary"
                          sx={{
                            py: 3,
                            textAlign: "center",
                            gridColumn: "1 / -1",
                          }}
                        >
                          {t("patient.appointments.no_available_slots")}
                        </Typography>
                      )}
                    </Box>
                  </>
                )}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
        <Button onClick={onBack}>{t("common.back")}</Button>
        <Button
          variant="contained"
          color="primary"
          disabled={!selectedDate || !selectedTime}
          onClick={handleContinue}
        >
          {t("common.continue")}
        </Button>
      </Box>
    </Box>
  );
};

export default SelectDateTime;
