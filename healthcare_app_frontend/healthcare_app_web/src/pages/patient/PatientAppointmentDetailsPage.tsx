import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useSelector } from "react-redux";
import {
  Box,
  Typography,
  Grid,
  Chip,
  CircularProgress,
  Card,
  CardContent,
  Button,
  Avatar,
  Divider,
  Paper,
} from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonIcon from "@mui/icons-material/Person";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import DescriptionIcon from "@mui/icons-material/Description";
import MedicalRecordModal from "../../components/medical/MedicalRecordModal";
import { getAppointmentPatientDetail } from "../../services/booking_service";
import { formatTimeFromTimeString } from "../../utils/dateUtils";

/**
 * Trang hiển thị chi tiết cuộc hẹn khám bệnh của bệnh nhân
 * Hiển thị thông tin về cuộc hẹn, bác sĩ phụ trách, và cho phép xem hồ sơ y tế liên quan
 */
const PatientAppointmentDetailsPage: React.FC = () => {
  // Lấy ID cuộc hẹn từ URL params
  const { appointmentId } = useParams<{ appointmentId: string }>();
  // State lưu trữ thông tin cuộc hẹn
  const [appointment, setAppointment] = useState<any>(null);
  // State xác định trạng thái đang tải dữ liệu
  const [loading, setLoading] = useState(true);
  // State điều khiển hiển thị modal hồ sơ bệnh án
  const [isMedicalRecordOpen, setIsMedicalRecordOpen] =
    useState<boolean>(false);
  const user = useSelector((state: any) => state.user.user);

  const getStatus = (status: string) => {
    switch(status) {
      case "WAITING": return "Đang chờ";
      case "IN_PROGRESS": return "Đang khám";
      case "DONE": return "Đã hoàn thành";
      case "CANCEL": return "Đã hủy";
      default:
        return "default";
    }
  }

  useEffect(() => {
    // Mô phỏng gọi API
    const fetchAppointmentDetails = async () => {
      try {
        const result = await getAppointmentPatientDetail(user.userId, appointmentId).then(response => response.data.data).catch(error => {
          console.error("Lỗi khi tải thông tin cuộc hẹn:", error);
          setLoading(false);
        });

        const data = {
          id: result.work_schedule.id,
          date: result.work_schedule.dateAppointment,
          time: `${formatTimeFromTimeString(result.work_schedule.shift.start, "string")} - ${formatTimeFromTimeString(result.work_schedule.shift.end, "string")}`,
          location: "Phòng 302, Tòa nhà chính",
          status: getStatus(result.book_appointment.status),
          patientInfo: {
            id: 1,
            medicalId: result.book_appointment.numericalOrder,
            name: "Nguyễn Văn A",
            age: 45,
            gender: "Nam",
            reason: "Khám định kỳ",
          },
          doctorInfo: {
            id: result.work_schedule.doctor.userId,
            name: `${result.work_schedule.doctor.firstName} ${result.work_schedule.doctor.lastName}`,
            specialization: result.work_schedule.doctor.specialization,
            avatar: result.work_schedule.doctor.avatar,
          },
          hasMedicalRecord: true,
        }
        setAppointment(data);
        setLoading(false);

      } catch (error) {
        console.error("Lỗi khi tải thông tin cuộc hẹn:", error);
        setLoading(false);
      }
    };

    fetchAppointmentDetails();
  }, [appointmentId]);

  // Hiển thị trạng thái đang tải
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  // Hiển thị thông báo khi không tìm thấy thông tin cuộc hẹn
  if (!appointment) {
    return (
      <Box p={3}>
        <Typography variant="h5">Không tìm thấy thông tin cuộc hẹn</Typography>
      </Box>
    );
  }

  /**
   * Xác định màu cho trạng thái cuộc hẹn
   * @param status - Trạng thái cuộc hẹn
   * @returns Màu tương ứng với trạng thái
   */
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Đang khám":
        return "success";
      case "Đang chờ":
        return "warning";
      case "Đã hoàn thành":
        return "info";
      case "Đã hủy":
        return "error";
      default:
        return "default";
    }
  };

  /**
   * Mở modal hồ sơ bệnh án
   */
  const handleOpenMedicalRecord = () => {
    setIsMedicalRecordOpen(true);
  };

  /**
   * Đóng modal hồ sơ bệnh án
   */
  const handleCloseMedicalRecord = () => {
    setIsMedicalRecordOpen(false);
  };

  return (
    <Box p={3}>
      {/* Tiêu đề trang */}
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Chi tiết cuộc hẹn khám bệnh
      </Typography>

      {/* Thẻ thông tin chi tiết cuộc hẹn */}
      <Card elevation={3} sx={{ mb: 4 }}>
        <CardContent>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h5">
              Thông tin cuộc hẹn #{appointment.id}
            </Typography>
            {/* Hiển thị trạng thái cuộc hẹn */}
            <Chip
              label={appointment.status}
              color={getStatusColor(appointment.status) as any}
              sx={{ fontWeight: "bold" }}
            />
          </Box>

          {/* Hiển thị ID khám bệnh của bệnh nhân */}
          <Box mb={2}>
            <Chip
              label={`Số Thứ Tự Khám: ${appointment.patientInfo.medicalId}`}
              color="primary"
              sx={{
                fontWeight: "medium",
                fontSize: "1rem",
                py: 0.5,
                "& .MuiChip-label": { px: 2 },
              }}
            />
          </Box>

          {/* Thông tin chi tiết cuộc hẹn: ngày, giờ, địa điểm */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={4} display="flex" alignItems="center">
              <EventIcon sx={{ mr: 1, color: "primary.main" }} />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Ngày khám
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {appointment.date}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={4} display="flex" alignItems="center">
              <AccessTimeIcon sx={{ mr: 1, color: "primary.main" }} />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Thời gian
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {appointment.time}
                </Typography>
              </Box>
            </Grid>

            {/* <Grid item xs={12} md={4} display="flex" alignItems="center">
              <LocationOnIcon sx={{ mr: 1, color: "primary.main" }} />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Địa điểm
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {appointment.location}
                </Typography>
              </Box>
            </Grid> */}
          </Grid>

          {/* Lý do khám bệnh */}
          <Box mt={3}>
            <Typography variant="body2" color="text.secondary">
              Lý do khám bệnh
            </Typography>
            <Typography variant="body1">
              {appointment.patientInfo.reason}
            </Typography>
          </Box>

          {/* Nút xem hồ sơ y tế */}
          {appointment.hasMedicalRecord && (
            <Box mt={3} display="flex" justifyContent="flex-end">
              <Button
                variant="contained"
                startIcon={<DescriptionIcon />}
                onClick={handleOpenMedicalRecord}
              >
                Xem hồ sơ bệnh án
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Thông tin bác sĩ */}
      <Card elevation={3} sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Thông tin bác sĩ phụ trách
          </Typography>

          <Box display="flex" alignItems="flex-start" mt={2}>
            {/* Avatar bác sĩ */}
            <Avatar
              src={appointment.doctorInfo.avatar}
              alt={appointment.doctorInfo.name}
              sx={{ width: 80, height: 80, mr: 3 }}
            >
              <PersonIcon fontSize="large" />
            </Avatar>

            <Box>
              {/* Tên bác sĩ */}
              <Typography variant="h6" color="primary.main" fontWeight="bold">
                {appointment.doctorInfo.name}
              </Typography>

              {/* Chuyên khoa */}
              <Box display="flex" alignItems="center" mt={1}>
                <LocalHospitalIcon
                  fontSize="small"
                  sx={{ mr: 1, color: "text.secondary" }}
                />
                <Typography variant="body1">
                  {appointment.doctorInfo.specialization}
                </Typography>
              </Box>

              {/* Thông tin học vị */}
              <Typography variant="body2" color="text.secondary" mt={1}>
                {appointment.doctorInfo.degree}
              </Typography>

              {/* Kinh nghiệm */}
              <Typography variant="body2" color="text.secondary" mt={0.5}>
                {appointment.doctorInfo.experience}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Các lưu ý và hướng dẫn cho bệnh nhân */}
      <Paper elevation={1} sx={{ p: 3, bgcolor: "info.50" }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Lưu ý quan trọng:
        </Typography>
        <Typography variant="body2" paragraph>
          • Vui lòng đến trước giờ hẹn 15 phút để hoàn tất thủ tục đăng ký.
        </Typography>
        <Typography variant="body2" paragraph>
          • Mang theo giấy tờ tùy thân, thẻ bảo hiểm y tế (nếu có) và các kết
          quả xét nghiệm, chẩn đoán trước đó (nếu có).
        </Typography>
        <Typography variant="body2">
          • Nếu cần hủy hoặc thay đổi lịch hẹn, vui lòng thông báo trước ít nhất
          24 giờ qua hotline của bệnh viện.
        </Typography>
      </Paper>

      {/* Modal hồ sơ bệnh án */}
      <MedicalRecordModal
        open={isMedicalRecordOpen}
        onClose={handleCloseMedicalRecord}
        appointmentId={appointment?.patientInfo.id}
        roomId={appointment?.location}
        isDoctor={false}
      />
    </Box>
  );
};

export default PatientAppointmentDetailsPage;
