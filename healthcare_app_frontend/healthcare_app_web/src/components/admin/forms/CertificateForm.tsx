import React, { useState } from "react";
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

interface CertificateFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (
    data: DoctorCertificate
  ) => Promise<{ success: boolean; message: string }>;
  certificate: DoctorCertificate | null;
  mode: "add" | "edit";
  isSubmitting?: boolean;
}

// Định nghĩa interface cho giá trị của form
interface CertificateFormValues {
  certName: string;
  issueDate: string;
}

const CertificateForm: React.FC<CertificateFormProps> = ({
  open,
  onClose,
  onSubmit,
  certificate,
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
    certName: Yup.string().required("Tên chứng chỉ không được để trống"),
    issueDate: Yup.string().required("Ngày cấp không được để trống"),
  });

  // Giá trị khởi tạo của form
  const initialValues: CertificateFormValues = {
    certName: "",
    issueDate: "",
  };

  // Chuẩn bị giá trị form khi dữ liệu chứng chỉ thay đổi
  const getInitialValues = (): CertificateFormValues => {
    if (!certificate) return initialValues;

    // Đảm bảo ngày cấp hợp lệ
    let validIssueDate = certificate.issueDate || "";

    if (typeof validIssueDate === "string" && validIssueDate) {
      try {
        // Thử phân tích ngày để đảm bảo nó hợp lệ
        parseDateFromString(validIssueDate);
      } catch (error) {
        console.error("Lỗi khi phân tích ngày cấp", error);
        // Nếu phân tích thất bại, đặt một định dạng ngày hợp lệ mặc định
        validIssueDate = format(new Date(), "dd-MM-yyyy");
      }
    }

    return {
      certName: certificate.certName || "",
      issueDate: validIssueDate,
    };
  };

  // Xử lý khi submit form
  const handleFormSubmit = async (
    values: CertificateFormValues,
    { setSubmitting }: any
  ) => {
    try {
      // Ghi log giá trị để gỡ lỗi
      console.log("Đang gửi giá trị chứng chỉ:", values);

      // Chuẩn bị dữ liệu cho API
      const submissionData: Partial<DoctorCertificate> = {
        certName: values.certName,
        issueDate: values.issueDate,
      };

      // Gọi onSubmit và xử lý phản hồi
      const result = await onSubmit(submissionData as DoctorCertificate);

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
      console.error("Lỗi khi gửi dữ liệu chứng chỉ:", error);
      setResponseMessage({
        type: "error",
        message: "Đã xảy ra lỗi khi lưu thông tin chứng chỉ!",
        show: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

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
                      value={
                        formik.values.issueDate
                          ? parseDateFromString(formik.values.issueDate)
                          : null
                      }
                      onChange={(date) => {
                        if (date) {
                          const formattedDate = formatDateToString(date);
                          formik.setFieldValue("issueDate", formattedDate);
                        }
                      }}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error:
                            formik.touched.issueDate &&
                            Boolean(formik.errors.issueDate),
                          helperText:
                            formik.touched.issueDate && formik.errors.issueDate,
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

export default CertificateForm;
