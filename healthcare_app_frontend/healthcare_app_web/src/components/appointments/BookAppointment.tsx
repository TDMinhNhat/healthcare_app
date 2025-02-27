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
} from "@mui/material";
import { useTranslation } from "react-i18next";
import SelectDateTime from "./SelectDateTime";
import DoctorList from "./DoctorList";
import DoctorDetails from "./DoctorDetails";
import ConfirmAppointment from "./ConfirmAppointment";

interface BookAppointmentProps {
  onClose: () => void;
}

const BookAppointment: React.FC<BookAppointmentProps> = ({ onClose }) => {
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);

  const steps = [
    t("patient.appointments.steps.select_time"),
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

  const handleConfirm = () => {
    // Here we would submit the appointment to the backend
    console.log("Appointment confirmed:", {
      selectedDate,
      selectedTime,
      selectedDoctor,
    });
    handleNext();
  };

  const handleReset = () => {
    setActiveStep(0);
    setSelectedDate(null);
    setSelectedTime("");
    setSelectedDoctor(null);
    onClose();
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
            <Button onClick={handleBack}>{t("common.back")}</Button>
            <Button variant="contained" color="primary" onClick={handleConfirm}>
              {t("patient.appointments.confirm")}
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
          <Button onClick={onClose} sx={{ mr: 1 }}>
            {t("common.cancel")}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default BookAppointment;
