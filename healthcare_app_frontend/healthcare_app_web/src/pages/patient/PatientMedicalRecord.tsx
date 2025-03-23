import React, { useState, useEffect } from "react";
import {
  Typography,
  Grid,
  Box,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Divider,
  Paper,
  Tabs,
  Tab,
  Button,
} from "@mui/material";
import MedicalInformationIcon from "@mui/icons-material/MedicalInformation";
import HistoryIcon from "@mui/icons-material/History";
import { MedicalRecord, MedicalRecordDrug, Drug } from "../../types/medical";
import { User } from "../../types/user";
import { formatCreatedAtDate } from "../../utils/dateUtils";

// Reuse the mock data from MedicalRecordModal component
const MOCK_PATIENT: User = {
  id: 1,
  userId: "patient-001",
  firstName: "Hùng",
  lastName: "Nguyễn Văn",
  sex: true, // true = male, false = female
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
  password: "", // Never expose actual password
  status: true,
};

// Mock medical record data
const MOCK_MEDICAL_RECORD: MedicalRecord = {
  id: 1,
  doctorName: "Dr. Nguyễn Bá Thành", // Single field replacing appointment object
  roomId: "room-101",
  diagnosisDisease: "Tăng huyết áp độ 1",
  note: "Bệnh nhân cần theo dõi huyết áp hàng ngày, giảm lượng muối trong khẩu phần ăn và tập thể dục đều đặn.",
  reExaminationDate: "2023-08-20",
  createdAt: "20-07-2023-09-30-00",
  drugs: [
    {
      drug: {
        id: 1,
        drugName: "Amlodipine",
        unit: "tablet",
      },
      medicalRecord: null,
      howUse: "Uống 1 viên mỗi ngày vào buổi sáng",
      quantity: 30,
    },
    {
      drug: {
        id: 2,
        drugName: "Losartan",
        unit: "tablet",
      },
      medicalRecord: null,
      howUse: "Uống 1 viên mỗi ngày vào buổi tối",
      quantity: 30,
    },
  ],
  status: "DONE",
};

// Mock patient history data
const MOCK_PATIENT_HISTORY = [
  {
    id: 1,
    doctorName: "Dr. Nguyễn Bá Thành",
    diagnosisDisease: "Tăng huyết áp độ 1",
    createdAt: "20-07-2023-09-30-00",
    status: "DONE",
  },
  {
    id: 2,
    doctorName: "Dr. Trần Minh Tuấn",
    diagnosisDisease: "Nhiễm trùng họng",
    createdAt: "15-06-2023-14-00-00",
    status: "DONE",
  },
  {
    id: 3,
    doctorName: "Dr. Lê Thị Hương",
    diagnosisDisease: "Đau lưng cấp tính",
    createdAt: "02-05-2023-10-15-00",
    status: "DONE",
  },
  {
    id: 4,
    doctorName: "Dr. Nguyễn Bá Thành",
    diagnosisDisease: "Khám sức khỏe định kỳ",
    createdAt: "10-01-2023-08-30-00",
    status: "DONE",
  },
];

// Simplified mock history detail
const MOCK_HISTORY_DETAIL = {
  id: 2,
  doctorName: "Dr. Trần Minh Tuấn",
  roomId: "room-103",
  diagnosisDisease: "Nhiễm trùng họng",
  note: "Bệnh nhân có triệu chứng đau họng, sốt nhẹ, và khó nuốt. Kết quả xét nghiệm chỉ ra nhiễm streptococcus.",
  reExaminationDate: "2023-06-22",
  createdAt: "15-06-2023-14-00-00",
  drugs: [
    {
      drug: {
        id: 2,
        drugName: "Amoxicillin",
        unit: "viên",
      },
      medicalRecord: null,
      howUse: "Uống 1 viên, ngày 2 lần sau bữa ăn",
      quantity: 20,
    },
    {
      drug: {
        id: 4,
        drugName: "Cetirizine",
        unit: "viên",
      },
      medicalRecord: null,
      howUse: "Uống 1 viên mỗi tối trước khi ngủ",
      quantity: 10,
    },
    {
      drug: {
        id: 10,
        drugName: "Vitamin C",
        unit: "viên",
      },
      medicalRecord: null,
      howUse: "Uống 1 viên mỗi ngày sau bữa sáng",
      quantity: 30,
    },
  ],
  status: "DONE",
};

