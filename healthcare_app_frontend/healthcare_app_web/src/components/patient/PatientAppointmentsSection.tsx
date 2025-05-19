import React from "react";
import { Typography, Box, Divider, Paper, Chip, Avatar } from "@mui/material";
import { ProfileCard } from "../profile/ProfileCard";
import EventIcon from "@mui/icons-material/Event";
import { Appointment } from "../../types/appointment";

interface PatientAppointmentsProps {
  appointments: Appointment[];
}

export const PatientAppointmentsSection: React.FC<PatientAppointmentsProps> = ({
  appointments,
}) => {
  // const getStatusColor = (status: string) => {
  //   switch (status) {
  //     case "upcoming":
  //       return "info";
  //     case "completed":
  //       return "success";
  //     case "cancelled":
  //       return "error";
  //     default:
  //       return "default";
  //   }
  // };

  return (
    <ProfileCard title="Recent Appointments">
      <Divider sx={{ my: 2 }} />
      {appointments.length ? (
        appointments.map((appointment) => (
          <Paper
            key={appointment.id}
            elevation={0}
            sx={{
              p: 2,
              mb: 2,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Box display="flex" alignItems="center">
                <EventIcon color="primary" sx={{ mr: 1 }} />
                <Box>
                  <Typography variant="subtitle1">
                    {new Date(appointment.start).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(appointment.start).toLocaleTimeString()} -
                    {new Date(appointment.end).toLocaleTimeString()}
                  </Typography>
                </Box>
              </Box>
              {/* <Chip 
                label={appointment.status} 
                color={getStatusColor(appointment.status) as any} 
                size="small" 
              /> */}
            </Box>
            <Box display="flex" alignItems="center" mb={1}>
              <Avatar
                src={"https://randomuser.me/api/portraits/men/41.jpg"}
                alt={
                  appointment.doctor.firstName +
                  " " +
                  appointment.doctor.lastName
                }
                sx={{ mr: 1, width: 32, height: 32 }}
              />
              <Box>
                <Typography variant="h6">
                  {appointment.doctor.lastName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {appointment.doctor.specialization}
                </Typography>
              </Box>
            </Box>
            {appointment.note && (
              <Typography variant="body2" mt={1}>
                Note: {appointment.note}
              </Typography>
            )}
          </Paper>
        ))
      ) : (
        <Typography variant="body1" color="text.secondary" align="center">
          No appointments scheduled
        </Typography>
      )}
    </ProfileCard>
  );
};
