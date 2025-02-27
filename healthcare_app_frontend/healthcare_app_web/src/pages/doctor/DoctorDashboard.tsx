import React from "react";
import {
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
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
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              {t("doctor.dashboard.upcoming_appointments")}
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="John Doe"
                  secondary="Today, 10:00 AM - Regular Checkup"
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Jane Smith"
                  secondary="Today, 11:30 AM - Follow-up"
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Robert Johnson"
                  secondary="Today, 2:00 PM - Initial Consultation"
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              {t("doctor.dashboard.recent_patient_updates")}
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="Test Results Available"
                  secondary="For: Mary Williams - Blood work results are ready for review"
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Prescription Refill Request"
                  secondary="From: Thomas Brown - Requesting hypertension medication refill"
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default DoctorDashboard;
