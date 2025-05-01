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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tooltip,
} from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonIcon from "@mui/icons-material/Person";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import DescriptionIcon from "@mui/icons-material/Description";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import CancelIcon from "@mui/icons-material/Cancel";
import MedicalRecordModal from "../../components/medical/MedicalRecordModal";
import {
  getAppointmentPatientDetail,
  cancelAppointment,
} from "../../services/appointment/booking_service";
import {
  formatTimeFromTimeString,
  parseDateTimeFromString,
} from "../../utils/dateUtils";
import { useNavigate } from "react-router";
import { ROUTING } from "../../constants/routing";
import { getPatientBankAccount } from "../../services/authenticate/user_service";

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
  const navigate = useNavigate();
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [cancellationSuccess, setCancellationSuccess] = useState(false);
  const [hasBankAccount, setHasBankAccount] = useState<boolean>(false);

  const getStatus = (status: string) => {
    switch (status) {
      case "WAITING":
        return "Đang chờ";
      case "IN_PROGRESS":
        return "Đang khám";
      case "DONE":
        return "Đã hoàn thành";
      case "CANCELLED":
        return "Đã hủy";
      default:
        return "default";
    }
  };

  const fetchAppointmentDetails = async () => {
    try {
      const result = await getAppointmentPatientDetail(
        user.userId,
        appointmentId
      )
        .then((response) => response.data.data)
        .catch((error) => {
          console.error("Lỗi khi tải thông tin cuộc hẹn:", error);
          setLoading(false);
        });

      const data = {
        id: result.book_appointment.id,
        workScheduleId: result.work_schedule.id,
        date: result.work_schedule.dateAppointment,
        time: `${formatTimeFromTimeString(
          result.work_schedule.shift.start,
          "string"
        )} - ${formatTimeFromTimeString(
          result.work_schedule.shift.end,
          "string"
        )}`,
        // location: "Phòng 302, Tòa nhà chính",
        status: getStatus(result.book_appointment.status),
        patientInfo: {
          id: result.book_appointment.patientId,
          numericalOrder: result.book_appointment.numericalOrder,
        },
        doctorInfo: {
          id: result.work_schedule.doctor.userId,
          name: `${result.work_schedule.doctor.firstName} ${result.work_schedule.doctor.lastName}`,
          typeDisease: result.work_schedule.doctor.typeDisease.name,
          avatar: result.work_schedule.doctor.avatar,
          specialization: result.work_schedule.doctor.specialization || "",
        },
        hasMedicalRecord: true,
        createdAt: result.book_appointment.createdAt,
      };
      setAppointment(data);
      setLoading(false);
    } catch (error) {
      console.error("Lỗi khi tải thông tin cuộc hẹn:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointmentDetails();

    // Check if patient has bank account
    const checkBankAccount = async () => {
      try {
        const response = await getPatientBankAccount(user.userId);
        // If response status is 200, patient has bank account
        setHasBankAccount(response.data.code === 200);
      } catch (error) {
        console.error("Error checking bank account:", error);
        setHasBankAccount(false);
      }
    };

    checkBankAccount();
  }, [appointmentId, cancellationSuccess, user.userId]);

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

  /**
   * Xác định xem một cuộc hẹn có đủ điều kiện để tham gia phòng khám trực tuyến hay không
   * Chỉ các cuộc hẹn có trạng thái "ĐANG CHỜ" hoặc "ĐANG KHÁM" mới có thể tham gia
   */
  const canJoinExamination = (status: string) => {
    // Kiểm tra trạng thái cuộc hẹn
    if (!(status === "Đang khám" || status === "Đang chờ")) {
      return false;
    }

    try {
      // Kiểm tra ngày hiện tại có trùng với ngày hẹn không
      const today = new Date();
      // console.log("Ngày hẹn:", appointment.date);
      // Chuyển đổi định dạng ngày từ "DD/MM/YYYY" sang định dạng ngày JavaScript
      const [day, month, year] = appointment.date.split("-").map(Number);
      const appointmentDate = new Date(year, month - 1, day);

      // So sánh ngày (bỏ qua giờ, phút, giây)
      const todayDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );
      const appointmentDateOnly = new Date(
        appointmentDate.getFullYear(),
        appointmentDate.getMonth(),
        appointmentDate.getDate()
      );
      // console.log("Ngày hiện tại:", todayDate);
      // console.log("Ngày hẹn:", appointmentDateOnly);
      if (todayDate.getTime() !== appointmentDateOnly.getTime()) {
        return false;
      }

      // Lấy thời gian bắt đầu và kết thúc từ chuỗi thời gian của appointment
      const timeString = appointment.time; // Ví dụ: "08:00 - 11:30"
      const [startTimeStr, endTimeStr] = timeString.split(" - ");

      // Chuyển thời gian sang phút
      const [startHour, startMinute] = startTimeStr.split(":").map(Number);
      const startTimeInMinutes = startHour * 60 + startMinute;

      const [endHour, endMinute] = endTimeStr.split(":").map(Number);
      const endTimeInMinutes = endHour * 60 + endMinute;

      // Tính thời gian hiện tại tính bằng phút
      const currentHour = today.getHours();
      const currentMinute = today.getMinutes();
      const currentTimeInMinutes = currentHour * 60 + currentMinute;

      // console.log("Thời gian hiện tại (phút):", currentTimeInMinutes);
      // Kiểm tra xem thời gian hiện tại có nằm trong khoảng thời gian của ca khám không
      return (
        currentTimeInMinutes >= startTimeInMinutes &&
        currentTimeInMinutes <= endTimeInMinutes
      );
    } catch (error) {
      console.error("Lỗi khi kiểm tra thời gian cho cuộc hẹn:", error);
      return false;
    }
    // return true;
  };

  /**
   * Xử lý sự kiện khi người dùng muốn tham gia phòng khám trực tuyến
   */
  const handleJoinExamination = (
    appointmentId: number,
    workScheduleId: number,
    dateAppointment: string,
    event: React.MouseEvent,
    doctorId?: number,
    doctorName?: string,
    numericalOrder?: number
  ) => {
    event.stopPropagation();

    navigate(`${ROUTING.PATIENT}/wating-room/${workScheduleId}`, {
      state: {
        doctorId: doctorId,
        appointmentId: appointmentId,
        dateAppointment: dateAppointment,
        doctorName: doctorName,
        numericalOrder: numericalOrder,
      },
    });
  };

  /**
   * Kiểm tra xem cuộc hẹn có thể huỷ hay không
   * Chỉ cho phép huỷ nếu đặt trong vòng 24h và có tài khoản ngân hàng
   */
  const canCancelAppointment = (createdAt: string, status: string) => {
    // Kiểm tra trạng thái cuộc hẹn
    if (status !== "Đang chờ") return false;

    try {
      // Sử dụng hàm từ dateUtils để parse chuỗi ngày đặt lịch hẹn
      const createdDate = parseDateTimeFromString(createdAt);
      const now = new Date();

      // Tính thời gian chênh lệch (milliseconds)
      const timeDiff = now.getTime() - createdDate.getTime();
      const hoursDiff = timeDiff / (1000 * 60 * 60);

      // Chỉ cho phép huỷ nếu đặt trong vòng 24h
      return hoursDiff <= 24;
    } catch (error) {
      console.error("Lỗi khi xử lý ngày tháng:", error);
      return false;
    }
    // return true;
  };

  /**
   * Mở dialog xác nhận huỷ lịch hẹn
   */
  const handleOpenCancelDialog = () => {
    setOpenCancelDialog(true);
  };

  /**
   * Đóng dialog xác nhận huỷ lịch hẹn
   */
  const handleCloseCancelDialog = () => {
    setOpenCancelDialog(false);
  };

  /**
   * Xử lý huỷ lịch hẹn
   */
  const handleCancelAppointment = async () => {
    try {
      // Check nếu có tài khoản ngân hàng
      if (!hasBankAccount) {
        alert(
          "Bạn cần có tài khoản ngân hàng để có thể huỷ lịch hẹn. Vui lòng liên hệ bệnh viện để biết thêm chi tiết."
        );
        return;
      }
      await cancelAppointment(appointment.id);
      setCancellationSuccess(true);
      handleCloseCancelDialog();
      fetchAppointmentDetails(); // Tải lại thông tin cuộc hẹn sau khi huỷ
    } catch (error) {
      console.error("Lỗi khi huỷ lịch hẹn:", error);
    }
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
              label={`Số Thứ Tự Khám: ${appointment.patientInfo.numericalOrder}`}
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
              {appointment.doctorInfo.typeDisease}
            </Typography>
          </Box>

          {/* Nút xem hồ sơ y tế và tham gia khám */}
          <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
            {appointment.status === "Đang chờ" && !hasBankAccount ? (
              <Tooltip title="Bạn cần có tài khoản ngân hàng để có thể huỷ lịch hẹn">
                <span>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<CancelIcon />}
                    disabled={true}
                  >
                    Huỷ lịch hẹn
                  </Button>
                </span>
              </Tooltip>
            ) : (
              canCancelAppointment(
                appointment.createdAt,
                appointment.status
              ) && (
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<CancelIcon />}
                  onClick={handleOpenCancelDialog}
                >
                  Huỷ lịch hẹn
                </Button>
              )
            )}
            {canJoinExamination(appointment.status) && (
              <Button
                variant="contained"
                color="success"
                startIcon={<VideoCallIcon />}
                onClick={(event) =>
                  handleJoinExamination(
                    appointment.id,
                    appointment.workScheduleId,
                    appointment.date,
                    event,
                    appointment.doctorInfo.id,
                    appointment.doctorInfo.name,
                    appointment.patientInfo.numericalOrder
                  )
                }
              >
                Tham gia khám
              </Button>
            )}
            {appointment.hasMedicalRecord && (
              <Button
                variant="contained"
                startIcon={<DescriptionIcon />}
                onClick={handleOpenMedicalRecord}
              >
                Xem hồ sơ bệnh án
              </Button>
            )}
          </Box>
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
      {/* <Paper elevation={1} sx={{ p: 3, bgcolor: "info.50" }}>
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
      </Paper> */}

      {/* Modal hồ sơ bệnh án */}
      <MedicalRecordModal
        open={isMedicalRecordOpen}
        onClose={handleCloseMedicalRecord}
        appointmentId={appointment?.id}
        patientId={user.userId}
        infoAppointment={{
          doctorName: appointment?.doctorInfo.name,
          dateAppointment: appointment?.date,
        }}
        isDoctor={false}
      />

      {/* Dialog xác nhận huỷ lịch hẹn */}
      <Dialog
        open={openCancelDialog}
        onClose={handleCloseCancelDialog}
        aria-labelledby="cancel-dialog-title"
        aria-describedby="cancel-dialog-description"
      >
        <DialogTitle id="cancel-dialog-title">
          Xác nhận huỷ lịch hẹn
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="cancel-dialog-description">
            Bạn có chắc chắn muốn huỷ lịch hẹn khám này không? Thao tác này
            không thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCancelDialog} color="primary">
            Hủy bỏ
          </Button>
          <Button
            onClick={handleCancelAppointment}
            color="error"
            variant="contained"
          >
            Xác nhận huỷ
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PatientAppointmentDetailsPage;
