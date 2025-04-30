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
import EmergencyIcon from "@mui/icons-material/MedicalServices";
import PatientMedicalRecordModal from "../../components/emergency/PatientMedicalRecordModal";
import { User } from "../../types/user";
import { Avatar } from "@mui/material";
import { Socket, io } from "socket.io-client";

// Initialize socket outside the component to avoid recreation on renders
const socket: Socket = io(`ws://localhost:8081`, {
  path: "/image_detect/socket",
  transports: ["websocket", "polling"],
  reconnection: true,
  reconnectionAttempts: 10,
  autoConnect: false,
});

// Dữ liệu giả lập cho bệnh nhân cấp cứu
const mockEmergencyPatients: User[] = [
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
    emergencyContact: "Nguyễn Văn B - 0987654321",
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
    emergencyContact: "Trần Văn C - 0976543210",
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
    emergencyContact: "Lê Thị D - 0965432109",
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
    emergencyContact: "Phạm Văn E - 0954321098",
  },
  {},
  {},
];

const EmergencyPage: React.FC = () => {
  const [patients, setPatients] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<User | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date()); // Mặc định là hôm nay

  useEffect(() => {
    loadEmergencyPatients();
  }, [selectedDate]); // Tải lại khi ngày thay đổi

  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log("connected");
      socket.emit("request_patient_in_emergency", "");

      socket.on("receive_patient_in_emergency", (data) => {
        console.log(data);
        if (data.data === "New User") {
          // Thêm bệnh nhân mới với đối tượng trống - có thể có nhiều row bệnh nhân mới rỗng
          // Đảm bảo trường emergencyContact được định nghĩa
          setPatients((prevPatients) => [
            ...prevPatients,
            { emergencyContact: data.emergencyContact } as User,
          ]);
        } else if (
          data.emergencyContact &&
          !data.userId &&
          !data.firstName &&
          !data.lastName
        ) {
          // Trường hợp chỉ có duy nhất trường emergencyContact, xử lý như new user
          setPatients((prevPatients) => [
            ...prevPatients,
            { emergencyContact: data.emergencyContact } as User,
          ]);
        } else if (data !== undefined) {
          // Luôn sử dụng cập nhật hàm để làm việc với trạng thái mới nhất
          setPatients((prevPatients) => {
            // Kiểm tra xem ID bệnh nhân này đã tồn tại chưa
            const patientExists = prevPatients.some(
              (patient) => patient.userId === data.userId
            );

            // Chỉ thêm bệnh nhân nếu họ chưa tồn tại trong danh sách
            if (!patientExists) {
              return [...prevPatients, data];
            }
            return prevPatients;
          });
        }
      });

      socket.on("get_patient_in_emergency", (data) => {});
    });

    // Cleanup function to disconnect socket when component unmounts
    return () => {
      socket.off("connect");
      socket.off("receive_patient_in_emergency");
      socket.off("get_patient_in_emergency");
      socket.disconnect();
    };
  }, []);

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
            label={params.value ? "Nữ" : "Nam"}
            color={params.value ? "secondary" : "info"}
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
      field: "emergencyContact",
      headerName: "Liên hệ khẩn cấp",
      width: 220,
      flex: 1,
      renderCell: (params: GridRenderCellParams) =>
        params.value || "Không xác định",
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
    </Container>
  );
};

export default EmergencyPage;
