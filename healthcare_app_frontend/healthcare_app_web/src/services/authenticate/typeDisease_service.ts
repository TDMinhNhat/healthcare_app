import axiosConfig from "../axiosConfig.ts";

const prefix: string = "/authenticate/api/v1/type_disease";

export const getAllTypeDiseases = async () => {
  return await axiosConfig.get(`${prefix}`);
};

export const getAllDoctorByTypeDiseaseName = async (typeName: string) => {
  return await axiosConfig.get(`${prefix}/doctor`, {
    params: {
      typeName: typeName,
    },
  });
};
