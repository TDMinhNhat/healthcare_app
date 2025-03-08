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
import { getWorkScheduleTimeSlot } from "../../services/workSchedule_service";
import { formatDateToString, parseDateTimeFromString, formatTime } from "../../utils/dateUtils";

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

      const result = await getWorkScheduleTimeSlot(doctor.userId, formatDateToString(date)).then(response => response.data.data).catch(error => {
        console.log(error);
        return null;
      })

      const data = result.map((item: object) => {
        const getStart = parseDateTimeFromString(item.workSchedule.start);
        const getEnd = parseDateTimeFromString(item.workSchedule.end);

        return {
          isAvailable: item.isAvailable,
          workSchedule: item.workSchedule.id,
          time: `${formatTime(getStart.getHours().toString())}:${formatTime(getStart.getMinutes().toString())} - ${formatTime(getEnd.getHours().toString())}:${formatTime(getEnd.getMinutes().toString())}`
        }  
      });

      data.sort((a: object, b: object) => {
        const timeA = a.time.split("-")[0].trim();
        const timeB = b.time.split("-")[0].trim();

        return timeA.localeCompare(timeB);
      })

      // Tạm thời sử dụng dữ liệu mẫu
      setAvailableTimes(data);
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
  const isTimeSlotDisabled = (time: string, isAvailable: boolean) => {
    if(isAvailable === false) {
      return true;
    }

    const getTimeStart = time.split("-")[0];

    if (!selectedDate || !isToday(selectedDate)) return false;

    const now = new Date();
    const [hours, minutes] = getTimeStart.split(":").map(Number);
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
                          "repeat(auto-fill, minmax(150px, 1fr))",
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
                            key={time.time}
                            variant={
                              selectedTime === time ? "contained" : "outlined"
                            }
                            size="medium"
                            onClick={() => handleTimeSelect(time)}
                            disabled={isTimeSlotDisabled(time.time, time.isAvailable)}
                            sx={{
                              width: "150px",
                              height: "36px", // Fixed height for buttons
                            }}
                          >
                            {time.time}
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
