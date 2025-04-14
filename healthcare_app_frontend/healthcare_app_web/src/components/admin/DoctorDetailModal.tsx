import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Tab,
  Tabs,
  Avatar,
  Grid,
  Paper,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Checkbox,
  FormControlLabel,
  FormGroup,
  CircularProgress,
} from "@mui/material";
import {
  Doctor,
  DoctorEducation,
  DoctorCertificate,
  DoctorExperience,
} from "../../types/doctor";
import { Disease } from "../../types/typeDisease";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { Diploma } from "../../types/enums";
import EducationForm from "./forms/EducationForm";
import CertificateForm from "./forms/CertificateForm";
import ExperienceForm from "./forms/ExperienceForm";
import { getAllTypeDiseases } from "../../services/admin/typeDisease_service";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface DoctorDetailModalProps {
  open: boolean;
  onClose: () => void;
  doctor: Doctor | null;
  onUpdate: (updatedDoctor: Doctor) => void;
}

// Component con dùng để hiển thị nội dung của từng tab
const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`doctor-tabpanel-${index}`}
      aria-labelledby={`doctor-tab-${index}`}
      {...other}
      style={{ padding: "16px 0" }}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
};

// Mock disease data for selection in disease modal
const mockDiseases: Disease[] = [
  { id: 1, name: "Bệnh tim mạch", status: true },
  { id: 2, name: "Viêm phổi", status: true },
  { id: 3, name: "Tiểu đường", status: true },
  { id: 4, name: "Cao huyết áp", status: true },
  { id: 5, name: "Viêm khớp", status: true },
  { id: 6, name: "Loãng xương", status: true },
  { id: 7, name: "Đau lưng mãn tính", status: true },
  { id: 8, name: "Viêm xoang", status: true },
  { id: 9, name: "Bệnh dạ dày", status: true },
  { id: 10, name: "Bệnh về mắt", status: true },
];

