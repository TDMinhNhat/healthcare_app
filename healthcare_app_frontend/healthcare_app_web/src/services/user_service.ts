import axiosConfig from "./axiosConfig";
const prefix = "/authenticate/api/v1/user";
export const getPatientInfo = async (userId: string) => {
  const response = await axiosConfig.get(`${prefix}/patient`, {
    params: {
      userId: userId,
    },
  });
  return response;
};

export const getDoctorInfo = async (userId: string) => {
  const response = await axiosConfig.get(`${prefix}/doctor`, {
    params: {
      userId: userId,
    },
  });
  return response;
};
