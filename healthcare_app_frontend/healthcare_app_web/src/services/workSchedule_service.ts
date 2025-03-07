import axiosConfig from "./axiosConfig.ts";

const prefix = "/authenticate/api/v1/work_schedule";

export const addWorkSchedule = async (data: object) => {
    return await axiosConfig.post(`${prefix}`, data);
}