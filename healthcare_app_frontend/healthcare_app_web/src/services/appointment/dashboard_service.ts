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

export const getListDoctorByQuarter = async (quarter: string) => {
  const response = await axiosConfig.get(`${prefix}/admin/doctor/quarter`, {
    params: {
      quarter: quarter,
    },
  });
  return response.data;
};

export const getListDoctorByMonth = async (month: string) => {
  const response = await axiosConfig.get(`${prefix}/admin/doctor/month`, {
    params: {
      month: month,
    },
  });
  return response.data;
};

export const getListDoctorByYear = async (year: string) => {
  const response = await axiosConfig.get(`${prefix}/admin/doctor/year`, {
    params: {
      year: year,
    },
  });
  return response.data;
};
