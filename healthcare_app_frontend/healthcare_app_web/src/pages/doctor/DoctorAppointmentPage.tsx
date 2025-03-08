import React, { useState } from "react";
import { Box, Typography, Tabs, Tab, Paper, Container } from "@mui/material";
import { useTranslation } from "react-i18next";
import DoctorAppointmentList from "../../components/appointments/DoctorAppointmentList";
import { useSelector } from "react-redux";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`appointment-tabpanel-${index}`}
      aria-labelledby={`appointment-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `appointment-tab-${index}`,
    "aria-controls": `appointment-tabpanel-${index}`,
  };
}

const DoctorAppointmentPage = () => {
  const { t } = useTranslation();
  const [tabValue, setTabValue] = useState(0);
  const user = useSelector((state: any) => state.user.user);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {t("doctor.appointments.title", "Appointments")}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t(
            "doctor.appointments.subtitle",
            "View and manage your appointments with patients"
          )}
        </Typography>
      </Box>

      <Paper sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="appointment tabs"
            variant="fullWidth"
          >
            <Tab
              label={t("doctor.appointments.tabs.upcoming", "Upcoming")}
              {...a11yProps(0)}
            />
            <Tab
              label={t("doctor.appointments.tabs.completed", "Completed")}
              {...a11yProps(1)}
            />
            <Tab
              label={t("doctor.appointments.tabs.cancelled", "Cancelled")}
              {...a11yProps(2)}
            />
          </Tabs>
        </Box>

        <Box sx={{ p: 3 }}>
          <TabPanel value={tabValue} index={0}>
            <DoctorAppointmentList
              type="upcoming"
              status={["WAITING", "IN_PROGRESS"]}
              doctorId={user?.user.userId || ""}
            />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <DoctorAppointmentList
              type="completed"
              status="DONE"
              doctorId={user?.user.userId || ""}
            />
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            <DoctorAppointmentList
              type="cancelled"
              status="CANCELLED"
              doctorId={user?.user.userId || ""}
            />
          </TabPanel>
        </Box>
      </Paper>
    </Container>
  );
};

export default DoctorAppointmentPage;
