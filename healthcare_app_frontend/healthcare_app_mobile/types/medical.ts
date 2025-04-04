/**
 * TypeScript definitions for Medical Records
 */

// Define drug type
export interface Drug {
  id: number;
  drugName: string;
  unit: string;
}

// Define medical record drug type
export interface MedicalRecordDrug {
  drug: Drug;
  howUse: string;
  quantity: number;
}

// For API response where drugs sometimes have nested id object
export interface ApiDrug {
  id?: {
    drug?: {
      id?: number;
      drugName?: string;
      unit?: string;
    };
  };
  drug?: {
    id?: number;
    drugName?: string;
    unit?: string;
  };
  howUse: string;
  quantity: number;
}

// Define the main medical record type
export interface MedicalRecord {
  id: number;
  appointmentId: number | string;
  doctorName: string;
  diagnosisDisease: string;
  note: string;
  dateAppointment: string;
  reExaminationDate: string;
  drugs: MedicalRecordDrug[] | ApiDrug[];
  status: string;
}

// Patient medical history record
export interface MedicalHistoryRecord {
  id: number;
  doctorName: string;
  diagnosisDisease: string;
  dateAppointment: string;
  status: string;
  appointmentId: number;
  drugs: ApiDrug[];
  note: string;
  reExaminationDate: string;
}
