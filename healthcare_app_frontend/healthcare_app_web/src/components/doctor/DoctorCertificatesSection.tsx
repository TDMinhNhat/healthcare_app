import React from "react";
import { Typography, Box, Divider, Paper } from "@mui/material";
import { ProfileCard } from "../profile/ProfileCard";
import VerifiedIcon from "@mui/icons-material/Verified";
import { DoctorCertificate } from "../../types/doctor";

interface DoctorCertificatesProps {
  certificates: DoctorCertificate[];
}

export const DoctorCertificatesSection: React.FC<DoctorCertificatesProps> = ({
  certificates,
}) => {
  return (
    <ProfileCard title="Certificates & Licenses">
      <Divider sx={{ my: 2 }} />
      {certificates.length ? (
        certificates.map((cert) => (
          <Paper
            key={cert.id}
            elevation={0}
            sx={{
              p: 2,
              mb: 2,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
              display: "flex",
              alignItems: "center",
            }}
          >
            <VerifiedIcon color="primary" sx={{ mr: 2 }} />
            <Box>
              <Typography variant="h6">{cert.certName}</Typography>
              <Typography variant="body2" color="text.secondary">
                Issue date: {new Date(cert.issueDate).toLocaleDateString()}
              </Typography>
            </Box>
          </Paper>
        ))
      ) : (
        <Typography variant="body1" color="text.secondary" align="center">
          No certificates listed
        </Typography>
      )}
    </ProfileCard>
  );
};
