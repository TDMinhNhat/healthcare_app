import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  Grid,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import SelectDateTime from "./SelectDateTime";
import DoctorList from "./DoctorList";
import DoctorDetails from "./DoctorDetails";
import ConfirmAppointment from "./ConfirmAppointment";
import { createAppointment } from "../../services/booking_service";
import { formatDateTimeToString } from "../../utils/dateUtils";

interface BookAppointmentProps {
  onClose: () => void;
  patientId?: string; // Current patient ID
}

const BookAppointment: React.FC<BookAppointmentProps> = ({
  onClose,
  patientId,
}) => {
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<string>("");

  const steps = [
    t("patient.appointments.steps.select_date_time"),
    t("patient.appointments.steps.select_doctor"),
    t("patient.appointments.steps.review"),
    t("patient.appointments.steps.confirm"),
  ];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleDateTimeSelect = (date: Date, time: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
    handleNext();
  };

  const handleDoctorSelect = (doctor: any) => {
    setSelectedDoctor(doctor);
    handleNext();
  };

  const handleConfirm = async () => {
    console.log("doctorId:", selectedDoctor.userId);
    console.log("patientId:", patientId);
    if (!selectedDate || !selectedTime || !selectedDoctor || !patientId) {
      setError("Missing required information for booking");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Create a combined date object and format it using the utility function
      const [hours, minutes] = selectedTime.split(":").map(Number);
      const dateObj = new Date(selectedDate);
      dateObj.setHours(hours, minutes, 0, 0);

      const formattedDateTime = formatDateTimeToString(dateObj);
      console.log("doctorId:", selectedDoctor.id);
      console.log("patientId:", patientId);
      await createAppointment(
        selectedDoctor.userId,
        patientId,
        note,
        formattedDateTime
      );

      handleNext(); // Move to confirmation step
    } catch (err) {
      console.error("Failed to create appointment:", err);
      setError("Failed to book appointment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setActiveStep(0);
    setSelectedDate(null);
    setSelectedTime("");
    setSelectedDoctor(null);
    setNote("");
    onClose();
  };

  const handleNoteChange = (value: string) => {
    setNote(value);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h6" gutterBottom>
        {t("patient.appointments.book_new")}
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {activeStep === 0 && <SelectDateTime onSelect={handleDateTimeSelect} />}

      {activeStep === 1 && (
        <DoctorList
          selectedDate={selectedDate!}
          selectedTime={selectedTime}
          onSelect={handleDoctorSelect}
          onBack={handleBack}
        />
      )}

      {activeStep === 2 && (
        <Box>
          <DoctorDetails doctor={selectedDoctor} />
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
            <Button onClick={handleBack} disabled={loading}>
              {t("common.back")}
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleConfirm}
              disabled={loading}
            >
              {loading
                ? t("patient.appointments.confirming")
                : t("patient.appointments.confirm")}
            </Button>
          </Box>
        </Box>
      )}

      {activeStep === 3 && (
        <ConfirmAppointment
          date={selectedDate!}
          time={selectedTime}
          doctor={selectedDoctor}
          onDone={handleReset}
        />
      )}

      {activeStep !== 0 && activeStep !== 3 && activeStep !== steps.length && (
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button onClick={onClose} sx={{ mr: 1 }} disabled={loading}>
            {t("common.cancel")}
          </Button>
        </Box>
      )}

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert
          onClose={() => setError(null)}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BookAppointment;
