import { Address } from "./address";
import { User } from "./user";
import { Diploma } from "./enums";
import { Disease } from "./typeDisease";

export interface DoctorExperience {
  id: number;
  compName: string;
  specialization: string;
  startDate: string;
  endDate?: string;
  compAddress: Address;
  description: string;
}

export interface DoctorCertificate {
  id: number;
  doctorId: number; // Reference to Doctor
  certName: string;
  issueDate: string;
  address?: Address; // Optional based on the relationship
}

export interface DoctorEducation {
  id: number;
  doctorId: number; // Reference to Doctor
  schoolName: string;
  joinedDate: string;
  graduateDate: string;
  diploma: Diploma;
}

export interface Doctor extends User {
  specialization: string;
  experience: DoctorExperience;
  educations?: DoctorEducation[];
  certificates?: DoctorCertificate[];
  diseases?: Disease[]; // Array of diseases the doctor can treat
}
