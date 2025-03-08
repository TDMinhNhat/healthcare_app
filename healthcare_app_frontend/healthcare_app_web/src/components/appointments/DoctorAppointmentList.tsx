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
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import EventIcon from "@mui/icons-material/Event";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import NoteAltIcon from "@mui/icons-material/NoteAlt";
import PersonIcon from "@mui/icons-material/Person";
import AssignmentIcon from "@mui/icons-material/Assignment";
import EditIcon from "@mui/icons-material/Edit";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useNavigate } from "react-router";
import { ROUTING } from "../../constants/routing";
import MedicalRecordModal from "../medical/MedicalRecordModal";
import { getAppointmentDoctor, getAppointmentStatusWithDoctorId } from "../../services/appointment_service";
import { parseDateTimeFromString, formatTimeFromDateTime } from "../../utils/dateUtils";

interface DoctorAppointmentListProps {
  type: "upcoming" | "completed" | "cancelled";
  status: string | string[];
  doctorId: string;
}

interface Appointment {
  patient: {
    id: number;
    userId: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
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

const DoctorAppointmentList: React.FC<DoctorAppointmentListProps> = ({
  type,
  status,
  doctorId,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<number | null>(
    null
  );
  const [notesDialogOpen, setNotesDialogOpen] = useState(false);
  const [appointmentNotes, setAppointmentNotes] = useState("");
  const [currentAppointment, setCurrentAppointment] =
    useState<Appointment | null>(null);
  const [medicalRecordModalOpen, setMedicalRecordModalOpen] = useState(false);
  const [selectedMedicalRecordId, setSelectedMedicalRecordId] = useState<
    number | null
  >(null);

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    appointment: Appointment
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedAppointment(appointment.appointment.id);
    setCurrentAppointment(appointment);
    setAppointmentNotes(appointment.appointment.note || "");
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOpenNotesDialog = () => {
    setNotesDialogOpen(true);
    handleMenuClose();

    // Thêm một chút delay để đảm bảo dialog hiển thị trước khi focus
    setTimeout(() => {
      // Focus vào TextField trong dialog
      const textField = document.querySelector('[role="dialog"] textarea');
      if (textField) {
        (textField as HTMLElement).focus();
      }
    }, 100);
  };

  const handleCloseNotesDialog = () => {
    setNotesDialogOpen(false);
  };

  const handleSaveNotes = async () => {
    // API call to save notes would go here
    console.log(
      `Saving notes for appointment ${selectedAppointment}:`,
      appointmentNotes
    );

    // Update local state (in a real app, you'd update after API success)
    if (currentAppointment) {
      const updatedAppointments = appointments.map((appt) => {
        if (appt.appointment.id === currentAppointment.appointment.id) {
          return {
            ...appt,
            appointment: {
              ...appt.appointment,
              note: appointmentNotes,
            },
          };
        }
        return appt;
      });

      setAppointments(updatedAppointments);
    }

    handleCloseNotesDialog();
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

  const handleStatusChange = async (
    appointmentId: number,
    newStatus: string
  ) => {
    // In a real app, this would call an API to update the status
    console.log(`Changing appointment ${appointmentId} status to ${newStatus}`);

    // Update local state (in a real app, you'd update after API success)
    const updatedAppointments = appointments.map((appt) => {
      if (appt.appointment.id === appointmentId) {
        return {
          ...appt,
          appointment: {
            ...appt.appointment,
            status: newStatus,
          },
        };
      }
      return appt;
    });

    setAppointments(updatedAppointments);
    handleMenuClose();
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
          const result = await getAppointmentDoctor(doctorId).then(response => response.data.data).catch(error => {
            console.log(error);
            return null;
          })

          allAppointments = result.map((item: object) => ({
            "patient": {
              "id": item.patient.id,
              "userId": item.patient.userId,
              "firstName": item.patient.firstName,
              "lastName": item.patient.lastName,
              "dateOfBirth": item.patient.dob,
              "gender": item.patient.sex ? "Nữ" : "Nam",
              "avatar": item.patient.avatar
            },
            "appointment": {
              "id": item.appointment.id,
              "patient": item.appointment.patient,
              "doctor": doctorId,
              "note": item.appointment.note,
              "roomId": item.appointment.roomId,
              "start": formatTimeFromDateTime(parseDateTimeFromString(item.appointment.start)),
              "end": formatTimeFromDateTime(parseDateTimeFromString(item.appointment.end)),
              "createdAt": item.appointment.createdAt,
              "status": item.appointment.status
            }
          }))

        } else {
          const result = await getAppointmentStatusWithDoctorId(doctorId, status).then(response => response.data.data).catch(error => {
            console.log(error);
            return null;
          })

          allAppointments = result.map((item: object) => ({
            "patient": {
              "id": item.patient.id,
              "userId": item.patient.userId,
              "firstName": item.patient.firstName,
              "lastName": item.patient.lastName,
              "dateOfBirth": item.patient.dob,
              "gender": item.patient.sex ? "Nữ" : "Nam",
              "avatar": item.patient.avatar
            },
            "appointment": {
              "id": item.appointment.id,
              "patient": item.appointment.patient,
              "doctor": doctorId,
              "note": item.appointment.note,
              "roomId": item.appointment.roomId,
              "start": formatTimeFromDateTime(parseDateTimeFromString(item.appointment.start)),
              "end": formatTimeFromDateTime(parseDateTimeFromString(item.appointment.end)),
              "createdAt": item.appointment.createdAt,
              "status": item.appointment.status
            }
          }))
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
  }, [status, doctorId]);

  const handleViewPatientDetails = () => {
    if (currentAppointment) {
      navigate(
        `/doctor/${ROUTING.MEDICAL_RECORDS}/${currentAppointment.appointment.id}`
      );
      handleMenuClose();
    }
  };

  const handleViewMedicalRecord = (appointmentId: number) => {
    setSelectedMedicalRecordId(appointmentId);
    setMedicalRecordModalOpen(true);
  };

  // Modify the existing handleViewMedicalRecord to use the modal
  const handleViewMedicalRecordMenu = () => {
    if (currentAppointment) {
      handleViewMedicalRecord(currentAppointment.appointment.id);
      handleMenuClose();
    }
  };

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
          {t("doctor.appointments.no_appointments", "No appointments found")}
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Grid container spacing={3}>
        {appointments.map((item) => {
          const appointment = item.appointment;
          const patient = item.patient;
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
                          src={patient?.avatar || "https://picsum.photos/56/56"}
                          sx={{ width: 56, height: 56, mr: 2 }}
                        >
                          {patient?.firstName.charAt(0) +
                            patient?.lastName.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography component="h6" variant="h6">
                            {patient?.firstName} {patient?.lastName}
                          </Typography>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                            gutterBottom
                          >
                            {/* Thay hiển thị mã bệnh nhân bằng thông tin về giới tính và ngày sinh */}
                            {patient?.gender} • {patient?.dateOfBirth}
                          </Typography>
                          <Chip
                            label={t(
                              `doctor.appointments.status.${appointment?.status}`,
                              appointment.status
                            )}
                            size="small"
                            color={getStatusColor(appointment.status) as any}
                          />
                        </Box>
                      </Box>

                      <Box>
                        {appointment.note && (
                          <Badge color="primary" variant="dot" sx={{ mr: 1 }}>
                            <IconButton
                              aria-label="notes"
                              onClick={() => {
                                setCurrentAppointment(item);
                                setAppointmentNotes(appointment.note || "");
                                setNotesDialogOpen(true);
                              }}
                            >
                              <NoteAltIcon />
                            </IconButton>
                          </Badge>
                        )}
                        <IconButton
                          aria-label="more"
                          onClick={(e) => handleMenuClick(e, item)}
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
                      {appointment.status === "WAITING" && (
                        <Button
                          size="small"
                          color="primary"
                          sx={{ ml: 1 }}
                          onClick={() =>
                            handleStatusChange(appointment.id, "IN_PROGRESS")
                          }
                        >
                          {t(
                            "doctor.appointments.start_appointment",
                            "Start Appointment"
                          )}
                        </Button>
                      )}
                      {appointment.status === "IN_PROGRESS" && (
                        <Button
                          size="small"
                          color="success"
                          sx={{ ml: 1 }}
                          onClick={() =>
                            handleStatusChange(appointment.id, "DONE")
                          }
                        >
                          {t(
                            "doctor.appointments.complete_appointment",
                            "Complete Appointment"
                          )}
                        </Button>
                      )}
                      <Button
                        size="small"
                        startIcon={<AssignmentIcon />}
                        sx={{ ml: 1 }}
                        onClick={() => handleViewMedicalRecord(appointment.id)}
                      >
                        {t(
                          "doctor.appointments.view_medical_record",
                          "View Medical Record"
                        )}
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        sx={{ ml: 1 }}
                        onClick={() =>
                          handleStatusChange(appointment.id, "CANCELLED")
                        }
                      >
                        {t("doctor.appointments.cancel", "Cancel")}
                      </Button>
                    </Box>
                  )}

                  {(appointment.status === "DONE" ||
                    appointment.status === "CANCELLED") && (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        pl: 1,
                        pb: 1,
                      }}
                    >
                      <Button
                        size="small"
                        startIcon={<AssignmentIcon />}
                        sx={{ ml: 1 }}
                        onClick={() => handleViewMedicalRecord(appointment.id)}
                      >
                        {t(
                          "doctor.appointments.view_medical_record",
                          "View Medical Record"
                        )}
                      </Button>
                    </Box>
                  )}
                </Box>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Menu for appointment actions */}
      <Menu
        id="appointment-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        MenuListProps={{
          "aria-labelledby": "appointment-actions",
          autoFocusItem: true, // Tự động focus vào menu item đầu tiên
        }}
      >
        <MenuItem onClick={handleViewMedicalRecordMenu}>
          {t("doctor.appointments.view_medical_record", "View Medical Record")}
        </MenuItem>
        <MenuItem onClick={handleOpenNotesDialog}>
          {t("doctor.appointments.view_edit_notes", "View/Edit Notes")}
        </MenuItem>
        <MenuItem onClick={handleViewPatientDetails}>
          {t(
            "doctor.appointments.view_patient_details",
            "View Patient Details"
          )}
        </MenuItem>
        {/* ...existing menu items... */}
      </Menu>

