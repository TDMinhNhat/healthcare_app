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
  const response = await axiosConfig.put(
    `${prefix}/certification/update/${doctorId}/${certId}`,
    certificate
  );
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
  const response = await axiosConfig.put(
    `${prefix}/experience/update/${doctorId}/${experienceId}`,
    experience
  );
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
  const response = await axiosConfig.put(
    `${prefix}/education/update/${doctorId}/${educationId}`,
    education
  );
  return response.data;
};
