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
import { updateAddEducation } from "../../../services/admin/doctor_service";

// Interface cho lỗi validation của ngày tháng
interface DateValidationErrors {
  hasError: boolean;
  messages: string[];
}

// Props cho form học vấn
interface EducationFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (updatedEducation: DoctorEducation) => void;
  education: DoctorEducation | null;
  mode: "add" | "edit";
  doctorId: number;
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
  onSuccess,
  education,
  mode,
  doctorId,
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

  // State để xử lý trạng thái đang gửi form
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State để quản lý giá trị ngày tháng
  const [joinedDate, setJoinedDate] = useState<Date | null>(null);
  const [graduateDate, setGraduateDate] = useState<Date | null>(null);

  // State quản lý thông báo lỗi validation ngày tháng
  const [dateValidation, setDateValidation] = useState<DateValidationErrors>({
    hasError: false,
    messages: [],
  });

  // Ngày hiện tại để kiểm tra validation
  const today = new Date();

  // Cập nhật giá trị ngày tháng khi thông tin học vấn thay đổi
  useEffect(() => {
    if (education) {
      if (education.joinedDate || education.joinDate) {
        setJoinedDate(
          parseDateFromString(education.joinedDate || education.joinDate || "")
        );
      }
      if (education.graduateDate) {
        setGraduateDate(parseDateFromString(education.graduateDate));
      }
    } else {
      setJoinedDate(null);
      setGraduateDate(null);
    }
    // Xóa thông báo lỗi khi thông tin học vấn thay đổi
    setDateValidation({ hasError: false, messages: [] });
  }, [education]);

  // Hàm kiểm tra lỗi ngày tháng
  const validateDates = (): DateValidationErrors => {
    const errors: string[] = [];

    // Kiểm tra ngày bắt đầu
    if (!joinedDate) {
      errors.push("Ngày bắt đầu không được để trống");
    } else if (joinedDate > today) {
      errors.push("Ngày bắt đầu không thể là ngày trong tương lai");
    }

    // Kiểm tra ngày tốt nghiệp
    if (!graduateDate) {
      errors.push("Ngày tốt nghiệp không được để trống");
    } else if (graduateDate > today) {
      errors.push("Ngày tốt nghiệp không thể là ngày trong tương lai");
    } else if (joinedDate && graduateDate && graduateDate < joinedDate) {
      errors.push("Ngày tốt nghiệp phải sau ngày bắt đầu");
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
    schoolName: Yup.string().required("Tên trường không được để trống"),
    diploma: Yup.string().required("Bằng cấp không được để trống"),
  });

  // Giá trị mặc định của form
  const initialValues: EducationFormValues = {
    schoolName: "",
    joinedDate: "",
    graduateDate: "",
    diploma: "BACHELOR",
  };

  // Lấy giá trị khởi tạo từ thông tin học vấn nếu có
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
        schoolName: values.schoolName,
        joinDate: joinedDate ? formatDateToString(joinedDate) : "",
        graduateDate: graduateDate ? formatDateToString(graduateDate) : "",
        diploma: values.diploma,
      };

      // Xác định ID của education (0 nếu là thêm mới)
      const educationId = education?.id || 0;

      // Gọi API trực tiếp từ form
      const response = await updateAddEducation(
        doctorId.toString(),
        submissionData,
        educationId.toString()
      );

      if (response && response.code === 200) {
        setResponseMessage({
          type: "success",
          message:
            mode === "add"
              ? "Thêm học vấn thành công!"
              : "Cập nhật học vấn thành công!",
          show: true,
        });

        // Nếu thành công và có hàm callback, gọi nó
        if (onSuccess) {
          const updatedEducation: DoctorEducation = {
            ...submissionData,
            id: educationId || response.data?.id || Date.now(), // Fallback nếu API không trả về ID
            joinedDate: values.joinedDate,
            doctorId: doctorId,
          };
          onSuccess(updatedEducation);
        }

        // Tự động đóng form sau khi thành công
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
      console.error("Lỗi khi gửi dữ liệu học vấn:", error);
      setResponseMessage({
        type: "error",
        message: "Đã xảy ra lỗi khi lưu thông tin học vấn!",
        show: true,
      });
    } finally {
      setSubmitting(false);
      setIsSubmitting(false);
    }
  };

  // Xử lý khi ngày bắt đầu thay đổi
  const handleJoinedDateChange = (date: Date | null) => {
    setJoinedDate(date);
    // Xóa thông báo lỗi khi người dùng thay đổi giá trị
    setDateValidation({ hasError: false, messages: [] });
  };

  // Xử lý khi ngày tốt nghiệp thay đổi
  const handleGraduateDateChange = (date: Date | null) => {
    setGraduateDate(date);
    // Xóa thông báo lỗi khi người dùng thay đổi giá trị
    setDateValidation({ hasError: false, messages: [] });
  };

  // Tham chiếu đến Formik
  const formikRef = React.useRef<FormikProps<EducationFormValues>>(null);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {mode === "add" ? "Thêm học vấn mới" : "Chỉnh sửa thông tin học vấn"}
      </DialogTitle>

      <Formik
        initialValues={getInitialValues()}
        validationSchema={validationSchema}
        onSubmit={handleFormSubmit}
        enableReinitialize
        innerRef={formikRef}
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
                      value={joinedDate}
                      onChange={handleJoinedDateChange}
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
                      label="Ngày tốt nghiệp"
                      value={graduateDate}
                      onChange={handleGraduateDateChange}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                        },
                      }}
                    />
                  </LocalizationProvider>
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
                  // Validate dates when user clicks submit
                  validateDates();
                }}
              >
                {isSubmitting ? (
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
