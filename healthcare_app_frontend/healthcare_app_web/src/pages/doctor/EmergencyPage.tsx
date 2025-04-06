import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Avatar,
  Divider,
  CircularProgress,
  Alert,
  Paper,
  Button,
  Chip,
  TextField,
  InputAdornment,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EmergencyIcon from "@mui/icons-material/MedicalServices";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import PatientMedicalRecordModal from "../../components/emergency/PatientMedicalRecordModal";
import { User } from "../../types/user";

// Dữ liệu giả lập cho bệnh nhân cấp cứu
const mockEmergencyPatients: (User & { received?: boolean })[] = [
  {
    userId: "1",
    firstName: "Văn A",
    lastName: "Nguyễn",
    email: "nguyenvana@example.com",
    phone: "0901234567",
    dob: "15-05-1985",
    sex: true,
    address: "Hà Nội",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    received: true, // Đã tiếp nhận
  },
  {
    userId: "2",
    firstName: "Thị B",
    lastName: "Trần",
    email: "tranthib@example.com",
    phone: "0912345678",
    dob: "22-09-1990",
    sex: false,
    address: "Hồ Chí Minh",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    // Chưa tiếp nhận
  },
  {
    userId: "3",
    firstName: "Văn C",
    lastName: "Lê",
    email: "levanc@example.com",
    phone: "0923456789",
    dob: "10-11-1978",
    sex: true,
    address: "Đà Nẵng",
    avatar: "https://randomuser.me/api/portraits/men/67.jpg",
    received: true, // Đã tiếp nhận
  },
  {
    userId: "4",
    firstName: "Thị D",
    lastName: "Phạm",
    email: "phamthid@example.com",
    phone: "0934567890",
    dob: "05-04-2000",
    sex: false,
    address: "Cần Thơ",
    avatar: "https://randomuser.me/api/portraits/women/22.jpg",
    // Chưa tiếp nhận
  },
  {},
];

// Hàm API giả lập - sẽ được thay thế bằng dịch vụ thực tế
const fetchEmergencyPatients = async (date?: Date): Promise<User[]> => {
  return new Promise((resolve) => {
    console.log(`Fetching patients for date: ${date?.toLocaleDateString()}`);
    setTimeout(() => resolve(mockEmergencyPatients), 800);
  });
};

interface EmergencyPatient extends User {
  received?: boolean;
}

