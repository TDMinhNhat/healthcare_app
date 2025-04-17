import axiosConfig from "../axiosConfig";

const prefix = "/admin/api/v1/patients";

export const importPatient = async (patients: any) => {
  const response = await axiosConfig.post(`${prefix}/import`, patients);
  return response.data;
};

export const getPatients = async () => {
  const response = await axiosConfig.get(`${prefix}`);
  return response.data;
};
