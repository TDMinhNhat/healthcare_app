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
import { getAppoinmentStatusWithPatientId } from "../../services/appoinment_service";

interface AppointmentListProps {
  type: "upcoming" | "completed" | "cancelled";
  status: string | string[];
  patientId: string;
}

interface Appointment {
  doctor: {
    id: number;
    userId: string;
    firstName: string;
    lastName: string;
    specialization: string;
    avatar: string | null;
  };
  appointment: {
    id: number;
    patient: string;
    doctor: string;
    note: string | null;
    roomId: string;
    start: string;
    end: string;
    createdAt: string;
    status: string;
  };
}

const AppointmentList: React.FC<AppointmentListProps> = ({
  type,
  status,
  patientId,
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
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
      case "WAITING":
        return "warning";
      case "IN_PROGRESS":
        return "success";
      case "DONE":
        return "info";
      case "CANCELLED":
        return "error";
      default:
        return "default";
    }
  };

  // Function to format date from API response
  const formatAppointmentDate = (dateStr: string) => {
    try {
      // Example format: "01-03-2025-12-30-00"
      const parts = dateStr.split("-");
      if (parts.length >= 6) {
        const day = parseInt(parts[0]);
        const month = parseInt(parts[1]) - 1; // Month is 0-indexed in JS Date
        const year = parseInt(parts[2]);
        const hour = parseInt(parts[3]);
        const minute = parseInt(parts[4]);
        return new Date(year, month, day, hour, minute);
      }
      return new Date();
    } catch (error) {
      console.error("Error parsing date:", dateStr, error);
      return new Date();
    }
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        let allAppointments: Appointment[] = [];

        // If status is an array, fetch appointments for each status
        if (Array.isArray(status)) {
          for (const singleStatus of status) {
            const response = await getAppoinmentStatusWithPatientId(
              patientId,
              singleStatus
            );
            if (response.data.data) {
              allAppointments = [...allAppointments, ...response.data.data];
            }
          }
        } else {
          // Single status
          const response = await getAppoinmentStatusWithPatientId(
            patientId,
            status
          );
          if (response.data.data) {
            allAppointments = response.data.data;
          }
        }

        setAppointments(allAppointments);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [status, patientId]);

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
        {appointments.map((item) => {
          const appointment = item.appointment;
          const doctor = item.doctor;
          const appointmentDate = formatAppointmentDate(appointment.start);
          const appointmentEndDate = formatAppointmentDate(appointment.end);

          return (
            <Grid item xs={12} key={appointment.id}>
              <Card sx={{ display: "flex", width: "100%" }}>
                <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
                  <CardContent sx={{ flex: "1 0 auto", pb: 1 }}>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Avatar
                          src={doctor.avatar || ""}
                          sx={{ width: 56, height: 56, mr: 2 }}
                        >
                          {doctor.firstName.charAt(0) +
                            doctor.lastName.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography component="h6" variant="h6">
                            Dr. {doctor.firstName} {doctor.lastName}
                          </Typography>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                            gutterBottom
                          >
                            {doctor.specialization}
                          </Typography>
                          <Chip
                            label={t(
                              `patient.appointments.status.${appointment.status}`,
                              appointment.status
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
                            {format(appointmentDate, "EEEE, MMMM d, yyyy")}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <AccessTimeIcon
                            sx={{ mr: 1, color: "primary.main" }}
                          />
                          <Typography variant="body2">
                            {format(appointmentDate, "HH:mm")} -{" "}
                            {format(appointmentEndDate, "HH:mm")}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>

                    {appointment.note && (
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Note:</strong> {appointment.note}
                        </Typography>
                      </Box>
                    )}
                  </CardContent>

                  {(appointment.status === "WAITING" ||
                    appointment.status === "IN_PROGRESS") && (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        pl: 1,
                        pb: 1,
                      }}
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
          );
        })}
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
        {(appointments.find((a) => a.appointment.id === selectedAppointment)
          ?.appointment.status === "WAITING" ||
          appointments.find((a) => a.appointment.id === selectedAppointment)
            ?.appointment.status === "IN_PROGRESS") && (
          <>
            <MenuItem onClick={handleMenuClose}>
              {t("patient.appointments.reschedule")}
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              {t("patient.appointments.cancel_appointment")}
            </MenuItem>
          </>
        )}
      </Menu>
    </Box>
  );
};

export default AppointmentList;
