import { Patient } from "./patient";
import { Doctor } from "./doctor";
import { MedicalRecord } from "./medical";

export interface Appointment {
  id: number;
  patient: Patient;
  doctor: Doctor;
  note: string;
  start: string; // Using Date for LocalDateTime
  end: string;
  medicalRecord?: MedicalRecord; // Based on the have relationship with MedicalRecord
}
