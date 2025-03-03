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
import MenuItem from "@mui/material/Menu";

// Mock data for patient appointments
const MOCK_PATIENT_APPOINTMENTS: {
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
}[] = [
  {
    doctor: {
      id: 1,
      userId: "doctor-001",
      firstName: "Thành",
      lastName: "Nguyễn Bá",
      specialization: "Tim Mạch",
      avatar: null,
    },
    appointment: {
      id: 101,
      patient: "patient-001",
      doctor: "doctor-001",
      note: "Khám sức khỏe tim mạch định kỳ",
      roomId: "room-001",
      start: "20-07-2023-09-00-00",
      end: "20-07-2023-09-30-00",
      createdAt: "15-07-2023",
      status: "WAITING",
    },
  },
  {
    doctor: {
      id: 2,
      userId: "doctor-002",
      firstName: "Mai",
      lastName: "Trần Thị",
      specialization: "Da Liễu",
      avatar: null,
    },
    appointment: {
      id: 102,
      patient: "patient-001",
      doctor: "doctor-002",
      note: "Tái khám về vấn đề dị ứng da",
      roomId: "room-002",
      start: "21-07-2023-10-00-00",
      end: "21-07-2023-10-30-00",
      createdAt: "16-07-2023",
      status: "IN_PROGRESS",
    },
  },
  {
    doctor: {
      id: 3,
      userId: "doctor-003",
      firstName: "Tuấn",
      lastName: "Vũ Văn",
      specialization: "Thần Kinh",
      avatar: null,
    },
    appointment: {
      id: 103,
      patient: "patient-001",
      doctor: "doctor-003",
      note: "Tư vấn về chứng đau đầu mãn tính",
      roomId: "room-003",
      start: "15-07-2023-14-00-00",
      end: "15-07-2023-14-30-00",
      createdAt: "10-07-2023",
      status: "DONE",
    },
  },
  {
    doctor: {
      id: 4,
      userId: "doctor-004",
      firstName: "Hà",
      lastName: "Lê Thị",
      specialization: "Chấn Thương Chỉnh Hình",
      avatar: null,
    },
    appointment: {
      id: 104,
      patient: "patient-001",
      doctor: "doctor-004",
      note: "Khám và điều trị đau đầu gối",
      roomId: "room-004",
      start: "10-07-2023-11-00-00",
      end: "10-07-2023-11-30-00",
      createdAt: "05-07-2023",
      status: "CANCELLED",
    },
  },
  {
    doctor: {
      id: 5,
      userId: "doctor-005",
      firstName: "Quang",
      lastName: "Phạm Văn",
      specialization: "Tai Mũi Họng",
      avatar: null,
    },
    appointment: {
      id: 105,
      patient: "patient-001",
      doctor: "doctor-005",
      note: "Thăm khám triệu chứng viêm họng",
      roomId: "room-005",
      start: "25-07-2023-13-00-00",
      end: "25-07-2023-13-30-00",
      createdAt: "20-07-2023",
      status: "WAITING",
    },
  },
];

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

        // Sử dụng mock data và lọc theo status
        if (Array.isArray(status)) {
          allAppointments = MOCK_PATIENT_APPOINTMENTS.filter((appointment) =>
            status.includes(appointment.appointment.status)
          );
        } else {
          allAppointments = MOCK_PATIENT_APPOINTMENTS.filter(
            (appointment) => appointment.appointment.status === status
          );
        }

        // Bỏ setTimeout để tránh vấn đề load mãi không dừng
        setAppointments(allAppointments);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setAppointments([]);
        setLoading(false);
      }
    };

    // Gọi hàm fetch ngay lập tức
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
                          src={doctor?.avatar || "https://picsum.photos/56/56"}
                          sx={{ width: 56, height: 56, mr: 2 }}
                        >
                          {doctor?.firstName.charAt(0) +
                            doctor?.lastName.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography component="h6" variant="h6">
                            Dr. {doctor?.firstName} {doctor?.lastName}
                          </Typography>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                            gutterBottom
                          >
                            {doctor?.specialization}
                          </Typography>
                          <Chip
                            label={t(
                              `patient.appointments.status.${appointment?.status}`,
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
