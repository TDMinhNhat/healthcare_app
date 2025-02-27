import React from "react";
import { PatientLayout } from "../layouts/PatientLayout";
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
} from "@mui/material";
import { useTranslation } from "react-i18next";

const PatientDashboard: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <Typography variant="h4" gutterBottom>
        {t("patient.dashboard.welcome")} Patient Name
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h5" component="div">
                {t("patient.dashboard.next_appointment")}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Dr. Smith - General Checkup - June 15, 2023 at 10:00 AM
              </Typography>
              <Button variant="contained" color="primary">
                {t("patient.dashboard.view_details")}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              {t("patient.dashboard.recent_appointments")}
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="Dr. Johnson - Cardiology"
                  secondary="May 2, 2023 - Follow-up consultation"
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Dr. Williams - General Practice"
                  secondary="April 15, 2023 - Annual physical"
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Dr. Davis - Dermatology"
                  secondary="March 28, 2023 - Skin assessment"
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              {t("patient.dashboard.medications")}
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="Lisinopril 10mg"
                  secondary="Take 1 tablet daily - Refills remaining: 2"
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Metformin 500mg"
                  secondary="Take 1 tablet twice daily - Refills remaining: 3"
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Atorvastatin 20mg"
                  secondary="Take 1 tablet at bedtime - Refills remaining: 5"
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              {t("patient.dashboard.recent_medical_records")}
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="Blood Test Results"
                  secondary="May 5, 2023 - Complete Blood Count"
                />
                <Button variant="outlined">{t("common.view")}</Button>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="X-Ray Report"
                  secondary="April 18, 2023 - Chest X-Ray"
                />
                <Button variant="outlined">{t("common.view")}</Button>
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default PatientDashboard;
