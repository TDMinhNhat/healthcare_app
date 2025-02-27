import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Avatar,
  CircularProgress,
  Divider,
  IconButton,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import EventIcon from "@mui/icons-material/Event";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

interface AppointmentListProps {
  type: "upcoming" | "past" | "cancelled";
}

// Mock appointment data
const mockAppointments = {
  upcoming: [
    {
      id: 101,
      doctorName: "Dr. Nguyen Van A",
      doctorSpecialty: "Cardiology",
      doctorImage: "https://randomuser.me/api/portraits/men/1.jpg",
      date: new Date(2023, 11, 25),
      time: "10:00",
      status: "confirmed",
    },
    {
      id: 102,
      doctorName: "Dr. Tran Thi B",
      doctorSpecialty: "Neurology",
      doctorImage: "https://randomuser.me/api/portraits/women/2.jpg",
      date: new Date(2023, 11, 28),
      time: "14:30",
      status: "pending",
    },
  ],
  past: [
    {
      id: 103,
      doctorName: "Dr. Nguyen Van A",
      doctorSpecialty: "Cardiology",
      doctorImage: "https://randomuser.me/api/portraits/men/1.jpg",
      date: new Date(2023, 10, 15),
      time: "09:00",
      status: "completed",
    },
    {
      id: 104,
      doctorName: "Dr. Le Van C",
      doctorSpecialty: "Dermatology",
      doctorImage: "https://randomuser.me/api/portraits/men/3.jpg",
      date: new Date(2023, 10, 10),
      time: "11:30",
      status: "completed",
    },
  ],
  cancelled: [
    {
      id: 105,
      doctorName: "Dr. Pham Thi D",
      doctorSpecialty: "Pediatrics",
      doctorImage: "https://randomuser.me/api/portraits/women/4.jpg",
      date: new Date(2023, 11, 5),
      time: "15:00",
      status: "cancelled",
    },
  ],
};

const AppointmentList: React.FC<AppointmentListProps> = ({ type }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<number | null>(
    null
  );

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    appointmentId: number
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedAppointment(appointmentId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedAppointment(null);
  };

  // Function to get status chip color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "success";
      case "pending":
        return "warning";
      case "cancelled":
        return "error";
      case "completed":
        return "info";
      default:
        return "default";
    }
  };

  useEffect(() => {
    // Simulate API call
    const fetchAppointments = async () => {
      setLoading(true);
      // In a real app, you would fetch this data from your API
      // const response = await api.getAppointments(type);
      setTimeout(() => {
        setAppointments(mockAppointments[type] || []);
        setLoading(false);
      }, 1000);
    };

    fetchAppointments();
  }, [type]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (appointments.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography variant="body1" color="text.secondary">
          {t("patient.appointments.no_appointments")}
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Grid container spacing={3}>
        {appointments.map((appointment) => (
          <Grid item xs={12} key={appointment.id}>
            <Card sx={{ display: "flex", width: "100%" }}>
              <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
                <CardContent sx={{ flex: "1 0 auto", pb: 1 }}>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar
                        src={appointment.doctorImage}
                        sx={{ width: 56, height: 56, mr: 2 }}
                      />
                      <Box>
                        <Typography component="h6" variant="h6">
                          {appointment.doctorName}
                        </Typography>
                        <Typography
                          variant="subtitle2"
                          color="text.secondary"
                          gutterBottom
                        >
                          {appointment.doctorSpecialty}
                        </Typography>
                        <Chip
                          label={t(
                            `patient.appointments.status.${appointment.status}`
                          )}
                          size="small"
                          color={getStatusColor(appointment.status) as any}
                        />
                      </Box>
                    </Box>

                    <Box>
                      <IconButton
                        aria-label="more"
                        onClick={(e) => handleMenuClick(e, appointment.id)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <EventIcon sx={{ mr: 1, color: "primary.main" }} />
                        <Typography variant="body2">
                          {format(appointment.date, "EEEE, MMMM d, yyyy")}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <AccessTimeIcon sx={{ mr: 1, color: "primary.main" }} />
                        <Typography variant="body2">
                          {appointment.time}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>

                {type === "upcoming" && appointment.status !== "cancelled" && (
                  <Box
                    sx={{ display: "flex", alignItems: "center", pl: 1, pb: 1 }}
                  >
                    <Button size="small" color="error" sx={{ ml: 1 }}>
                      {t("patient.appointments.cancel_appointment")}
                    </Button>
                    <Button size="small" color="primary" sx={{ ml: 1 }}>
                      {t("patient.appointments.reschedule")}
                    </Button>
                  </Box>
                )}
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Menu
        id="appointment-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={handleMenuClose}>{t("common.view")}</MenuItem>
        {type === "upcoming" && (
          <MenuItem onClick={handleMenuClose}>
            {t("patient.appointments.reschedule")}
          </MenuItem>
        )}
        {type === "upcoming" && (
          <MenuItem onClick={handleMenuClose}>
            {t("patient.appointments.cancel_appointment")}
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
};

export default AppointmentList;
