import axiosConfig from "../axiosConfig";

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
  workSchedule: number,
  paymentContent: string
) => {
  const response = await axiosConfig.post(`${prefix}`, {
    patientId: patientId,
    workSchedule: workSchedule,
    paymentContent: paymentContent,
    note: note,
  });
  return response;
};

export const getAppointmentBetweenDate = async (
  userId: string,
  start: string,
  end: string
) => {
  const response = await axiosConfig.get(`${prefix}/week/patient/${userId}`, {
    params: {
      start: start,
      end: end,
    },
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
      start: start,
      end: end,
    },
  });
};

export const getAppointmentPatientDetail = async (
  patientId: string,
  workSchedule: number
) => {
  return await axiosConfig.get(`${prefix}/detail/patient`, {
    params: {
      patientId: patientId,
      workSchedule: workSchedule,
    },
  });
};

// hay còn gọi là chi tiết ca khám đúng hơn
export const getDetailDoctorAppointment = async (
  doctorId: string,
  workSchedule: number
) => {
  return await axiosConfig.get(`${prefix}/detail/doctor`, {
    params: {
      doctorId: doctorId,
      workSchedule: workSchedule,
    },
  });
};

export const cancelAppointment = (bookAppointmentId: string) => {
  return axiosConfig.delete(`${prefix}/cancel`, {
    params: {
      bookAppointmentId: bookAppointmentId,
    },
  });
};

export const getPatientDoneInWorkSchedule = async (workScheduleId: string) => {
  return await axiosConfig.get(`${prefix}/status_done/work_schedule`, {
    params: {
      workScheduleId: workScheduleId,
    },
  });
};
