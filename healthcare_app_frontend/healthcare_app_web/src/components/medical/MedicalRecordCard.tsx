import React from "react";
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Box,
  Chip,
  Button,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EventIcon from "@mui/icons-material/Event";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";

// MedicalRecord type definition
export interface MedicalRecord {
  id: number;
  appointmentDate: string;
  doctor: string;
  diagnosisDisease: string;
  status: string;
  specialization: string;
}

// Medical Record Card Component props
export interface MedicalRecordCardProps {
  record: MedicalRecord;
  onViewRecord: (recordId: number) => void;
  formatDate: (dateString: string) => string;
  t: (key: string, defaultValue: string) => string;
}

const MedicalRecordCard: React.FC<MedicalRecordCardProps> = ({
  record,
  onViewRecord,
  formatDate,
  t,
}) => {
  return (
    <Card>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Typography variant="h6" gutterBottom>
              {record.diagnosisDisease}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <LocalHospitalIcon sx={{ mr: 1, color: "primary.main" }} />
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
              onClick={() => onViewRecord(record.id)}
            >
              {t("common.view_details", "View Details")}
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default MedicalRecordCard;
