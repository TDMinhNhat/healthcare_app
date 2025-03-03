export const ROUTING = {
  // Public routes
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  VERIFY_EMAIL: "/verify-email",

  // Role root paths
  ADMIN: "/admin",
  DOCTOR: "/doctor",
  PATIENT: "/patient",

  // Admin routes (nested under /admin)
  DASHBOARD: "dashboard",
  USERS: "users",
  DOCTORS: "doctors",
  SETTINGS: "settings",

  // Doctor routes (nested under /doctor)
  APPOINTMENTS: "appointments",
  PATIENTS: "patients",
  PRESCRIPTIONS: "prescriptions",
  CHAT: "chat",
  PROFILE: "profile",
  SCHEDULE: "schedule",
  CURRENT_SCHEDULE: "current-schedule",
  MEDICAL_RECORDS: "medical-records", // This will be used for both doctor and patient

  // Patient routes (nested under /patient)
  FIND_DOCTOR: "find-doctor",
};
