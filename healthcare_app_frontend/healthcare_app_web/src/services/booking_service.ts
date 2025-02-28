import axiosConfig from "./axiosConfig";

const prefix = "/appointment/api/v1/booking";

export const getDoctorsFreeStartTime = async (start: string) => {
  const response = await axiosConfig.get(`${prefix}/doctor`, {
    params: {
      start: start,
    },
  });
  return response;
};

export const createAppointment = async (
  doctorId: string,
  patientId: string,
  note: string,
  start: string
) => {
  const response = await axiosConfig.post(`${prefix}`, {
    doctorId,
    patientId,
    note,
    start,
  });
  return response;
};
