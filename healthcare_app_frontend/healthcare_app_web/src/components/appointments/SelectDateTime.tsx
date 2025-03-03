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

// Mock data for doctor availability
const generateMockAvailability = () => {
  const availability: { [key: string]: string[] } = {};
  const today = new Date();

  // Generate random availability for the next 30 days
  for (let i = 0; i < 30; i++) {
    const date = addDays(today, i);
    const day = date.getDay();

    // Skip weekends
    if (day === 0 || day === 6) continue;

    const dateStr = format(date, "yyyy-MM-dd");
    const timeSlots: string[] = [];

    // Morning slots (with some randomness)
    if (Math.random() > 0.3) {
      timeSlots.push(
        ...["08:00", "08:30", "09:00", "09:30", "10:00"].filter(
          () => Math.random() > 0.3
        )
      );
    }

    // Afternoon slots (with some randomness)
    if (Math.random() > 0.3) {
      timeSlots.push(
        ...["13:00", "13:30", "14:00", "14:30", "15:00"].filter(
          () => Math.random() > 0.3
        )
      );
    }

    // Evening slots (with some randomness)
    if (Math.random() > 0.4) {
      timeSlots.push(
        ...["17:00", "17:30", "18:00", "18:30"].filter(
          () => Math.random() > 0.4
        )
      );
    }

    availability[dateStr] = timeSlots;
  }

  return availability;
};

const mockAvailabilityByDoctor: { [key: string]: { [key: string]: string[] } } =
  {
    d101: generateMockAvailability(),
    d102: generateMockAvailability(),
    d201: generateMockAvailability(),
    d301: generateMockAvailability(),
    d302: generateMockAvailability(),
    d401: generateMockAvailability(),
    d501: generateMockAvailability(),
    d502: generateMockAvailability(),
    d601: generateMockAvailability(),
  };

const SelectDateTime: React.FC<SelectDateTimeProps> = ({
  doctor,
  onSelect,
  onBack,
}) => {
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [availableTimes, setAvailableTimes] = useState<{
    [key: string]: string[];
  }>({
    morning: [],
    afternoon: [],
    evening: [],
  });
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

      // Format date for mock data lookup
      const formattedDate = format(date, "yyyy-MM-dd");

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Use mock data instead of API call
      // const response = await getDoctorAvailability(doctor.userId);
      // const availableSlots = response.data.data || {};

      const availableSlots = mockAvailabilityByDoctor[doctor.userId] || {};

      // Organize times into morning, afternoon, evening
      const times: { [key: string]: string[] } = {
        morning: [],
        afternoon: [],
        evening: [],
      };

      // Filter available times for the selected date
      const dateTimes = availableSlots[formattedDate] || [];

      dateTimes.forEach((time: string) => {
        const hour = parseInt(time.split(":")[0], 10);
        if (hour < 12) {
          times.morning.push(time);
        } else if (hour < 17) {
          times.afternoon.push(time);
        } else {
          times.evening.push(time);
        }
      });

      setAvailableTimes(times);
    } catch (err) {
      console.error("Failed to fetch doctor availability:", err);
      setError("Failed to load available times. Please try again.");

      // Fallback to default time slots for demo purposes
      setAvailableTimes({
        morning: [
          "08:00",
          "08:30",
          "09:00",
          "09:30",
          "10:00",
          "10:30",
          "11:00",
          "11:30",
        ],
        afternoon: [
          "13:00",
          "13:30",
          "14:00",
          "14:30",
          "15:00",
          "15:30",
          "16:00",
          "16:30",
        ],
        evening: ["17:00", "17:30", "18:00", "18:30", "19:00", "19:30"],
      });
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
                    {availableTimes.morning.length > 0 && (
                      <>
                        <Typography variant="subtitle2" sx={{ mt: 2 }}>
                          {t("patient.appointments.morning")}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 1,
                            mb: 2,
                          }}
                        >
                          {availableTimes.morning.map((time) => (
                            <Button
                              key={time}
                              variant={
                                selectedTime === time ? "contained" : "outlined"
                              }
                              size="small"
                              onClick={() => handleTimeSelect(time)}
                              disabled={isTimeSlotDisabled(time)}
                            >
                              {time}
                            </Button>
                          ))}
                        </Box>
                      </>
                    )}

                    {availableTimes.afternoon.length > 0 && (
                      <>
                        <Typography variant="subtitle2" sx={{ mt: 2 }}>
                          {t("patient.appointments.afternoon")}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 1,
                            mb: 2,
                          }}
                        >
                          {availableTimes.afternoon.map((time) => (
                            <Button
                              key={time}
                              variant={
                                selectedTime === time ? "contained" : "outlined"
                              }
                              size="small"
                              onClick={() => handleTimeSelect(time)}
                              disabled={isTimeSlotDisabled(time)}
                            >
                              {time}
                            </Button>
                          ))}
                        </Box>
                      </>
                    )}

                    {availableTimes.evening.length > 0 && (
                      <>
                        <Typography variant="subtitle2" sx={{ mt: 2 }}>
                          {t("patient.appointments.evening")}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 1,
                            mb: 2,
                          }}
                        >
                          {availableTimes.evening.map((time) => (
                            <Button
                              key={time}
                              variant={
                                selectedTime === time ? "contained" : "outlined"
                              }
                              size="small"
                              onClick={() => handleTimeSelect(time)}
                              disabled={isTimeSlotDisabled(time)}
                            >
                              {time}
                            </Button>
                          ))}
                        </Box>
                      </>
                    )}

                    {availableTimes.morning.length === 0 &&
                      availableTimes.afternoon.length === 0 &&
                      availableTimes.evening.length === 0 && (
                        <Typography
                          color="text.secondary"
                          sx={{ py: 3, textAlign: "center" }}
                        >
                          {t("patient.appointments.no_available_slots")}
                        </Typography>
                      )}
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
