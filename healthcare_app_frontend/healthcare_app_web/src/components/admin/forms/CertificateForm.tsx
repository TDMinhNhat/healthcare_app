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

// Define the form values interface
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
  // State for handling response messages
  const [responseMessage, setResponseMessage] = useState<{
    type: "success" | "error" | "info";
    message: string;
    show: boolean;
  }>({
    type: "info",
    message: "",
    show: false,
  });

  // Define validation schema with Yup
  const validationSchema = Yup.object({
    certName: Yup.string().required("Tên chứng chỉ không được để trống"),
    issueDate: Yup.string().required("Ngày cấp không được để trống"),
  });

  // Initial form values
  const initialValues: CertificateFormValues = {
    certName: "",
    issueDate: "",
  };

  // Prepare form values when certificate data changes
  const getInitialValues = (): CertificateFormValues => {
    if (!certificate) return initialValues;

    // Make sure we have a valid issueDate
    let validIssueDate = certificate.issueDate || "";

    if (typeof validIssueDate === "string" && validIssueDate) {
      try {
        // Try to parse the date to make sure it's valid
        parseDateFromString(validIssueDate);
      } catch (error) {
        console.error("Error parsing issueDate", error);
        // If parsing fails, set a default valid date format
        validIssueDate = format(new Date(), "dd-MM-yyyy");
      }
    }

    return {
      certName: certificate.certName || "",
      issueDate: validIssueDate,
    };
  };

  // Submit handler
  const handleFormSubmit = async (
    values: CertificateFormValues,
    { setSubmitting }: any
  ) => {
    try {
      // Log the values for debugging
      console.log("Submitting certificate values:", values);

      // Prepare data for API submission
      const submissionData: Partial<DoctorCertificate> = {
        certName: values.certName,
        issueDate: values.issueDate,
      };

      // Call onSubmit and handle the response
      const result = await onSubmit(submissionData as DoctorCertificate);

      if (result.success) {
        setResponseMessage({
          type: "success",
          message: result.message || "Thao tác thành công!",
          show: true,
        });

        // Optionally close the form after success with a delay
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
      console.error("Error submitting certificate data:", error);
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
              {/* Response message alert */}
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
