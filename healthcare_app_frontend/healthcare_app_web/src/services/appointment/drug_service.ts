import axiosConfig from "../axiosConfig";
const prefix = "/appointment/api/v1/drug";
export const getAllDrugss = async () => {
  const response = await axiosConfig.get(`${prefix}`);
  return response;
};

export const getDrugByAbsouluteName = async (name: string) => {
  const response = await axiosConfig.get(`${prefix}/absolute`, {
    params: {
      name: name,
    },
  });
  return response;
};

export const getAllDrugs = async () => {
  const response = await axiosConfig.get(`${prefix}`);
  return response;
};
