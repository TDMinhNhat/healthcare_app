import React, { useState, useEffect } from "react";
import { Container, Grid, Box, IconButton, Alert } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

import { PersonalInfoSection } from "../../components/profile/PersonalInfoSection";
import { EditProfileModal } from "../../components/profile/EditProfileModal";
import AvatarUploadModal from "../../components/profile/AvatarUploadModal";
import { useTranslation } from "react-i18next";
import { getPatientInfo } from "../../services/user_service";

const PatientProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const [patientData, setPatientData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  useEffect(() => {
    const fetchPatientData = async () => {
      setLoading(true);
      try {
        // Fetch patient data using the userId - in a real app, you might get this from authentication
        const userId = "20250228192235-63089-20000102"; // This would typically come from auth context
        const response = await getPatientInfo(userId);

        if (response.data && response.data.code === 200) {
          setPatientData(response.data.data);
        } else {
          setError("Failed to retrieve patient data");
        }
      } catch (error) {
        console.error("Error fetching patient data:", error);
        setError("Error loading patient data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
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
    // Ensure we handle the case where the user might not have an address initially
    const updatedPatientData = {
      ...patientData,
      ...updatedData,
      // If address was null and is now populated, make sure the updated structure is correct
      address: updatedData.address || patientData.address || null,
    };

    setPatientData(updatedPatientData);
    console.log("Saving updated profile data:", updatedData);
  };

  const handleSaveAvatar = (newAvatar: string) => {
    // Here you would make an API call to update the avatar
    setPatientData({ ...patientData, avatar: newAvatar });
    console.log("Saving updated avatar:", newAvatar);
  };

  if (loading) {
    return <div>{t("common.loading")}</div>;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!patientData) {
    return <Alert severity="info">{t("common.noData")}</Alert>;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box sx={{ position: "relative" }}>
            <PersonalInfoSection
              firstName={patientData.firstName || t("common.notAvailable")}
              lastName={patientData.lastName || t("common.notAvailable")}
              email={patientData.email || t("common.notAvailable")}
              phone={patientData.phone || t("common.notAvailable")}
              dob={patientData.dob || t("common.notAvailable")}
              sex={patientData.sex !== undefined ? patientData.sex : null}
              address={patientData.address || null}
              avatar={patientData.avatar || "/default-avatar.png"}
              onEditAvatar={handleOpenAvatarModal}
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
                zIndex: 1,
              }}
              aria-label={t("common.edit")}
              size="small"
            >
              <EditIcon />
            </IconButton>
          </Box>
        </Grid>
      </Grid>

      <EditProfileModal
        open={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSave={handleSaveProfile}
        userData={{
          firstName: patientData.firstName || "",
          lastName: patientData.lastName || "",
          email: patientData.email || "",
          phone: patientData.phone || "",
          dob: patientData.dob || "",
          sex: patientData.sex !== undefined ? patientData.sex : "",
          address: patientData.address || null,
        }}
      />

      <AvatarUploadModal
        open={isAvatarModalOpen}
        currentAvatar={patientData.avatar || "/default-avatar.png"}
        onClose={handleCloseAvatarModal}
        onSave={handleSaveAvatar}
      />
    </Container>
  );
};

export default PatientProfilePage;
