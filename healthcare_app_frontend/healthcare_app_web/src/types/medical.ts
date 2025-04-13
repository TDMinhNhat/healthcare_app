import { Appointment } from "./appointment";

export interface Drug {
  id: number;
  drugName: string;
  drugType?: string;
  unit: string;
}

export interface MedicalRecordDrug {
  drugId: number;
  howUse: string;
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
