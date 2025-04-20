import React, { useState } from "react";
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
  CircularProgress,
  Alert,
  Collapse,
} from "@mui/material";
import { Formik, Form, Field, FormikProps } from "formik";
import * as Yup from "yup";
import { DoctorEducation } from "../../../types/doctor";
import { Diploma } from "../../../types/enums";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { vi } from "date-fns/locale";
import {
  parseDateFromString,
  formatDateToString,
} from "../../../utils/dateUtils";

interface EducationFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (
    data: DoctorEducation
  ) => Promise<{ success: boolean; message: string }>;
  education: DoctorEducation | null;
  mode: "add" | "edit";
  isSubmitting?: boolean;
}

// Định nghĩa interface cho giá trị của form
interface EducationFormValues {
  schoolName: string;
  joinedDate: string;
  joinDate?: string;
  graduateDate: string;
  diploma: keyof typeof Diploma;
}

const EducationForm: React.FC<EducationFormProps> = ({
  open,
  onClose,
  onSubmit,
  education,
  mode,
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

  // Định nghĩa schema xác thực với Yup
  const validationSchema = Yup.object({
    schoolName: Yup.string().required("Tên trường không được để trống"),
    joinedDate: Yup.string().required("Ngày bắt đầu không được để trống"),
    graduateDate: Yup.string().required("Ngày kết thúc không được để trống"),
    diploma: Yup.string().required("Bằng cấp không được để trống"),
  });

  // Giá trị khởi tạo của form
  const initialValues: EducationFormValues = {
    schoolName: "",
    joinedDate: "",
    graduateDate: "",
    diploma: "BACHELOR",
  };

  // Chuẩn bị giá trị form khi dữ liệu học vấn thay đổi
  const getInitialValues = (): EducationFormValues => {
    if (!education) return initialValues;

    return {
      schoolName: education.schoolName || "",
      joinedDate: education.joinedDate || education.joinDate || "",
      joinDate: education.joinDate || education.joinedDate || "",
      graduateDate: education.graduateDate || "",
      diploma: education.diploma || "BACHELOR",
    };
  };

  // Xử lý khi submit form
  const handleFormSubmit = async (
    values: EducationFormValues,
    { setSubmitting }: any
  ) => {
    try {
      // Chuẩn bị dữ liệu cho API
      const submissionData: Partial<DoctorEducation> = {
        schoolName: values.schoolName,
        joinedDate: values.joinedDate,
        joinDate: values.joinedDate, // Đảm bảo tương thích với API
        graduateDate: values.graduateDate,
        diploma: values.diploma,
      };

      // Gọi onSubmit và xử lý phản hồi
      const result = await onSubmit(submissionData as DoctorEducation);

      if (result.success) {
        setResponseMessage({
          type: "success",
          message: result.message || "Thao tác thành công!",
          show: true,
        });

        // Tùy chọn đóng form sau khi thành công với độ trễ
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
      console.error("Lỗi khi gửi dữ liệu học vấn:", error);
      setResponseMessage({
        type: "error",
        message: "Đã xảy ra lỗi khi lưu thông tin học vấn!",
        show: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Xác thực tùy chỉnh cho ngày tháng
  const validateDates = (values: EducationFormValues) => {
    const errors: { graduateDate?: string } = {};

    if (values.joinedDate && values.graduateDate) {
      const joinedDate = new Date(values.joinedDate);
      const graduateDate = new Date(values.graduateDate);
      if (joinedDate > graduateDate) {
        errors.graduateDate = "Ngày kết thúc phải sau ngày bắt đầu";
      }
    }

    return errors;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {mode === "add" ? "Thêm học vấn mới" : "Chỉnh sửa thông tin học vấn"}
      </DialogTitle>

      <Formik
        initialValues={getInitialValues()}
        validationSchema={validationSchema}
        onSubmit={handleFormSubmit}
        validate={validateDates}
        enableReinitialize
      >
        {(formik: FormikProps<EducationFormValues>) => (
          <Form>
            <DialogContent>
              {/* Thông báo phản hồi */}
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
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    name="schoolName"
                    label="Tên trường"
                    fullWidth
                    error={
                      formik.touched.schoolName &&
                      Boolean(formik.errors.schoolName)
                    }
                    helperText={
                      formik.touched.schoolName && formik.errors.schoolName
                    }
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl
                    fullWidth
                    error={
                      formik.touched.diploma && Boolean(formik.errors.diploma)
                    }
                  >
                    <InputLabel>Bằng cấp</InputLabel>
                    <Field as={Select} name="diploma" label="Bằng cấp">
                      <MenuItem value="BACHELOR">Cử nhân</MenuItem>
                      <MenuItem value="MASTER">Thạc sĩ</MenuItem>
                      <MenuItem value="DOCTOR">Tiến sĩ</MenuItem>
                      <MenuItem value="PROFESSOR">Giáo sư</MenuItem>
                    </Field>
                    {formik.touched.diploma && formik.errors.diploma && (
                      <FormHelperText>{formik.errors.diploma}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <LocalizationProvider
                    dateAdapter={AdapterDateFns}
                    adapterLocale={vi}
                  >
                    <DatePicker
                      label="Ngày bắt đầu"
                      value={
                        formik.values.joinedDate
                          ? parseDateFromString(formik.values.joinedDate)
                          : null
                      }
                      onChange={(date) => {
                        if (date) {
                          const formattedDate = formatDateToString(date);
                          formik.setFieldValue("joinedDate", formattedDate);
                          formik.setFieldValue("joinDate", formattedDate); // Đặt cả hai để tương thích với API
                        }
                      }}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error:
                            formik.touched.joinedDate &&
                            Boolean(formik.errors.joinedDate),
                          helperText:
                            formik.touched.joinedDate &&
                            formik.errors.joinedDate,
                        },
                      }}
                    />
                  </LocalizationProvider>
                </Grid>

                <Grid item xs={12} md={6}>
                  <LocalizationProvider
                    dateAdapter={AdapterDateFns}
                    adapterLocale={vi}
                  >
                    <DatePicker
                      label="Ngày kết thúc"
                      value={
                        formik.values.graduateDate
                          ? parseDateFromString(formik.values.graduateDate)
                          : null
                      }
                      onChange={(date) => {
                        if (date) {
                          const formattedDate = formatDateToString(date);
                          formik.setFieldValue("graduateDate", formattedDate);
                        }
                      }}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error:
                            formik.touched.graduateDate &&
                            Boolean(formik.errors.graduateDate),
                          helperText:
                            formik.touched.graduateDate &&
                            formik.errors.graduateDate,
                        },
                      }}
                    />
                  </LocalizationProvider>
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
                ) : mode === "add" ? (
                  "Thêm"
                ) : (
                  "Lưu thay đổi"
                )}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default EducationForm;
