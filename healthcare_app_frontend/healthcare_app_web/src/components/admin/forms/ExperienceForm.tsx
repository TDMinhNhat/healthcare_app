import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Collapse,
  FormHelperText,
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
import { updateAddExperience } from "../../../services/admin/doctor_service";

// Interface cho lỗi validation của ngày tháng
interface DateValidationErrors {
  hasError: boolean;
  messages: string[];
}

// Props cho form kinh nghiệm
interface ExperienceFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (updatedExperience: DoctorExperience) => void;
  experience: DoctorExperience | null;
  mode?: "add" | "edit";
  doctorId: number;
}

// Định nghĩa kiểu dữ liệu cho form kinh nghiệm
interface ExperienceFormValues {
  compName: string;
  specialization: string;
  startDate: string;
  endDate: string;
  description: string;
  address: {
    id?: number;
    number: string;
    street: string;
    ward: string;
    district: string;
    city: string;
    country: string;
  };
}

const ExperienceForm: React.FC<ExperienceFormProps> = ({
  open,
  onClose,
  onSuccess,
  experience,
  mode = "add",
  doctorId,
}) => {
  // State để hiển thị thông báo phản hồi
  const [responseMessage, setResponseMessage] = useState<{
    type: "success" | "error" | "info";
    message: string;
    show: boolean;
  }>({
    type: "info",
    message: "",
    show: false,
  });

  // State để xử lý trạng thái đang gửi form
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Ngày hiện tại để kiểm tra validation
  const today = new Date();

  // State quản lý giá trị ngày tháng
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // State quản lý thông báo lỗi validation ngày tháng
  const [dateValidation, setDateValidation] = useState<DateValidationErrors>({
    hasError: false,
    messages: [],
  });

  // Cập nhật giá trị ngày tháng khi thông tin kinh nghiệm thay đổi
  useEffect(() => {
    if (experience) {
      if (experience.startDate) {
        setStartDate(parseDateFromString(experience.startDate));
      }
      if (experience.endDate) {
        setEndDate(parseDateFromString(experience.endDate));
      }
    } else {
      setStartDate(null);
      setEndDate(null);
    }
    // Xóa thông báo lỗi khi thông tin kinh nghiệm thay đổi
    setDateValidation({ hasError: false, messages: [] });
  }, [experience]);

  // Hàm kiểm tra lỗi ngày tháng
  const validateDates = (): DateValidationErrors => {
    const errors: string[] = [];

    // Kiểm tra ngày bắt đầu
    if (!startDate) {
      errors.push("Ngày bắt đầu không được để trống");
    } else if (startDate > today) {
      errors.push("Ngày bắt đầu không thể là ngày trong tương lai");
    }

    // Kiểm tra ngày kết thúc
    if (!endDate) {
      errors.push("Ngày kết thúc không được để trống");
    } else if (endDate > today) {
      errors.push("Ngày kết thúc không thể là ngày trong tương lai");
    } else if (startDate && endDate && endDate < startDate) {
      errors.push("Ngày kết thúc phải sau ngày bắt đầu");
    }

    const validationResult = {
      hasError: errors.length > 0,
      messages: errors,
    };

    setDateValidation(validationResult);
    return validationResult;
  };

  // Schema validation cho Formik (không bao gồm kiểm tra ngày tháng)
  const validationSchema = Yup.object({
    compName: Yup.string().required("Tên công ty không được để trống"),
    specialization: Yup.string().required("Chuyên môn không được để trống"),
  });

  // Giá trị mặc định của form
  const initialValues: ExperienceFormValues = {
    compName: "",
    specialization: "",
    startDate: "",
    endDate: "",
    description: "",
    address: {
      id: 0,
      number: "",
      street: "",
      ward: "",
      district: "",
      city: "",
      country: "",
    },
  };

  // Lấy giá trị khởi tạo từ thông tin kinh nghiệm nếu có
  const getInitialValues = (): ExperienceFormValues => {
    if (!experience) return initialValues;

    return {
      compName: experience.compName || experience.companyName || "",
      specialization: experience.specialization || "",
      startDate: experience.startDate || "",
      endDate: experience.endDate || "",
      description: experience.description || "",
      address: {
        id: experience.compAddress?.id || 0,
        number: experience.compAddress?.number || "",
        street: experience.compAddress?.street || "",
        ward: experience.compAddress?.ward || "",
        district: experience.compAddress?.district || "",
        city: experience.compAddress?.city || "",
        country: experience.compAddress?.country || "",
      },
    };
  };

  // Xử lý khi submit form
  const handleFormSubmit = async (
    values: ExperienceFormValues,
    { setSubmitting }: any
  ) => {
    // Kiểm tra lỗi ngày tháng trước khi gửi form
    const dateValidationResult = validateDates();
    if (dateValidationResult.hasError) {
      // Hiển thị thông báo lỗi
      setResponseMessage({
        type: "error",
        message: dateValidationResult.messages.join(". "),
        show: true,
      });
      setSubmitting(false);
      return;
    }

    try {
      setIsSubmitting(true);
      // Xóa thông báo lỗi cũ
      setResponseMessage((prev) => ({ ...prev, show: false }));

      // Chuẩn bị dữ liệu gửi lên server
      const submissionData = {
        companyName: values.compName,
        specialization: values.specialization,
        startDate: startDate ? formatDateToString(startDate) : "",
        endDate: endDate ? formatDateToString(endDate) : "",
        address: {
          number: values.address?.number || "",
          street: values.address?.street || "",
          ward: values.address?.ward || "",
          district: values.address?.district || "",
          city: values.address?.city || "",
          country: values.address?.country || "",
        },
        description: values.description || "",
      };

      const experienceId = experience?.id || 0;

      const response = await updateAddExperience(
        doctorId.toString(),
        submissionData,
        experienceId.toString()
      );

      if (response && response.code === 200) {
        setResponseMessage({
          type: "success",
          message:
            mode === "add"
              ? "Thêm kinh nghiệm thành công!"
              : "Cập nhật kinh nghiệm thành công!",
          show: true,
        });

        if (onSuccess) {
          const updatedExperience: DoctorExperience = {
            ...submissionData,
            id: experienceId || response.data?.id || Date.now(),
            compName: values.compName,
            companyName: values.compName,
            compAddress: values.address,
            doctorId: doctorId,
          };
          onSuccess(updatedExperience);
        }

        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setResponseMessage({
          type: "error",
          message:
            response?.data?.message || "Đã xảy ra lỗi khi lưu thông tin!",
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
      setIsSubmitting(false);
    }
  };

  // Xử lý khi ngày bắt đầu thay đổi
  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date);
    // Xóa thông báo lỗi khi người dùng thay đổi giá trị
    setDateValidation({ hasError: false, messages: [] });
  };

  // Xử lý khi ngày kết thúc thay đổi
  const handleEndDateChange = (date: Date | null) => {
    setEndDate(date);
    // Xóa thông báo lỗi khi người dùng thay đổi giá trị
    setDateValidation({ hasError: false, messages: [] });
  };

  // Tham chiếu đến Formik
  const formikRef = React.useRef<FormikProps<ExperienceFormValues>>(null);

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
        enableReinitialize
        innerRef={formikRef}
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
                      value={startDate}
                      onChange={handleStartDateChange}
                      slotProps={{
                        textField: {
                          fullWidth: true,
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
                      value={endDate}
                      onChange={handleEndDateChange}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                        },
                      }}
                    />
                  </LocalizationProvider>
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
              <Button onClick={onClose} disabled={isSubmitting}>
                Hủy
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting || !formik.isValid}
                onClick={() => {
                  validateDates();
                }}
              >
                {isSubmitting ? (
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