const DoctorDetailModal: React.FC<DoctorDetailModalProps> = ({
  open,
  onClose,
  doctor,
  onUpdate,
}) => {
  const [tabValue, setTabValue] = useState(0);
  const [isEducationFormOpen, setIsEducationFormOpen] = useState(false);
  const [isCertificateFormOpen, setIsCertificateFormOpen] = useState(false);
  const [isExperienceFormOpen, setIsExperienceFormOpen] = useState(false);
  const [isDiseaseDialogOpen, setIsDiseaseDialogOpen] = useState(false);
  const [selectedEducation, setSelectedEducation] =
    useState<DoctorEducation | null>(null);
  const [selectedCertificate, setSelectedCertificate] =
    useState<DoctorCertificate | null>(null);
  const [selectedExperience, setSelectedExperience] =
    useState<DoctorExperience | null>(null);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");

  // State for managing disease selection
  const [availableDiseases, setAvailableDiseases] = useState<Disease[]>([]);
  const [loadingDiseases, setLoadingDiseases] = useState<boolean>(false);
  const [errorDiseases, setErrorDiseases] = useState<string | null>(null);
  const [selectedDiseases, setSelectedDiseases] = useState<number[]>([]);

  // Reset tab khi modal đóng/mở
  useEffect(() => {
    if (open) {
      setTabValue(0);
    }
  }, [open]);

  // Load available diseases from API
  useEffect(() => {
    if (open) {
      const fetchDiseases = async () => {
        try {
          setLoadingDiseases(true);
          setErrorDiseases(null);
          const response = await getAllTypeDiseases();
          if (response && response.data) {
            // If doctor already has a disease, filter it out
            if (doctor && doctor.typeDisease) {
              setAvailableDiseases(
                response.data.filter(
                  (disease) => disease.id !== doctor.typeDisease?.id
                )
              );
            } else {
              setAvailableDiseases(response.data);
            }
          } else {
            setErrorDiseases("Không thể tải danh sách loại bệnh");
          }
        } catch (error) {
          console.error("Error fetching diseases:", error);
          setErrorDiseases("Đã xảy ra lỗi khi tải danh sách loại bệnh");
        } finally {
          setLoadingDiseases(false);
        }
      };

      fetchDiseases();
    }
  }, [open, doctor]);

  // Xử lý thay đổi tab
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Chuyển đổi Diploma enum sang chuỗi hiển thị
  const getDiplomaLabel = (diploma: Diploma) => {
    switch (diploma) {
      case "BACHELOR":
        return "Cử nhân";
      case "MASTER":
        return "Thạc sĩ";
      case "DOCTOR":
        return "Tiến sĩ";
      default:
        return "Không xác định";
    }
  };

  // Xử lý mở form thêm học vấn mới
  const handleAddEducation = () => {
    setFormMode("add");
    setSelectedEducation(null);
    setIsEducationFormOpen(true);
  };

  // Xử lý mở form sửa học vấn
  const handleEditEducation = (education: DoctorEducation) => {
    setFormMode("edit");
    setSelectedEducation(education);
    setIsEducationFormOpen(true);
  };

  // Xử lý mở form thêm chứng chỉ mới
  const handleAddCertificate = () => {
    setFormMode("add");
    setSelectedCertificate(null);
    setIsCertificateFormOpen(true);
  };

  // Xử lý mở form sửa chứng chỉ
  const handleEditCertificate = (certificate: DoctorCertificate) => {
    setFormMode("edit");
    setSelectedCertificate(certificate);
    setIsCertificateFormOpen(true);
  };

  // Add handler for adding new experience
  const handleAddExperience = () => {
    setFormMode("add");
    setSelectedExperience(null);
    setIsExperienceFormOpen(true);
  };

  // Xử lý mở form sửa kinh nghiệm
  const handleEditExperience = (experience: DoctorExperience) => {
    setFormMode("edit");
    setSelectedExperience(experience);
    setIsExperienceFormOpen(true);
  };

  // Add handler for deleting experiences
  const handleDeleteExperience = (id: number) => {
    if (!doctor?.experiences) return;

    const updatedExperiences = doctor.experiences.filter(
      (exp) => exp.id !== id
    );

    const updatedDoctor = {
      ...doctor,
      experiences: updatedExperiences,
    };

    onUpdate(updatedDoctor);
  };

  // Xử lý lưu thông tin học vấn
  const handleSaveEducation = (educationData: DoctorEducation) => {
    if (!doctor) return;

    let updatedEducations = [...(doctor.educations || [])];

    if (formMode === "add") {
      // Tạo ID mới
      const newId =
        updatedEducations.length > 0
          ? Math.max(...updatedEducations.map((e) => e.id)) + 1
          : 1;

      updatedEducations.push({
        ...educationData,
        id: newId,
        doctorId: doctor.id,
      });
    } else if (selectedEducation) {
      // Cập nhật học vấn hiện có
      updatedEducations = updatedEducations.map((edu) =>
        edu.id === selectedEducation.id
          ? { ...educationData, doctorId: doctor.id }
          : edu
      );
    }

    const updatedDoctor = {
      ...doctor,
      educations: updatedEducations,
    };

    onUpdate(updatedDoctor);
    setIsEducationFormOpen(false);
  };

  // Xử lý xóa học vấn
  const handleDeleteEducation = (id: number) => {
    if (!doctor?.educations) return;

    const updatedEducations = doctor.educations.filter((edu) => edu.id !== id);

    const updatedDoctor = {
      ...doctor,
      educations: updatedEducations,
    };

    onUpdate(updatedDoctor);
  };

  // Xử lý lưu thông tin chứng chỉ
  const handleSaveCertificate = (certificateData: DoctorCertificate) => {
    if (!doctor) return;

    let updatedCertificates = [...(doctor.certificates || [])];

    if (formMode === "add") {
      // Tạo ID mới
      const newId =
        updatedCertificates.length > 0
          ? Math.max(...updatedCertificates.map((c) => c.id)) + 1
          : 1;

      updatedCertificates.push({
        ...certificateData,
        id: newId,
        doctorId: doctor.id,
      });
    } else if (selectedCertificate) {
      // Cập nhật chứng chỉ hiện có
      updatedCertificates = updatedCertificates.map((cert) =>
        cert.id === selectedCertificate.id
          ? { ...certificateData, doctorId: doctor.id }
          : cert
      );
    }

    const updatedDoctor = {
      ...doctor,
      certificates: updatedCertificates,
    };

    onUpdate(updatedDoctor);
    setIsCertificateFormOpen(false);
  };

  // Xử lý xóa chứng chỉ
  const handleDeleteCertificate = (id: number) => {
    if (!doctor?.certificates) return;

    const updatedCertificates = doctor.certificates.filter(
      (cert) => cert.id !== id
    );

    const updatedDoctor = {
      ...doctor,
      certificates: updatedCertificates,
    };

    onUpdate(updatedDoctor);
  };

  // Update the experience save handler to work with multiple experiences
  const handleSaveExperience = (experienceData: DoctorExperience) => {
    if (!doctor) return;

    let updatedExperiences = [...(doctor.experiences || [])];

    if (formMode === "add") {
      // Create new ID
      const newId =
        updatedExperiences.length > 0
          ? Math.max(...updatedExperiences.map((e) => e.id)) + 1
          : 1;

      updatedExperiences.push({
        ...experienceData,
        id: newId,
        doctorId: doctor.id,
      });
    } else if (selectedExperience) {
      // Update existing experience
      updatedExperiences = updatedExperiences.map((exp) =>
        exp.id === selectedExperience.id
          ? { ...experienceData, doctorId: doctor.id }
          : exp
      );
    }

    const updatedDoctor = {
      ...doctor,
      experiences: updatedExperiences,
    };

    onUpdate(updatedDoctor);
    setIsExperienceFormOpen(false);
  };

  // Add a function to handle adding diseases
  const handleAddDiseases = () => {
    setSelectedDiseases([]);
    setIsDiseaseDialogOpen(true);
  };

  // Handle disease selection in the dialog
  const handleDiseaseSelectionChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    diseaseId: number
  ) => {
    setSelectedDiseases((prev) =>
      event.target.checked
        ? [...prev, diseaseId]
        : prev.filter((id) => id !== diseaseId)
    );
  };

  // Handle saving selected disease - now for a single disease
  const handleSaveSelectedDiseases = () => {
    if (!doctor || selectedDiseases.length === 0) return;

    const selectedId = selectedDiseases[0]; // Take just the first selected disease
    const selectedDisease = mockDiseases.find(
      (disease) => disease.id === selectedId
    );

    if (selectedDisease) {
      const updatedDoctor = {
        ...doctor,
        typeDisease: selectedDisease,
      };

      onUpdate(updatedDoctor);
    }
    setIsDiseaseDialogOpen(false);
  };

  // Handle removing a disease from the doctor's list
  const handleRemoveDisease = (id: number) => {
    if (!doctor?.typeDisease) return;

    const updatedDoctor = {
      ...doctor,
      typeDisease: undefined,
    };

    onUpdate(updatedDoctor);
  };

  // Render nội dung modal
  if (!doctor) {
    return null;
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">Thông tin chi tiết bác sĩ</Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar
            src={doctor.avatar || "/default-avatar.png"}
            alt={`${doctor.firstName} ${doctor.lastName}`}
            sx={{ width: 80, height: 80 }}
          />
          <Box>
            <Typography variant="h5">
              {doctor.firstName} {doctor.lastName}
            </Typography>
            <Typography variant="subtitle1" color="primary">
              {doctor.specialization}
            </Typography>
            <Typography variant="body2">
              <Chip
                label={doctor.status ? "Đang hoạt động" : "Không hoạt động"}
                color={doctor.status ? "success" : "error"}
                size="small"
                sx={{ mt: 1 }}
              />
            </Typography>
          </Box>
        </Box>

        <Box>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="doctor tabs"
          >
            <Tab label="Thông tin cơ bản" />
            <Tab label="Học vấn" />
            <Tab label="Chứng chỉ" />
            <Tab label="Kinh nghiệm" />
            <Tab label="Loại bệnh" />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <Paper sx={{ p: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Mã bác sĩ
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {doctor.userId}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Giới tính
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {doctor.sex ? "Nam" : "Nữ"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Ngày sinh
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {new Date(doctor.dob).toLocaleDateString("vi-VN")}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Số điện thoại
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {doctor.phone}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {doctor.email}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Chuyên khoa
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {doctor.specialization}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Loại bệnh có thể khám
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {doctor.typeDisease ? (
                      <Chip
                        key={doctor.typeDisease.id}
                        label={doctor.typeDisease.name}
                        variant="outlined"
                        color="primary"
                        size="small"
                      />
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Chưa có thông tin về loại bệnh có thể khám
                      </Typography>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddEducation}
              >
                Thêm học vấn
              </Button>
            </Box>

            {doctor.educations && doctor.educations.length > 0 ? (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Tên trường</TableCell>
                      <TableCell>Bằng cấp</TableCell>
                      <TableCell>Thời gian</TableCell>
                      <TableCell align="right">Thao tác</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {doctor.educations.map((education) => (
                      <TableRow key={education.id}>
                        <TableCell>{education.schoolName}</TableCell>
                        <TableCell>
                          {getDiplomaLabel(education.diploma)}
                        </TableCell>
                        <TableCell>
                          {new Date(education.joinedDate).getFullYear()} -{" "}
                          {new Date(education.graduateDate).getFullYear()}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleEditEducation(education)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteEducation(education.id)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Paper sx={{ p: 3, textAlign: "center" }}>
                <Typography color="text.secondary">
                  Chưa có thông tin về học vấn
                </Typography>
              </Paper>
            )}
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddCertificate}
              >
                Thêm chứng chỉ
              </Button>
            </Box>

            {doctor.certificates && doctor.certificates.length > 0 ? (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Tên chứng chỉ</TableCell>
                      <TableCell>Ngày cấp</TableCell>
                      <TableCell>Nơi cấp</TableCell>
                      <TableCell align="right">Thao tác</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {doctor.certificates.map((certificate) => (
                      <TableRow key={certificate.id}>
                        <TableCell>{certificate.certName}</TableCell>
                        <TableCell>
                          {new Date(certificate.issueDate).toLocaleDateString(
                            "vi-VN"
                          )}
                        </TableCell>
                        <TableCell>
                          {certificate.address
                            ? `${certificate.address.city}`
                            : "N/A"}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleEditCertificate(certificate)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() =>
                              handleDeleteCertificate(certificate.id)
                            }
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Paper sx={{ p: 3, textAlign: "center" }}>
                <Typography color="text.secondary">
                  Chưa có thông tin về chứng chỉ
                </Typography>
              </Paper>
            )}
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddExperience}
              >
                Thêm kinh nghiệm
              </Button>
            </Box>

            {doctor.experiences && doctor.experiences.length > 0 ? (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Tên công ty/Cơ sở y tế</TableCell>
                      <TableCell>Chuyên môn</TableCell>
                      <TableCell>Thời gian</TableCell>
                      <TableCell align="right">Thao tác</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {doctor.experiences.map((experience) => (
                      <TableRow key={experience.id}>
                        <TableCell>{experience.compName}</TableCell>
                        <TableCell>{experience.specialization}</TableCell>
                        <TableCell>
                          {new Date(experience.startDate).toLocaleDateString(
                            "vi-VN"
                          )}
                          {experience.endDate
                            ? ` - ${new Date(
                                experience.endDate
                              ).toLocaleDateString("vi-VN")}`
                            : " - Hiện tại"}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleEditExperience(experience)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() =>
                              handleDeleteExperience(experience.id)
                            }
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Paper sx={{ p: 3, textAlign: "center" }}>
                <Typography color="text.secondary">
                  Chưa có thông tin về kinh nghiệm
                </Typography>
              </Paper>
            )}
          </TabPanel>

          <TabPanel value={tabValue} index={4}>
            <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddDiseases}
                disabled={doctor.typeDisease !== undefined} // Disable if already has a disease
              >
                Thêm loại bệnh
              </Button>
            </Box>

            {doctor.typeDisease ? (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Tên loại bệnh</TableCell>
                      <TableCell>Trạng thái</TableCell>
                      <TableCell align="right">Thao tác</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>{doctor.typeDisease.name}</TableCell>
                      <TableCell>
                        <Chip
                          label={
                            doctor.typeDisease.status
                              ? "Đang hoạt động"
                              : "Không hoạt động"
                          }
                          color={
                            doctor.typeDisease.status ? "success" : "error"
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => {
                            const updatedDoctor = {
                              ...doctor,
                              typeDisease: undefined,
                            };
                            onUpdate(updatedDoctor);
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Paper sx={{ p: 3, textAlign: "center" }}>
                <Typography color="text.secondary">
                  Chưa có thông tin về loại bệnh có thể khám
                </Typography>
              </Paper>
            )}
          </TabPanel>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Đóng</Button>
      </DialogActions>

      {/* Form chỉnh sửa học vấn */}
      <EducationForm
        open={isEducationFormOpen}
        onClose={() => setIsEducationFormOpen(false)}
        onSubmit={handleSaveEducation}
        education={selectedEducation}
        mode={formMode}
      />

      {/* Form chỉnh sửa chứng chỉ */}
      <CertificateForm
        open={isCertificateFormOpen}
        onClose={() => setIsCertificateFormOpen(false)}
        onSubmit={handleSaveCertificate}
        certificate={selectedCertificate}
        mode={formMode}
      />

      {/* Form chỉnh sửa kinh nghiệm */}
      <ExperienceForm
        open={isExperienceFormOpen}
        onClose={() => setIsExperienceFormOpen(false)}
        onSubmit={handleSaveExperience}
        experience={selectedExperience}
        mode={formMode}
      />

      {/* Dialog for adding diseases */}
      <Dialog
        open={isDiseaseDialogOpen}
        onClose={() => setIsDiseaseDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Chọn loại bệnh</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            {loadingDiseases ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
                <CircularProgress size={24} />
              </Box>
            ) : errorDiseases ? (
              <Typography color="error" align="center">
                {errorDiseases}
              </Typography>
            ) : availableDiseases.length > 0 ? (
              <FormGroup>
                {availableDiseases.map((disease) => (
                  <FormControlLabel
                    key={disease.id}
                    control={
                      <Checkbox
                        checked={selectedDiseases.includes(disease.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            // Only allow one selection
                            setSelectedDiseases([disease.id]);
                          } else {
                            setSelectedDiseases([]);
                          }
                        }}
                      />
                    }
                    label={disease.name}
                  />
                ))}
              </FormGroup>
            ) : (
              <Typography color="text.secondary" align="center">
                Không có loại bệnh nào để chọn
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDiseaseDialogOpen(false)}>Hủy</Button>
          <Button
            onClick={handleSaveSelectedDiseases}
            variant="contained"
            color="primary"
            disabled={selectedDiseases.length === 0}
          >
            Chọn
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};

export default DoctorDetailModal;
