import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Rating,
  Avatar,
  CircularProgress,
  Divider,
  Paper,
  Alert,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { getDoctorsFreeStartTime } from "../../services/booking_service";
import MedicationIcon from "@mui/icons-material/Medication";
import { formatDateTimeToString } from "../../utils/dateUtils";

interface DoctorListProps {
  selectedDate: Date;
  selectedTime: string;
  onSelect: (doctor: any) => void;
  onBack: () => void;
}

const DoctorList: React.FC<DoctorListProps> = ({
  selectedDate,
  selectedTime,
  onSelect,
  onBack,
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAvailableDoctors = async () => {
      try {
        setLoading(true);
        setError(null);

        // Create a combined date object and format it using the utility function
        const [hours, minutes] = selectedTime.split(":").map(Number);
        const dateObj = new Date(selectedDate);
        dateObj.setHours(hours, minutes, 0, 0);

        const formattedDateTime = formatDateTimeToString(dateObj);
        // console.log("Formatted date time:", formattedDateTime);

        const response = await getDoctorsFreeStartTime(formattedDateTime);
        setDoctors(response.data.data || []);
      } catch (err) {
        console.error("Failed to fetch available doctors:", err);
        setError("Failed to load available doctors. Please try again.");
        setDoctors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableDoctors();
  }, [selectedDate, selectedTime]);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {t("patient.appointments.available_doctors")}
      </Typography>

      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
        {format(selectedDate, "EEEE, MMMM d, yyyy")} at {selectedTime}
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" sx={{ textAlign: "center", my: 4 }}>
          {error}
        </Typography>
      ) : (
        <>
          {doctors.length === 0 ? (
            <Paper
              elevation={1}
              sx={{
                my: 4,
                p: 3,
                textAlign: "center",
                backgroundColor: "rgba(0, 0, 0, 0.02)",
              }}
            >
              <MedicationIcon
                sx={{ fontSize: 60, color: "text.secondary", mb: 2 }}
              />
              <Typography variant="h6" color="text.secondary">
                {t("patient.appointments.no_doctors_available")}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {t("patient.appointments.try_different_time")}
              </Typography>
              <Button variant="outlined" onClick={onBack} sx={{ mt: 2 }}>
                {t("patient.appointments.select_different_time")}
              </Button>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {doctors && doctors.length > 0 ? (
                doctors.map((doctor, index) => (
                  <Grid
                    item
                    xs={12}
                    md={6}
                    key={doctor.id || `doctor-${index}`}
                  >
                    <Card sx={{ display: "flex", height: "100%" }}>
                      <CardMedia
                        component="img"
                        sx={{ width: 120, objectFit: "cover" }}
                        image={
                          doctor.image ||
                          "https://via.placeholder.com/120x160?text=Doctor"
                        }
                        alt={doctor.name || "Doctor"}
                      />
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          width: "100%",
                        }}
                      >
                        <CardContent sx={{ flex: "1 0 auto" }}>
                          <Typography component="div" variant="h6">
                            {doctor.name || "Unknown Doctor"}
                          </Typography>
                          {doctor.specialty && (
                            <Chip
                              label={doctor.specialty}
                              size="small"
                              color="primary"
                              sx={{ mt: 1, mb: 1 }}
                            />
                          )}
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                            component="div"
                          >
                            {t("doctor.profile.experience")}:{" "}
                            {doctor.experience || 0} {t("doctor.profile.years")}
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mt: 1,
                            }}
                          >
                            <Rating
                              value={doctor.rating || 0}
                              precision={0.1}
                              readOnly
                              size="small"
                            />
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ ml: 1 }}
                            >
                              ({doctor.reviews || 0}{" "}
                              {t("doctor.profile.reviews")})
                            </Typography>
                          </Box>
                        </CardContent>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            pl: 1,
                            pb: 1,
                            justifyContent: "flex-end",
                            pr: 2,
                          }}
                        >
                          <Button
                            size="small"
                            onClick={() => onSelect(doctor)}
                            variant="contained"
                          >
                            {t("patient.appointments.select")}
                          </Button>
                        </Box>
                      </Box>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ width: "100%", textAlign: "center", py: 2 }}
                >
                  {t("patient.appointments.no_doctors_available")}
                </Typography>
              )}
            </Grid>
          )}
        </>
      )}

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
        <Button onClick={onBack}>{t("common.back")}</Button>
      </Box>
    </Box>
  );
};

export default DoctorList;
