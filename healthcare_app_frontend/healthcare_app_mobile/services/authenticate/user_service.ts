import axiosConfig from "../axiosConfig";
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

export const updateInfo = async (userId: string, data: any) => {
  const response = await axiosConfig.put(`${prefix}/patient/${userId}`, data);
  return response;
};

export const addBankAccount = async (
  patientId: string,
  bankName: string,
  accountNumber: string
) => {
  const response = await axiosConfig.post(`${prefix}/patient/account_bank`, {
    patientId,
    bankName,
    accountNumber,
  });
  return response;
};

export const updateBankAccount = async (
  patientId: string,
  bankName: string,
  accountNumber: string
) => {
  const response = await axiosConfig.put(`${prefix}/patient/account_bank`, {
    patientId,
    bankName,
    accountNumber,
  });
  return response;
};

// Dùng để check, lấy thông tin tài khoản ngân hàng của bệnh nhân
// Nếu trả về code 200 của data thì có tài khoản ngân hàng
export const getPatientBankAccount = async (patientId: string) => {
  const response = await axiosConfig.get(`${prefix}/patient/account_bank`, {
    params: {
      patientId: patientId,
    },
  });
  return response;
};
