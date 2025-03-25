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

/**
 * Props cho component ConfirmAppointment
 * @param date - Ngày khám đã chọn
 * @param time - Thời gian khám đã chọn
 * @param doctor - Thông tin bác sĩ đã chọn
 * @param specialty - Thông tin dịch vụ/chuyên khoa đã chọn (tuỳ chọn)
 * @param onDone - Hàm callback khi người dùng hoàn tất quy trình đặt lịch
 */
interface ConfirmAppointmentProps {
  date: Date;
  time: string;
  doctor: any;
  specialty?: any; // Giờ đại diện cho dịch vụ
  onDone: () => void;
}

/**
 * Component hiển thị màn hình xác nhận đặt lịch thành công
 * Hiển thị tóm tắt thông tin cuộc hẹn: ngày, giờ, bác sĩ và dịch vụ
 */
const ConfirmAppointment: React.FC<ConfirmAppointmentProps> = ({
  date,
  time,
  doctor,
  specialty, // Giờ đại diện cho dịch vụ
  onDone,
}) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ textAlign: "center", py: 3 }}>
      {/* Biểu tượng đặt lịch thành công */}
      <CheckCircleIcon sx={{ fontSize: 64, color: "success.main", mb: 2 }} />

      {/* Thông báo đặt lịch thành công */}
      <Typography variant="h5" gutterBottom>
        {t("patient.appointments.booking_successful")}
      </Typography>

      <Typography variant="body1" color="text.secondary" paragraph>
        {t("patient.appointments.booking_confirmation_message")}
      </Typography>

      {/* Khung hiển thị chi tiết cuộc hẹn */}
      <Paper sx={{ maxWidth: 600, mx: "auto", mt: 4, p: 3 }}>
        <Typography variant="h6" gutterBottom>
          {t("patient.appointments.appointment_details")}
        </Typography>
        <Divider sx={{ mb: 2 }} />

        {/* Danh sách các thông tin chi tiết */}
        <List>
          {/* Ngày khám */}
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <EventIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={t("patient.appointments.date")}
              secondary={date.toLocaleDateString()}
            />
          </ListItem>

          {/* Giờ khám */}
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <AccessTimeIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={t("patient.appointments.time")}
              secondary={time.start + " - " + time.end}
            />
          </ListItem>

          {/* Thông tin bác sĩ */}
          <ListItem>
            <ListItemAvatar>
              <Avatar src={doctor.avatar ?? ""}>
                <PersonIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={t("patient.appointments.doctor")}
              secondary={`${doctor.firstName} ${doctor.lastName}`}
            />
          </ListItem>

          {/* Thông tin dịch vụ (hiển thị nếu có) */}
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

      {/* Nút quay lại trang lịch hẹn */}
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
