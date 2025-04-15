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
} from "@mui/material";
import { DoctorCertificate } from "../../../types/doctor";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { vi } from "date-fns/locale";
import {
  parseDateFromString,
  formatDateToString,
} from "../../../utils/dateUtils";

interface CertificateFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: DoctorCertificate) => void;
  certificate: DoctorCertificate | null;
  mode: "add" | "edit";
}

const CertificateForm: React.FC<CertificateFormProps> = ({
  open,
  onClose,
  onSubmit,
  certificate,
  mode,
}) => {
  // State để lưu trữ dữ liệu form
  const [formData, setFormData] = useState<Partial<DoctorCertificate>>({
    certName: "",
    issueDate: "",
  });

  // State cho validation
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Cập nhật dữ liệu form khi prop certificate thay đổi
  useEffect(() => {
    if (certificate && mode === "edit") {
      setFormData({
        ...certificate,
      });
    } else {
      // Reset form khi thêm mới
      setFormData({
        certName: "",
        issueDate: "",
      });
    }
    // Reset errors
    setErrors({});
  }, [certificate, mode, open]);

  // Xử lý thay đổi input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Xóa lỗi khi trường được thay đổi
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  // Xử lý thay đổi ngày cấp
  const handleIssueDateChange = (date: Date | null) => {
    if (date) {
      // Use formatDateToString to ensure date is in correct format (dd-MM-yyyy)
      const formattedDate = formatDateToString(date);
      setFormData({
        ...formData,
        issueDate: formattedDate,
      });
      if (errors["issueDate"]) {
        setErrors({
          ...errors,
          issueDate: "",
        });
      }
    }
  };

  // Validate form trước khi submit
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.certName?.trim()) {
      newErrors.certName = "Tên chứng chỉ không được để trống";
    }

    if (!formData.issueDate) {
      newErrors.issueDate = "Ngày cấp không được để trống";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Xử lý submit form
  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData as DoctorCertificate);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {mode === "add"
          ? "Thêm chứng chỉ mới"
          : "Chỉnh sửa thông tin chứng chỉ"}
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              name="certName"
              label="Tên chứng chỉ"
              value={formData.certName || ""}
              onChange={handleChange}
              fullWidth
              error={!!errors.certName}
              helperText={errors.certName}
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
                  formData.issueDate
                    ? typeof formData.issueDate === "string"
                      ? parseDateFromString(formData.issueDate)
                      : new Date(formData.issueDate)
                    : null
                }
                onChange={handleIssueDateChange}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.issueDate,
                    helperText: errors.issueDate,
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {mode === "add" ? "Thêm" : "Lưu thay đổi"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CertificateForm;
