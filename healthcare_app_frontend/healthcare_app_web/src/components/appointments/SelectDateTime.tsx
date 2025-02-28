import React, { useState } from "react";
import { Box, Typography, Grid, Paper, Button } from "@mui/material";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useTranslation } from "react-i18next";
import { format, addDays, isBefore, isToday } from "date-fns";

interface SelectDateTimeProps {
  onSelect: (date: Date, time: string) => void;
}

const SelectDateTime: React.FC<SelectDateTimeProps> = ({ onSelect }) => {
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>("");

  // Create time slots with 30-minute intervals
  const morningSlots = [
    "07:00",
    "07:30",
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
  ];
  const afternoonSlots = [
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
  ];
  const eveningSlots = ["17:00", "17:30", "18:00", "18:30", "19:00", "19:30"];

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

  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  const shouldDisableDate = (date: Date) => {
    // Disable past days, weekends, and dates more than 30 days in the future
    const today = new Date();
    const maxDate = addDays(today, 30);

    return (
      (isBefore(date, today) && !isToday(date)) ||
      isWeekend(date) ||
      isBefore(maxDate, date)
    );
  };

  // Disable time slots that are in the past for today
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

                <Typography variant="subtitle2" sx={{ mt: 2 }}>
                  {t("patient.appointments.morning")}
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                  {morningSlots.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "contained" : "outlined"}
                      size="small"
                      onClick={() => handleTimeSelect(time)}
                      disabled={isTimeSlotDisabled(time)}
                    >
                      {time}
                    </Button>
                  ))}
                </Box>

                <Typography variant="subtitle2" sx={{ mt: 2 }}>
                  {t("patient.appointments.afternoon")}
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                  {afternoonSlots.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "contained" : "outlined"}
                      size="small"
                      onClick={() => handleTimeSelect(time)}
                      disabled={isTimeSlotDisabled(time)}
                    >
                      {time}
                    </Button>
                  ))}
                </Box>

                <Typography variant="subtitle2" sx={{ mt: 2 }}>
                  {t("patient.appointments.evening")}
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                  {eveningSlots.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "contained" : "outlined"}
                      size="small"
                      onClick={() => handleTimeSelect(time)}
                      disabled={isTimeSlotDisabled(time)}
                    >
                      {time}
                    </Button>
                  ))}
                </Box>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
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
