import axiosConfig from "./axiosConfig";

const prefix = "/appointments/api/v1/appointments";

export const getAppointmentPatient = async (userId: string) => {
  const response = await axiosConfig.get(`${prefix}/patient/`, {
    params: {
      userId: userId,
    },
  });
  return response;
};

export const getAppointmentDoctor = async (userId: string) => {
  const response = await axiosConfig.get(`${prefix}/doctor/`, {
    params: {
      userId: userId,
    },
  });
  return response;
};
