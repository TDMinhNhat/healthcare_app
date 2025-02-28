import { Appointment } from "./appointment";
import { Doctor } from "./doctor";

export interface Drug {
  id: number;
  drugName: string;
  unit: string;
}

export interface MedicalRecordDrug {
  medicalRecord: MedicalRecord;
  drug: Drug;
  quantity: number;
}

export interface MedicalRecord {
  id: number;
  appointment: Appointment;
  diagnosisDisease: string;
  note: string;
  createdAt: string;
  reExaminationDate: string;
  roomId: string;
  drugs?: MedicalRecordDrug[]; // Based on relationship with MedicalRecordDrug
}
