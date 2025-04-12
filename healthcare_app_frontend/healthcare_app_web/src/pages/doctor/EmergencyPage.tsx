import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Divider,
  CircularProgress,
  Alert,
  Paper,
  Chip,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridToolbar,
} from "@mui/x-data-grid";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EmergencyIcon from "@mui/icons-material/MedicalServices";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import PatientMedicalRecordModal from "../../components/emergency/PatientMedicalRecordModal";
import { User } from "../../types/user";
import { Avatar } from "@mui/material";
import GPSMapComponent from "../../components/find_doctor/GPSMapComponent";
import { Socket, io } from "socket.io-client";

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
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    patientId: string;
    patientName: string;
  }>({
    open: false,
    patientId: "",
    patientName: "",
  });
  const [socket, setSocket] = useState<Socket>(
    io(`ws://${import.meta.env.VITE_HOST}:8081`, {
      path: "/image_detect/socket",
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 10,
      autoConnect: false,
    })
  );

  // useEffect(() => {
  //   loadEmergencyPatients();
  // }, [selectedDate]); // Tải lại khi ngày thay đổi

  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      socket.emit("request_patient_in_emergency")

      socket.on("receive_patient_in_emergency", (data) => { 
        if(data === "New User") {
          //Add new patient with empty object
          setPatients((prevPatients) => [
            ...prevPatients,
            { } as User,
          ]);
        } else {
          // Filter patients contain the userId already before
          const result = patients.filter((patient) => patient.userId === data.userId);
          // Check if newPatients is empty or not
          if(result.length === 0) {
            // Add new patients to the state
            setPatients((prevPatients) => [
              ...prevPatients,
              data,
            ]);
          }
        }
      })

      socket.on("get_patient_in_emergency", (data) => { 

      })
    })
  }, [])

  const loadEmergencyPatients = async () => {
    try {
      setLoading(true);
      // // Truyền ngày được chọn vào hàm tải dữ liệu
      // const data = await fetchEmergencyPatients(selectedDate);

      // // Khởi tạo trạng thái chưa tiếp nhận (received=false) cho bệnh nhân
      // const patientsWithReceivedStatus = (data || []).map((patient) => ({
      //   ...patient,
      //   received: patient.received !== undefined ? patient.received : false,
      // }));

      // setPatients(patientsWithReceivedStatus);
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

    // Tìm thông tin bệnh nhân để hiển thị trong dialog
    const patient = patients.find((p) => p.userId === patientId);
    const patientName = patient
      ? `${patient.lastName || ""} ${patient.firstName || ""}`.trim() ||
        "bệnh nhân này"
      : "bệnh nhân này";

    setConfirmDialog({
      open: true,
      patientId,
      patientName,
    });
  };

  // Xử lý xác nhận tiếp nhận
  const handleConfirmReceive = () => {
    setPatients((prevPatients) =>
      prevPatients.map((patient) =>
        patient.userId === confirmDialog.patientId
          ? { ...patient, received: true }
          : patient
      )
    );
    setConfirmDialog({ ...confirmDialog, open: false });
  };

  // Đóng dialog xác nhận
  const handleCloseConfirm = () => {
    setConfirmDialog({ ...confirmDialog, open: false });
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

  // Định nghĩa cấu trúc các cột cho bảng dữ liệu
  const columns: GridColDef[] = [
    {
      field: "avatar",
      headerName: "Ảnh",
      width: 70,
      renderCell: (params: GridRenderCellParams) => (
        <Avatar src={(params.value as string) || "/default-avatar.png"} />
      ),
      sortable: false,
    },
    {
      field: "lastName",
      headerName: "Họ",
      width: 120,
      flex: 0.8,
      renderCell: (params: GridRenderCellParams) =>
        params.value || "Không xác định",
    },
    {
      field: "firstName",
      headerName: "Tên",
      width: 100,
      flex: 0.8,
      renderCell: (params: GridRenderCellParams) =>
        params.value || "Không xác định",
    },
    {
      field: "userId",
      headerName: "Mã BN",
      width: 100,
      renderCell: (params: GridRenderCellParams) =>
        params.value || "Không xác định",
    },
    {
      field: "sex",
      headerName: "Giới tính",
      width: 100,
      renderCell: (params: GridRenderCellParams) =>
        params.value !== undefined ? (
          <Chip
            label={params.value ? "Nam" : "Nữ"}
            color={params.value ? "info" : "secondary"}
            size="small"
          />
        ) : (
          "Không xác định"
        ),
    },
    {
      field: "dob",
      headerName: "Tuổi",
      width: 80,
      renderCell: (params: GridRenderCellParams) =>
        params.value ? calculateAge(params.value as string) : "N/A",
    },
    {
      field: "phone",
      headerName: "SĐT",
      width: 120,
      renderCell: (params: GridRenderCellParams) =>
        params.value || "Không xác định",
    },
    {
      field: "address",
      headerName: "Địa chỉ",
      width: 200,
      flex: 1,
      renderCell: (params: GridRenderCellParams) =>
        params.value || "Không xác định",
    },
    {
      field: "received",
      headerName: "Trạng thái",
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value ? "Đã tiếp nhận" : "Chưa tiếp nhận"}
          color={params.value ? "success" : "warning"}
          icon={params.value ? <CheckCircleIcon /> : <PersonAddAlt1Icon />}
          size="small"
          onClick={
            !params.value && params.row.userId
              ? (event) => handleReceivePatient(event, params.row.userId)
              : undefined
          }
          sx={{
            cursor: !params.value && params.row.userId ? "pointer" : "default",
          }}
        />
      ),
    },
  ];

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
          <>
            {/* Bản đồ vị trí */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                Bản đồ vị trí
              </Typography>
              <Box sx={{ height: "400px", width: "100%" }}>
                <GPSMapComponent />
              </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Box sx={{ height: 500, width: "100%" }}>
              <DataGrid
                rows={patients.map((p, index) => ({
                  ...p,
                  id: p.userId || `unknown-${index}`,
                }))}
                columns={columns}
                pageSizeOptions={[5, 10, 25, 50, 100]}
                slots={{
                  toolbar: GridToolbar,
                }}
                slotProps={{
                  toolbar: {
                    showQuickFilter: true, // search
                    // tắt export
                    printOptions: { disableToolbarButton: true },
                    csvOptions: { disableToolbarButton: true },
                    quickFilterProps: { debounceMs: 500 },
                  },
                }}
                // tắt mấy filter khác
                disableRowSelectionOnClick
                disableColumnFilter={true}
                disableDensitySelector={true}
                disableColumnSelector={true}
                onRowClick={(params) => {
                  // Chỉ mở modal cho bệnh nhân có thông tin xác định (có userId)
                  if (params.row.userId) {
                    handlePatientClick(params.row);
                  }
                }}
              />
            </Box>
          </>
        )}
      </Paper>

      <PatientMedicalRecordModal
        open={modalOpen}
        onClose={handleCloseModal}
        patient={selectedPatient}
      />

      {/* Dialog xác nhận tiếp nhận */}
      <Dialog
        open={confirmDialog.open}
        onClose={handleCloseConfirm}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Xác nhận tiếp nhận bệnh nhân"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bạn có chắc chắn muốn tiếp nhận {confirmDialog.patientName}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirm} color="inherit">
            Hủy
          </Button>
          <Button
            onClick={handleConfirmReceive}
            color="primary"
            variant="contained"
            autoFocus
          >
            Xác nhận tiếp nhận
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EmergencyPage;