// Interface for TabPanel component
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`medical-tabpanel-${index}`}
      aria-labelledby={`medical-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

const PatientMedicalRecord: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [medicalRecord, setMedicalRecord] = useState<MedicalRecord | null>(
    null
  );
  const [patient, setPatient] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [selectedHistoryRecord, setSelectedHistoryRecord] = useState<
    number | null
  >(null);

  useEffect(() => {
    const fetchMedicalRecord = async () => {
      setLoading(true);
      setError(null);

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));
        setMedicalRecord(MOCK_MEDICAL_RECORD);
        setPatient(MOCK_PATIENT);
      } catch (error) {
        console.error("Error fetching medical record:", error);
        setError("Không thể tải hồ sơ bệnh án");
      } finally {
        setLoading(false);
      }
    };

    fetchMedicalRecord();
  }, []);

  // Calculate age from date of birth
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

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    // Reset selected history record when switching to history tab
    if (newValue === 1) {
      setSelectedHistoryRecord(null);
    }
  };

  // Handle history record selection
  const handleSelectHistoryRecord = (recordId: number) => {
    // In a real app, this would fetch the details of the selected record
    setSelectedHistoryRecord(recordId);
    // For demo purposes, we're showing mock data for record #2
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
        Hồ Sơ Bệnh Án
      </Typography>

      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            py: 4,
          }}
        >
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Box sx={{ py: 1 }}>
          {/* Patient Information */}
          <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
            THÔNG TIN BỆNH NHÂN
          </Typography>
          {patient && (
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2">
                  <strong>Họ tên:</strong> {patient.lastName}{" "}
                  {patient.firstName}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2">
                  <strong>Mã bệnh nhân:</strong> {patient.userId}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2">
                  <strong>Giới tính:</strong> {patient.sex ? "Nam" : "Nữ"}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2">
                  <strong>Ngày sinh:</strong> {patient.dob} (
                  {calculateAge(patient.dob)} tuổi)
                </Typography>
              </Grid>
            </Grid>
          )}

          <Divider sx={{ my: 1 }} />

          {/* Tab Navigation */}
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              aria-label="medical record tabs"
              variant="fullWidth"
            >
              <Tab
                icon={<MedicalInformationIcon />}
                iconPosition="start"
                label="Ca Khám Hiện Tại"
                id="medical-tab-0"
              />
              <Tab
                icon={<HistoryIcon />}
                iconPosition="start"
                label="Lịch Sử Khám Bệnh"
                id="medical-tab-1"
              />
            </Tabs>
          </Box>

          {/* Current Record Tab */}
          <TabPanel value={activeTab} index={0}>
            {/* Appointment Information */}
            {medicalRecord && (
              <>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: "bold", mb: 1, mt: 2 }}
                >
                  THÔNG TIN LỊCH HẸN
                </Typography>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2">
                      <strong>Ngày khám:</strong>{" "}
                      {formatCreatedAtDate(medicalRecord.createdAt)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2">
                      <strong>Bác sĩ khám:</strong> {medicalRecord.doctorName}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2">
                      <strong>Phòng khám:</strong> {medicalRecord.roomId}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2">
                      <strong>Trạng thái:</strong>{" "}
                      <Chip
                        label={getStatusLabel(medicalRecord.status)}
                        size="small"
                        color={
                          medicalRecord.status === "DONE"
                            ? "success"
                            : "default"
                        }
                      />
                    </Typography>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 1 }} />

                {/* Diagnosis Section */}
                <Box>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: "bold", mb: 1, mt: 2 }}
                  >
                    CHẨN ĐOÁN
                  </Typography>

                  <Box sx={{ mb: 2, px: 1 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Bệnh được chẩn đoán:</strong>{" "}
                      {medicalRecord.diagnosisDisease || "-"}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Ghi chú:</strong> {medicalRecord.note || "-"}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Ngày tái khám:</strong>{" "}
                      {medicalRecord.reExaminationDate ||
                        "Không có lịch tái khám"}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 1 }} />

                {/* Medications Section */}
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: "bold", mb: 1, mt: 2 }}
                >
                  THUỐC ĐIỀU TRỊ
                </Typography>

                {/* Medications List */}
                {medicalRecord.drugs.length > 0 ? (
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: "bold" }}>
                            Tên thuốc
                          </TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>
                            Cách dùng
                          </TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>
                            Số lượng
                          </TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>
                            Đơn vị
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {medicalRecord.drugs.map((drug, index) => (
                          <TableRow key={index}>
                            <TableCell>{drug.drug.drugName}</TableCell>
                            <TableCell>{drug.howUse}</TableCell>
                            <TableCell align="center">
                              {drug.quantity}
                            </TableCell>
                            <TableCell>{drug.drug.unit}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Typography
                    color="text.secondary"
                    sx={{ textAlign: "center", py: 2 }}
                  >
                    Không có thuốc nào được kê đơn
                  </Typography>
                )}
              </>
            )}
          </TabPanel>

          {/* Patient History Tab */}
          <TabPanel value={activeTab} index={1}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: "bold", mb: 1, mt: 2 }}
            >
              LỊCH SỬ KHÁM BỆNH
            </Typography>

            <TableContainer sx={{ mb: 3 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Ngày khám</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Bác sĩ</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Chẩn đoán</TableCell>
                    <TableCell align="center" sx={{ fontWeight: "bold" }}>
                      Xem chi tiết
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {MOCK_PATIENT_HISTORY.map((record) => (
                    <TableRow
                      key={record.id}
                      hover
                      selected={selectedHistoryRecord === record.id}
                    >
                      <TableCell>
                        {formatCreatedAtDate(record.createdAt)}
                      </TableCell>
                      <TableCell>{record.doctorName}</TableCell>
                      <TableCell>{record.diagnosisDisease}</TableCell>
                      <TableCell align="center">
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => handleSelectHistoryRecord(record.id)}
                        >
                          Xem
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {selectedHistoryRecord && (
              <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: "bold", mb: 2 }}
                >
                  Chi tiết ca khám #{selectedHistoryRecord}
                </Typography>

                {selectedHistoryRecord === 2 ? (
                  <>
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2">
                          <strong>Ngày khám:</strong>{" "}
                          {formatCreatedAtDate(MOCK_HISTORY_DETAIL.createdAt)}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2">
                          <strong>Bác sĩ khám:</strong>{" "}
                          {MOCK_HISTORY_DETAIL.doctorName}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2">
                          <strong>Phòng khám:</strong>{" "}
                          {MOCK_HISTORY_DETAIL.roomId}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2">
                          <strong>Ngày tái khám:</strong>{" "}
                          {MOCK_HISTORY_DETAIL.reExaminationDate ||
                            "Không có lịch tái khám"}
                        </Typography>
                      </Grid>
                    </Grid>

                    <Divider sx={{ my: 1 }} />

                    {/* Diagnosis */}
                    <Box sx={{ mb: 2 }}>
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: "bold", mb: 1 }}
                      >
                        CHẨN ĐOÁN
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Bệnh được chẩn đoán:</strong>{" "}
                        {MOCK_HISTORY_DETAIL.diagnosisDisease}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Ghi chú:</strong> {MOCK_HISTORY_DETAIL.note}
                      </Typography>
                    </Box>

                    <Divider sx={{ my: 1 }} />

                    {/* Medications */}
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: "bold", mb: 1 }}
                    >
                      THUỐC ĐIỀU TRỊ
                    </Typography>
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ fontWeight: "bold" }}>
                              Tên thuốc
                            </TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>
                              Cách dùng
                            </TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>
                              Số lượng
                            </TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>
                              Đơn vị
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {MOCK_HISTORY_DETAIL.drugs.map((drug, index) => (
                            <TableRow key={index}>
                              <TableCell>{drug.drug.drugName}</TableCell>
                              <TableCell>{drug.howUse}</TableCell>
                              <TableCell align="center">
                                {drug.quantity}
                              </TableCell>
                              <TableCell>{drug.drug.unit}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </>
                ) : (
                  <Typography variant="body2">
                    Đang tải thông tin chi tiết...
                  </Typography>
                )}
              </Paper>
            )}
          </TabPanel>
        </Box>
      )}
    </Paper>
  );
};

export default PatientMedicalRecord;
