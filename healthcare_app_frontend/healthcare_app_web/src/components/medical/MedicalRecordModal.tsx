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
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Collapse,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import HistoryIcon from "@mui/icons-material/History";
import MedicalInformationIcon from "@mui/icons-material/MedicalInformation";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
// DataGrid import
import {
  DataGrid,
  GridColDef,
  GridToolbar,
  GridCsvExportOptions,
} from "@mui/x-data-grid";
import { MedicalRecord, MedicalRecordDrug, Drug } from "../../types/medical";
import { User } from "../../types/user";
import { formatCreatedAtDate } from "../../utils/dateUtils";
import {
  createMedicalRecord,
  getMedicalRecord,
  getMedicalRecordPrevious,
} from "../../services/appointment/medical_record_service";
import { getPatientInfo } from "../../services/authenticate/user_service";
import { getAllDrugs } from "../../services/appointment/drug_service";
import { ca } from "date-fns/locale";

// Dữ liệu mẫu bệnh nhân
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

interface MedicalRecordModalProps {
  open: boolean;
  onClose: () => void;
  appointmentId: number | null;
  patientId?: string | null;
  infoAppointment?: any;
  isDoctor?: boolean; // Xác định người dùng có phải bác sĩ không
}

// Interface cho component TabPanel
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

/**
 * Component hiển thị modal hồ sơ bệnh án
 * Cho phép xem và chỉnh sửa thông tin bệnh án
 * Gồm 2 tab: Thông tin ca khám hiện tại và lịch sử khám bệnh
 */
