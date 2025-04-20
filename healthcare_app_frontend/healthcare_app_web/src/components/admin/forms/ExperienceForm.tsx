import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Typography,
  FormControlLabel,
  Checkbox,
  Box,
  CircularProgress,
  Alert,
  Collapse,
} from "@mui/material";
import { Formik, Form, Field, FormikProps } from "formik";
import * as Yup from "yup";
import { DoctorExperience } from "../../../types/doctor";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { vi } from "date-fns/locale";
import {
  parseDateFromString,
  formatDateToString,
} from "../../../utils/dateUtils";

interface ExperienceFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (
    data: DoctorExperience
  ) => Promise<{ success: boolean; message: string }>;
  experience: DoctorExperience | null;
  mode?: "add" | "edit";
  isSubmitting?: boolean;
}

interface ExperienceFormValues {
  compName: string;
  specialization: string;
  startDate: string;
  endDate?: string;
  description: string;
  compAddress: {
    id?: number;
    number: string;
    street: string;
    ward: string;
    district: string;
    city: string;
    country: string;
  };
  isCurrentJob: boolean;
}

const ExperienceForm: React.FC<ExperienceFormProps> = ({
  open,
  onClose,
  onSubmit,
  experience,
  mode = "add",
  isSubmitting = false,
}) => {
  // State để xử lý thông báo phản hồi
  const [responseMessage, setResponseMessage] = useState<{
    type: "success" | "error" | "info";
    message: string;
    show: boolean;
  }>({
    type: "info",
    message: "",
    show: false,
  });

  const validationSchema = Yup.object({
    compName: Yup.string().required("Tên công ty không được để trống"),
    specialization: Yup.string().required("Chuyên môn không được để trống"),
    startDate: Yup.string().required("Ngày bắt đầu không được để trống"),
    compAddress: Yup.object({
      city: Yup.string().required("Thành phố không được để trống"),
    }),
  });

  const initialValues: ExperienceFormValues = {
    compName: "",
    specialization: "",
    startDate: "",
    endDate: "",
    description: "",
    compAddress: {
      id: 0,
      number: "",
      street: "",
      ward: "",
      district: "",
      city: "",
      country: "",
    },
    isCurrentJob: false,
  };

  const getInitialValues = (): ExperienceFormValues => {
    if (!experience) return initialValues;

    return {
      compName: experience.compName || experience.companyName || "",
      specialization: experience.specialization || "",
      startDate: experience.startDate || "",
      endDate: experience.endDate || "",
      description: experience.description || "",
      compAddress: {
        id: experience.compAddress?.id || 0,
        number: experience.compAddress?.number || "",
        street: experience.compAddress?.street || "",
        ward: experience.compAddress?.ward || "",
        district: experience.compAddress?.district || "",
        city: experience.compAddress?.city || "",
        country: experience.compAddress?.country || "",
      },
      isCurrentJob: !experience.endDate,
    };
  };

  const handleFormSubmit = async (
    values: ExperienceFormValues,
    { setSubmitting }: any
  ) => {
    try {
      // Chuẩn bị dữ liệu cho API
      const submissionData: Partial<DoctorExperience> = {
        compName: values.compName,
        companyName: values.compName,
        specialization: values.specialization,
        startDate: values.startDate,
        endDate: values.isCurrentJob ? undefined : values.endDate,
        description: values.description,
        compAddress: values.compAddress,
      };

      const result = await onSubmit(submissionData as DoctorExperience);

      if (result.success) {
        setResponseMessage({
          type: "success",
          message: result.message || "Thao tác thành công!",
          show: true,
        });

        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setResponseMessage({
          type: "error",
          message: result.message || "Đã xảy ra lỗi!",
          show: true,
        });
      }
    } catch (error) {
      console.error("Lỗi khi gửi dữ liệu kinh nghiệm:", error);
      setResponseMessage({
        type: "error",
        message: "Đã xảy ra lỗi khi lưu thông tin kinh nghiệm!",
        show: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Kiểm tra hợp lệ cho ngày tháng
  const validateDates = (values: ExperienceFormValues) => {
    const errors: { endDate?: string } = {};

    if (!values.isCurrentJob && !values.endDate) {
      errors.endDate = "Ngày kết thúc không được để trống";
    }

    if (values.startDate && values.endDate) {
      const startDate = new Date(values.startDate);
      const endDate = new Date(values.endDate);
      if (startDate > endDate) {
        errors.endDate = "Ngày kết thúc phải sau ngày bắt đầu";
      }
    }

    return errors;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {mode === "edit"
          ? "Chỉnh sửa thông tin kinh nghiệm"
          : "Thêm kinh nghiệm mới"}
      </DialogTitle>

      <Formik
        initialValues={getInitialValues()}
        validationSchema={validationSchema}
        onSubmit={handleFormSubmit}
        validate={validateDates}
        enableReinitialize
      >
        {(formik: FormikProps<ExperienceFormValues>) => (
          <Form>
            <DialogContent>
              <Collapse in={responseMessage.show}>
                <Alert
                  severity={responseMessage.type}
                  sx={{ mb: 2 }}
                  onClose={() =>
                    setResponseMessage((prev) => ({ ...prev, show: false }))
                  }
                >
                  {responseMessage.message}
                </Alert>
              </Collapse>

              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} md={6}>
                  <Field
                    as={TextField}
                    name="compName"
                    label="Tên công ty/Cơ sở y tế"
                    fullWidth
                    error={
                      formik.touched.compName && Boolean(formik.errors.compName)
                    }
                    helperText={
                      formik.touched.compName && formik.errors.compName
                    }
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Field
                    as={TextField}
                    name="specialization"
                    label="Chuyên môn/Vị trí"
                    fullWidth
                    error={
                      formik.touched.specialization &&
                      Boolean(formik.errors.specialization)
                    }
                    helperText={
                      formik.touched.specialization &&
                      formik.errors.specialization
                    }
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <LocalizationProvider
                    dateAdapter={AdapterDateFns}
                    adapterLocale={vi}
                  >
                    <DatePicker
                      label="Ngày bắt đầu"
                      value={
                        formik.values.startDate
                          ? parseDateFromString(formik.values.startDate)
                          : null
                      }
                      onChange={(date) => {
                        if (date) {
                          const formattedDate = formatDateToString(date);
                          formik.setFieldValue("startDate", formattedDate);
                        }
                      }}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error:
                            formik.touched.startDate &&
                            Boolean(formik.errors.startDate),
                          helperText:
                            formik.touched.startDate && formik.errors.startDate,
                        },
                      }}
                    />
                  </LocalizationProvider>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <LocalizationProvider
                      dateAdapter={AdapterDateFns}
                      adapterLocale={vi}
                    >
                      <DatePicker
                        label="Ngày kết thúc"
                        value={
                          formik.values.endDate && !formik.values.isCurrentJob
                            ? parseDateFromString(formik.values.endDate)
                            : null
                        }
                        onChange={(date) => {
                          if (date) {
                            const formattedDate = formatDateToString(date);
                            formik.setFieldValue("endDate", formattedDate);
                          }
                        }}
                        disabled={formik.values.isCurrentJob}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            error:
                              formik.touched.endDate &&
                              Boolean(formik.errors.endDate),
                            helperText:
                              formik.touched.endDate && formik.errors.endDate,
                          },
                        }}
                      />
                    </LocalizationProvider>

                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formik.values.isCurrentJob}
                          onChange={(e) => {
                            formik.setFieldValue(
                              "isCurrentJob",
                              e.target.checked
                            );
                            if (e.target.checked) {
                              formik.setFieldValue("endDate", undefined);
                            }
                          }}
                          name="isCurrentJob"
                          color="primary"
                        />
                      }
                      label="Hiện tại đang làm việc"
                      sx={{ mt: 1 }}
                    />
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    Địa chỉ công ty
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Field
                    as={TextField}
                    name="compAddress.city"
                    label="Thành phố"
                    fullWidth
                    error={
                      formik.touched.compAddress?.city &&
                      Boolean(formik.errors.compAddress?.city)
                    }
                    helperText={
                      formik.touched.compAddress?.city &&
                      formik.errors.compAddress?.city
                    }
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Field
                    as={TextField}
                    name="compAddress.country"
                    label="Quốc gia"
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Field
                    as={TextField}
                    name="compAddress.district"
                    label="Quận/Huyện"
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <Field
                    as={TextField}
                    name="compAddress.ward"
                    label="Phường/Xã"
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Field
                    as={TextField}
                    name="compAddress.street"
                    label="Đường"
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} md={2}>
                  <Field
                    as={TextField}
                    name="compAddress.number"
                    label="Số nhà"
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    name="description"
                    label="Mô tả công việc"
                    fullWidth
                    multiline
                    rows={4}
                  />
                </Grid>
              </Grid>
            </DialogContent>

            <DialogActions>
              <Button
                onClick={onClose}
                disabled={formik.isSubmitting || isSubmitting}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={
                  formik.isSubmitting || isSubmitting || !formik.isValid
                }
              >
                {formik.isSubmitting || isSubmitting ? (
                  <>
                    <CircularProgress size={24} sx={{ mr: 1 }} />
                    {mode === "add" ? "Đang thêm..." : "Đang lưu..."}
                  </>
                ) : experience ? (
                  "Lưu thay đổi"
                ) : (
                  "Thêm"
                )}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default ExperienceForm;
