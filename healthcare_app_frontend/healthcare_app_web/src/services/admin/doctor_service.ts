import { Diploma } from "../../types";
import axiosConfig from "../axiosConfig";

const prefix = "/admin/api/v1/doctors";

export const getAllDoctors = async () => {
  const response = await axiosConfig.get(`${prefix}`);
  return response.data;
};

export const addDoctor = async (doctor: any) => {
  const response = await axiosConfig.post(`${prefix}`, doctor);
  return response.data;
};

export const importDoctor = async (doctors: any) => {
  const response = await axiosConfig.post(`${prefix}/import`, doctors);
  return response.data;
};

// api dành cho việc thêm và update chứng chỉ của bác sĩ
// nếu certId khác 0 thì là update, không có thì là add
export const updateAddCertificate = async (
  doctorId: string, // userId của bác sĩ
  certificate: {
    certName: string;
    issueDate: string; // dd-mm-yyyy
  },
  certId?: string
) => {
  const { certName, issueDate } = certificate;

  console.log("Gọi API thêm/cập nhật chứng chỉ:", {
    doctorId,
    certId,
    requestBody: { certName, issueDate },
  });

  const response = await axiosConfig.put(
    `${prefix}/certification/update/${doctorId}/${certId}`,
    { certName, issueDate }
  );

  console.log("Kết quả API chứng chỉ:", response.data);
  return response.data;
};

// api dành cho việc thêm và update kinh nghiệm của bác sĩ
// nếu experienceId khác 0 thì là update, không có thì là add
export const updateAddExperience = async (
  doctorId: string, // userId của bác sĩ
  experience: {
    companyName: string;
    specialization: string;
    startDate: string; // dd-mm-yyyy
    endDate: string; // dd-mm-yyyy
    address: {
      number: string;
      street: string;
      ward: string;
      district: string;
      city: string;
      country: string;
    };
    description: string;
  },
  experienceId?: string
) => {
  const {
    companyName,
    specialization,
    startDate,
    endDate,
    address,
    description,
  } = experience;

  const { number, street, ward, district, city, country } = address;

  const requestBody = {
    companyName,
    specialization,
    startDate,
    endDate,
    address: { number, street, ward, district, city, country },
    description,
  };

  console.log("Gọi API thêm/cập nhật kinh nghiệm:", {
    doctorId,
    experienceId,
    requestBody,
  });

  const response = await axiosConfig.put(
    `${prefix}/experience/update/${doctorId}/${experienceId}`,
    requestBody
  );

  console.log("Kết quả API kinh nghiệm:", response.data);
  return response.data;
};

// api dành cho việc thêm và update thông tin học vấn của bác sĩ
// nếu educationId khác 0 thì là update, không có thì là add
export const updateAddEducation = async (
  doctorId: string, // userId của bác sĩ
  education: {
    schoolName: string;
    joinDate: string; // dd-mm-yyyy
    graduateDate: string; // dd-mm-yyyy
    diploma: keyof typeof Diploma; // "BACHELOR", "MASTER", "DOCTOR", "PROFESSOR"
  },
  educationId?: string
) => {
  const { schoolName, joinDate, graduateDate, diploma } = education;

  const requestBody = { schoolName, joinDate, graduateDate, diploma };

  console.log("Gọi API thêm/cập nhật học vấn:", {
    doctorId,
    educationId,
    requestBody,
  });

  const response = await axiosConfig.put(
    `${prefix}/education/update/${doctorId}/${educationId}`,
    requestBody
  );

  console.log("Kết quả API học vấn:", response.data);
  return response.data;
};

// delete thật ra là thay đổi trạng thái của bác sĩ
export const deleteDoctor = async (doctorId: string) => {
  const response = await axiosConfig.delete(`${prefix}`, {
    params: {
      doctorId: doctorId,
    },
  });
  return response.data;
};
