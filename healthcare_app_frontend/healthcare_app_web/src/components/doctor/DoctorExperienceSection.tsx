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
  experiences = [],
  specialization = "Not specified",
}) => {
  console.log("DoctorExperienceSection -> experiences", experiences);

  const validExperiences = Array.isArray(experiences) ? experiences : [];

  return (
    <ProfileCard title="Kinh Nghiệm Chuyên Môn">
      <Box mb={2}>
        <Typography variant="subtitle1" gutterBottom>
          Chuyên Ngành
        </Typography>
        <Chip label={specialization} color="primary" />
      </Box>
      <Divider sx={{ my: 2 }} />
      {validExperiences && validExperiences.length > 0 ? (
        validExperiences.map((exp) => (
          <Box key={exp.id || `exp-${Math.random()}`} mb={3}>
            <Box display="flex" alignItems="flex-start">
              <WorkIcon sx={{ mr: 1, color: "primary.main" }} />
              <Box>
                <Typography variant="h6">
                  {exp.companyName || "Công ty không xác định"}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  {exp.specialization || "Thực hành chung"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {exp.startDate || "Không xác định"} -{" "}
                  {exp.endDate && exp.endDate ? exp.endDate : "Hiện tại"}
                </Typography>
                {(exp.compAddress?.city || exp.compAddress?.country) && (
                  <Typography variant="body2" color="text.secondary">
                    {exp.compAddress?.city || ""}
                    {exp.compAddress?.city && exp.compAddress?.country
                      ? ", "
                      : ""}
                    {exp.compAddress?.country || ""}
                  </Typography>
                )}
                {exp.description && (
                  <Typography variant="body1" mt={1}>
                    {exp.description}
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
        ))
      ) : (
        <Box>
          <Typography variant="body2" color="text.secondary">
            Không có thông tin kinh nghiệm
          </Typography>
          {/* <Typography variant="caption" color="error">
            Thông tin gỡ lỗi: {JSON.stringify(experiences)}
          </Typography> */}
        </Box>
      )}
    </ProfileCard>
  );
};
