import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  CircularProgress,
  Alert,
  Collapse,
} from "@mui/material";
import { Formik, Form, Field, FormikProps } from "formik";
import * as Yup from "yup";
import { DoctorCertificate } from "../../../types/doctor";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { vi } from "date-fns/locale";
import {
  parseDateFromString,
  formatDateToString,
} from "../../../utils/dateUtils";
import { format } from "date-fns";
import { updateAddCertificate } from "../../../services/admin/doctor_service";

// Interface cho lỗi validation của ngày tháng
interface DateValidationErrors {
  hasError: boolean;
  messages: string[];
}

// Props cho form chứng chỉ
interface CertificateFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (updatedCertificate: DoctorCertificate) => void;
  certificate: DoctorCertificate | null;
  mode: "add" | "edit";
  doctorId: number;
}

// Định nghĩa interface cho giá trị của form
interface CertificateFormValues {
  certName: string;
  issueDate: string;
}

const CertificateForm: React.FC<CertificateFormProps> = ({
  open,
  onClose,
  onSuccess,
  certificate,
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

  // State để quản lý giá trị ngày cấp
  const [issueDate, setIssueDate] = useState<Date | null>(null);

  // State quản lý thông báo lỗi validation ngày tháng
  const [dateValidation, setDateValidation] = useState<DateValidationErrors>({
    hasError: false,
    messages: [],
  });

  // Ngày hiện tại để kiểm tra validation
  const today = new Date();

  // Cập nhật giá trị ngày cấp khi thông tin chứng chỉ thay đổi
  useEffect(() => {
    if (certificate && certificate.issueDate) {
      try {
        setIssueDate(parseDateFromString(certificate.issueDate));
      } catch (error) {
        console.error("Lỗi khi phân tích ngày cấp", error);
        setIssueDate(new Date());
      }
    } else {
      setIssueDate(null);
    }
    // Xóa thông báo lỗi khi thông tin chứng chỉ thay đổi
    setDateValidation({ hasError: false, messages: [] });
  }, [certificate]);

  // Hàm kiểm tra lỗi ngày tháng
  const validateDates = (): DateValidationErrors => {
    const errors: string[] = [];

    // Kiểm tra ngày cấp
    if (!issueDate) {
      errors.push("Ngày cấp không được để trống");
    } else if (issueDate > today) {
      errors.push("Ngày cấp không thể là ngày trong tương lai");
    }

    const validationResult = {
      hasError: errors.length > 0,
      messages: errors,
    };

    setDateValidation(validationResult);
    return validationResult;
  };

  // Schema validation cho Formik (không bao gồm kiểm tra ngày cấp)
  const validationSchema = Yup.object({
    certName: Yup.string().required("Tên chứng chỉ không được để trống"),
  });

  // Giá trị mặc định của form
  const initialValues: CertificateFormValues = {
    certName: "",
    issueDate: "",
  };

  // Lấy giá trị khởi tạo từ thông tin chứng chỉ nếu có
  const getInitialValues = (): CertificateFormValues => {
    if (!certificate) return initialValues;

    return {
      certName: certificate.certName || "",
      issueDate: certificate.issueDate || "",
    };
  };

  // Xử lý khi submit form
  const handleFormSubmit = async (
    values: CertificateFormValues,
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
        certName: values.certName,
        issueDate: issueDate ? formatDateToString(issueDate) : "",
      };

      // Xác định ID của certificate (0 nếu là thêm mới)
      const certificateId = certificate?.id || 0;

      // Gọi API trực tiếp từ form
      const response = await updateAddCertificate(
        doctorId.toString(),
        submissionData,
        certificateId.toString()
      );

      if (response && response.code === 200) {
        setResponseMessage({
          type: "success",
          message:
            mode === "add"
              ? "Thêm chứng chỉ thành công!"
              : "Cập nhật chứng chỉ thành công!",
          show: true,
        });

        // Nếu thành công và có hàm callback, gọi nó
        if (onSuccess) {
          const updatedCertificate: DoctorCertificate = {
            ...submissionData,
            id: certificateId || response.data?.id || Date.now(), // Fallback nếu API không trả về ID
            doctorId: doctorId,
          };
          onSuccess(updatedCertificate);
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
      console.error("Lỗi khi gửi dữ liệu chứng chỉ:", error);
      setResponseMessage({
        type: "error",
        message: "Đã xảy ra lỗi khi lưu thông tin chứng chỉ!",
        show: true,
      });
    } finally {
      setSubmitting(false);
      setIsSubmitting(false);
    }
  };

  // Xử lý khi ngày cấp thay đổi
  const handleIssueDateChange = (date: Date | null) => {
    setIssueDate(date);
    // Xóa thông báo lỗi khi người dùng thay đổi giá trị
    setDateValidation({ hasError: false, messages: [] });
  };

  // Tham chiếu đến Formik
  const formikRef = React.useRef<FormikProps<CertificateFormValues>>(null);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {mode === "add"
          ? "Thêm chứng chỉ mới"
          : "Chỉnh sửa thông tin chứng chỉ"}
      </DialogTitle>

      <Formik
        initialValues={getInitialValues()}
        validationSchema={validationSchema}
        onSubmit={handleFormSubmit}
        enableReinitialize
        innerRef={formikRef}
      >
        {(formik: FormikProps<CertificateFormValues>) => (
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
                    name="certName"
                    label="Tên chứng chỉ"
                    fullWidth
                    error={
                      formik.touched.certName && Boolean(formik.errors.certName)
                    }
                    helperText={
                      formik.touched.certName && formik.errors.certName
                    }
                  />
                </Grid>

                <Grid item xs={12}>
                  <LocalizationProvider
                    dateAdapter={AdapterDateFns}
                    adapterLocale={vi}
                  >
                    <DatePicker
                      label="Ngày cấp"
                      value={issueDate}
                      onChange={handleIssueDateChange}
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

export default CertificateForm;
