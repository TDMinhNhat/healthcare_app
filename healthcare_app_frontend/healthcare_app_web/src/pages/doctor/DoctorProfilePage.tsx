import React, { useState, useEffect } from "react";
import { Container, Grid, Box, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { PersonalInfoSection } from "../../components/profile/PersonalInfoSection";
import { DoctorExperienceSection } from "../../components/doctor/DoctorExperienceSection";
import { DoctorEducationSection } from "../../components/doctor/DoctorEducationSection";
import { DoctorCertificatesSection } from "../../components/doctor/DoctorCertificatesSection";
import { EditProfileModal } from "../../components/profile/EditProfileModal";
import AvatarUploadModal from "../../components/profile/AvatarUploadModal";
import { Doctor } from "../../types/doctor";
import { useTranslation } from "react-i18next";
import { Diploma } from "../../types";

// Mock data - would normally come from API
const mockDoctorData: Doctor = {
  id: 1,
  userId: "dr123",
  firstName: "John",
  lastName: "Smith",
  sex: true,
  dob: "1980-05-15",
  address: {
    id: 1,
    number: "123",
    street: "Medical Street",
    ward: "Healthcare",
    district: "Central",
    city: "Metropolis",
    country: "USA",
  },
  phone: "+1234567890",
  avatar: "https://randomuser.me/api/portraits/men/41.jpg",
  email: "john.smith@healthcare.com",
  emailVerify: true,
  status: true,
  specialization: "Cardiologist",
  experience: {
    id: 1,
    compName: "Metro Hospital",
    specialization: "Cardiology",
    startDate: "2015-01-01",
    endDate: "",
    compAddress: {
      city: "Metropolis",
      country: "USA",
      id: 2,
      number: "123",
      street: "Hospital Street",
      ward: "Healthcare",
      district: "Central",
    },
    description:
      "Specialized in cardiovascular treatments and heart surgeries.",
  },
  educations: [
    {
      id: 1,
      schoolName: "Medical University",
      joinedDate: "2000-09-01",
      graduateDate: "2006-06-30",
      diploma: Diploma.BACHELOR,
      doctorId: 0,
    },
    {
      id: 2,
      schoolName: "Health Academy",
      joinedDate: "1996-09-01",
      graduateDate: "2000-05-30",
      diploma: Diploma.DOCTOR,
      doctorId: 0,
    },
  ],
  certificates: [
    {
      id: 1,
      certName: "Advanced Cardiovascular Life Support",
      issueDate: "2018-03-15",
      doctorId: 1,
      address: {
        city: "Metropolis",
        country: "USA",
        id: 3,
        number: "123",
        street: "Medical Street",
        ward: "Healthcare",
        district: "Central",
      },
    },
    {
      id: 2,
      certName: "Board Certification in Cardiology",
      issueDate: "2016-07-22",
      doctorId: 1,
      address: {
        city: "Metropolis",
        country: "USA",
        id: 4,
        number: "123",
        street: "Medical Street",
        ward: "Healthcare",
        district: "Central",
      },
    },
  ],
};

const DoctorProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const [doctorData, setDoctorData] = useState(mockDoctorData);
  const [loading, setLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  useEffect(() => {
    // Here you would fetch the doctor data from the API
    // For now we're using the mock data
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  const handleOpenEditModal = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleOpenAvatarModal = () => {
    setIsAvatarModalOpen(true);
  };

  const handleCloseAvatarModal = () => {
    setIsAvatarModalOpen(false);
  };

  const handleSaveProfile = (updatedData: any) => {
    // Here you would make an API call to update the profile
    setDoctorData({ ...doctorData, ...updatedData });
    // For demonstration purposes, we're just updating the local state
    console.log("Saving updated profile data:", updatedData);
  };

  const handleSaveAvatar = (newAvatar: string) => {
    // Here you would make an API call to update the avatar
    setDoctorData({ ...doctorData, avatar: newAvatar });
    console.log("Saving updated avatar:", newAvatar);
  };

  if (loading) {
    return <div>{t("common.loading")}</div>;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Box sx={{ position: "relative" }}>
            <PersonalInfoSection
              firstName={doctorData.firstName}
              lastName={doctorData.lastName}
              email={doctorData.email}
              phone={doctorData.phone}
              dob={doctorData.dob}
              gender={String(doctorData.sex)}
              address={doctorData.address}
              avatar={doctorData.avatar}
              onEditAvatar={handleOpenAvatarModal}
              hideEditButton={false} // Changed to false to show edit button
            />
            <IconButton
              color="primary"
              onClick={handleOpenEditModal}
              sx={{
                position: "absolute",
                top: "12px",
                right: "12px",
                bgcolor: "background.paper",
                "&:hover": {
                  bgcolor: "action.hover",
                },
                boxShadow: 1,
                zIndex: 1, // Add zIndex to ensure our button is on top
              }}
              aria-label={t("common.edit")}
              size="small"
            >
              <EditIcon />
            </IconButton>
          </Box>
          <DoctorCertificatesSection certificates={doctorData.certificates} />
        </Grid>
        <Grid item xs={12} md={6}>
          <DoctorExperienceSection
            experiences={[doctorData.experience]}
            specialization={doctorData.specialization}
          />
          <DoctorEducationSection education={doctorData.educations} />
        </Grid>
      </Grid>

      <EditProfileModal
        open={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSave={handleSaveProfile}
        userData={{
          firstName: doctorData.firstName,
          lastName: doctorData.lastName,
          email: doctorData.email,
          phone: doctorData.phone,
          dob: doctorData.dob,
          sex: doctorData.sex,
          address: doctorData.address,
        }}
      />

      <AvatarUploadModal
        open={isAvatarModalOpen}
        currentAvatar={doctorData.avatar}
        onClose={handleCloseAvatarModal}
        onSave={handleSaveAvatar}
      />
    </Container>
  );
};

export default DoctorProfilePage;
