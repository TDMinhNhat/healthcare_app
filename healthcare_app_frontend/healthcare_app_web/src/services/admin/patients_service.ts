import axiosConfig from "../axiosConfig";

const prefix = "/authenticate/api/v1/user/patient";

export const updatePatient = async (id: string, data: any) => {
  const response = await axiosConfig.put(`${prefix}/${id}`, data);
  return response.data;
};
