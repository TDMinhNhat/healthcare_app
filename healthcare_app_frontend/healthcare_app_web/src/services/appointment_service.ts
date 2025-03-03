import { axiosInstance } from "./api";

// Function to get appointments by patient ID and status
export const getAppoinmentStatusWithPatientId = (
  patientId: string,
  status: string
) => {
  return axiosInstance.get(
    `/appointments/patient/${patientId}/status/${status}`
  );
};

// Function to get appointments by doctor ID and status
export const getAppointmentStatusWithDoctorId = (
  doctorId: string,
  status: string
) => {
  return axiosInstance.get(`/appointments/doctor/${doctorId}/status/${status}`);
};

// Other appointment-related API functions would go here
