import axiosConfig from "../axiosConfig";
import mime from "mime";

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

export const updatePatientAvatar = async (
  patientId: string,
  image: { uri: string; type?: string }
) => {
  const formData = new FormData();

  // Chuyển đổi chuỗi base64 thành file Blob
  const fetchResponse = await fetch(image.uri);
  const blob = await fetchResponse.blob();

  // Tạo tên file từ timestamp để đảm bảo là duy nhất
  const fileName = `avatar_${Date.now()}.jpg`;

  // Thêm file vào FormData - đây là phần quan trọng nhất
  // Đảm bảo name là 'file' trùng với yêu cầu của server
  formData.append("image", blob, fileName);
  formData.append("patientId", patientId);

  const response = await axiosConfig.put(`${prefix}/patient/avatar`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};

export const updateDoctorAvatar = async (
  doctorId: string,
  image: { uri: string; type?: string }
) => {
  const formData = new FormData();
  // Chuyển đổi chuỗi base64 thành file Blob
  const fetchResponse = await fetch(image.uri);
  const blob = await fetchResponse.blob();

  // Tạo tên file từ timestamp để đảm bảo là duy nhất
  const fileName = `avatar_${Date.now()}.jpg`;

  // Thêm file vào FormData - đây là phần quan trọng nhất
  // Đảm bảo name là 'file' trùng với yêu cầu của server
  formData.append("image", blob, fileName);
  formData.append("doctorId", doctorId);
  const response = await axiosConfig.put(`${prefix}/doctor/avatar`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};
