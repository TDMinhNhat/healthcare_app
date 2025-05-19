import axiosConfig from "../axiosConfig.ts";

const prefix = "/authenticate/api/v1/work_schedule";

export const addWorkSchedule = async (
  doctorId: string,
  shift: number,
  maxSlots: number,
  dateAppointment: string
) => {
  return await axiosConfig.post(`${prefix}`, {
    doctorId: doctorId,
    shift: shift,
    maxSlots: maxSlots,
    dateAppointment: dateAppointment,
  });
};

export const addMultipleWorkSchedule = async (
  schedules: Array<{
    doctorId: string;
    shift: number;
    maxSlots: number;
    dateAppointment: string;
  }>
) => {
  return await axiosConfig.post(`${prefix}/add_multi`, schedules);
};

export const getWorkSchedule = async (doctorId: string) => {
  return await axiosConfig.get(`${prefix}/doctor`, {
    params: {
      doctorId: doctorId,
    },
  });
};

export const getWorkScheduleBetweenDate = async (
  doctorId: string,
  startDate: string,
  endDate: string
) => {
  return await axiosConfig.get(`${prefix}/between/${doctorId}`, {
    params: {
      start: startDate,
      end: endDate,
    },
  });
};

export const getWorkScheduleByDoctorAndExactDate = async (doctorId: string, date: string) => {
  return await axiosConfig.get(`${prefix}/doctor/date`, {
    params: {
      doctorId: doctorId,
      date: date
    }
  });
}