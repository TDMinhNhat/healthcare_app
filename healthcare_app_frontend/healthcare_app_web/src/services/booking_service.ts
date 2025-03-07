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
  patientId: string,
  note: string,
  workSchedule: number
) => {
  const response = await axiosConfig.post(`${prefix}`, {
    "patientId": patientId,
    "workSchedule": workSchedule,
    "note": note
  });
  return response;
};
