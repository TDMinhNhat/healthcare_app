import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Avatar,
} from "@mui/material";
import { getAllTypeDiseases } from "../../services/authenticate/typeDisease_service.ts";
import { Disease } from "../../types/typeDisease";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import PsychologyIcon from "@mui/icons-material/Psychology";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";

export default function DiseaseList() {
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDiseases = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getAllTypeDiseases();
        if (response.data.code === 200) {
          // Filter only active diseases
          const activeDiseases = response.data.data.filter(
            (disease: Disease) => disease.status === true
          );
          setDiseases(activeDiseases);
        }
      } catch (err) {
        console.error("Error fetching disease types:", err);
        setError("Không thể tải danh sách loại bệnh. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchDiseases();
  }, []);

  // Hàm để lấy biểu tượng dựa trên chỉ số của bệnh
  const getIcon = (index: number) => {
    const icons = [
      <PsychologyIcon fontSize="large" />, // Biểu tượng tâm lý học
      <LocalHospitalIcon fontSize="large" />, // Biểu tượng bệnh viện
      <HealthAndSafetyIcon fontSize="large" />, // Biểu tượng sức khỏe và an toàn
      <MedicalServicesIcon fontSize="large" />, // Biểu tượng dịch vụ y tế
    ];
    return icons[index % icons.length];
  };

  // Hàm để tạo màu cho nền avatar dựa trên chỉ số
  const getColor = (index: number) => {
    const colors = [
      "#3F51B5", // Màu xanh indigo
      "#E91E63", // Màu hồng
      "#009688", // Màu xanh lá cây đậm
      "#FF5722", // Màu cam đậm
      "#2196F3", // Màu xanh da trời
      "#673AB7", // Màu tím
      "#4CAF50", // Màu xanh lá cây
      "#FFC107", // Màu vàng
    ];
    return colors[index % colors.length];
  };

  return (
    <Box sx={{ py: 8, backgroundColor: "background.paper" }}>
      <Container>
        <Typography variant="h2" align="center" gutterBottom>
          Các Nhóm Bệnh Chúng Tôi Điều Trị
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          sx={{ mb: 4 }}
        >
          Đội ngũ y bác sĩ chuyên nghiệp với nhiều năm kinh nghiệm
        </Typography>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ my: 2 }}>
            {error}
          </Alert>
        ) : diseases.length === 0 ? (
          <Alert severity="info" sx={{ my: 2 }}>
            Không có nhóm bệnh nào được tìm thấy
          </Alert>
        ) : (
          <Grid container spacing={4}>
            {diseases.map((disease, index) => (
              <Grid item xs={12} sm={6} md={4} key={disease.id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 2,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: 6,
                    },
                  }}
                >
                  <CardContent
                    sx={{ display: "flex", alignItems: "center", p: 3 }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: getColor(index),
                        width: 56,
                        height: 56,
                        mr: 2,
                      }}
                    >
                      {getIcon(index)}
                    </Avatar>
                    <Box>
                      <Typography
                        variant="h6"
                        component="h2"
                        sx={{ fontWeight: "bold" }}
                      >
                        {disease.name}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}
