import axiosConfig from "../axiosConfig";

const prefix = "appointment/api/v1/dashboard";

export const getPatientDashboard = async (patientId: string) => {
  const response = await axiosConfig.get(`${prefix}/patient`, {
    params: {
      patientId: patientId,
    },
  });
  return response.data;
};

export const getDoctorDashboard = async (doctorId: string) => {
  const response = await axiosConfig.get(`${prefix}/doctor`, {
    params: {
      doctorId: doctorId,
    },
  });
  return response.data;
};

export const getDashboard = async () => {
  const response = await axiosConfig.get(`${prefix}/admin`);
  return response.data;
};
