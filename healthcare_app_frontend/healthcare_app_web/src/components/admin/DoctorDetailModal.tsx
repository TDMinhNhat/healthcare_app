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
} from "@mui/material";
import {
  Doctor,
  DoctorEducation,
  DoctorCertificate,
  DoctorExperience,
} from "../../types/doctor";
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
  const [selectedEducation, setSelectedEducation] =
    useState<DoctorEducation | null>(null);
  const [selectedCertificate, setSelectedCertificate] =
    useState<DoctorCertificate | null>(null);
  const [selectedExperience, setSelectedExperience] =
    useState<DoctorExperience | null>(null);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");

  // Reset tab khi modal đóng/mở
  useEffect(() => {
    if (open) {
      setTabValue(0);
    }
  }, [open]);

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
      case "ASSOCIATE":
        return "Cao đẳng";
      case "SPECIALIST_1":
        return "Chuyên khoa 1";
      case "SPECIALIST_2":
        return "Chuyên khoa 2";
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

  // Xử lý mở form sửa kinh nghiệm
  const handleEditExperience = (experience: DoctorExperience) => {
    setSelectedExperience(experience);
    setIsExperienceFormOpen(true);
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

  // Xử lý lưu thông tin kinh nghiệm
  const handleSaveExperience = (experienceData: DoctorExperience) => {
    if (!doctor) return;

    const updatedDoctor = {
      ...doctor,
      experience: experienceData,
    };

    onUpdate(updatedDoctor);
    setIsExperienceFormOpen(false);
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
            {doctor.experience ? (
              <Paper sx={{ p: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Typography variant="h6">
                    {doctor.experience.compName}
                  </Typography>
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => handleEditExperience(doctor.experience)}
                  >
                    <EditIcon />
                  </IconButton>
                </Box>

                <Divider sx={{ my: 1 }} />

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Chuyên môn
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {doctor.experience.specialization}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Thời gian
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {new Date(doctor.experience.startDate).toLocaleDateString(
                        "vi-VN"
                      )}
                      {doctor.experience.endDate
                        ? ` - ${new Date(
                            doctor.experience.endDate
                          ).toLocaleDateString("vi-VN")}`
                        : " - Hiện tại"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Địa chỉ công ty
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {`${doctor.experience.compAddress.number} ${doctor.experience.compAddress.street}, 
                        ${doctor.experience.compAddress.ward}, 
                        ${doctor.experience.compAddress.district}, 
                        ${doctor.experience.compAddress.city}`}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Mô tả công việc
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {doctor.experience.description}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            ) : (
              <Box sx={{ textAlign: "center", p: 3 }}>
                <Typography color="text.secondary" gutterBottom>
                  Chưa có thông tin về kinh nghiệm
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setIsExperienceFormOpen(true)}
                >
                  Thêm kinh nghiệm
                </Button>
              </Box>
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
      />
    </Dialog>
  );
};

export default DoctorDetailModal;
