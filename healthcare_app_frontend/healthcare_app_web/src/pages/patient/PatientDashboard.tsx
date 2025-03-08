import React, { useState, useEffect } from "react";
import {
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Box,
  Alert,
  Stack,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import EmptyState from "../../components/EmptyState";
import AppointmentList from "../../components/appointments/AppointmentList";

const PatientDashboard: React.FC = () => {
  const user = useSelector((state: any) => state.user.user);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [patientData, setPatientData] = useState<any | null>(null);
  const { t } = useTranslation();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchPatientData = async () => {
      console.log("user.userId", user.userId);
      if (!user?.userId) {
        setError("User not found");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log("user.userId", user.userId);
        // Mock data for demonstration
        const data = {
          nextAppointment: null,
          appointmentStats: {
            total: 12,
            completed: 10,
            upcoming: 2,
            cancelled: 1,
          },
        };
        setPatientData(data);
        setError(null);
      } catch (err) {
        setError("Failed to load patient data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [user]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!patientData) {
    return <Alert severity="info">{t("common.loading")}</Alert>;
  }

  const { appointmentStats } = patientData;
  const fullName = user ? `${user.firstName} ${user.lastName}` : "";

  return (
    <>
      <Typography variant="h4" gutterBottom>
        {t("patient.dashboard.welcome")} {fullName}
      </Typography>
      <Grid container spacing={3}>
        {/* Appointment Statistics */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              {t("patient.dashboard.appointment_statistics")}
            </Typography>
            <Stack spacing={2} mt={2}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h3" align="center" color="primary">
                    {appointmentStats.total}
                  </Typography>
                  <Typography variant="body1" align="center">
                    {t("patient.dashboard.total_appointments")}
                  </Typography>
                </CardContent>
              </Card>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography
                        variant="h4"
                        align="center"
                        color="success.main"
                      >
                        {appointmentStats.completed}
                      </Typography>
                      <Typography variant="body2" align="center">
                        {t("patient.dashboard.completed")}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={4}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h4" align="center" color="info.main">
                        {appointmentStats.upcoming}
                      </Typography>
                      <Typography variant="body2" align="center">
                        {t("patient.dashboard.upcoming")}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={4}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography
                        variant="h4"
                        align="center"
                        color="error.main"
                      >
                        {appointmentStats.cancelled}
                      </Typography>
                      <Typography variant="body2" align="center">
                        {t("patient.dashboard.cancelled")}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Stack>
          </Paper>
        </Grid>

        {/* Combined Upcoming Appointments Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom mb={2}>
              {t("patient.dashboard.next_appointment")}
            </Typography>
            {user?.userId ? (
              <AppointmentList
                type="upcoming"
                status={["WAITING", "IN_PROGRESS"]}
                patientId={user.userId}
              />
            ) : (
              <EmptyState
                message={t("patient.dashboard.no_upcoming_appointments")}
              />
            )}
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default PatientDashboard;
