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

export const getAppointmentPatientBookInWeek = async (
  patientId: string,
  start: string,
  end: string
) => {
  return await axiosConfig.get(`${prefix}/week/patient/${patientId}`, {
    params: {
      "start": start,
      "end": end
    }
  });
}

export const getAppointmentPatientDetail = async (patientId: string, workSchedule: number) => {
  return await axiosConfig.get(`${prefix}/detail/patient`, {
    params: {
      "patientId": patientId,
      "workSchedule": workSchedule
    }
  })
}