const MedicalRecordModal: React.FC<MedicalRecordModalProps> = ({
  open,
  onClose,
  appointmentId,
  patientId,
  infoAppointment,
  isDoctor = false,
}) => {
  // Quản lý trạng thái loading và lỗi
  const [loading, setLoading] = useState<boolean>(true);
  const [patientLoading, setPatientLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [patientError, setPatientError] = useState<string | null>(null);

  // State cho danh sách thuốc từ API
  const [availableDrugs, setAvailableDrugs] = useState<Drug[]>([]);
  const [loadingDrugs, setLoadingDrugs] = useState<boolean>(false);
  const [drugsError, setDrugsError] = useState<string | null>(null);

  // Dữ liệu chính
  const [medicalRecord, setMedicalRecord] = useState<MedicalRecord | null>(
    null
  );
  const [patient, setPatient] = useState<User | null>(null);

  // Trạng thái chỉnh sửa
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [canEdit, setCanEdit] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Quản lý tab và lịch sử
  const [activeTab, setActiveTab] = useState<number>(0);
  const [selectedHistoryRecord, setSelectedHistoryRecord] = useState<
    number | null
  >(null);

  // Các trường dữ liệu chỉnh sửa
  const [diagnosisDisease, setDiagnosisDisease] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [reExaminationDate, setReExaminationDate] = useState<string>("");
  const [drugs, setDrugs] = useState<MedicalRecordDrug[]>([]);

  // Trường dữ liệu cho thuốc mới
  const [selectedDrug, setSelectedDrug] = useState<Drug | null>(null);
  const [howUse, setHowUse] = useState<string>("");
  const [drugQuantity, setDrugQuantity] = useState<number>(1);

  // Quản lý danh sách mục đã mở rộng
  const [expandedRecords, setExpandedRecords] = useState<number[]>([]);

  // Trạng thái cho lịch sử khám bệnh
  const [patientHistory, setPatientHistory] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState<boolean>(false);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [selectedHistoryData, setSelectedHistoryData] = useState<any | null>(
    null
  );

  // Fetch available drugs from API
  useEffect(() => {
    const fetchDrugs = async () => {
      if (!open) return;

      setLoadingDrugs(true);
      setDrugsError(null);

      try {
        const response = await getAllDrugs();
        if (response.data && Array.isArray(response.data.data)) {
          const formattedDrugs = response.data.data.map((drug: any) => ({
            id: drug.id,
            drugName: drug.drugName,
            unit: drug.unit,
          }));
          setAvailableDrugs(formattedDrugs);
        } else {
          console.warn("Invalid drugs data format", response);
          setAvailableDrugs([]);
        }
      } catch (error) {
        console.error("Error fetching drugs:", error);
        setDrugsError("Không thể tải danh sách thuốc");
        setAvailableDrugs([]);
      } finally {
        setLoadingDrugs(false);
      }
    };

    fetchDrugs();
  }, [open]);

  useEffect(() => {
    const fetchMedicalRecord = async () => {
      if (!appointmentId || !open) return;

      setLoading(true);
      setError(null);
      setIsEditing(false);
      setSaveSuccess(false);

      try {
        // Gọi API lấy dữ liệu hồ sơ bệnh án
        console.log("Fetching medical record for appointment:", appointmentId);
        const response = await getMedicalRecord(appointmentId);
        console.log("API response:", response);
        const apiData = response.data || {};

        // Check if apiData is empty object or null
        if (!apiData || Object.keys(apiData).length === 0) {
          setCanEdit(true);
        }

        console.log("infoAppointment", infoAppointment);
        console.log("patient id", patientId);

        // Chuyển đổi dữ liệu API sang định dạng dùng trong component
        // Nếu apiData trống, sử dụng giá trị mặc định
        const formattedMedicalRecord: MedicalRecord = {
          id: apiData.medical_record?.id || 0,
          doctorName: apiData.doctor?.doctor
            ? `Dr. ${apiData.doctor.doctor.firstName} ${apiData.doctor.doctor.lastName}`
            : infoAppointment?.doctorName,
          appointmentId:
            apiData.medical_record?.bookAppointment?.id?.toString() ||
            appointmentId,
          diagnosisDisease: apiData.medical_record?.diagnosisDisease || "",
          note: apiData.medical_record?.note || "",
          reExaminationDate: apiData.medical_record?.reExaminationDate || "",
          dateAppointment:
            apiData.doctor?.dateAppointment || infoAppointment?.dateAppointment,
          drugs: (apiData.drugs || []).map((drugItem) => ({
            drug: {
              id: drugItem?.id?.drug?.id || 0,
              drugName: drugItem?.id?.drug?.drugName || "",
              unit: drugItem?.id?.drug?.unit || "",
            },
            howUse: drugItem?.howUse || "",
            quantity: drugItem?.quantity || 0,
          })),
          status: apiData.medical_record?.bookAppointment?.status || "WAITING",
        };

        setMedicalRecord(formattedMedicalRecord);

        // Nếu có patientId thì lấy thông tin bệnh nhân
        if (patientId) {
          fetchPatientInfo(patientId);
        } else {
          // Sử dụng dữ liệu mẫu nếu không có patientId
          // setPatient(MOCK_PATIENT);
        }

        // Khởi tạo các trường dữ liệu form
        setDiagnosisDisease(formattedMedicalRecord.diagnosisDisease || "");
        setNote(formattedMedicalRecord.note || "");
        setReExaminationDate(formattedMedicalRecord.reExaminationDate || "");
        setDrugs(formattedMedicalRecord.drugs || []);
      } catch (error) {
        console.error("Error fetching medical record:", error);
        setError("Không thể tải hồ sơ bệnh án");
      } finally {
        setLoading(false);
      }
    };
    // Hàm lấy thông tin bệnh nhân
    const fetchPatientInfo = async (userId: string) => {
      setPatientLoading(true);
      setPatientError(null);

      try {
        const response = await getPatientInfo(userId);
        console.log("Patient API response:", response);

        if (response.data && response.data.data) {
          setPatient(response.data.data);
        } else {
          // Sử dụng dữ liệu mẫu nếu API không trả về dữ liệu
          console.warn("No patient data returned from API, using mock data");
          setPatient(MOCK_PATIENT);
        }
      } catch (error) {
        console.error("Error fetching patient info:", error);
        setPatientError("Không thể tải thông tin bệnh nhân");
        // Sử dụng dữ liệu mẫu khi có lỗi
        setPatient(MOCK_PATIENT);
      } finally {
        setPatientLoading(false);
      }
    };

    fetchMedicalRecord();
  }, [appointmentId, patientId, open]);

  // Lấy lịch sử khám bệnh khi chuyển sang tab lịch sử
  useEffect(() => {
    if (activeTab === 1 && appointmentId && patientId) {
      fetchPatientHistory();
    }
  }, [activeTab, appointmentId, patientId]);

  // Hàm lấy lịch sử khám bệnh của bệnh nhân
  const fetchPatientHistory = async () => {
    if (!appointmentId || !patientId) return;

    setHistoryLoading(true);
    setHistoryError(null);

    try {
      const response = await getMedicalRecordPrevious(patientId, appointmentId);
      console.log("Patient history response:", response);

      if (response.data && Array.isArray(response.data)) {
        // Chuyển đổi dữ liệu API sang định dạng sử dụng trong component
        const formattedHistory = response.data.map((item) => {
          // Trích xuất tên bác sĩ
          const doctorFirstName = item.doctor?.doctor?.firstName || "";
          const doctorLastName = item.doctor?.doctor?.lastName || "";
          const doctorName = `Dr. ${doctorLastName} ${doctorFirstName}`.trim();

          return {
            id: item.medicalRecord?.id || 0,
            doctorName,
            diagnosisDisease: item.medicalRecord?.diagnosisDisease || "",
            dateAppoinment: item.doctor?.dateAppointment
              ? `${item.doctor.dateAppointment}`
              : "",
            status: item.medicalRecord?.bookAppointment?.status || "",
            appointmentId: item.medicalRecord?.bookAppointment?.id,
            drugs: item.drugs || [],
            note: item.medicalRecord?.note,
            reExaminationDate: item.medicalRecord?.reExaminationDate,
            // Lưu trữ dữ liệu đầy đủ cho xem chi tiết
            fullData: item,
          };
        });

        setPatientHistory(formattedHistory);
      } else {
        setPatientHistory([]);
      }
    } catch (error) {
      console.error("Error fetching patient history:", error);
      setHistoryError("Không thể tải lịch sử khám bệnh");
      setPatientHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  // Hàm xử lý khi chọn xem chi tiết một bản ghi lịch sử
  const handleSelectHistoryRecord = (recordId: number) => {
    setExpandedRecords((prev) => {
      if (prev.includes(recordId)) {
        // Nếu đang mở, đóng lại và xóa dữ liệu chi tiết
        return prev.filter((id) => id !== recordId);
      } else {
        // Khi mở rộng, tìm và đặt dữ liệu chi tiết
        const historyItem = patientHistory.find((item) => item.id === recordId);
        if (historyItem) {
          setSelectedHistoryData(historyItem);
        }
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

  // Hàm bắt đầu chỉnh sửa hồ sơ
  const handleStartEditing = () => {
    if (!canEdit) {
      window.alert("Không thể chỉnh sửa hồ sơ bệnh án đã lưu");
      return;
    }

    setIsEditing(true);
  };

  // Hàm hủy bỏ chỉnh sửa
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

  // Hàm lưu thông tin hồ sơ bệnh án
  const handleSave = async () => {
    if (!medicalRecord || !appointmentId) return;

    if (!diagnosisDisease.trim()) {
      window.alert("Vui lòng nhập chẩn đoán bệnh");
      return;
    }

    if (!reExaminationDate) {
      window.alert("Vui lòng chọn ngày tái khám");
      return;
    }

    // Ensure re-examination date is in the future
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time component to compare dates only
    const reExamDate = new Date(reExaminationDate);

    if (reExamDate <= today) {
      window.alert("Ngày tái khám phải là ngày trong tương lai");
      return;
    }

    // Add confirmation dialog before saving
    const confirmSave = window.confirm(
      "Lưu ý: Sau khi lưu hồ sơ bệnh án, bạn sẽ không thể chỉnh sửa lại. Bạn có chắc chắn muốn lưu không?"
    );

    if (!confirmSave) {
      return;
    }

    setSaving(true);
    setError(null);

    try {
      // Định dạng mảng thuốc theo yêu cầu của API
      const formattedDrugs = drugs.map((drug) => ({
        drugId: drug.drug.id,
        quantity: drug.quantity,
        howUse: drug.howUse,
      }));

      // Chuyển đổi định dạng ngày từ yyyy-MM-dd sang dd-MM-yyyy
      const formatDateToApi = (dateStr: string) => {
        if (!dateStr) return dateStr;
        const [year, month, day] = dateStr.split("-");
        return `${day}-${month}-${year}`;
      };

      // Tạo đối tượng hồ sơ với định dạng phù hợp
      const updatedRecord = {
        bookAppointmentId: appointmentId,
        diagnosisDisease,
        note: note || null, // Đảm bảo gửi null nếu không có dữ liệu
        reExaminationDate: formatDateToApi(reExaminationDate),
        drugs: formattedDrugs,
      };

      const result = await createMedicalRecord(updatedRecord)
        .then((response) => response.data.data)
        .catch((error) => {
          console.error(error);
          return null;
        });

      console.log(result);
      console.log("Lưu hồ sơ bệnh án:", updatedRecord);

      // Cập nhật state hiện tại
      setMedicalRecord({
        ...medicalRecord,
        diagnosisDisease,
        note,
        reExaminationDate,
        drugs,
      });
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

  // Hàm thêm thuốc mới vào danh sách
  const handleAddDrug = () => {
    if (!selectedDrug || !medicalRecord) return;

    if (!howUse.trim()) {
      alert("Vui lòng nhập cách dùng thuốc");
      return;
    }

    const newDrug: MedicalRecordDrug = {
      drug: {
        id: selectedDrug.id,
        drugName: selectedDrug.drugName,
        unit: selectedDrug.unit,
      },
      howUse: howUse,
      quantity: drugQuantity,
    };

    setDrugs([...drugs, newDrug]);
    setSelectedDrug(null);
    setHowUse("");
    setDrugQuantity(1);
  };

  // Hàm xóa thuốc khỏi danh sách
  const handleRemoveDrug = (index: number) => {
    const updatedDrugs = [...drugs];
    updatedDrugs.splice(index, 1);
    setDrugs(updatedDrugs);
  };

  // Chuyển đổi trạng thái thành nhãn tiếng Việt
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

  // Xử lý khi chuyển tab
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    // Reset lựa chọn lịch sử khi chuyển sang tab lịch sử
    if (newValue === 1) {
      setSelectedHistoryRecord(null);
    }
  };

  // DataGrid columns for drugs
  const drugGridColumns: GridColDef[] = [
    { field: "drugName", headerName: "Tên thuốc", flex: 2, minWidth: 180 },
    { field: "howUse", headerName: "Cách dùng", flex: 2, minWidth: 180 },
    {
      field: "quantity",
      headerName: "Số lượng",
      flex: 1,
      minWidth: 100,
      align: "center",
      headerAlign: "center",
    },
    { field: "unit", headerName: "Đơn vị", flex: 1, minWidth: 100 },
  ];
  const drugCsvOptions: GridCsvExportOptions = {
    fileName: "drugs",
    delimiter: ",",
    utf8WithBom: true,
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

            {patientLoading ? (
              <Box sx={{ display: "flex", py: 2, justifyContent: "center" }}>
                <CircularProgress size={24} />
              </Box>
            ) : patientError ? (
              <Alert severity="warning" sx={{ mb: 2 }}>
                {patientError}
              </Alert>
            ) : patient ? (
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
                    <strong>Giới tính:</strong> {patient.sex ? "Nữ" : "Nam"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2">
                    <strong>Ngày sinh:</strong> {patient.dob} (
                    {calculateAge(patient.dob)} tuổi)
                  </Typography>
                </Grid>
              </Grid>
            ) : (
              <Typography color="text.secondary" sx={{ py: 1 }}>
                Không có thông tin bệnh nhân
              </Typography>
            )}

            <Divider sx={{ my: 1 }} />

            {/* Tab Navigation */}
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                aria-label="medical record tabs"
                variant="fullWidth" // Change to fullWidth to take entire available space
                sx={{
                  minHeight: 36,
                  "& .MuiTab-root": {
                    minHeight: 36,
                    py: 0.5,
                    fontSize: "0.85rem",
                  },
                }}
              >
                <Tab
                  icon={<MedicalInformationIcon sx={{ fontSize: 16 }} />}
                  iconPosition="start"
                  label="Ca Khám Hiện Tại"
                  id="medical-tab-0"
                  sx={{ textTransform: "none" }}
                />
                <Tab
                  icon={<HistoryIcon sx={{ fontSize: 16 }} />}
                  iconPosition="start"
                  label="Lịch Sử Khám Bệnh"
                  id="medical-tab-1"
                  sx={{ textTransform: "none" }}
                />
              </Tabs>
            </Box>

            {/* Current Record Tab */}
            <TabPanel value={activeTab} index={0}>
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
                        {formatCreatedAtDate(medicalRecord.dateAppointment)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2">
                        <strong>Bác sĩ khám:</strong> {medicalRecord.doctorName}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2">
                        <strong>Mã lịch khám:</strong>{" "}
                        {medicalRecord.appointmentId}
                      </Typography>
                    </Grid>
                    {/* <Grid item xs={12} sm={6}>
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
                    </Grid> */}
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
                            options={availableDrugs}
                            getOptionLabel={(option) =>
                              `${option.drugName} (${option.unit})`
                            }
                            value={selectedDrug}
                            onChange={(_, newValue) =>
                              setSelectedDrug(newValue)
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Tên thuốc"
                                size="small"
                                fullWidth
                              />
                            )}
                            loading={loadingDrugs}
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
                    <Box sx={{ width: "100%", mt: 1 }}>
                      <DataGrid
                        rows={drugs.map((d, idx) => ({
                          ...d,
                          id: idx + 1,
                          drugName: d.drug?.drugName || "",
                          unit: d.drug?.unit || "",
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
                        sx={{ background: "white", borderRadius: 1 }}
                      />
                    </Box>
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

              {historyLoading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : historyError ? (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {historyError}
                </Alert>
              ) : patientHistory.length === 0 ? (
                <Typography
                  color="text.secondary"
                  sx={{ textAlign: "center", py: 2 }}
                >
                  Không có lịch sử khám bệnh
                </Typography>
              ) : (
                <List
                  sx={{ width: "100%", bgcolor: "background.paper", mb: 3 }}
                >
                  {patientHistory.map((record) => (
                    <React.Fragment key={record.id}>
                      <ListItem
                        disablePadding
                        divider
                        secondaryAction={
                          <IconButton
                            edge="end"
                            onClick={() => handleSelectHistoryRecord(record.id)}
                          >
                            {expandedRecords.includes(record.id) ? (
                              <ExpandLessIcon />
                            ) : (
                              <ExpandMoreIcon />
                            )}
                          </IconButton>
                        }
                      >
                        <ListItemButton
                          onClick={() => handleSelectHistoryRecord(record.id)}
                        >
                          <ListItemText
                            primary={
                              <Typography variant="subtitle2">
                                {formatCreatedAtDate(record.dateAppoinment)} -{" "}
                                {record.diagnosisDisease}
                              </Typography>
                            }
                            secondary={
                              <Box
                                component="span"
                                display="flex"
                                alignItems="center"
                                gap={1}
                              >
                                <span>Bác sĩ: {record.doctorName}</span>
                              </Box>
                            }
                          />
                        </ListItemButton>
                      </ListItem>

                      <Collapse
                        in={expandedRecords.includes(record.id)}
                        timeout="auto"
                        unmountOnExit
                      >
                        <Box
                          sx={{
                            p: 2,
                            bgcolor: "#f8f8f8",
                            borderRadius: 1,
                            mb: 1,
                          }}
                        >
                          {expandedRecords.includes(record.id) && (
                            <>
                              <Grid container spacing={2} sx={{ mb: 3 }}>
                                <Grid item xs={12} sm={6}>
                                  <Typography variant="body2">
                                    <strong>Ngày khám:</strong>{" "}
                                    {formatCreatedAtDate(record.dateAppoinment)}
                                  </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                  <Typography variant="body2">
                                    <strong>Bác sĩ khám:</strong>{" "}
                                    {record.doctorName}
                                  </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                  <Typography variant="body2">
                                    <strong>Mã lịch khám:</strong>{" "}
                                    {record.appointmentId}
                                  </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                  <Typography variant="body2">
                                    <strong>Trạng thái:</strong>{" "}
                                    <Chip
                                      label={getStatusLabel(record.status)}
                                      size="small"
                                      color={
                                        record.status === "DONE"
                                          ? "success"
                                          : "default"
                                      }
                                    />
                                  </Typography>
                                </Grid>
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
                                  {record.diagnosisDisease}
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                  <strong>Ghi chú:</strong>{" "}
                                  {record.note || "Không có ghi chú"}
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                  <strong>Ngày tái khám:</strong>{" "}
                                  {record.reExaminationDate ||
                                    "Không có lịch tái khám"}
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
                                      drugName:
                                        d.id?.drug?.drugName ||
                                        d.drug?.drugName ||
                                        "",
                                      unit:
                                        d.id?.drug?.unit || d.drug?.unit || "",
                                    }))}
                                    columns={drugGridColumns}
                                    getRowId={(row) => row.id}
                                    hideFooterSelectedRowCount
                                    hideFooterPagination
                                    slots={{ toolbar: GridToolbar }}
                                    slotProps={{
                                      toolbar: {
                                        csvOptions: drugCsvOptions,
                                        printOptions: {
                                          disableToolbarButton: false,
                                        },
                                        showQuickFilter: false,
                                      },
                                    }}
                                    disableColumnFilter
                                    disableColumnSelector
                                    // disableDensitySelector
                                    sx={{
                                      background: "white",
                                      borderRadius: 1,
                                    }}
                                  />
                                </Box>
                              ) : (
                                <Typography
                                  color="text.secondary"
                                  sx={{ py: 1 }}
                                >
                                  Không có thuốc nào được kê đơn
                                </Typography>
                              )}
                            </>
                          )}
                        </Box>
                      </Collapse>
                    </React.Fragment>
                  ))}
                </List>
              )}
            </TabPanel>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        {isDoctor &&
          medicalRecord &&
          activeTab === 0 &&
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
                medicalRecord.status !== "WAITING"
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
