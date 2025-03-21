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
import { getDetailDoctorAppointment } from "../../services/appointment/booking_service";
import { useSelector } from "react-redux";
import { ROUTING } from "../../constants/routing"; // Add this import

// Tính tuổi (dd-MM-yyyy format)
const calculateAge = (dobString: string) => {
  const parts = dobString.split("-");
  if (parts.length !== 3) return 0;

  const dob = new Date(
    parseInt(parts[2]),
    parseInt(parts[1]) - 1,
    parseInt(parts[0])
  );
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDifference = today.getMonth() - dob.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < dob.getDate())
  ) {
    age--;
  }

  return age;
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
  // Doctor ID would typically come from authentication context
  const doctorId = useSelector((state: any) => state.user.user).userId;
  // State for medical record modal
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(
    null
  );
  const [isMedicalRecordOpen, setIsMedicalRecordOpen] =
    useState<boolean>(false);

  useEffect(() => {
    // Actual API call to fetch appointment details
    const fetchAppointmentDetails = async () => {
      try {
        setLoading(true);
        // Convert appointmentId from string to number
        const workScheduleId = Number(appointmentId);
        if (isNaN(workScheduleId)) {
          throw new Error("Invalid appointment ID");
        }

        const response = await getDetailDoctorAppointment(
          doctorId,
          workScheduleId
        );

        // Transform API response to match expected format
        const responseData = response.data.data;
        const workSchedule = responseData.work_schedule;

        // Format time from hh-mm-ss to hh:mm
        const formatTime = (timeStr: string) => {
          const parts = timeStr.split("-");
          return `${parts[0]}:${parts[1]}`;
        };

        // Determine appointment status based on date
        const appointmentDate = new Date(
          workSchedule.dateAppointment.split("-").reverse().join("-")
        );
        const today = new Date();

        // Map patients data
        const transformedPatients = responseData.patients.map(
          (patient: any) => ({
            id: patient.user_info.userId,
            numericalOrder: patient.book_appointment.numericalOrder.toString(),
            medicalId: patient.user_info.userId.substring(0, 10),
            name: `${patient.user_info.lastName} ${patient.user_info.firstName}`,
            age: calculateAge(patient.user_info.dob),
            gender: patient.user_info.sex ? "Nữ" : "Nam",
          })
        );

        const transformedData = {
          id: workSchedule.id.toString(),
          date: workSchedule.dateAppointment,
          time: `${formatTime(workSchedule.shift.start)} - ${formatTime(
            workSchedule.shift.end
          )}`,
          status: status,
          totalSlots: workSchedule.maxSlots,
          registeredPatients: transformedPatients,
        };

        setAppointment(transformedData);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi tải thông tin ca khám:", error);
        setLoading(false);
      }
    };

    fetchAppointmentDetails();
  }, [appointmentId, doctorId]);

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
   * Lọc danh sách bệnh nhân theo ID khám
   * @returns Danh sách bệnh nhân đã được lọc theo ID khám
   */
  const filteredPatients =
    searchQuery.trim() === ""
      ? appointment.registeredPatients
      : appointment.registeredPatients.filter((patient: any) =>
          patient.numericalOrder
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
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
   * Kiểm tra xem một ngày đã qua hay chưa (dùng để kiểm soát nút "Khám")
   */
  const isPastDate = (dateString: string): boolean => {
    // Chuyển đổi chuỗi ngày thành đối tượng Date
    const parts = dateString.split("-");
    const date = new Date(
      parseInt(parts[2]), // year
      parseInt(parts[1]) - 1, // month (0-based)
      parseInt(parts[0]) // day
    );
    // So sánh với ngày hiện tại (loại bỏ giờ, phút, giây)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  /**
   * Xử lý chuyển đến phòng khám trực tuyến
   */
  const handleStartExamination = (patientId: number) => {
    if (!appointment || !appointmentId) {
      console.error("Không có thông tin ca khám hợp lệ");
      alert(
        "Không thể mở phòng khám do thiếu thông tin ca khám. Vui lòng thử lại."
      );
      return;
    }

    // Kiểm tra xem ngày khám đã qua chưa
    const isDateInPast = isPastDate(appointment.date);
    if (isDateInPast) {
      // console.error("Không thể khám cho ngày đã qua");
      alert("Không thể bắt đầu khám do ngày đã qua");
      return;
    }

    // Tạo URL phòng khám với ID lịch và ID bệnh nhân
    const examRoomPath = ROUTING.EXAMINATION_ROOM.replace(
      ":scheduleId",
      appointmentId.toString()
    );

    // console.log(`Đang chuyển hướng đến phòng khám: ${examRoomPath}`);

    // Mở trang khám bệnh trong tab mới
    window.open(examRoomPath, "_blank");
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
            <Typography variant="h5">Thông tin ca khám</Typography>
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

          {/* Thêm nút khám duy nhất ở thông tin ca khám */}
          <Box mt={3} display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              color="success"
              startIcon={<VideocamIcon />}
              onClick={handleStartExamination}
            >
              Bắt đầu ca khám
            </Button>
          </Box>
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
              placeholder="Tìm kiếm theo stt bệnh nhân"
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
                            Số thứ tự: {patient.numericalOrder}
                          </Typography>
                          {/* Thông tin cơ bản của bệnh nhân */}
                          <Typography component="span" variant="body2">
                            {patient.age} tuổi • {patient.gender}
                          </Typography>
                        </>
                      }
                    />
                    {/* Cột bên phải chứa các nút tương tác */}
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                        gap: 1,
                      }}
                    >
                      {/* Stack của các nút tương tác */}
                      <Stack spacing={1}>
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
                ? "Không tìm thấy bệnh nhân nào với stt khám này"
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
