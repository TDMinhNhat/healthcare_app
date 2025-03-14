import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import {
  Box,
  Typography,
  Grid,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemText,
  Avatar,
  CircularProgress,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Stack,
} from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VideocamIcon from "@mui/icons-material/Videocam";
import MedicalRecordModal from "../../components/medical/MedicalRecordModal";
import { useNavigate } from "react-router";

// Dữ liệu mẫu - sẽ được thay thế bằng API calls trong môi trường sản xuất
const mockAppointmentData = {
  id: "123",
  date: "15-10-2023", // Định dạng ngày đã được thay đổi sang dd-MM-yyyy
  time: "09:00 - 11:00",
  location: "Phòng 302, Tòa nhà chính",
  status: "Đang diễn ra",
  totalSlots: 15,
  registeredPatients: [
    {
      id: 1,
      medicalId: "BN001", // ID khám bệnh nhân
      name: "Nguyễn Văn A",
      age: 45,
      gender: "Nam",
      reason: "Khám định kỳ",
      status: "Đã xác nhận",
    },
    {
      id: 2,
      medicalId: "BN002", // ID khám bệnh nhân
      name: "Trần Thị B",
      age: 32,
      gender: "Nữ",
      reason: "Tái khám",
      status: "Đang chờ",
    },
    {
      id: 3,
      medicalId: "BN003", // ID khám bệnh nhân
      name: "Lê Văn C",
      age: 58,
      gender: "Nam",
      reason: "Tư vấn",
      status: "Đã xác nhận",
    },
  ],
};

/**
 * Trang hiển thị chi tiết ca khám của bác sĩ
 * Hiển thị thông tin về ca khám và danh sách bệnh nhân đã đăng ký
 */
const DoctorAppointmentDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  // Lấy ID ca khám từ URL params
  const { appointmentId } = useParams<{ appointmentId: string }>();
  // State lưu trữ thông tin ca khám
  const [appointment, setAppointment] = useState<any>(null);
  // State xác định trạng thái đang tải dữ liệu
  const [loading, setLoading] = useState(true);
  // State lưu trữ từ khóa tìm kiếm
  const [searchQuery, setSearchQuery] = useState<string>("");

  // State for medical record modal
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(
    null
  );
  const [isMedicalRecordOpen, setIsMedicalRecordOpen] =
    useState<boolean>(false);

  useEffect(() => {
    // Mô phỏng gọi API
    const fetchAppointmentDetails = async () => {
      try {
        // Trong môi trường thực tế: const response = await api.getAppointmentDetails(appointmentId);
        // Mô phỏng thời gian tải dữ liệu
        setTimeout(() => {
          setAppointment(mockAppointmentData);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error("Lỗi khi tải thông tin ca khám:", error);
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

  // Hiển thị thông báo khi không tìm thấy thông tin ca khám
  if (!appointment) {
    return (
      <Box p={3}>
        <Typography variant="h5">Không tìm thấy thông tin ca khám</Typography>
      </Box>
    );
  }

  /**
   * Xác định màu cho trạng thái ca khám
   * @param status - Trạng thái ca khám
   * @returns Màu tương ứng với trạng thái
   */
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Đang diễn ra":
        return "success";
      case "Đã kết thúc":
        return "default";
      case "Sắp tới":
        return "info";
      default:
        return "default";
    }
  };

  /**
   * Xác định màu cho trạng thái đăng ký của bệnh nhân
   * @param status - Trạng thái đăng ký
   * @returns Màu tương ứng với trạng thái
   */
  const getPatientStatusColor = (status: string) => {
    switch (status) {
      case "Đã xác nhận":
        return "success";
      case "Đang chờ":
        return "warning";
      default:
        return "default";
    }
  };

  /**
   * Lọc danh sách bệnh nhân theo ID khám
   * @returns Danh sách bệnh nhân đã được lọc theo ID khám
   */
  const filteredPatients =
    searchQuery.trim() === ""
      ? appointment.registeredPatients
      : appointment.registeredPatients.filter((patient: any) =>
          patient.medicalId.toLowerCase().includes(searchQuery.toLowerCase())
        );

  /**
   * Xóa từ khóa tìm kiếm
   */
  const handleClearSearch = () => {
    setSearchQuery("");
  };

  /**
   * Mở modal hồ sơ bệnh án cho bệnh nhân được chọn
   * @param patientId - ID của bệnh nhân
   */
  const handleOpenMedicalRecord = (patientId: number) => {
    setSelectedPatientId(patientId);
    setIsMedicalRecordOpen(true);
  };

  /**
   * Đóng modal hồ sơ bệnh án
   */
  const handleCloseMedicalRecord = () => {
    setIsMedicalRecordOpen(false);
    setSelectedPatientId(null);
  };

  /**
   * Xử lý chuyển đến phòng khám trực tuyến
   * @param patientId - ID của bệnh nhân
   */
  const handleStartExamination = (patientId: number) => {
    // Create an examination room ID using appointment and patient information
    const roomId = `${appointmentId}-patient-${patientId}`;
    // Navigate to the virtual examination room
    navigate(`/doctor/examination/${roomId}`);
  };

  return (
    <Box p={3}>
      {/* Tiêu đề trang */}
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Chi tiết ca khám
      </Typography>

      {/* Thẻ thông tin chi tiết ca khám */}
      <Card elevation={3} sx={{ mb: 4 }}>
        <CardContent>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h5">
              Thông tin ca khám #{appointment.id}
            </Typography>
            {/* Hiển thị trạng thái ca khám */}
            <Chip
              label={appointment.status}
              color={getStatusColor(appointment.status) as any}
              sx={{ fontWeight: "bold" }}
            />
          </Box>

          {/* Thông tin chi tiết ca khám: ngày, giờ, địa điểm */}
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
        </CardContent>
      </Card>

      {/* Danh sách bệnh nhân đăng ký */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box
            display="flex"
            justifyContent="space-between"
            mb={2}
            alignItems="center"
          >
            <Typography variant="h5">Danh sách bệnh nhân đăng ký</Typography>
            {/* Hiển thị số lượng bệnh nhân đã đăng ký trên tổng số slot */}
            <Box>
              <Chip
                label={`${appointment.registeredPatients.length}/${appointment.totalSlots} bệnh nhân`}
                color="primary"
              />
            </Box>
          </Box>

          {/* Thanh tìm kiếm theo ID */}
          <Box mb={3}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Tìm kiếm theo ID khám bệnh nhân (VD: BN001)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="primary" />
                  </InputAdornment>
                ),
                endAdornment: searchQuery && (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={handleClearSearch}
                      aria-label="Xóa tìm kiếm"
                    >
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {filteredPatients.length > 0 ? (
            <List>
              {/* Lặp qua từng bệnh nhân và hiển thị thông tin */}
              {filteredPatients.map((patient: any, index: number) => (
                <React.Fragment key={patient.id}>
                  <ListItem alignItems="flex-start" sx={{ py: 2 }}>
                    {/* Avatar hiển thị chữ cái đầu của tên bệnh nhân */}
                    <Avatar sx={{ mr: 2, bgcolor: "primary.main" }}>
                      {patient.name[0]}
                    </Avatar>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" fontWeight="bold">
                          {patient.name}
                        </Typography>
                      }
                      secondary={
                        <>
                          {/* Hiển thị ID khám bệnh nhân */}
                          <Typography
                            variant="body2"
                            color="primary"
                            sx={{ fontWeight: "medium" }}
                          >
                            ID khám: {patient.medicalId}
                          </Typography>
                          {/* Thông tin cơ bản của bệnh nhân */}
                          <Typography component="span" variant="body2">
                            {patient.age} tuổi • {patient.gender}
                          </Typography>
                          <br />
                          {/* Lý do khám của bệnh nhân */}
                          <Typography component="span" variant="body2">
                            Lý do khám: {patient.reason}
                          </Typography>
                        </>
                      }
                    />
                    {/* Cột bên phải chứa trạng thái và các nút tương tác */}
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                        gap: 1,
                      }}
                    >
                      {/* Hiển thị trạng thái đăng ký của bệnh nhân */}
                      <Chip
                        size="small"
                        label={patient.status}
                        color={getPatientStatusColor(patient.status) as any}
                      />

                      {/* Stack của các nút tương tác */}
                      <Stack spacing={1}>
                        {/* Nút bắt đầu khám bệnh trực tuyến */}
                        <Button
                          variant="contained"
                          size="small"
                          color="success"
                          startIcon={<VideocamIcon />}
                          onClick={() => handleStartExamination(patient.id)}
                          fullWidth
                        >
                          Khám
                        </Button>

                        {/* Nút xem hồ sơ bệnh án */}
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<VisibilityIcon />}
                          onClick={() => handleOpenMedicalRecord(patient.id)}
                          fullWidth
                        >
                          Xem hồ sơ
                        </Button>
                      </Stack>
                    </Box>
                  </ListItem>
                  {/* Thêm dòng phân cách giữa các bệnh nhân, trừ bệnh nhân cuối cùng */}
                  {index < filteredPatients.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          ) : (
            // Hiển thị khi không có bệnh nhân nào đăng ký hoặc không tìm thấy kết quả
            <Typography variant="body1" textAlign="center" py={3}>
              {searchQuery.trim() !== ""
                ? "Không tìm thấy bệnh nhân nào với ID khám này"
                : "Chưa có bệnh nhân đăng ký ca khám này"}
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Modal hồ sơ bệnh án */}
      <MedicalRecordModal
        open={isMedicalRecordOpen}
        onClose={handleCloseMedicalRecord}
        appointmentId={selectedPatientId}
        roomId={appointment?.location}
        isDoctor={true}
      />
    </Box>
  );
};

export default DoctorAppointmentDetailsPage;
