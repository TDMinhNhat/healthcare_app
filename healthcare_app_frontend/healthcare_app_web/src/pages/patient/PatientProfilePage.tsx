import React, { useState, useEffect } from "react";
import { Container, Grid, Box, Typography, Button, Paper } from "@mui/material";

import { PersonalInfoSection } from "../../components/profile/PersonalInfoSection";
import { PatientMedicalRecordsSection } from "../../components/patient/PatientMedicalRecordsSection";
import { PatientAppointmentsSection } from "../../components/patient/PatientAppointmentsSection";
import { Appointment } from "../../types/appointment";
import { useTranslation } from "react-i18next";
import { Patient } from "../../types";

// Mock data - would normally come from API
const mockPatientData: any = {
  id: 2,
  userId: "pt456",
  firstName: "Emma",
  lastName: "Johnson",
  sex: false,
  dob: "15-07-1980",
  address: {
    id: 1,
    number: "456",
    street: "Patient Avenue",
    ward: "Wellness",
    district: "East",
    city: "Healthville",
    country: "USA",
  },
  phone: "+1987654321",
  avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  email: "emma.johnson@email.com",
  emailVerify: true,
  status: true,
  medicalRecords: [
    {
      id: 101,
      diagnosisDisease: "Hypertension",
      note: "Patient has elevated blood pressure. Recommended lifestyle changes and prescribed medication.",
      // reExaminationDate: "2023-07-15",
      createdAt: "2023-06-01T14:30:00",
      doctorName: "Dr. John Smith",
    },
    {
      id: 102,
      diagnosisDisease: "Seasonal Allergies",
      note: "Patient experiencing allergic rhinitis. Prescribed antihistamines and nasal spray.",
      // reExaminationDate: null,
      createdAt: "2023-04-12T10:15:00",
      doctorName: "Dr. Laura Chen",
    },
  ],
  appointments: [
    {
      id: 201,
      patient: {
        id: 2,
        firstName: "Emma",
        lastName: "Johnson",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        // other patient properties would go here
      },
      doctor: {
        id: 101,
        firstName: "John",
        lastName: "Smith",
        specialization: "Cardiologist",
        avatar: "https://randomuser.me/api/portraits/men/41.jpg",
        // other doctor properties would go here
      },
      note: "Follow-up for hypertension",
      start: "2023-07-15T09:00:00",
      end: "2023-07-15T09:30:00",
      // Optional fields that were in the original mock but not in the type
      status: "upcoming" as const,
    },
    {
      id: 202,
      patient: {
        id: 2,
        firstName: "Emma",
        lastName: "Johnson",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        // other patient properties would go here
      },
      doctor: {
        id: 102,
        firstName: "Laura",
        lastName: "Chen",
        specialization: "Allergist",
        avatar: "https://randomuser.me/api/portraits/women/68.jpg",
        // other doctor properties would go here
      },
      note: "Seasonal allergies consultation",
      start: "2023-04-12T10:00:00",
      end: "2023-04-12T10:30:00",
      // Optional fields that were in the original mock but not in the type
      status: "completed" as const,
    },
  ],
};

const PatientProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const [patientData, setPatientData] = useState(mockPatientData);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Here you would fetch the patient data from the API
    // For now we're using the mock data
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return <div>{t("common.loading")}</div>;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <PersonalInfoSection
            firstName={patientData.firstName}
            lastName={patientData.lastName}
            email={patientData.email}
            phone={patientData.phone}
            dob={patientData.dob}
            sex={patientData.sex}
            address={patientData.address}
            avatar={patientData.avatar}
          />
          <PatientAppointmentsSection appointments={patientData.appointments} />
        </Grid>
        <Grid item xs={12} md={6}>
          <PatientMedicalRecordsSection records={patientData.medicalRecords} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default PatientProfilePage;
