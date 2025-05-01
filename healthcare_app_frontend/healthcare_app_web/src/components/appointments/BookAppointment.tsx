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

  const handlePaymentComplete = async (paymentContent: string) => {
    try {
      setLoading(true);
      setError(null);
      setPaymentCompleted(true);

      await createAppointment(patientId, note, workSchedule.id, paymentContent);

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
    // redirect to appointment list page or show success message
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
          // onBack={handleBack}
        />
      )}

      {activeStep === 2 && (
        <SelectDateTime
          doctor={selectedDoctor}
          onSelect={handleDateTimeSelect}
          patientId={patientId}
          // onBack={handleBack}
        />
      )}

      {/* {activeStep === 3 && (
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
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handlePaymentComplete}
              disabled={loading}
            >
              {loading ? "Đang xử lý..." : "Tiến hành thanh toán"}
            </Button>
          </Box>
        </Box>
      )} */}

      {activeStep === 3 && (
        <PaymentCheckout
          onPaymentComplete={handlePaymentComplete}
          // onBack={handleBack}
          // onReset={handleReset}
          workSchedule={workSchedule}
          service={selectedService}
          loading={loading}
        />
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

      {activeStep === 0 && (
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button onClick={onClose} sx={{ mr: 1 }} disabled={loading}>
            Hủy
          </Button>
        </Box>
      )}

      {activeStep !== 0 && activeStep !== 4 && activeStep !== steps.length && (
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button onClick={handleBack} disabled={activeStep === 0 || loading}>
            Quay lại
          </Button>
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
