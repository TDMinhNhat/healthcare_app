import axiosConfig from "./axiosConfig.ts";

const prefix = "/authenticate/api/v1/work_schedule";

export const addWorkSchedule = async (data: object) => {
    return await axiosConfig.post(`${prefix}`, data);
}

export const getWorkSchedule = async (doctorId: string) => {
    return await axiosConfig.get(`${prefix}/doctor`, {
        params: {
            doctorId: doctorId
        }
    });
}

export const getWorkScheduleTimeSlot = async (doctorId: string, date: string) => {
    return await axiosConfig.get(`${prefix}/doctor/time_slot`, {
        params: {
            doctorId: doctorId,
            date: date
        }
    })
}