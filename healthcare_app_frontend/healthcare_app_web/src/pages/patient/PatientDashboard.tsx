import React, { useState, useEffect } from "react";
import {
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Box,
  Alert,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import EmptyState from "../../components/EmptyState";
import { getAppointmentPatient } from "../../services/appoinment_service";
import { setUser } from "../../stores/slices/user.slice";

const PatientDashboard: React.FC = () => {
  const user = useSelector((state: any) => state.user).user;
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [patientData, setPatientData] = useState<any | null>(null);
  const { t } = useTranslation();
  const dispatch = useDispatch();

  useEffect(() => {
    // console.log("user from redux:", user);
    // console.log("user type:", typeof user);
    // console.log("user keys:", user ? Object.keys(user) : null);

    const fetchPatientData = async () => {
      // console.log("user line 35 in dashboard", user);
      if (!user?.userId) {
        setError("User not found");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log("user.userId", user.userId);
        const data = await getAppointmentPatient(user.userId);
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

  // const handleViewMedicalRecord = async (recordId: string, title: string) => {
  //   try {
  //     const fileBlob = await getMedicalRecordFile(recordId);
  //     const url = window.URL.createObjectURL(fileBlob);
  //     const a = document.createElement('a');
  //     a.href = url;
  //     a.download = `${title}.pdf`;
  //     document.body.appendChild(a);
  //     a.click();
  //     window.URL.revokeObjectURL(url);
  //     document.body.removeChild(a);
  //   } catch (error) {
  //     console.error("Error downloading medical record:", error);
  //   }
  // };

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

  const { nextAppointment, recentAppointments, medications, medicalRecords } =
    patientData;
  const fullName = user ? `${user.firstName} ${user.lastName}` : "";

  return (
    <>
      <Typography variant="h4" gutterBottom>
        {t("patient.dashboard.welcome")} {fullName}
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Typography variant="h5" component="div">
                {t("patient.dashboard.next_appointment")}
              </Typography>
              {nextAppointment ? (
                <>
                  <Typography variant="body1" color="text.secondary">
                    Dr. {nextAppointment.doctorName} - {nextAppointment.purpose}{" "}
                    - {nextAppointment.date} at {nextAppointment.time}
                  </Typography>
                  <Button variant="contained" color="primary">
                    {t("patient.dashboard.view_details")}
                  </Button>
                </>
              ) : (
                <Typography variant="body1" color="text.secondary">
                  {t("patient.dashboard.no_upcoming_appointments")}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              {t("patient.dashboard.recent_appointments")}
            </Typography>
            {recentAppointments && recentAppointments.length > 0 ? (
              <List>
                {recentAppointments.map((appointment, index) => (
                  <React.Fragment key={appointment.id}>
                    <ListItem>
                      <ListItemText
                        primary={`Dr. ${appointment} - ${appointment.specialty}`}
                        secondary={`${appointment.date} - ${appointment.purpose}`}
                      />
                    </ListItem>
                    {index < recentAppointments.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <EmptyState
                message={t("patient.dashboard.no_recent_appointments")}
              />
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              {t("patient.dashboard.medications")}
            </Typography>
            {medications && medications.length > 0 ? (
              <List>
                {medications.map((medication, index) => (
                  <React.Fragment key={medication.id}>
                    <ListItem>
                      <ListItemText
                        primary={`${medication.name} ${medication.dosage}`}
                        secondary={`${medication.instructions} - ${t(
                          "patient.dashboard.refills_remaining"
                        )}: ${medication.refillsRemaining}`}
                      />
                    </ListItem>
                    {index < medications.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <EmptyState message={t("patient.dashboard.no_medications")} />
            )}
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              {t("patient.dashboard.recent_medical_records")}
            </Typography>
            {medicalRecords && medicalRecords.length > 0 ? (
              <List>
                {medicalRecords.map((record, index) => (
                  <React.Fragment key={record.id}>
                    <ListItem>
                      <ListItemText
                        primary={record.title}
                        secondary={`${record.date} - ${record.description}`}
                      />
                      <Button
                        variant="outlined"
                        onClick={() =>
                          handleViewMedicalRecord(record.id, record.title)
                        }
                      >
                        {t("common.view")}
                      </Button>
                    </ListItem>
                    {index < medicalRecords.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <EmptyState message={t("patient.dashboard.no_medical_records")} />
            )}
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default PatientDashboard;
