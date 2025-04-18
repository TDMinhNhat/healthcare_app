import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  CircularProgress,
  Alert,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import {
  DataGrid,
  GridColDef,
  GridToolbar,
  GridCsvExportOptions,
} from "@mui/x-data-grid";
import { User } from "../../types/user";
import { formatCreatedAtDate } from "../../utils/dateUtils";
import { getAllMedicalRecord } from "../../services/appointment/medical_record_service";
import { getPatientInfo } from "../../services/authenticate/user_service";
import { useSelector } from "react-redux";

// Dữ liệu bệnh nhân mẫu để kiểm thử
const MOCK_PATIENT: User = {
  id: 1,
  userId: "patient-001",
  firstName: "Hùng",
  lastName: "Nguyễn Văn",
  sex: true, // true = nữ, false = nam
  dob: "15-05-1985",
  address: {
    id: 1,
    number: "123",
    street: "Nguyễn Văn Linh",
    ward: "Phường Tân Thuận Đông",
    district: "Quận 7",
    city: "Thành phố Hồ Chí Minh",
    country: "Việt Nam",
  },
  phone: "0901234567",
  email: "hung.nguyen@example.com",
  password: "", // Không bao giờ hiển thị mật khẩu thật
  status: true,
};

const PatientMedicalRecord: React.FC = () => {
  const user = useSelector((state: any) => state.user.user);
  const [patient, setPatient] = useState<User | null>(null);
  const [patientLoading, setPatientLoading] = useState<boolean>(false); // Khởi tạo là false
  const [patientError, setPatientError] = useState<string | null>(null);

  const [medicalRecords, setMedicalRecords] = useState<any[]>([]);
  const [recordsLoading, setRecordsLoading] = useState<boolean>(true);
  const [recordsError, setRecordsError] = useState<string | null>(null);
  const [expandedRecords, setExpandedRecords] = useState<number[]>([]);

  useEffect(() => {
    // Sử dụng dữ liệu người dùng từ Redux nếu có sẵn
    if (user) {
      setPatient(user);
      // Lấy hồ sơ y tế bằng ID người dùng từ Redux
      fetchMedicalRecords(user.userId);
    } else {
      console.error("User data not found in Redux store");
    }
  }, [user]);

  const fetchMedicalRecords = async (patientId: string) => {
    setRecordsLoading(true);
    setRecordsError(null);

    try {
      const response = await getAllMedicalRecord(patientId);
      console.log("Medical records response:", response);

      if (response.data && Array.isArray(response.data)) {
        // Chuyển đổi dữ liệu API để phù hợp với định dạng mong muốn của component
        const formattedRecords = response.data.map((item) => {
          const doctor = item.workSchedule?.doctor || {};
          const doctorFirstName = doctor.firstName || "";
          const doctorLastName = doctor.lastName || "";
          const doctorName = `Dr. ${doctorLastName} ${doctorFirstName}`.trim();

          // Lấy dữ liệu hồ sơ y tế (xử lý cấu trúc mảng)
          const medicalRecord =
            item.medicalRecord && item.medicalRecord.length > 0
              ? item.medicalRecord[0]
              : {};

          return {
            id: medicalRecord.id || 0,
            doctorName,
            diagnosisDisease: medicalRecord.diagnosisDisease || "",
            dateAppoinment: item.workSchedule?.dateAppointment
              ? `${item.workSchedule.dateAppointment}`
              : "",
            status: medicalRecord.bookAppointment?.status || "",
            appointmentId: medicalRecord.bookAppointment?.id,
            drugs: item.drugs || [],
            note: medicalRecord.note,
            reExaminationDate: medicalRecord.reExaminationDate,
            fullData: item,
          };
        });

        setMedicalRecords(formattedRecords);
      } else {
        setMedicalRecords([]);
      }
    } catch (error) {
      console.error("Error fetching medical records:", error);
      setRecordsError("Không thể tải lịch sử khám bệnh");
    } finally {
      setRecordsLoading(false);
    }
  };

  const handleToggleRecord = (recordId: number) => {
    setExpandedRecords((prev) => {
      if (prev.includes(recordId)) {
        // Nếu recordId đã tồn tại trong mảng, loại bỏ nó
        return prev.filter((id) => id !== recordId);
      } else {
        // Nếu recordId không tồn tại trong mảng, thêm nó
        return [...prev, recordId];
      }
    });
  };

  // Tính tuổi từ ngày sinh
  const calculateAge = (dateOfBirth: string) => {
    const dob = new Date(dateOfBirth.split("-").reverse().join("-"));
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

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "WAITING":
        return "Đang Chờ";
      case "IN_PROGRESS":
        return "Đang Khám";
      case "DONE":
        return "Đã Hoàn Thành";
      case "CANCELLED":
        return "Đã Hủy";
      default:
        return status;
    }
  };

  const drugGridColumns: GridColDef[] = [
    {
      field: "drugName",
      headerName: "Tên thuốc",
      flex: 2,
      minWidth: 180,
    },
    {
      field: "howUse",
      headerName: "Cách dùng",
      flex: 2,
      minWidth: 180,
    },
    {
      field: "quantity",
      headerName: "Số lượng",
      flex: 1,
      minWidth: 100,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "unit",
      headerName: "Đơn vị",
      flex: 1,
      minWidth: 100,
    },
  ];

  const drugCsvOptions: GridCsvExportOptions = {
    fileName: "drugs",
    delimiter: ",",
    utf8WithBom: true,
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        {/* Thông tin bệnh nhân */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
            THÔNG TIN BỆNH NHÂN
          </Typography>

          {patientLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
              <CircularProgress />
            </Box>
          ) : patientError ? (
            <Alert severity="error">{patientError}</Alert>
          ) : patient ? (
            <Card variant="outlined" sx={{ mb: 3 }}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1">
                      <strong>Họ tên:</strong> {patient.lastName}{" "}
                      {patient.firstName}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1">
                      <strong>Mã bệnh nhân:</strong> {patient.userId}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1">
                      <strong>Giới tính:</strong> {patient.sex ? "Nữ" : "Nam"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1">
                      <strong>Ngày sinh:</strong> {patient.dob} (
                      {calculateAge(patient.dob)} tuổi)
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1">
                      <strong>Điện thoại:</strong> {patient.phone}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1">
                      <strong>Email:</strong> {patient.email}
                    </Typography>
                  </Grid>
                  {/* Address display removed as requested */}
                </Grid>
              </CardContent>
            </Card>
          ) : (
            <Alert severity="info">Không có thông tin bệnh nhân</Alert>
          )}
        </Box>

        {/* Danh sách hồ sơ y tế */}
        <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
          LỊCH SỬ KHÁM BỆNH
        </Typography>

        {recordsLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : recordsError ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {recordsError}
          </Alert>
        ) : medicalRecords.length === 0 ? (
          <Alert severity="info">Không có lịch sử khám bệnh</Alert>
        ) : (
          <List sx={{ width: "100%", bgcolor: "background.paper" }}>
            {medicalRecords.map((record) => (
              <React.Fragment key={record.id}>
                <ListItem
                  disablePadding
                  divider
                  secondaryAction={
                    <IconButton
                      edge="end"
                      onClick={() => handleToggleRecord(record.id)}
                    >
                      {expandedRecords.includes(record.id) ? (
                        <ExpandLessIcon />
                      ) : (
                        <ExpandMoreIcon />
                      )}
                    </IconButton>
                  }
                >
                  {/* Nút cho phép người dùng nhấp vào để mở rộng/thu gọn chi tiết bệnh án */}
                  <ListItemButton onClick={() => handleToggleRecord(record.id)}>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" fontWeight="medium">
                          {/* Hiển thị ngày khám và chẩn đoán */}
                          {formatCreatedAtDate(record.dateAppoinment)} -{" "}
                          {record.diagnosisDisease || "Không có chẩn đoán"}
                        </Typography>
                      }
                      secondary={
                        <Box
                          component="span"
                          display="flex"
                          alignItems="center"
                          gap={1}
                          mt={0.5}
                        >
                          {/* Hiển thị tên bác sĩ khám */}
                          <span>Bác sĩ: {record.doctorName}</span>
                        </Box>
                      }
                    />
                  </ListItemButton>
                </ListItem>

                {/* Component điều khiển hiển thị/ẩn nội dung chi tiết bệnh án */}
                <Collapse
                  in={expandedRecords.includes(record.id)} // Kiểm tra xem record này có được mở rộng không
                  timeout="auto" // Thời gian mở rộng
                  unmountOnExit // Ẩn nội dung khi không được mở rộng
                >
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: "#f8f8f8",
                      borderRadius: 1,
                      mb: 1,
                    }}
                  >
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2">
                          <strong>Ngày khám:</strong>{" "}
                          {formatCreatedAtDate(record.dateAppoinment)}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2">
                          <strong>Bác sĩ khám:</strong> {record.doctorName}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2">
                          <strong>Mã lịch khám:</strong> {record.appointmentId}
                        </Typography>
                      </Grid>
                      {/* <Grid item xs={12} sm={6}>
                        <Typography variant="body2">
                          <strong>Trạng thái:</strong>{" "}
                          <Chip
                            label={getStatusLabel(record.status)}
                            size="small"
                            color={
                              record.status === "DONE" ? "success" : "default"
                            }
                          />
                        </Typography>
                      </Grid> */}
                    </Grid>

                    <Divider sx={{ my: 1 }} />

                    {/* Chẩn đoán */}
                    <Box sx={{ mb: 2 }}>
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: "bold", mb: 1 }}
                      >
                        CHẨN ĐOÁN
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Bệnh được chẩn đoán:</strong>{" "}
                        {record.diagnosisDisease || "Không có chẩn đoán"}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Ghi chú:</strong>{" "}
                        {record.note || "Không có ghi chú"}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Ngày tái khám:</strong>{" "}
                        {record.reExaminationDate || "Không có lịch tái khám"}
                      </Typography>
                    </Box>

                    <Divider sx={{ my: 1 }} />

                    {/* Thuốc điều trị */}
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: "bold", mb: 1 }}
                    >
                      THUỐC ĐIỀU TRỊ
                    </Typography>
                    {record.drugs && record.drugs.length > 0 ? (
                      <Box sx={{ width: "100%", mt: 1 }}>
                        <DataGrid
                          rows={record.drugs.map((d, idx) => ({
                            ...d,
                            id: idx + 1,
                            drugName: d.id?.drug?.drugName || "",
                            unit: d.id?.drug?.unit || "",
                          }))}
                          columns={drugGridColumns}
                          getRowId={(row) => row.id}
                          hideFooterSelectedRowCount
                          hideFooterPagination
                          slots={{ toolbar: GridToolbar }}
                          slotProps={{
                            toolbar: {
                              csvOptions: drugCsvOptions,
                              printOptions: { disableToolbarButton: false },
                              showQuickFilter: false,
                            },
                          }}
                          disableColumnFilter
                          disableColumnSelector
                          // disableDensitySelector
                        />
                      </Box>
                    ) : (
                      <Typography color="text.secondary" sx={{ py: 1 }}>
                        Không có thuốc nào được kê đơn
                      </Typography>
                    )}
                  </Box>
                </Collapse>
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>
    </Container>
  );
};

export default PatientMedicalRecord;
