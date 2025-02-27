import React, { useState } from "react";
import { Box, Typography, Grid, Paper, Button } from "@mui/material";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";

interface SelectDateTimeProps {
  onSelect: (date: Date, time: string) => void;
}

const SelectDateTime: React.FC<SelectDateTimeProps> = ({ onSelect }) => {
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>("");

  // Mock time slots
  const morningSlots = ["08:00", "09:00", "10:00", "11:00"];
  const afternoonSlots = ["13:00", "14:00", "15:00", "16:00"];
  const eveningSlots = ["17:00", "18:00", "19:00"];

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
                shouldDisableDate={isWeekend}
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
