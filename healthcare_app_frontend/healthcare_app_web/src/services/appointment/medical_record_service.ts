import { MedicalRecord } from "../../types";
import axiosConfig from "../axiosConfig";

const prefix = "appointment/api/v1/medical_record";

export const createMedicalRecord = async (medicalRecord: object) => {
  const response = await axiosConfig.post(`${prefix}`, medicalRecord);
  return response.data;
};

export const getMedicalRecord = async (bookAppointmentId: number) => {
  const response = await axiosConfig.get(
    `${prefix}/book_appointment/${bookAppointmentId}`
  );
  return response.data;
};
