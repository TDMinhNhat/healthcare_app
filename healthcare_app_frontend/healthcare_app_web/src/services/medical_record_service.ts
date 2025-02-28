import { MedicalRecord } from "../types";
import axiosConfig from "./axiosConfig";
const prefix = "appointment/api/v1/medical_record";
export const createMedicalRecord = async (medicalRecord: MedicalRecord) => {
  const response = await axiosConfig.post(`${prefix}`, medicalRecord);
  return response.data;
};
