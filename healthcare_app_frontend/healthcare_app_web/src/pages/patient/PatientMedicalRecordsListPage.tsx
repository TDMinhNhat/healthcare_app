import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Divider,
  IconButton,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EventIcon from "@mui/icons-material/Event";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import { format } from "date-fns";

// Mock data for medical records
const MOCK_MEDICAL_RECORDS = [
  {
    id: 1,
    appointmentDate: "20-07-2023-09-30-00",
    doctor: "Dr. Nguyễn Bá Thành",
    diagnosisDisease: "Tăng huyết áp độ 1",
    status: "DONE",
    specialization: "Tim Mạch",
  },
  {
    id: 2,
    appointmentDate: "15-06-2023-10-00-00",
    doctor: "Dr. Trần Thị Mai",
    diagnosisDisease: "Viêm da dị ứng",
    status: "DONE",
    specialization: "Da Liễu",
  },
  {
    id: 3,
    appointmentDate: "01-05-2023-14-30-00",
    doctor: "Dr. Vũ Văn Tuấn",
    diagnosisDisease: "Đau đầu mãn tính",
    status: "DONE",
    specialization: "Thần Kinh",
  },
];

const PatientMedicalRecordsListPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [medicalRecords, setMedicalRecords] = useState<any[]>([]);

  useEffect(() => {
    // Simulate API call
    const fetchMedicalRecords = async () => {
      try {
        // In a real app, we would fetch from an API
        setTimeout(() => {
          setMedicalRecords(MOCK_MEDICAL_RECORDS);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching medical records:", error);
        setLoading(false);
      }
    };

    fetchMedicalRecords();
  }, []);

  const handleViewRecord = (recordId: number) => {
    navigate(`/patient/medical-records/${recordId}`);
  };

  // Format date from string like "20-07-2023-09-30-00"
  const formatDate = (dateString: string) => {
    try {
      const parts = dateString.split("-");
      if (parts.length >= 6) {
        const day = parseInt(parts[0]);
        const month = parseInt(parts[1]) - 1; // Month is 0-indexed in JS Date
        const year = parseInt(parts[2]);
        const hour = parseInt(parts[3]);
        const minute = parseInt(parts[4]);
        return format(
          new Date(year, month, day, hour, minute),
          "dd/MM/yyyy HH:mm"
        );
      }
      return dateString;
    } catch (e) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" component="h1" sx={{ mb: 3 }}>
        {t("patient.medical_records.title", "Medical Records")}
      </Typography>

      {medicalRecords.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography color="text.secondary">
            {t(
              "patient.medical_records.no_records",
              "You don't have any medical records yet."
            )}
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {medicalRecords.map((record) => (
            <Grid item xs={12} key={record.id}>
              <Card>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={8}>
                      <Typography variant="h6" gutterBottom>
                        {record.diagnosisDisease}
                      </Typography>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        <LocalHospitalIcon
                          sx={{ mr: 1, color: "primary.main" }}
                        />
                        <Typography variant="body2">
                          {record.doctor} - {record.specialization}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <EventIcon sx={{ mr: 1, color: "primary.main" }} />
                        <Typography variant="body2">
                          {formatDate(record.appointmentDate)}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      md={4}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                        justifyContent: "space-between",
                      }}
                    >
                      <Chip
                        label={t(
                          `patient.appointments.status.${record.status}`,
                          record.status
                        )}
                        color="success"
                        size="small"
                        sx={{ mb: 1 }}
                      />
                      <Button
                        variant="outlined"
                        startIcon={<VisibilityIcon />}
                        onClick={() => handleViewRecord(record.id)}
                      >
                        {t("common.view_details", "View Details")}
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default PatientMedicalRecordsListPage;
