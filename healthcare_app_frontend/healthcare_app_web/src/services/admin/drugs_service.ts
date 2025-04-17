import axiosConfig from "../axiosConfig";

const prefix = "/admin/api/v1/drug";

export const getDrugs = async () => {
  const response = await axiosConfig.get(`${prefix}`);
  return response.data;
};

export const addDrug = async (drug: any) => {
  const response = await axiosConfig.post(`${prefix}`, drug);
  return response.data;
};

export const updateDrug = async (id: string, drug: any) => {
  const response = await axiosConfig.put(`${prefix}/${id}`, drug);
  return response.data;
};

export const importDrug = async (drugs: any) => {
  const response = await axiosConfig.post(`${prefix}/import`, drugs);
  return response.data;
};