      {/* Add the medical record modal */}
      <MedicalRecordModal
        open={medicalRecordModalOpen}
        onClose={() => setMedicalRecordModalOpen(false)}
        appointmentId={selectedMedicalRecordId}
        roomId={currentAppointment?.appointment.roomId}
        isDoctor={true}
      />

      {/* Dialog for notes */}
      <Dialog
        open={notesDialogOpen}
        onClose={handleCloseNotesDialog}
        fullWidth
        maxWidth="sm"
        // Thêm các props cho quản lý focus
        disableEnforceFocus={false}
        autoFocus
        // Đảm bảo trả focus lại cho nút mở dialog sau khi đóng
        TransitionProps={{
          onExited: () => {
            const noteButton = document.querySelector(
              `button[aria-label="notes"]`
            );
            if (noteButton) {
              (noteButton as HTMLElement).focus();
            }
          },
        }}
      >
        <DialogTitle>
          {t("doctor.appointments.appointment_notes", "Appointment Notes")}
        </DialogTitle>
        <DialogContent>
          <TextField
            multiline
            rows={5}
            fullWidth
            value={appointmentNotes}
            onChange={(e) => setAppointmentNotes(e.target.value)}
            placeholder={t(
              "doctor.appointments.notes_placeholder",
              "Enter notes about the patient's condition, diagnosis, or treatment plan..."
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseNotesDialog} color="inherit">
            {t("common.cancel", "Cancel")}
          </Button>
          <Button onClick={handleSaveNotes} variant="contained" color="primary">
            {t("common.save", "Save")}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DoctorAppointmentList;
