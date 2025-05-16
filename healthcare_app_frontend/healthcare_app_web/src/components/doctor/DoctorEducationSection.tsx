import React from "react";
import { Typography, Box, Divider, Chip } from "@mui/material";
import { ProfileCard } from "../profile/ProfileCard";
import SchoolIcon from "@mui/icons-material/School";
import { DoctorEducation } from "../../types/doctor";

interface DoctorEducationProps {
  education: DoctorEducation[];
}

export const DoctorEducationSection: React.FC<DoctorEducationProps> = ({
  education,
}) => {
  const getDiplomaColor = (
    diploma: string
  ): "default" | "info" | "success" | "warning" | "error" => {
    switch (diploma) {
      case "BACHELOR":
        return "info";
      case "MASTER":
        return "success";
      case "DOCTOR":
        return "warning";
      case "PROFESSOR":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <ProfileCard title="Học Vấn & Bằng Cấp">
      <Divider sx={{ my: 2 }} />
      {education.map((edu) => (
        <Box key={edu.id} mb={3}>
          <Box display="flex" alignItems="flex-start">
            <SchoolIcon sx={{ mr: 1, color: "primary.main" }} />
            <Box>
              <Typography variant="h6">{edu.schoolName}</Typography>
              <Box display="flex" alignItems="center" mt={0.5} mb={1}>
                <Chip
                  label={edu.diploma}
                  size="small"
                  color={getDiplomaColor(edu.diploma)}
                  sx={{ mr: 1 }}
                />
              </Box>
              <Typography variant="body2" color="text.secondary">
                {edu.joinDate} - {edu.graduateDate}
              </Typography>
            </Box>
          </Box>
        </Box>
      ))}
    </ProfileCard>
  );
};
