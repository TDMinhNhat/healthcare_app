import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
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
  IconButton,
  Alert,
  Divider,
  TextField,
  Autocomplete,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import { MedicalRecord, MedicalRecordDrug, Drug } from "../../types/medical";
import { User } from "../../types/user";
import { formatCreatedAtDate } from "../../utils/dateUtils";

// Mock drugs data for the autocomplete
const MOCK_DRUGS: Drug[] = [
  { id: 1, drugName: "Paracetamol", unit: "viên" },
  { id: 2, drugName: "Amoxicillin", unit: "viên" },
  { id: 3, drugName: "Ibuprofen", unit: "viên" },
  { id: 4, drugName: "Cetirizine", unit: "viên" },
  { id: 5, drugName: "Omeprazole", unit: "viên" },
  { id: 6, drugName: "Losartan", unit: "viên" },
  { id: 7, drugName: "Metformin", unit: "viên" },
  { id: 8, drugName: "Atorvastatin", unit: "viên" },
  { id: 9, drugName: "Salbutamol", unit: "ống xịt" },
  { id: 10, drugName: "Vitamin C", unit: "viên" },
];

// Mock patient data
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
  appointment: {
    id: 101,
    patient: "patient-001",
    doctor: "Dr. Nguyễn Bá Thành",
    roomId: "room-101",
  },
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

interface MedicalRecordModalProps {
  open: boolean;
  onClose: () => void;
  appointmentId: number | null;
  isDoctor?: boolean;
}

