import { Suspense } from "react";
import { Loading } from "../components/global/Loading/Loading";
import { BrowserRouter, Route, Routes } from "react-router";
import { ROUTING } from "../constants/routing";
import PatientProfilePage from "../pages/patient/PatientProfilePage";
import DoctorProfilePage from "../pages/doctor/DoctorProfilePage";
import MedicalRecordPage from "../pages/doctor/MedicalRecordPage";
import DoctorAppointmentDetailsPage from "../pages/doctor/DoctorAppointmentDetailsPage";
import PatientAppointmentDetailsPage from "../pages/patient/PatientAppointmentDetailsPage";

// Import layout components
import AdminLayout from "../layouts/AdminLayout";
import DoctorLayout from "../layouts/DoctorLayout";
import PatientLayout from "../layouts/PatientLayout";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import VerifyEmailPage from "../pages/VerifyEmailPage";
import RegisterPage from "../pages/RegisterPage";
import DoctorDashboard from "../pages/doctor/DoctorDashboard";
import PatientDashboard from "../pages/patient/PatientDashboard";
import AppointmentPage from "../pages/patient/AppointmentPage";
import DoctorSchedulePage from "../pages/doctor/DoctorSchedulePage";
import DoctorCurrentSchedulePage from "../pages/doctor/DoctorCurrentSchedulePage";
import PatientMedicalRecordsListPage from "../pages/patient/PatientMedicalRecordsListPage";
import ExaminationRoomPage from "../pages/ExaminationRoomPage"; // Import from new location
import WaitingRoomPage from "../pages/patient/WatingRoomPage";
import PatientManagementPage from "../pages/admin/PatientManagementPage";

// const ChatPage = lazy(() => import("../pages/ChatPage"));

export const AppRoutes = () => {
  return (
    <Suspense fallback={<Loading />}>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path={ROUTING.HOME} element={<HomePage />} />
          <Route path={ROUTING.REGISTER} element={<RegisterPage />} />
          <Route path={ROUTING.LOGIN} element={<LoginPage />} />
          <Route path={ROUTING.VERIFY_EMAIL} element={<VerifyEmailPage />} />

          {/* Standalone Examination Room route */}
          <Route
            path={ROUTING.EXAMINATION_ROOM}
            element={<ExaminationRoomPage />}
          />

          {/* Admin routes */}
          <Route path={ROUTING.ADMIN} element={<AdminLayout />}>
            <Route path={ROUTING.DASHBOARD} element={<div>Dashboard</div>} />
            <Route index element={<div>Dashboard</div>} />
            {/* Add other admin routes as needed */}
            <Route path={ROUTING.USERS} element={<PatientManagementPage />} />
            <Route
              path={ROUTING.DOCTORS}
              element={<div>Doctors Management</div>}
            />
            <Route path={ROUTING.DRUG} element={<div>Drug Management</div>} />
          </Route>

          {/* Doctor routes */}
          <Route path={ROUTING.DOCTOR} element={<DoctorLayout />}>
            <Route path={ROUTING.DASHBOARD} element={<DoctorDashboard />} />
            <Route index element={<DoctorDashboard />} />
            <Route path={ROUTING.PROFILE} element={<DoctorProfilePage />} />
            <Route
              path={ROUTING.APPOINTMENT_DETAILS}
              element={<DoctorAppointmentDetailsPage />}
            />
            <Route path={ROUTING.SCHEDULE} element={<DoctorSchedulePage />} />
            <Route
              path={ROUTING.CURRENT_SCHEDULE}
              element={<DoctorCurrentSchedulePage />}
            />
            <Route path={ROUTING.PATIENTS} element={<div>Patients</div>} />
            <Route
              path={ROUTING.PRESCRIPTIONS}
              element={<div>Prescriptions</div>}
            />
            <Route path={ROUTING.CHAT} element={<div>Chat</div>} />
            {/* Keep the nested route for backward compatibility */}
            {/* <Route
              path={ROUTING.EXAMINATION_ROOM}
              element={<DoctorExaminationRoomPage />}
            /> */}
          </Route>

          {/* Patient routes */}
          <Route path={ROUTING.PATIENT} element={<PatientLayout />}>
            <Route path={ROUTING.DASHBOARD} element={<PatientDashboard />} />
            <Route index element={<PatientDashboard />} />
            <Route path={ROUTING.PROFILE} element={<PatientProfilePage />} />
            <Route path={ROUTING.APPOINTMENTS} element={<AppointmentPage />} />
            <Route
              path={ROUTING.PATIENT_APPOINTMENT_DETAILS}
              element={<PatientAppointmentDetailsPage />}
            />
            <Route
              path={ROUTING.WATING_ROOM}
              element={<WaitingRoomPage />} // This component is now correctly named WaitingRoom internally
            />
            <Route
              path={ROUTING.FIND_DOCTOR}
              element={<div>Find Doctor</div>}
            />
            <Route
              path={ROUTING.MEDICAL_RECORDS}
              element={<PatientMedicalRecordsListPage />}
            />
            <Route path={ROUTING.CHAT} element={<div>Chat</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Suspense>
  );
};
