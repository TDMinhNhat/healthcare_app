import React from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EventIcon from "@mui/icons-material/Event";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonIcon from "@mui/icons-material/Person";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";

interface ConfirmAppointmentProps {
  date: Date;
  time: string;
  doctor: any;
  specialty?: any; // Now represents a service
  onDone: () => void;
}

const ConfirmAppointment: React.FC<ConfirmAppointmentProps> = ({
  date,
  time,
  doctor,
  specialty, // Now represents a service
  onDone,
}) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ textAlign: "center", py: 3 }}>
      <CheckCircleIcon sx={{ fontSize: 64, color: "success.main", mb: 2 }} />

      <Typography variant="h5" gutterBottom>
        {t("patient.appointments.booking_successful")}
      </Typography>

      <Typography variant="body1" color="text.secondary" paragraph>
        {t("patient.appointments.booking_confirmation_message")}
      </Typography>

      <Paper sx={{ maxWidth: 600, mx: "auto", mt: 4, p: 3 }}>
        <Typography variant="h6" gutterBottom>
          {t("patient.appointments.appointment_details")}
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <List>
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <EventIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={t("patient.appointments.date")}
              secondary={format(date, "EEEE, MMMM d, yyyy")}
            />
          </ListItem>

          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <AccessTimeIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={t("patient.appointments.time")}
              secondary={time.time}
            />
          </ListItem>

          <ListItem>
            <ListItemAvatar>
              <Avatar src={doctor.avatar ?? ""}>
                <PersonIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={t("patient.appointments.doctor")}
              secondary={`${doctor.firstName} + ' ' ${doctor.lastName} - ${doctor.specialization}`}
            />
          </ListItem>

          {specialty && (
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <LocalHospitalIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={t("patient.appointments.service")}
                secondary={specialty.name}
              />
            </ListItem>
          )}
        </List>
      </Paper>

      <Box sx={{ mt: 4 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={onDone}
          size="large"
        >
          {t("patient.appointments.back_to_appointments")}
        </Button>
      </Box>
    </Box>
  );
};

export default ConfirmAppointment;
