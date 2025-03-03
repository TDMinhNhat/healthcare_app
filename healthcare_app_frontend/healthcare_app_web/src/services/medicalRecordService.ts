import { MedicalRecord } from "../types/medical";

// Mock medical record data
const MOCK_MEDICAL_RECORDS: MedicalRecord[] = [
  {
    id: 1,
    appointment: {
      id: 101,
      patient: "patient-001",
      doctor: "Dr. Nguyễn Bá Thành",
      roomId: "room-101",
    },
    roomId: "room-101",
    diagnosisDisease: "Tăng huyết áp độ 1",
    note: "Bệnh nhân cần theo dõi huyết áp hàng ngày, giảm lượng muối trong khẩu phần ăn và tập thể dục đều đặn.",
    reExaminationDate: "2023-08-20",
    createdAt: "20-07-2023-09-30-00",
    drugs: [
      {
        drug: {
          id: 1,
          drugName: "Amlodipine",
          unit: "tablet",
        },
        medicalRecord: null,
        howUse: "Uống 1 viên mỗi ngày vào buổi sáng",
        quantity: 30,
      },
      {
        drug: {
          id: 2,
          drugName: "Losartan",
          unit: "tablet",
        },
        medicalRecord: null,
        howUse: "Uống 1 viên mỗi ngày vào buổi tối",
        quantity: 30,
      },
    ],
    status: "DONE",
  },
  {
    id: 2,
    appointment: {
      id: 102,
      patient: "patient-001",
      doctor: "Dr. Trần Thị Mai",
      roomId: "room-203",
    },
    roomId: "room-203",
    diagnosisDisease: "Viêm da dị ứng",
    note: "Bệnh nhân có biểu hiện dị ứng với một số hóa chất trong mỹ phẩm. Cần tránh sử dụng các sản phẩm có chứa paraben.",
    reExaminationDate: "2023-07-05",
    createdAt: "15-06-2023-10-00-00",
    drugs: [
      {
        drug: {
          id: 3,
          drugName: "Cetirizine",
          unit: "tablet",
        },
        medicalRecord: null,
        howUse: "Uống 1 viên mỗi ngày trước khi đi ngủ",
        quantity: 15,
      },
      {
        drug: {
          id: 4,
          drugName: "Hydrocortisone Cream",
          unit: "tube",
        },
        medicalRecord: null,
        howUse: "Bôi lên vùng da bị dị ứng 2 lần mỗi ngày",
        quantity: 1,
      },
    ],
    status: "DONE",
  },
];

// Get a medical record by ID
export const getMedicalRecordById = async (
  id: number
): Promise<MedicalRecord | null> => {
  // In a real app, this would be an API call
  // return await apiClient.get(`/medical-records/${id}`);

  // Using mock data instead
  console.log("Mock fetching medical record with ID:", id);
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const record = MOCK_MEDICAL_RECORDS.find((record) => record.id === id);
  return record || null;
};

// Save a medical record
export const saveMedicalRecord = async (
  record: MedicalRecord
): Promise<MedicalRecord> => {
  // In a real app, this would be an API call
  // return await apiClient.post('/medical-records', record);

  // Using mock data instead
  console.log("Mock saving medical record:", record);
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Return the submitted record for now
  return record;
};

// Get medical records by patient ID
export const getMedicalRecordsByPatientId = async (
  patientId: string
): Promise<MedicalRecord[]> => {
  // In a real app, this would be an API call
  // return await apiClient.get(`/patients/${patientId}/medical-records`);

  // Using mock data instead
  console.log("Mock fetching medical records for patient:", patientId);
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Filter records by patient ID
  return MOCK_MEDICAL_RECORDS.filter(
    (record) => record.appointment.patient === patientId
  );
};
