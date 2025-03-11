import axiosConfig from "../axiosConfig";

const prefix = "/appointment/api/v1/appointments";

export const getAppointmentPatient = async (userId: string) => {
  const response = await axiosConfig.get(`${prefix}/patient`, {
    params: {
      userId: userId,
    },
  });
  return response;
};

export const getAppointmentStatusWithDoctorId = async (
  doctorId: string,
  status: string
) => {
  return await axiosConfig.get(`${prefix}/doctor/status`, {
    params: {
      doctorId: doctorId,
      status: status,
    },
  });
};

export const getAppointmentDoctor = async (doctorId: string) => {
  return await axiosConfig.get(`${prefix}/doctor`, {
    params: {
      doctorId: doctorId,
    },
  });
};

export const getAppoinmentStatusWithPatientId = async (
  patientId: string,
  status: string
) => {
  const response = await axiosConfig.get(`${prefix}/status_with_patient`, {
    params: {
      status: status,
      patientId: patientId,
    },
  });
  return response;
};
