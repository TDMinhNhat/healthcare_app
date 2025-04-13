export const ROUTING = {
  // Public routes
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  VERIFY_EMAIL: "/verify-email",
  EXAMINATION_ROOM: "/examination/:scheduleId", // New standalone examination room route

  // Role root paths
  ADMIN: "/admin",
  DOCTOR: "/doctor",
  PATIENT: "/patient",

  // Admin routes (nested under /admin)
  DASHBOARD: "dashboard",
  USERS: "users",
  DOCTORS: "doctors",
  DRUG: "drugs",
  SHIFTS: "shifts",
  DISEASES: "diseases",

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
};
