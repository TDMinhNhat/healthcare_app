import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Box,
  Typography,
  CircularProgress,
  SelectChangeEvent,
} from "@mui/material";
import { Formik, Form, Field, FormikHelpers } from "formik";
import * as Yup from "yup";
import { Doctor } from "../../types/doctor";
import { Disease } from "../../types/typeDisease";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { vi } from "date-fns/locale";
import { getAllTypeDiseases } from "../../services/admin/typeDisease_service";

interface DoctorFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Doctor>) => void;
  doctor: Doctor | null;
  mode: "add" | "edit";
  isSubmitting?: boolean; // New prop for submission loading state
}

const DoctorForm: React.FC<DoctorFormProps> = ({
  open,
  onClose,
  onSubmit,
  doctor,
  mode,
  isSubmitting = false, // Default to false
}) => {
  // State for diseases fetched from API
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [loadingDiseases, setLoadingDiseases] = useState<boolean>(false);
  const [errorDiseases, setErrorDiseases] = useState<string | null>(null);

  // State for date validation error
  const [dobError, setDobError] = useState<string | null>(null);

  // Create validation schema with Yup for text fields only
  const validationSchema = Yup.object({
    firstName: Yup.string()
      .required("Tên là bắt buộc")
      .min(2, "Tên phải có ít nhất 2 ký tự"),
    lastName: Yup.string()
      .required("Họ là bắt buộc")
      .min(2, "Họ phải có ít nhất 2 ký tự"),
    specialization: Yup.string().required("Chuyên khoa không được để trống"),
    phone: Yup.string()
      .required("Số điện thoại không được để trống")
      .matches(/^[0-9]{10,11}$/, "Số điện thoại không hợp lệ"),
    email: Yup.string()
      .required("Email không được để trống")
      .email("Email không hợp lệ"),
  });

  // Fetch diseases when the form opens
  useEffect(() => {
    if (open) {
      const fetchDiseases = async () => {
        try {
          setLoadingDiseases(true);
          setErrorDiseases(null);
          const response = await getAllTypeDiseases();
          if (response && response.data) {
            setDiseases(response.data);
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
  }, [open]);

  // Validate date of birth separately
  const validateDob = (date: Date | null): boolean => {
    if (!date) {
      setDobError("Ngày sinh không được để trống");
      return false;
    }

    // Additional validation if needed - can check age limits, etc.

    setDobError(null);
    return true;
  };

  // Handle form submission with Formik and additional validation
  const handleSubmitForm = (
    values: Partial<Doctor>,
    actions: FormikHelpers<Partial<Doctor>>
  ) => {
    // Validate date first
    if (!validateDob(values.dob ? new Date(values.dob) : null)) {
      actions.setSubmitting(false);
      return;
    }

    // All validation passed, submit the form
    // The dob will be formatted in the parent component (DoctorManagementPage)
    onSubmit(values);
    actions.setSubmitting(false);
  };

  // Prevent closing the dialog while submitting
  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose} // Use handleClose instead of onClose directly
      maxWidth="md"
      fullWidth
      // Prevent closing by backdrop click or escape key while submitting
      disableEscapeKeyDown={isSubmitting}
      disableBackdropClick={isSubmitting}
    >
      <DialogTitle>
        {mode === "add" ? "Thêm bác sĩ mới" : "Chỉnh sửa thông tin bác sĩ"}
      </DialogTitle>

      <Formik
        initialValues={{
          firstName: doctor?.firstName || "",
          lastName: doctor?.lastName || "",
          sex: doctor?.sex ?? true,
          dob: doctor?.dob || "",
          phone: doctor?.phone || "",
          email: doctor?.email || "",
          specialization: doctor?.specialization || "",
          status: doctor?.status ?? true,
          typeDisease: doctor?.typeDisease || undefined,
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmitForm}
        enableReinitialize
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          setFieldValue,
          isSubmitting: formikSubmitting,
        }) => {
          // Use either the external submitting state or Formik's internal one
          const isCurrentlySubmitting = isSubmitting || formikSubmitting;

          return (
            <Form>
              <DialogContent>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Thông tin cơ bản
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Field
                        as={TextField}
                        name="firstName"
                        label="Họ"
                        value={values.firstName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        fullWidth
                        error={touched.firstName && Boolean(errors.firstName)}
                        helperText={touched.firstName && errors.firstName}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Field
                        as={TextField}
                        name="lastName"
                        label="Tên"
                        value={values.lastName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        fullWidth
                        error={touched.lastName && Boolean(errors.lastName)}
                        helperText={touched.lastName && errors.lastName}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Giới tính</InputLabel>
                        <Select
                          name="sex"
                          value={values.sex === undefined ? "" : values.sex}
                          label="Giới tính"
                          onChange={(e) => {
                            setFieldValue("sex", e.target.value);
                          }}
                        >
                          <MenuItem value={true}>Nam</MenuItem>
                          <MenuItem value={false}>Nữ</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <LocalizationProvider
                        dateAdapter={AdapterDateFns}
                        adapterLocale={vi}
                      >
                        <DatePicker
                          label="Ngày sinh"
                          value={values.dob ? new Date(values.dob) : null}
                          onChange={(date) => {
                            if (date) {
                              setFieldValue(
                                "dob",
                                date.toISOString().split("T")[0]
                              );
                              validateDob(date);
                            }
                          }}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              error: !!dobError,
                              helperText: dobError,
                            },
                          }}
                        />
                      </LocalizationProvider>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Field
                        as={TextField}
                        name="phone"
                        label="Số điện thoại"
                        value={values.phone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        fullWidth
                        error={touched.phone && Boolean(errors.phone)}
                        helperText={touched.phone && errors.phone}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Field
                        as={TextField}
                        name="email"
                        label="Email"
                        type="email"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        fullWidth
                        error={touched.email && Boolean(errors.email)}
                        helperText={touched.email && errors.email}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Field
                        as={TextField}
                        name="specialization"
                        label="Chuyên khoa"
                        value={values.specialization}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        fullWidth
                        error={
                          touched.specialization &&
                          Boolean(errors.specialization)
                        }
                        helperText={
                          touched.specialization && errors.specialization
                        }
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Trạng thái</InputLabel>
                        <Select
                          name="status"
                          value={
                            values.status === undefined ? "" : values.status
                          }
                          label="Trạng thái"
                          onChange={(e) => {
                            setFieldValue("status", e.target.value);
                          }}
                        >
                          <MenuItem value={true}>Đang hoạt động</MenuItem>
                          <MenuItem value={false}>Không hoạt động</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                      <FormControl fullWidth disabled={loadingDiseases}>
                        <InputLabel id="disease-select-label">
                          Loại bệnh có thể khám
                        </InputLabel>
                        {loadingDiseases ? (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              pl: 2,
                              pt: 1,
                            }}
                          >
                            <CircularProgress size={20} sx={{ mr: 1 }} />
                            <Typography variant="body2" color="textSecondary">
                              Đang tải danh sách loại bệnh...
                            </Typography>
                          </Box>
                        ) : errorDiseases ? (
                          <Box sx={{ color: "error.main", pl: 2, pt: 1 }}>
                            <Typography variant="body2" color="error">
                              {errorDiseases}
                            </Typography>
                          </Box>
                        ) : (
                          <Select
                            labelId="disease-select-label"
                            value={
                              values.typeDisease?.id ||
                              (diseases.length > 0 ? diseases[0].id : "")
                            }
                            onChange={(e: SelectChangeEvent<any>) => {
                              const selectedId = e.target.value;
                              const selectedDisease = diseases.find(
                                (disease) => disease.id === selectedId
                              );
                              setFieldValue("typeDisease", selectedDisease);
                            }}
                            label="Loại bệnh có thể khám"
                          >
                            {diseases.map((disease) => (
                              <MenuItem key={disease.id} value={disease.id}>
                                {disease.name}
                              </MenuItem>
                            ))}
                          </Select>
                        )}
                      </FormControl>
                    </Grid>
                  </Grid>
                </Box>
              </DialogContent>

              <DialogActions>
                <Button onClick={handleClose} disabled={isCurrentlySubmitting}>
                  Hủy
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isCurrentlySubmitting}
                  startIcon={
                    isCurrentlySubmitting && (
                      <CircularProgress size={20} color="inherit" />
                    )
                  }
                >
                  {isCurrentlySubmitting
                    ? "Đang xử lý..."
                    : mode === "add"
                    ? "Thêm"
                    : "Lưu thay đổi"}
                </Button>
              </DialogActions>
            </Form>
          );
        }}
      </Formik>
    </Dialog>
  );
};

export default DoctorForm;
