import React from "react";
import { Typography, Box, Divider, Chip } from "@mui/material";
import { ProfileCard } from "../profile/ProfileCard";
import WorkIcon from "@mui/icons-material/Work";
import { DoctorExperience } from "../../types/doctor";

interface DoctorExperienceProps {
  experiences: DoctorExperience[];
  specialization: string;
}

export const DoctorExperienceSection: React.FC<DoctorExperienceProps> = ({
  experiences,
  specialization,
}) => {
  return (
    <ProfileCard title="Professional Experience">
      <Box mb={2}>
        <Typography variant="subtitle1" gutterBottom>
          Specialization
        </Typography>
        <Chip label={specialization} color="primary" />
      </Box>
      <Divider sx={{ my: 2 }} />
      {experiences.map((exp) => (
        <Box key={exp.id} mb={3}>
          <Box display="flex" alignItems="flex-start">
            <WorkIcon sx={{ mr: 1, color: "primary.main" }} />
            <Box>
              <Typography variant="h6">{exp.compName}</Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {exp.specialization}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {new Date(exp.startDate).toLocaleDateString()} -{" "}
                {exp.endDate
                  ? new Date(exp.endDate).toLocaleDateString()
                  : "Present"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {exp.compAddress.city}, {exp.compAddress.country}
              </Typography>
              <Typography variant="body1" mt={1}>
                {exp.description}
              </Typography>
            </Box>
          </Box>
        </Box>
      ))}
    </ProfileCard>
  );
};
