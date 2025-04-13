import axiosConfig from "../axiosConfig";

const prefix = "/admin/api/v1/shift";

export const getShifts = async () => {
  const response = await axiosConfig.get(`${prefix}`);
  return response.data;
};

export const addShift = async (data: any) => {
  const response = await axiosConfig.post(`${prefix}`, data);
  return response.data;
};

export const deleteShift = async (id: string) => {
  const response = await axiosConfig.delete(`${prefix}/${id}`);
  return response.data;
};