const MedicalRecordModal: React.FC<MedicalRecordModalProps> = ({
  open,
  onClose,
  appointmentId,
  isDoctor = false,
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [medicalRecord, setMedicalRecord] = useState<MedicalRecord | null>(
    null
  );
  const [patient, setPatient] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Các trường dữ liệu chỉnh sửa
  const [diagnosisDisease, setDiagnosisDisease] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [reExaminationDate, setReExaminationDate] = useState<string>("");
  const [drugs, setDrugs] = useState<MedicalRecordDrug[]>([]);

  // Trường dữ liệu cho thuốc mới
  const [selectedDrug, setSelectedDrug] = useState<Drug | null>(null);
  const [howUse, setHowUse] = useState<string>("");
  const [drugQuantity, setDrugQuantity] = useState<number>(1);

  useEffect(() => {
    const fetchMedicalRecord = async () => {
      if (!appointmentId || !open) return;

      setLoading(true);
      setError(null);
      setIsEditing(false);
      setSaveSuccess(false);

      try {
        // Giả lập gọi API
        await new Promise((resolve) => setTimeout(resolve, 500));
        setMedicalRecord(MOCK_MEDICAL_RECORD);
        setPatient(MOCK_PATIENT);

        // Khởi tạo giá trị cho form chỉnh sửa
        setDiagnosisDisease(MOCK_MEDICAL_RECORD.diagnosisDisease || "");
        setNote(MOCK_MEDICAL_RECORD.note || "");
        setReExaminationDate(MOCK_MEDICAL_RECORD.reExaminationDate || "");
        setDrugs(MOCK_MEDICAL_RECORD.drugs || []);
      } catch (error) {
        console.error("Error fetching medical record:", error);
        setError("Không thể tải hồ sơ bệnh án");
      } finally {
        setLoading(false);
      }
    };

    fetchMedicalRecord();
  }, [appointmentId, open]);

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

  const handleStartEditing = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    // Reset về giá trị ban đầu
    if (medicalRecord) {
      setDiagnosisDisease(medicalRecord.diagnosisDisease || "");
      setNote(medicalRecord.note || "");
      setReExaminationDate(medicalRecord.reExaminationDate || "");
      setDrugs(medicalRecord.drugs || []);
    }
    setIsEditing(false);
    setSelectedDrug(null);
    setHowUse("");
    setDrugQuantity(1);
  };

  const handleSave = async () => {
    if (!medicalRecord) return;

    setSaving(true);
    setError(null);

    try {
      // Tạo bản ghi đã cập nhật
      const updatedRecord: MedicalRecord = {
        ...medicalRecord,
        diagnosisDisease,
        note,
        reExaminationDate,
        drugs,
      };

      // Giả lập gọi API lưu
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Lưu hồ sơ bệnh án:", updatedRecord);

      // Cập nhật state hiện tại
      setMedicalRecord(updatedRecord);
      setSaveSuccess(true);
      setIsEditing(false);

      // Xóa thông báo thành công sau 3 giây
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Lỗi khi lưu:", error);
      setError("Không thể lưu hồ sơ bệnh án");
    } finally {
      setSaving(false);
    }
  };

  const handleAddDrug = () => {
    if (!selectedDrug || !medicalRecord) return;

    if (!howUse.trim()) {
      alert("Vui lòng nhập cách dùng thuốc");
      return;
    }

    const newDrug: MedicalRecordDrug = {
      medicalRecord: medicalRecord,
      drug: selectedDrug,
      howUse: howUse,
      quantity: drugQuantity,
    };

    setDrugs([...drugs, newDrug]);
    setSelectedDrug(null);
    setHowUse("");
    setDrugQuantity(1);
  };

  const handleRemoveDrug = (index: number) => {
    const updatedDrugs = [...drugs];
    updatedDrugs.splice(index, 1);
    setDrugs(updatedDrugs);
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

  return (
    <Dialog
      open={open}
      onClose={isEditing ? undefined : onClose} // Không cho phép đóng khi đang chỉnh sửa
      maxWidth="md"
      fullWidth
      scroll="paper"
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">
            {isEditing ? "Chỉnh Sửa Hồ Sơ Bệnh Án" : "Hồ Sơ Bệnh Án"}
          </Typography>
          <IconButton
            aria-label="close"
            onClick={isEditing ? handleCancelEdit : onClose}
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
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
        ) : saveSuccess ? (
          <Alert severity="success" sx={{ mb: 2 }}>
            Đã lưu hồ sơ bệnh án thành công
          </Alert>
        ) : (
          <Box sx={{ py: 1 }}>
            {/* Phần thông tin bệnh nhân (không chỉnh sửa được) */}
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

            {/* Thông tin lịch hẹn (không chỉnh sửa được) */}
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
                      <strong>Bác sĩ khám:</strong>{" "}
                      {medicalRecord.appointment.doctor}
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

                {/* Phần chẩn đoán - có thể chỉnh sửa */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: "bold", mb: 1, mt: 2 }}
                  >
                    CHẨN ĐOÁN
                  </Typography>
                </Box>

                {isEditing ? (
                  // Chế độ chỉnh sửa
                  <Box sx={{ mb: 2, px: 1 }}>
                    <TextField
                      fullWidth
                      label="Bệnh được chẩn đoán"
                      value={diagnosisDisease}
                      onChange={(e) => setDiagnosisDisease(e.target.value)}
                      margin="dense"
                    />
                    <TextField
                      fullWidth
                      label="Ghi chú"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      margin="dense"
                      multiline
                      rows={3}
                    />
                    <TextField
                      fullWidth
                      label="Ngày tái khám"
                      type="date"
                      value={reExaminationDate}
                      onChange={(e) => setReExaminationDate(e.target.value)}
                      margin="dense"
                      InputLabelProps={{ shrink: true }}
                    />
                  </Box>
                ) : (
                  // Chế độ xem
                  <Box sx={{ mb: 2, px: 1 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Bệnh được chẩn đoán:</strong>{" "}
                      {diagnosisDisease || "-"}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Ghi chú:</strong> {note || "-"}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Ngày tái khám:</strong>{" "}
                      {reExaminationDate || "Không có lịch tái khám"}
                    </Typography>
                  </Box>
                )}

                <Divider sx={{ my: 1 }} />

                {/* Phần thuốc điều trị */}
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: "bold", mb: 1, mt: 2 }}
                >
                  THUỐC ĐIỀU TRỊ
                </Typography>

                {/* Phần thêm thuốc mới - chỉ hiện khi đang chỉnh sửa */}
                {isEditing && isDoctor && (
                  <Box
                    sx={{ mb: 2, p: 1, bgcolor: "#f5f5f5", borderRadius: 1 }}
                  >
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} md={3}>
                        <Autocomplete
                          options={MOCK_DRUGS}
                          getOptionLabel={(option) =>
                            `${option.drugName} (${option.unit})`
                          }
                          value={selectedDrug}
                          onChange={(_, newValue) => setSelectedDrug(newValue)}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Tên thuốc"
                              size="small"
                              fullWidth
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <TextField
                          label="Cách dùng"
                          value={howUse}
                          onChange={(e) => setHowUse(e.target.value)}
                          size="small"
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12} md={2}>
                        <TextField
                          label="Số lượng"
                          type="number"
                          value={drugQuantity}
                          onChange={(e) =>
                            setDrugQuantity(parseInt(e.target.value) || 1)
                          }
                          InputProps={{ inputProps: { min: 1 } }}
                          size="small"
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Button
                          variant="contained"
                          startIcon={<AddIcon />}
                          onClick={handleAddDrug}
                          disabled={!selectedDrug || !howUse.trim()}
                          fullWidth
                        >
                          Thêm Thuốc
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                )}

                {/* Danh sách thuốc */}
                {drugs.length > 0 ? (
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
                          {isEditing && isDoctor && (
                            <TableCell
                              align="center"
                              sx={{ fontWeight: "bold" }}
                            >
                              Thao tác
                            </TableCell>
                          )}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {drugs.map((drug, index) => (
                          <TableRow key={index}>
                            <TableCell>{drug.drug.drugName}</TableCell>
                            <TableCell>{drug.howUse}</TableCell>
                            <TableCell align="center">
                              {drug.quantity}
                            </TableCell>
                            <TableCell>{drug.drug.unit}</TableCell>
                            {isEditing && isDoctor && (
                              <TableCell align="center">
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => handleRemoveDrug(index)}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </TableCell>
                            )}
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
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        {isDoctor &&
          medicalRecord &&
          (isEditing ? (
            <>
              <Button
                onClick={handleCancelEdit}
                color="inherit"
                startIcon={<CancelIcon />}
              >
                Hủy
              </Button>
              <Button
                onClick={handleSave}
                color="primary"
                variant="contained"
                startIcon={<SaveIcon />}
                disabled={saving}
              >
                {saving ? "Đang Lưu..." : "Lưu"}
              </Button>
            </>
          ) : (
            <Button
              onClick={handleStartEditing}
              color="primary"
              startIcon={<EditIcon />}
              disabled={
                medicalRecord.status !== "DONE" &&
                medicalRecord.status !== "IN_PROGRESS"
              }
            >
              Chỉnh Sửa
            </Button>
          ))}
        <Button
          onClick={isEditing ? handleCancelEdit : onClose}
          color="primary"
          variant={!isEditing ? "contained" : "text"}
        >
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MedicalRecordModal;
