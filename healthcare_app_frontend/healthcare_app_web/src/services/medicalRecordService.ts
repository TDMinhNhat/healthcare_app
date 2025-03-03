import { MedicalRecord } from "../types/medical";

// Mock medical record for testing purposes
const MOCK_MEDICAL_RECORD: MedicalRecord = {
  id: 101,
  appointment: {
    id: 101,
    patient: "patient-001",
    doctor: "doctor-001",
    note: "Bệnh nhân bị đau đầu trong một tuần qua, cần kiểm tra huyết áp.",
    roomId: "room-001",
    start: "20-07-2023-09-00-00",
    end: "20-07-2023-09-30-00",
    createdAt: "15-07-2023",
    status: "DONE",
  },
  diagnosisDisease: "Cao huyết áp",
  note: "Bệnh nhân cần uống thuốc đều đặn và kiểm soát chế độ ăn ít muối",
  createdAt: "20-07-2023",
  reExaminationDate: "20-08-2023",
  roomId: "room-001",
  drugs: [
    {
      medicalRecord: null as any, // Circular reference will be set after creation
      drug: { id: 1, drugName: "Amlodipine", unit: "tablet" },
      howUse: "Uống 1 viên sau bữa sáng",
      quantity: 30,
    },
    {
      medicalRecord: null as any, // Circular reference will be set after creation
      drug: { id: 2, drugName: "Losartan", unit: "tablet" },
      howUse: "Uống 1 viên sau bữa tối",
      quantity: 30,
    },
  ],
};

// Set circular references
if (MOCK_MEDICAL_RECORD.drugs) {
  MOCK_MEDICAL_RECORD.drugs.forEach((drug) => {
    drug.medicalRecord = MOCK_MEDICAL_RECORD;
  });
}

/**
 * Fetch a medical record by appointment ID
 * @param appointmentId The appointment ID
 * @returns The medical record or null if not found
 */
export const getMedicalRecordById = async (
  appointmentId: number
): Promise<MedicalRecord | null> => {
  // In a real application, this would make an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      if (appointmentId === MOCK_MEDICAL_RECORD.appointment.id) {
        resolve(MOCK_MEDICAL_RECORD);
      } else {
        resolve(null);
      }
    }, 500);
  });
};

/**
 * Save or update a medical record
 * @param medicalRecord The medical record to save
 * @returns The saved medical record
 */
export const saveMedicalRecord = async (
  medicalRecord: MedicalRecord
): Promise<MedicalRecord> => {
  // In a real application, this would make an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(medicalRecord);
    }, 800);
  });
};
