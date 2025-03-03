import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Tabs,
  Tab,
  Divider,
  Card,
  CardContent,
  Autocomplete,
  IconButton,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { styled } from "@mui/material/styles";
import {
  getMedicalRecordById,
  saveMedicalRecord,
} from "../../services/medicalRecordService";
import { MedicalRecord, MedicalRecordDrug, Drug } from "../../types/medical";
import {
  parseDateFromString,
  formatDateToString,
  formatCreatedAtDate,
} from "../../utils/dateUtils";
import { User } from "../../types/user";

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
      id={`medical-record-tabpanel-${index}`}
      aria-labelledby={`medical-record-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

// Mock drugs data for the autocomplete
const MOCK_DRUGS: Drug[] = [
  { id: 1, drugName: "Paracetamol", unit: "tablet" },
  { id: 2, drugName: "Amoxicillin", unit: "capsule" },
  { id: 3, drugName: "Ibuprofen", unit: "tablet" },
  { id: 4, drugName: "Cetirizine", unit: "tablet" },
  { id: 5, drugName: "Omeprazole", unit: "capsule" },
  { id: 6, drugName: "Losartan", unit: "tablet" },
  { id: 7, drugName: "Metformin", unit: "tablet" },
  { id: 8, drugName: "Atorvastatin", unit: "tablet" },
  { id: 9, drugName: "Salbutamol", unit: "inhaler" },
  { id: 10, drugName: "Vitamin C", unit: "tablet" },
];

// Mock patient data for detailed information
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

// Add mock medical record data
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

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

const MedicalRecordPage: React.FC = () => {
  const { t } = useTranslation();
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);

  const [medicalRecord, setMedicalRecord] = useState<MedicalRecord | null>(
    null
  );
  const [diagnosisDisease, setDiagnosisDisease] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [reExaminationDate, setReExaminationDate] = useState<string>("");
  const [drugs, setDrugs] = useState<MedicalRecordDrug[]>([]);

  // New drug form state
  const [selectedDrug, setSelectedDrug] = useState<Drug | null>(null);
  const [howUse, setHowUse] = useState<string>("");
  const [drugQuantity, setDrugQuantity] = useState<number>(1);

  const [patient, setPatient] = useState<User | null>(null);

  useEffect(() => {
    const fetchMedicalRecord = async () => {
      if (!appointmentId) return;

      setLoading(true);
      try {
        // Comment out actual API call
        // const record = await getMedicalRecordById(parseInt(appointmentId));

        // Use mock data instead
        const record = MOCK_MEDICAL_RECORD;

        if (record) {
          setMedicalRecord(record);
          setDiagnosisDisease(record.diagnosisDisease || "");
          setNote(record.note || "");
          setReExaminationDate(record.reExaminationDate || "");
          setDrugs(record.drugs || []);
        } else {
          setError(
            t(
              "doctor.medical_records.record_not_found",
              "Medical record not found"
            )
          );
        }

        // In a real app, you would fetch the patient details from an API
        // For now, let's use the mock data
        setPatient(MOCK_PATIENT);
      } catch (error) {
        console.error("Error fetching medical record:", error);
        setError("Failed to load medical record");
      } finally {
        setLoading(false);
      }
    };

    fetchMedicalRecord();
  }, [appointmentId, t]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleAddDrug = () => {
    if (!selectedDrug || !medicalRecord) return;

    if (!howUse.trim()) {
      // Simple validation for usage instructions
      alert("Please enter how to use the medication");
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

  const handleSaveMedicalRecord = async () => {
    if (!medicalRecord) return;

    setSaving(true);
    setSaveSuccess(false);
    setError(null);

    try {
      const updatedRecord: MedicalRecord = {
        ...medicalRecord,
        diagnosisDisease,
        note,
        reExaminationDate,
        drugs,
      };

      // Comment out actual API call
      // await saveMedicalRecord(updatedRecord);

      // Mock successful save
      console.log("Mock saving medical record:", updatedRecord);
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSaveSuccess(true);

      // Reset success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving medical record:", error);
      setError("Failed to save medical record");
    } finally {
      setSaving(false);
    }
  };

  const handleBackToAppointments = () => {
    navigate("/doctor/appointments");
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error && !medicalRecord) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
        <Box sx={{ mt: 2 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBackToAppointments}
          >
            {t("common.back", "Back")}
          </Button>
        </Box>
      </Box>
    );
  }

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

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <IconButton onClick={handleBackToAppointments} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" component="h1">
          {t("doctor.medical_records.title", "Medical Record")}
        </Typography>
      </Box>

      {saveSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {t(
            "doctor.medical_records.save_success",
            "Medical record saved successfully"
          )}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="medical record tabs"
        >
          <Tab
            label={t(
              "doctor.medical_records.tabs.patient_info",
              "Patient Information"
            )}
          />
          <Tab
            label={t("doctor.medical_records.tabs.diagnosis", "Diagnosis")}
          />
          <Tab
            label={t("doctor.medical_records.tabs.medications", "Medications")}
          />
        </Tabs>
      </Box>

      {/* Patient Information Tab */}
      <TabPanel value={tabValue} index={0}>
        <StyledPaper>
          <Typography variant="h6" gutterBottom>
            {t("doctor.medical_records.patient_details", "Patient Details")}
          </Typography>

          {patient ? (
            <>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <strong>
                      {t("doctor.medical_records.patient_name", "Patient Name")}
                      :
                    </strong>{" "}
                    {patient.lastName} {patient.firstName}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <strong>
                      {t("doctor.medical_records.patient_id", "Patient ID")}:
                    </strong>{" "}
                    {patient.userId}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <strong>
                      {t("doctor.medical_records.gender", "Gender")}:
                    </strong>{" "}
                    {patient.sex
                      ? t("register.input_info.sex_male", "Nam")
                      : t("register.input_info.sex_female", "Nữ")}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <strong>
                      {t(
                        "doctor.medical_records.date_of_birth",
                        "Date of Birth"
                      )}
                      :
                    </strong>{" "}
                    {patient.dob} ({calculateAge(patient.dob)}{" "}
                    {t("doctor.profile.years", "years")})
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <strong>{t("register.input_info.phone", "Phone")}:</strong>{" "}
                    {patient.phone}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1">
                    <strong>{t("register.input_info.email", "Email")}:</strong>{" "}
                    {patient.email}
                  </Typography>
                </Grid>

                {patient.address && (
                  <Grid item xs={12}>
                    <Typography variant="body1">
                      <strong>
                        {t("register.input_info.address.title", "Address")}:
                      </strong>{" "}
                      {patient.address.number} {patient.address.street},{" "}
                      {patient.address.ward}, {patient.address.district},{" "}
                      {patient.address.city}, {patient.address.country}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </>
          ) : (
            <Typography color="text.secondary">
              {t(
                "doctor.medical_records.no_patient_data",
                "No patient data available"
              )}
            </Typography>
          )}
        </StyledPaper>

        {/* Appointment Details Paper */}
        <StyledPaper>
          <Typography variant="h6" gutterBottom>
            {t(
              "doctor.medical_records.appointment_details",
              "Appointment Details"
            )}
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>
                  {t(
                    "doctor.medical_records.appointment_date",
                    "Appointment Date"
                  )}
                  :
                </strong>{" "}
                {medicalRecord?.createdAt
                  ? formatCreatedAtDate(medicalRecord.createdAt)
                  : ""}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>
                  {t("doctor.medical_records.doctor_name", "Doctor")}:
                </strong>{" "}
                {medicalRecord?.appointment.doctor}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>{t("doctor.medical_records.room", "Room")}:</strong>{" "}
                {medicalRecord?.roomId}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>{t("doctor.medical_records.status", "Status")}:</strong>{" "}
                <Chip label="Completed" size="small" color="success" />
              </Typography>
            </Grid>
          </Grid>
        </StyledPaper>
      </TabPanel>

      {/* Diagnosis Tab */}
      <TabPanel value={tabValue} index={1}>
        <StyledPaper>
          <Typography variant="h6" gutterBottom>
            {t("doctor.medical_records.diagnosis", "Diagnosis")}
          </Typography>
          <TextField
            label={t(
              "doctor.medical_records.diagnosis_disease",
              "Diagnosis Disease"
            )}
            value={diagnosisDisease}
            onChange={(e) => setDiagnosisDisease(e.target.value)}
            fullWidth
            margin="normal"
          />

          <TextField
            label={t("doctor.medical_records.notes", "Notes")}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            multiline
            rows={5}
            fullWidth
            margin="normal"
            placeholder={t(
              "doctor.medical_records.notes_placeholder",
              "Enter notes about patient condition, diet, lifestyle..."
            )}
          />

          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              {t("doctor.medical_records.follow_up", "Follow Up")}
            </Typography>
            <TextField
              label={t(
                "doctor.medical_records.reexamination_date",
                "Re-examination Date"
              )}
              type="date"
              value={reExaminationDate}
              onChange={(e) => setReExaminationDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
            />
          </Box>
        </StyledPaper>
      </TabPanel>

      {/* Medications Tab */}
      <TabPanel value={tabValue} index={2}>
        <StyledPaper>
          <Typography variant="h6" gutterBottom>
            {t("doctor.medical_records.add_medication", "Add Medication")}
          </Typography>

          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
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
                    label={t(
                      "doctor.medical_records.medication_name",
                      "Medication Name"
                    )}
                    placeholder={t(
                      "doctor.medical_records.search_medication",
                      "Search medication..."
                    )}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="How to Use"
                value={howUse}
                onChange={(e) => setHowUse(e.target.value)}
                placeholder="E.g., Take 1 tablet after breakfast"
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                fullWidth
                label={t("doctor.medical_records.quantity", "Quantity")}
                type="number"
                InputProps={{ inputProps: { min: 1 } }}
                value={drugQuantity}
                onChange={(e) => setDrugQuantity(parseInt(e.target.value) || 1)}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleAddDrug}
                disabled={!selectedDrug || !howUse.trim()}
                fullWidth
                sx={{ height: "56px" }}
              >
                {t("doctor.medical_records.add", "Add")}
              </Button>
            </Grid>
          </Grid>
        </StyledPaper>

        <StyledPaper>
          <Typography variant="h6" gutterBottom>
            {t("doctor.medical_records.medications_list", "Medications List")}
          </Typography>

          {drugs.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 3 }}>
              <Typography color="text.secondary">
                {t(
                  "doctor.medical_records.no_medications",
                  "No medications prescribed"
                )}
              </Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Medication</TableCell>
                    <TableCell>How to Use</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Unit</TableCell>
                    <TableCell align="center">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {drugs.map((drug, index) => (
                    <TableRow key={index}>
                      <TableCell>{drug.drug.drugName}</TableCell>
                      <TableCell>{drug.howUse}</TableCell>
                      <TableCell>{drug.quantity}</TableCell>
                      <TableCell>{drug.drug.unit}</TableCell>
                      <TableCell align="center">
                        <IconButton
                          color="error"
                          onClick={() => handleRemoveDrug(index)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </StyledPaper>
      </TabPanel>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
        <Button
          variant="outlined"
          color="inherit"
          onClick={handleBackToAppointments}
          sx={{ mr: 2 }}
        >
          {t("common.cancel", "Cancel")}
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSaveMedicalRecord}
          disabled={saving}
        >
          {saving ? t("common.saving", "Saving...") : t("common.save", "Save")}
        </Button>
      </Box>
    </Box>
  );
};

export default MedicalRecordPage;
