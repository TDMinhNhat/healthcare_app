import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  CardMedia,
  Chip,
  Rating,
  Paper,
  CircularProgress,
} from "@mui/material";
import { getDoctorInfo } from "../../services/authenticate/user_service";
import { DoctorEducationSection } from "../doctor/DoctorEducationSection";
import { DoctorExperienceSection } from "../doctor/DoctorExperienceSection";
import { DoctorCertificatesSection } from "../doctor/DoctorCertificatesSection";

/**
 * Props cho component DoctorDetails
 * @param doctor - Thông tin bác sĩ cần hiển thị chi tiết
 */
interface DoctorDetailsProps {
  doctor: any;
}

/**
 * Component hiển thị thông tin chi tiết về bác sĩ
 * Bao gồm thông tin cá nhân, học vấn, kinh nghiệm và chứng chỉ
 */
const DoctorDetails: React.FC<DoctorDetailsProps> = ({ doctor }) => {
  // State lưu trạng thái loading
  const [loading, setLoading] = useState(true);
  // State lưu thông tin chi tiết bác sĩ
  const [doctorDetails, setDoctorDetails] = useState<any>(null);
  // State lưu thông báo lỗi nếu có
  const [error, setError] = useState<string | null>(null);

  /**
   * Gọi API để lấy thông tin chi tiết về bác sĩ khi component mount
   */
  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("Fetching doctor details for:", doctor);
        const response = await getDoctorInfo(doctor.userId);
        console.log("Doctor details response:", response.data.data);
        setDoctorDetails(response.data.data || doctor);
      } catch (err) {
        console.error("Failed to fetch doctor details:", err);
        setError(
          "Failed to load doctor details. Using basic information instead."
        );
        setDoctorDetails(doctor);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorDetails();
  }, [doctor]);

  // Hiển thị loading spinner khi đang tải dữ liệu
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Trích xuất dữ liệu từ doctorDetails
  const details = doctorDetails || doctor;
  const infoBasic = details.doctor || {};
  const education = details.educations || [];
  const experience = details.experiences || [];
  const certificates = details.certificates || [];

  return (
    <Box>
      {/* Hiển thị thông báo lỗi nếu có */}
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {/* Thông tin cơ bản của bác sĩ */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2}>
          {/* Ảnh đại diện của bác sĩ */}
          <Grid item xs={12} sm={3}>
            <CardMedia
              component="img"
              sx={{
                width: "80%",
                maxWidth: "120px",
                borderRadius: 1,
                margin: "0 auto",
              }}
              image={
                infoBasic.avatar || "https://picsum.photos/120/160?random=1" // Ảnh mặc định nếu không có avatar
              }
              alt={infoBasic.lastName || "Doctor"}
            />
          </Grid>
          {/* Thông tin cơ bản về bác sĩ */}
          <Grid item xs={12} sm={9}>
            <Typography variant="h5" component="div">
              {infoBasic.firstName + " " + infoBasic.lastName || "Doctor"}
            </Typography>
            <Chip
              label={infoBasic.specialization}
              color="primary"
              sx={{ mt: 1, mb: 1 }}
            />
            <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
              <Rating value={details.rating || 0} precision={0.1} readOnly />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                ({details.reviews || 0} đánh giá)
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Using specialized doctor components for education, experience, and certificates */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <DoctorEducationSection education={education} />
        </Grid>

        <Grid item xs={12} md={6}>
          <DoctorExperienceSection
            experiences={experience}
            specialization={infoBasic.specialization || "Không xác định"}
          />
        </Grid>

        <Grid item xs={12}>
          <DoctorCertificatesSection certificates={certificates} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default DoctorDetails;
