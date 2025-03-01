import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  Paper,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useTranslation } from "react-i18next";
import BookAppointment from "../../components/appointments/BookAppointment";
import AppointmentList from "../../components/appointments/AppointmentList";
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
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const AppointmentPage = () => {
  const { t } = useTranslation();
  const [tabValue, setTabValue] = useState(0);
  const [showBooking, setShowBooking] = useState(false);
  const user = useSelector((state: any) => state.user.user);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleBookingClick = () => {
    setShowBooking(true);
  };

  const handleBookingClose = () => {
    setShowBooking(false);
  };

  // Define status mapping for each tab
  const getStatusForTab = (tabIndex: number) => {
    switch (tabIndex) {
      case 0: // Upcoming - includes WAITING and IN_PROGRESS
        return ["WAITING", "IN_PROGRESS"];
      case 1: // Completed - DONE
        return "DONE";
      case 2: // Cancelled - CANCELLED
        return "CANCELLED";
      default:
        return ["WAITING", "IN_PROGRESS"];
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5" component="h1">
          {t("patient.appointments.title")}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleBookingClick}
          disabled={showBooking}
        >
          {t("patient.appointments.book_new")}
        </Button>
      </Box>

      {showBooking ? (
        <Paper sx={{ p: 3, mb: 3 }}>
          <BookAppointment
            onClose={handleBookingClose}
            patientId={user.userId}
          />
        </Paper>
      ) : (
        <>
          <Paper sx={{ width: "100%", mb: 3 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="appointment tabs"
            >
              <Tab label={t("patient.appointments.upcoming")} />
              <Tab label={t("patient.appointments.completed")} />
              <Tab label={t("patient.appointments.cancelled")} />
            </Tabs>
            <Divider />

            <TabPanel value={tabValue} index={0}>
              <AppointmentList
                type="upcoming"
                status={getStatusForTab(0)}
                patientId={user.userId}
              />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <AppointmentList
                type="completed"
                status={getStatusForTab(1)}
                patientId={user.userId}
              />
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
              <AppointmentList
                type="cancelled"
                status={getStatusForTab(2)}
                patientId={user.userId}
              />
            </TabPanel>
          </Paper>
        </>
      )}
    </Box>
  );
};

export default AppointmentPage;
