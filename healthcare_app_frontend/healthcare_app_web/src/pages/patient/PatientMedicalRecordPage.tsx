import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Tabs,
  Tab,
  Divider,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { getMedicalRecordById } from "../../services/medicalRecordService";
import { MedicalRecord, MedicalRecordDrug } from "../../types/medical";
import { parseDateFromString, formatDateToString } from "../../utils/dateUtils";
import { format } from "date-fns";

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

const MOCK_DOCTOR = {
  id: 1,
  userId: "doctor-001",
  firstName: "Thành",
  lastName: "Nguyễn Bá",
  specialization: "Tim Mạch",
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

// Mock patient data for detailed information
const MOCK_PATIENT = {
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
  status: true,
};

const PatientMedicalRecordPage: React.FC = () => {
  const { t } = useTranslation();
  const { recordId } = useParams<{ recordId: string }>();
  const navigate = useNavigate();

  // Add console log to debug the recordId
  console.log("Medical record page loaded with ID:", recordId);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [medicalRecord, setMedicalRecord] = useState<MedicalRecord | null>(
    null
  );
  const [patient, setPatient] = useState(MOCK_PATIENT);

  useEffect(() => {
    const fetchMedicalRecord = async () => {
      if (!recordId) return;

      setLoading(true);
      try {
        console.log("Fetching medical record with ID:", recordId);

        // In a real app this would call an API
        // const record = await getMedicalRecordById(parseInt(recordId));

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Using mock data for demonstration
        setMedicalRecord(MOCK_MEDICAL_RECORD);
        console.log("Medical record loaded:", MOCK_MEDICAL_RECORD);
      } catch (error) {
        console.error("Error fetching medical record:", error);
        setError("Failed to load medical record");
      } finally {
        setLoading(false);
      }
    };

    fetchMedicalRecord();
  }, [recordId]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleBackToAppointments = () => {
    navigate("/patient/appointments");
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

  if (error || !medicalRecord) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          {error ||
            t(
              "patient.medical_records.record_not_found",
              "Medical record not found"
            )}
        </Alert>
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

  // Parse date from string or use current date
  const getFormattedDate = (dateString: string) => {
    try {
      if (!dateString) return "";

      // Handle date format like "20-07-2023-09-30-00"
      if (dateString.includes("-")) {
        const parts = dateString.split("-");
        if (parts.length >= 6) {
          const day = parseInt(parts[0]);
          const month = parseInt(parts[1]) - 1; // Month is 0-indexed in JS Date
          const year = parseInt(parts[2]);
          const hour = parseInt(parts[3]);
          const minute = parseInt(parts[4]);
          return format(
            new Date(year, month, day, hour, minute),
            "dd/MM/yyyy HH:mm"
          );
        }
      }

      // Try standard date parsing
      return format(new Date(dateString), "dd/MM/yyyy");
    } catch (e) {
      console.error("Error parsing date:", e);
      return dateString;
    }
  };

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth: string) => {
    try {
      const parts = dateOfBirth.split("-");
      const day = parseInt(parts[0]);
      const month = parseInt(parts[1]) - 1; // Month is 0-indexed in JS Date
      const year = parseInt(parts[2]);

      const today = new Date();
      const birthDate = new Date(year, month, day);

      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();

      if (
        monthDifference < 0 ||
        (monthDifference === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      return age;
    } catch (e) {
      console.error("Error calculating age:", e);
      return "";
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <IconButton onClick={handleBackToAppointments} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" component="h1">
          {t("patient.medical_records.title", "Medical Record")}
        </Typography>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="medical record tabs"
        >
          <Tab
            label={t(
              "patient.medical_records.tabs.patient_information",
              "Patient Information"
            )}
          />
          <Tab label={t("patient.medical_records.diagnosis", "Diagnosis")} />
          <Tab
            label={t("patient.medical_records.medications", "Medications")}
          />
        </Tabs>
      </Box>

      {/* Patient Information Tab (renamed from Appointment Details) */}
      <TabPanel value={tabValue} index={0}>
        {/* Patient Personal Information */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            {t(
              "patient.medical_records.patient_information",
              "Patient Information"
            )}
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>
                  {t("doctor.medical_records.patient_name", "Patient Name")}:
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
                <strong>{t("doctor.medical_records.gender", "Gender")}:</strong>{" "}
                {patient.sex
                  ? t("register.input_info.sex_male", "Nam")
                  : t("register.input_info.sex_female", "Nữ")}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>
                  {t("doctor.medical_records.date_of_birth", "Date of Birth")}:
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
        </Paper>

        {/* Appointment Details */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            {t(
              "patient.medical_records.appointment_details",
              "Appointment Details"
            )}
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>
                  {t("patient.medical_records.doctor", "Doctor")}:
                </strong>{" "}
                {medicalRecord.appointment.doctor}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>{t("patient.medical_records.date", "Date")}:</strong>{" "}
                {getFormattedDate(medicalRecord.createdAt)}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>{t("patient.medical_records.room", "Room")}:</strong>{" "}
                {medicalRecord.roomId}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>
                  {t("patient.medical_records.status", "Status")}:
                </strong>{" "}
                <Chip
                  label={t(
                    `patient.appointments.status.${medicalRecord.status}`,
                    medicalRecord.status
                  )}
                  size="small"
                  color={
                    medicalRecord.status === "DONE" ? "success" : "primary"
                  }
                />
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </TabPanel>

      {/* Diagnosis Tab */}
      <TabPanel value={tabValue} index={1}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            {t("patient.medical_records.diagnosis", "Diagnosis")}
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              {t(
                "patient.medical_records.diagnosis_disease",
                "Diagnosis Disease"
              )}
              :
            </Typography>
            <Typography variant="body1" paragraph>
              {medicalRecord.diagnosisDisease ||
                t(
                  "patient.medical_records.no_diagnosis",
                  "No diagnosis recorded"
                )}
            </Typography>

            <Typography variant="subtitle1" gutterBottom>
              {t("patient.medical_records.notes", "Notes")}:
            </Typography>
            <Typography variant="body1" paragraph>
              {medicalRecord.note ||
                t("patient.medical_records.no_notes", "No additional notes")}
            </Typography>

            {medicalRecord.reExaminationDate && (
              <>
                <Typography variant="subtitle1" gutterBottom>
                  {t("patient.medical_records.follow_up", "Follow Up")}:
                </Typography>
                <Typography variant="body1">
                  {getFormattedDate(medicalRecord.reExaminationDate)}
                </Typography>
              </>
            )}
          </Box>
        </Paper>
      </TabPanel>

      {/* Medications Tab */}
      <TabPanel value={tabValue} index={2}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            {t("patient.medical_records.medications_list", "Medications List")}
          </Typography>

          {medicalRecord.drugs && medicalRecord.drugs.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      {t(
                        "patient.medical_records.medication_name",
                        "Medication"
                      )}
                    </TableCell>
                    <TableCell>
                      {t("patient.medical_records.how_to_use", "How to Use")}
                    </TableCell>
                    <TableCell>
                      {t("patient.medical_records.quantity", "Quantity")}
                    </TableCell>
                    <TableCell>
                      {t("patient.medical_records.unit", "Unit")}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {medicalRecord.drugs.map((drug, index) => (
                    <TableRow key={index}>
                      <TableCell>{drug.drug.drugName}</TableCell>
                      <TableCell>{drug.howUse}</TableCell>
                      <TableCell>{drug.quantity}</TableCell>
                      <TableCell>{drug.drug.unit}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box sx={{ textAlign: "center", py: 3 }}>
              <Typography color="text.secondary">
                {t(
                  "patient.medical_records.no_medications",
                  "No medications prescribed"
                )}
              </Typography>
            </Box>
          )}
        </Paper>
      </TabPanel>
    </Box>
  );
};

export default PatientMedicalRecordPage;
