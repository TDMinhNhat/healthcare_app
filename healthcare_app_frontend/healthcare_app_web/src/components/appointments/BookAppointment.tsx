import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  Snackbar,
  Alert,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import SelectService from "./SelectService";
import DoctorList from "./DoctorList";
import SelectDateTime from "./SelectDateTime";
import DoctorDetails from "./DoctorDetails";
import ConfirmAppointment from "./ConfirmAppointment";
import { createAppointment } from "../../services/appointment/booking_service";

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
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<string>("");

  const steps = [
    t("patient.appointments.steps.select_service"),
    t("patient.appointments.steps.select_doctor"),
    t("patient.appointments.steps.select_date_time"),
    t("patient.appointments.steps.review"),
    t("patient.appointments.steps.confirm"),
  ];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleServiceSelect = (service: any) => {
    setSelectedService(service);
    handleNext();
  };

  const handleDoctorSelect = (doctor: any) => {
    setSelectedDoctor(doctor);
    handleNext();
  };

  const handleDateTimeSelect = (date: Date, time: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
    handleNext();
  };

  const handleConfirm = async () => {
    if (!selectedDate || !selectedTime || !selectedDoctor || !patientId) {
      setError("Missing required information for booking");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await createAppointment(patientId, note, selectedTime.workSchedule);

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
    setSelectedService(null);
    setSelectedDoctor(null);
    setSelectedDate(null);
    setSelectedTime("");
    setNote("");
    onClose();
  };

  const handleNoteChange = (value: string) => {
    setNote(value);
  };
  console.log(patientId, note, selectedTime);
  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h6" gutterBottom>
        {t("patient.appointments.book_new")}
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {activeStep === 0 && <SelectService onSelect={handleServiceSelect} />}

      {activeStep === 1 && (
        <DoctorList
          specialty={selectedService}
          onSelect={handleDoctorSelect}
          onBack={handleBack}
        />
      )}

      {activeStep === 2 && (
        <SelectDateTime
          doctor={selectedDoctor}
          onSelect={handleDateTimeSelect}
          onBack={handleBack}
        />
      )}

      {activeStep === 3 && (
        <Box>
          <DoctorDetails doctor={selectedDoctor} />
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              {t("patient.appointments.appointment_details")}
            </Typography>
            <Typography variant="body1">
              {t("patient.appointments.date")}:{" "}
              {selectedDate ? selectedDate.toLocaleDateString() : ""}
            </Typography>
            <Typography variant="body1">
              {t("patient.appointments.time")}: {selectedTime.time}
            </Typography>
            <Typography variant="body1">
              {t("patient.appointments.service")}: {selectedService.name}
            </Typography>
          </Box>
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

      {activeStep === 4 && (
        <ConfirmAppointment
          date={selectedDate!}
          time={selectedTime}
          doctor={selectedDoctor}
          specialty={selectedService}
          onDone={handleReset}
        />
      )}

      {activeStep !== 0 && activeStep !== 4 && activeStep !== steps.length && (
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
