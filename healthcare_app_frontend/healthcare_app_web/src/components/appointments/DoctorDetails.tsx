import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Rating,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  CircularProgress,
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import WorkIcon from "@mui/icons-material/Work";
import StarIcon from "@mui/icons-material/Star";
import { useTranslation } from "react-i18next";
import { getDoctorInfo } from "../../services/authenticate/user_service";

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
  const { t } = useTranslation();
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
  const certifications = details.certificates || [];

  return (
    <Box>
      {/* Tiêu đề phần thông tin bác sĩ */}
      <Typography variant="h6" gutterBottom>
        {t("patient.appointments.doctor_details")}
      </Typography>

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
              sx={{ width: "100%", borderRadius: 1 }}
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
            <Typography variant="body1" color="text.secondary">
              {t("doctor.profile.experience")}: {details.experience}{" "}
              {t("doctor.profile.years")}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
              <Rating value={details.rating || 0} precision={0.1} readOnly />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                ({details.reviews || 0} {t("doctor.profile.reviews")})
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Layout 2 cột cho thông tin học vấn và kinh nghiệm */}
      <Grid container spacing={3}>
        {/* Thông tin học vấn */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <SchoolIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">
                {t("doctor.profile.education")}
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <List>
              {education.length > 0 ? (
                education.map((item: any, index: number) => (
                  <ListItem key={item.id || index} sx={{ px: 0 }}>
                    <ListItemText
                      primary={item.schoolName}
                      // Có thể hiển thị thêm thông tin chi tiết
                    />
                  </ListItem>
                ))
              ) : (
                <ListItem sx={{ px: 0 }}>
                  <ListItemText
                    primary={t("doctor.profile.no_education_data")}
                  />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>

        {/* Thông tin kinh nghiệm làm việc */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <WorkIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">
                {t("doctor.profile.experience")}
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <List>
              {experience.length > 0 ? (
                experience.map((item: any, index: number) => (
                  <ListItem key={item.id || index} sx={{ px: 0 }}>
                    <ListItemText
                      primary={item.position ?? ""}
                      secondary={`${item.companyName} (${item.startDate} - ${item.endDate})`}
                    />
                  </ListItem>
                ))
              ) : (
                <ListItem sx={{ px: 0 }}>
                  <ListItemText
                    primary={t("doctor.profile.no_experience_data")}
                  />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>

        {/* Thông tin chứng chỉ */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <StarIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">
                {t("doctor.profile.certificates")}
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <List>
              {certifications.length > 0 ? (
                certifications.map((cert: string, index: number) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemText primary={cert?.certName} />
                  </ListItem>
                ))
              ) : (
                <ListItem sx={{ px: 0 }}>
                  <ListItemText
                    primary={t("doctor.profile.no_certificates_data")}
                  />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DoctorDetails;