const EmergencyPage: React.FC = () => {
  const [patients, setPatients] = useState<EmergencyPatient[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<User | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date()); // Mặc định là hôm nay

  useEffect(() => {
    loadEmergencyPatients();
  }, [selectedDate]); // Tải lại khi ngày thay đổi

  const loadEmergencyPatients = async () => {
    try {
      setLoading(true);
      // Truyền ngày được chọn vào hàm tải dữ liệu
      const data = await fetchEmergencyPatients(selectedDate);

      // Khởi tạo trạng thái chưa tiếp nhận (received=false) cho bệnh nhân
      const patientsWithReceivedStatus = (data || []).map((patient) => ({
        ...patient,
        received: patient.received !== undefined ? patient.received : false,
      }));

      setPatients(patientsWithReceivedStatus);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch emergency patients:", err);
      setError("Không thể tải danh sách bệnh nhân cấp cứu");
    } finally {
      setLoading(false);
    }
  };

  const handlePatientClick = (patient: User) => {
    setSelectedPatient(patient);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  // Xử lý tiếp nhận bệnh nhân
  const handleReceivePatient = (event: React.MouseEvent, patientId: string) => {
    event.stopPropagation(); // Ngăn chặn sự kiện click trên thẻ

    setPatients((prevPatients) =>
      prevPatients.map((patient) =>
        patient.userId === patientId ? { ...patient, received: true } : patient
      )
    );
  };

  // Tính tuổi từ ngày sinh
  const calculateAge = (dob: string) => {
    const parts = dob.split("-");
    const birthDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  // Xử lý khi thay đổi ngày
  const handleDateChange = (date: Date | null) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  return (
    <Container maxWidth="xl">
      <Paper
        elevation={0}
        sx={{
          borderRadius: 2,
          p: { xs: 2, md: 3 },
          mt: 2,
          bgcolor: "background.paper",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 3,
            flexWrap: { xs: "wrap", sm: "nowrap" },
          }}
        >
          <EmergencyIcon
            color="error"
            sx={{ fontSize: { xs: 28, md: 32 }, mr: 1.5 }}
          />
          <Typography
            variant="h4"
            component="h1"
            fontWeight="bold"
            sx={{
              fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
              lineHeight: 1.3,
              flexGrow: 1,
            }}
          >
            Danh sách bệnh nhân cấp cứu
          </Typography>

          {/* Bộ chọn ngày */}
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Chọn ngày"
              value={selectedDate}
              onChange={handleDateChange}
              slotProps={{
                textField: {
                  size: "small",
                  InputProps: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarTodayIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  },
                  sx: {
                    minWidth: "180px",
                    ml: { xs: 0, sm: 2 },
                    mt: { xs: 2, sm: 0 },
                  },
                },
              }}
            />
          </LocalizationProvider>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : (
          <Grid container spacing={{ xs: 2, md: 3 }}>
            {patients.length === 0 ? (
              <Grid item xs={12}>
                <Card
                  elevation={2}
                  sx={{
                    borderRadius: 2,
                    p: 4,
                    textAlign: "center",
                  }}
                >
                  <Typography variant="body1">
                    Không có bệnh nhân cấp cứu nào.
                  </Typography>
                </Card>
              </Grid>
            ) : (
              patients.map((patient) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  key={patient.userId || `unknown-${Math.random()}`}
                >
                  <Card
                    elevation={2}
                    sx={{
                      borderRadius: 2,
                      height: "100%",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: 8,
                      },
                      // position: "relative",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <CardActionArea
                      onClick={() => handlePatientClick(patient)}
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Box
                        sx={{
                          p: 2,
                          pb: 0, // Luôn đặt padding bottom là 0 vì chúng ta có khu vực nút/trạng thái bên dưới
                          display: "flex",
                          flexDirection: "column",
                          height: "100%",
                        }}
                      >
                        {/* Thông tin tiêu đề bệnh nhân với avatar và tên */}
                        <Box
                          sx={{
                            display: "flex",
                            mb: 1.5,
                            alignItems: "center",
                          }}
                        >
                          <Avatar
                            src={patient.avatar || ""}
                            alt={`${patient.lastName || ""} ${
                              patient.firstName || ""
                            }`}
                            sx={{
                              width: 56,
                              height: 56,
                              mr: 2,
                              border: "1px solid #eee",
                            }}
                          />
                          <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                            <Typography
                              variant="subtitle1"
                              fontWeight="bold"
                              noWrap
                            >
                              {patient.lastName || ""} {patient.firstName || ""}
                              {!patient.lastName &&
                                !patient.firstName &&
                                "Không xác định"}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              ID: {patient.userId || "Không xác định"}
                            </Typography>
                          </Box>
                        </Box>

                        {/* Chi tiết bệnh nhân - gọn hơn */}
                        <Box sx={{ mb: 1 }}>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              gap: 2, // Thêm khoảng cách giữa các mục
                              mb: 0.5,
                            }}
                          >
                            <Typography
                              variant="body2"
                              component="div"
                              sx={{ minWidth: "80px" }}
                            >
                              <strong>Tuổi:</strong>{" "}
                              {patient.dob
                                ? calculateAge(patient.dob)
                                : "Không xác định"}
                            </Typography>
                            <Typography
                              variant="body2"
                              component="div"
                              sx={{ minWidth: "80px" }}
                            >
                              <strong>Giới tính:</strong>{" "}
                              {patient.sex !== undefined
                                ? patient.sex
                                  ? "Nam"
                                  : "Nữ"
                                : "Không xác định"}
                            </Typography>
                          </Box>

                          <Typography variant="body2" sx={{ mb: 0.5 }}>
                            <strong>SĐT:</strong>{" "}
                            {patient.phone || "Không xác định"}
                          </Typography>

                          <Typography variant="body2" noWrap>
                            <strong>Địa chỉ:</strong>{" "}
                            {patient.address || "Không xác định"}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Thay thế nút điều kiện bằng container luôn hiển thị */}
                      <Box
                        sx={{
                          mt: "auto",
                          px: 2,
                          py: 1.5,
                          bgcolor: "rgba(0,0,0,0.02)",
                          borderTop: "1px solid rgba(0,0,0,0.05)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {patient.received ? (
                          // Hiển thị trạng thái đã tiếp nhận thay vì nút
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              color: "success.main",
                              fontWeight: 500,
                            }}
                          >
                            <CheckCircleIcon
                              fontSize="small"
                              sx={{ mr: 0.5 }}
                            />
                            <Typography variant="body2" fontWeight="medium">
                              Đã tiếp nhận
                            </Typography>
                          </Box>
                        ) : (
                          // Hiển thị nút tiếp nhận cho bệnh nhân chưa tiếp nhận
                          patient.userId && (
                            <Button
                              variant="contained"
                              color="success"
                              size="small"
                              startIcon={<PersonAddAlt1Icon />}
                              onClick={(e) =>
                                handleReceivePatient(e, patient.userId || "")
                              }
                              fullWidth
                              sx={{ fontWeight: 500 }}
                            >
                              Tiếp nhận
                            </Button>
                          )
                        )}
                      </Box>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        )}
      </Paper>

      <PatientMedicalRecordModal
        open={modalOpen}
        onClose={handleCloseModal}
        patient={selectedPatient}
      />
    </Container>
  );
};

export default EmergencyPage;
