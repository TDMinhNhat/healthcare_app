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
  CircularProgress,
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
  Close as CloseIcon,
} from "@mui/icons-material";
import { Diploma } from "../../types/enums";
import EducationForm from "./forms/EducationForm";
import CertificateForm from "./forms/CertificateForm";
import ExperienceForm from "./forms/ExperienceForm";
import { getDoctorInfo } from "../../services/authenticate/user_service";
import { parseDateFromString } from "../../utils/dateUtils";

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

  // State để lưu thông tin chi tiết của bác sĩ
  const [certificates, setCertificates] = useState<DoctorCertificate[]>([]);
  const [educations, setEducations] = useState<DoctorEducation[]>([]);
  const [experiences, setExperiences] = useState<DoctorExperience[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Reset tab khi modal đóng/mở
  useEffect(() => {
    if (open) {
      setTabValue(0);
      fetchDoctorDetails();
    }
  }, [open]);

  // Lấy thông tin chi tiết của bác sĩ khi modal mở
  const fetchDoctorDetails = async () => {
    if (!doctor) return;

    try {
      setLoading(true);
      setError(null);
      const response = await getDoctorInfo(doctor.userId).then(
        (res) => res.data
      );

      if (response && response.data) {
        console.log("Thông tin chi tiết bác sĩ:", response.data);
        setCertificates(response.data.certificates || []);
        setEducations(response.data.educations || []);
        setExperiences(response.data.experiences || []);
      } else {
        setError("Không thể tải thông tin chi tiết của bác sĩ");
      }
    } catch (error) {
      console.error("Lỗi khi tải thông tin chi tiết bác sĩ:", error);
      setError("Đã xảy ra lỗi khi tải thông tin chi tiết của bác sĩ");
    } finally {
      setLoading(false);
    }
  };

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
      case "PROFESSOR":
        return "Giáo sư";
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

  // Xử lý thêm kinh nghiệm mới
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

  // Xử lý callback khi các form lưu thành công
  const handleEducationSuccess = (updatedEducation: DoctorEducation) => {
    let updatedEducations = [...educations];

    if (formMode === "add") {
      updatedEducations.push(updatedEducation);
    } else {
      updatedEducations = updatedEducations.map((edu) =>
        edu.id === updatedEducation.id ? updatedEducation : edu
      );
    }

    setEducations(updatedEducations);

    if (doctor) {
      const updatedDoctor = {
        ...doctor,
        educations: updatedEducations,
      };
      onUpdate(updatedDoctor);
    }
  };

  const handleCertificateSuccess = (updatedCertificate: DoctorCertificate) => {
    let updatedCertificates = [...certificates];

    if (formMode === "add") {
      updatedCertificates.push(updatedCertificate);
    } else {
      updatedCertificates = updatedCertificates.map((cert) =>
        cert.id === updatedCertificate.id ? updatedCertificate : cert
      );
    }

    setCertificates(updatedCertificates);

    if (doctor) {
      const updatedDoctor = {
        ...doctor,
        certificates: updatedCertificates,
      };
      onUpdate(updatedDoctor);
    }
  };

  const handleExperienceSuccess = (updatedExperience: DoctorExperience) => {
    let updatedExperiences = [...experiences];

    if (formMode === "add") {
      updatedExperiences.push(updatedExperience);
    } else {
      updatedExperiences = updatedExperiences.map((exp) =>
        exp.id === updatedExperience.id ? updatedExperience : exp
      );
    }

    setExperiences(updatedExperiences);

    if (doctor) {
      const updatedDoctor = {
        ...doctor,
        experiences: updatedExperiences,
      };
      onUpdate(updatedDoctor);
    }
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
        Thông tin chi tiết bác sĩ
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 0 }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ p: 3 }}>
            <Typography color="error" align="center">
              {error}
            </Typography>
          </Box>
        ) : (
          <>
            <Box
              sx={{
                mb: 3,
                ml: 2,
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
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
                <Typography variant="body2" component="div">
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
                        {typeof doctor.dob === "string"
                          ? parseDateFromString(doctor.dob).toLocaleDateString(
                              "vi-VN"
                            )
                          : new Date(doctor.dob).toLocaleDateString("vi-VN")}
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
                <Box
                  sx={{
                    mb: 2,
                    mr: 2,
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAddEducation}
                  >
                    Thêm học vấn
                  </Button>
                </Box>

                {educations && educations.length > 0 ? (
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
                        {educations.map((education) => (
                          <TableRow key={education.id}>
                            <TableCell>{education.schoolName}</TableCell>
                            <TableCell>
                              {getDiplomaLabel(education.diploma)}
                            </TableCell>
                            <TableCell>
                              {parseDateFromString(
                                education.joinDate || education.joinedDate
                              ).getFullYear()}{" "}
                              -{" "}
                              {parseDateFromString(
                                education.graduateDate
                              ).getFullYear()}
                            </TableCell>
                            <TableCell align="right">
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => handleEditEducation(education)}
                              >
                                <EditIcon fontSize="small" />
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
                <Box
                  sx={{
                    mb: 2,
                    mr: 2,
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAddCertificate}
                  >
                    Thêm chứng chỉ
                  </Button>
                </Box>

                {certificates && certificates.length > 0 ? (
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Tên chứng chỉ</TableCell>
                          <TableCell>Ngày cấp</TableCell>
                          <TableCell align="right">Thao tác</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {certificates.map((certificate) => (
                          <TableRow key={certificate.id}>
                            <TableCell>{certificate.certName}</TableCell>
                            <TableCell>
                              {parseDateFromString(
                                certificate.issueDate
                              ).toLocaleDateString("vi-VN")}
                            </TableCell>
                            <TableCell align="right">
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() =>
                                  handleEditCertificate(certificate)
                                }
                              >
                                <EditIcon fontSize="small" />
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
                <Box
                  sx={{
                    mb: 2,
                    mr: 2,
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAddExperience}
                  >
                    Thêm kinh nghiệm
                  </Button>
                </Box>

                {experiences && experiences.length > 0 ? (
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
                        {experiences.map((experience) => (
                          <TableRow key={experience.id}>
                            <TableCell>
                              {experience.companyName || experience.compName}
                            </TableCell>
                            <TableCell>{experience.specialization}</TableCell>
                            <TableCell>
                              {parseDateFromString(
                                experience.startDate
                              ).toLocaleDateString("vi-VN")}
                              {experience.endDate
                                ? ` - ${parseDateFromString(
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
            </Box>
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Đóng</Button>
      </DialogActions>

      {/* Form chỉnh sửa học vấn */}
      <EducationForm
        open={isEducationFormOpen}
        onClose={() => setIsEducationFormOpen(false)}
        onSuccess={handleEducationSuccess}
        education={selectedEducation}
        mode={formMode}
        doctorId={doctor?.userId || 0}
      />

      {/* Form chỉnh sửa chứng chỉ */}
      <CertificateForm
        open={isCertificateFormOpen}
        onClose={() => setIsCertificateFormOpen(false)}
        onSuccess={handleCertificateSuccess}
        certificate={selectedCertificate}
        mode={formMode}
        doctorId={doctor?.userId || 0}
      />

      {/* Form chỉnh sửa kinh nghiệm */}
      <ExperienceForm
        open={isExperienceFormOpen}
        onClose={() => setIsExperienceFormOpen(false)}
        onSuccess={handleExperienceSuccess}
        experience={selectedExperience}
        mode={formMode}
        doctorId={doctor?.userId || 0}
      />
    </Dialog>
  );
};

export default DoctorDetailModal;
