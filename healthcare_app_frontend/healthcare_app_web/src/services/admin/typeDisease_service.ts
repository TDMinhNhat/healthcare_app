import axiosConfig from "../axiosConfig";

const prefix = "/admin/api/v1/type_disease";

export const getAllTypeDiseases = async () => {
  const response = await axiosConfig.get(`${prefix}`);
  return response.data;
};

export const addTypeDisease = async (name: string) => {
  const response = await axiosConfig.post(`${prefix}`, null, {
    params: { name: name },
  });
  return response.data;
};

// export const updateTypeDisease = async (id: string, name: string) => {
//   const response = await axiosConfig.put(`${prefix}/${id}`, null, {
//     params: { name: name },
//   });
//   return response.data;
// };

export const deleteTypeDisease = async (id: string) => {
  const response = await axiosConfig.delete(`${prefix}/${id}`);
  return response.data;
};

export const importTypeDisease = async (diseases: any) => {
  const response = await axiosConfig.post(`${prefix}/import`, diseases);
  return response.data;
};
