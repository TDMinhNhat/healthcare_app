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

// delete patient là thay đổi status của patient thành false
export const deletePatient = async (patientId: string) => {
  const response = await axiosConfig.delete(`${prefix}`, {
    params: {
      patientId: patientId,
    },
  });
  return response.data;
};

export const importPatients = async (patients: any) => {
  const response = await axiosConfig.post(`${prefix}/import`, patients);
  return response.data;
};
