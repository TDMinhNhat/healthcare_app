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
import SelectService from "./SelectService";
import DoctorList from "./DoctorList";
import SelectDateTime from "./SelectDateTime";
import DoctorDetails from "./DoctorDetails";
import ConfirmAppointment from "./ConfirmAppointment";
import PaymentCheckout from "./PaymentCheckout";
import { createAppointment } from "../../services/appointment/booking_service";

interface BookAppointmentProps {
  onClose: () => void;
  patientId?: string; // Current patient ID
}

const BookAppointment: React.FC<BookAppointmentProps> = ({
  onClose,
  patientId,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<string>("");
  const [workSchedule, setWorkSchedule] = useState<any>(null);
  const [paymentCompleted, setPaymentCompleted] = useState<boolean>(false);

  const steps = [
    "Chọn dịch vụ",
    "Chọn bác sĩ",
    "Chọn ngày giờ",
    "Xem lại thông tin",
    "Thanh toán",
    "Xác nhận",
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

  const handleDateTimeSelect = (
    date: Date,
    time: string,
    workSchedule: object
  ) => {
    setSelectedDate(date);
    setSelectedTime(time);
    setWorkSchedule(workSchedule);
    handleNext();
  };

  const handlePaymentComplete = async () => {
    try {
      setLoading(true);
      setError(null);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      setPaymentCompleted(true);

      await createAppointment(patientId, note, workSchedule.id);

      handleNext();
    } catch (err) {
      console.error("Failed to process payment:", err);
      setError("Thanh toán thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!selectedDate || !selectedTime || !selectedDoctor || !patientId) {
      setError("Thông tin đặt lịch còn thiếu. Vui lòng kiểm tra lại.");
      return;
    }

    handleNext();
  };

  const handleReset = () => {
    setActiveStep(0);
    setSelectedService(null);
    setSelectedDoctor(null);
    setSelectedDate(null);
    setSelectedTime("");
    setWorkSchedule(null);
    setNote("");
    onClose();
  };

  const handleNoteChange = (value: string) => {
    setNote(value);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h6" gutterBottom>
        Đặt lịch khám bệnh
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
              Chi tiết lịch hẹn
            </Typography>
            <Typography variant="body1">
              Ngày: {selectedDate ? selectedDate.toLocaleDateString() : ""}
            </Typography>
            <Typography variant="body1">
              Thời gian:{" "}
              {selectedTime
                ? `${selectedTime.start} - ${selectedTime.end}`
                : ""}
            </Typography>
            <Typography variant="body1">
              Dịch vụ: {selectedService.name}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
            <Button onClick={handleBack} disabled={loading}>
              Quay lại
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleConfirm}
              disabled={loading}
            >
              {loading ? "Đang xử lý..." : "Tiến hành thanh toán"}
            </Button>
          </Box>
        </Box>
      )}

      {activeStep === 4 && (
        <PaymentCheckout
          onPaymentComplete={handlePaymentComplete}
          onBack={handleBack}
          loading={loading}
        />
      )}

      {activeStep === 5 && (
        <ConfirmAppointment
          date={selectedDate!}
          time={selectedTime}
          doctor={selectedDoctor}
          specialty={selectedService}
          onDone={handleReset}
        />
      )}

      {activeStep !== 0 && activeStep !== 5 && activeStep !== steps.length && (
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button onClick={onClose} sx={{ mr: 1 }} disabled={loading}>
            Hủy
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
