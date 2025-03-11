import React from "react";
import { Typography, Paper, Grid, Card, CardContent } from "@mui/material";
import { useTranslation } from "react-i18next";

const DoctorDashboard: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <Typography variant="h4" gutterBottom>
        {t("doctor.dashboard.title")}
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                {t("doctor.dashboard.todays_appointments")}
              </Typography>
              <Typography variant="h3">8</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                {t("doctor.dashboard.total_patients")}
              </Typography>
              <Typography variant="h3">124</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                {t("doctor.dashboard.upcoming_appointments")}
              </Typography>
              <Typography variant="h3">15</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              {t("doctor.dashboard.upcoming_appointments")}
            </Typography>
            {/* <DoctorAppointmentList
              type="upcoming"
              status={["WAITING", "IN_PROGRESS"]}
              doctorId="doctor-001"
            /> */}
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default DoctorDashboard;
