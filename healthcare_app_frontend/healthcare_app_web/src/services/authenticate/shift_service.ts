import axiosConfig from "../axiosConfig.ts";

const prefix = "/authenticate/api/v1/shift";

export const getAllShift = async () => {
  return await axiosConfig.get(`${prefix}`);
};

export const getShiftByStatusTrue = async () => {
  return await axiosConfig.get(`${prefix}/status`, {
    params: { status: true },
  });
};
