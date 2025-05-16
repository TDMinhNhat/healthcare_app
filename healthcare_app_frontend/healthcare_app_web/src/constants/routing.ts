export const ROUTING = {
  // Public routes
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  VERIFY_EMAIL: "/verify-email",
  CHANGE_PASSWORD: "/change-password", // New route for password change
  EXAMINATION_ROOM: "/examination/:scheduleId", // New standalone examination room route
  FORGET_PASSWORD: "/forgot-password", // New route for forgot password

  // Role root paths
  ADMIN: "/admin",
  DOCTOR: "/doctor",
  PATIENT: "/patient",

  // Admin routes (nested under /admin)
  DASHBOARD: "dashboard",
  USERS: "users",
  DOCTORS: "doctors",
  DRUG: "drugs",
  PRICES: "prices", // Add new route for prices
  SHIFTS: "shifts",
  DISEASES: "diseases",
  CANCEL_APPOINTMENT: "cancel-appointment",
  DOCTOR_REVENUE: "doctor-revenue/:periodType/:period", // New route for doctor revenue details

  // Doctor routes (nested under /doctor)
  APPOINTMENTS: "appointments",
  SCHEDULE_DETAIL: "schedule/:scheduleId", // New route for appointment details
  PATIENTS: "patients",
  PRESCRIPTIONS: "prescriptions",
  CHAT: "chat",
  PROFILE: "profile",
  SCHEDULE: "schedule",
  CURRENT_SCHEDULE: "current-schedule",
  MEDICAL_RECORDS: "medical-records", // This will be used for both doctor and patient
  EMERGENCY: "emergency", // New route for emergency cases

  // Patient routes (nested under /patient)
  FIND_DOCTOR: "find-doctor",
  PATIENT_APPOINTMENT: "appointments",
  PATIENT_APPOINTMENT_DETAILS: "appointments/:appointmentId", // New route for patient appointment details
  WATING_ROOM: "wating-room/:scheduleId", // New route for patient examination room
  BANK_ACCOUNT: "bank-account", // Thêm route mới để quản lý tài khoản ngân hàng
};
