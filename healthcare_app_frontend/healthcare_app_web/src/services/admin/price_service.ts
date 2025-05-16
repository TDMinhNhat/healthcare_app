import axiosConfig from "../axiosConfig";

const prefix = "/admin/api/v1/price";

export const getAll = async () => {
  const response = await axiosConfig.get(`${prefix}`);
  return response.data;
};

export const addPrice = async (data: { priceType: string; price: number }) => {
  const response = await axiosConfig.post(`${prefix}`, { ...data });
  return response.data;
};

export const updatePrice = async (
  id: string,
  data: { priceType: string; price: number }
) => {
  const response = await axiosConfig.put(`${prefix}/${id}`, { ...data });
  return response.data;
};

export const deletePrice = async (id: string) => {
  const response = await axiosConfig.delete(`${prefix}/${id}`);
  return response.data;
};
