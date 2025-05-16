import React from "react";
import { Typography, Box, Divider, Paper, Chip } from "@mui/material";
import { ProfileCard } from "../profile/ProfileCard";
import MedicalInformationIcon from "@mui/icons-material/MedicalInformation";
import { MedicalRecord } from "../../types/medical";

interface PatientMedicalRecordsProps {
  records: MedicalRecord[];
}

export const PatientMedicalRecordsSection: React.FC<
  PatientMedicalRecordsProps
> = ({ records }) => {
  return (
    <ProfileCard title="Medical Records">
      <Divider sx={{ my: 2 }} />
      {records.length ? (
        records.map((record) => (
          <Paper
            key={record.id}
            elevation={0}
            sx={{
              p: 2,
              mb: 2,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Box display="flex" alignItems="center" mb={1}>
              <MedicalInformationIcon color="error" sx={{ mr: 1 }} />
              <Typography variant="h6">{record.diagnosisDisease}</Typography>
            </Box>
            {/* <Typography variant="body2" color="text.secondary" gutterBottom>
              Date: {new Date(record.createdAt).toLocaleDateString()}
            </Typography> */}
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Doctor: {record.doctor?.lastName}
            </Typography>
            <Typography variant="body1" paragraph>
              {record.note}
            </Typography>
            {record.reExaminationDate && (
              <Box mt={1}>
                <Chip
                  label={`Re-examination: ${record.reExaminationDate}`}
                  color="warning"
                  size="small"
                />
              </Box>
            )}
          </Paper>
        ))
      ) : (
        <Typography variant="body1" color="text.secondary" align="center">
          No medical records available
        </Typography>
      )}
    </ProfileCard>
  );
};
