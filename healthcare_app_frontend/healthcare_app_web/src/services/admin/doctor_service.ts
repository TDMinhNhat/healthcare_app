import axiosConfig from "../axiosConfig";

const prefix = "/admin/api/v1/doctors";

export const getAllDoctors = async () => {
  const response = await axiosConfig.get(`${prefix}`);
  return response.data;
};

export const addDoctor = async (doctor: any) => {
  const response = await axiosConfig.post(`${prefix}`, doctor);
  return response.data;
};

export const importDoctor = async (doctors: any) => {
  const response = await axiosConfig.post(`${prefix}/import`, doctors);
  return response.data;
};
