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
    address: {
      id: 0,
      number: "",
      street: "",
      ward: "",
      district: "",
      city: "",
      country: "",
    },
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
        address: {
          id: 0,
          number: "",
          street: "",
          ward: "",
          district: "",
          city: "",
          country: "",
        },
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

  // Xử lý thay đổi input address
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      address: {
        ...(formData.address || {}),
        [name]: value,
      },
    });

    // Xóa lỗi khi trường được thay đổi
    if (errors[`address.${name}`]) {
      setErrors({
        ...errors,
        [`address.${name}`]: "",
      });
    }
  };

  // Xử lý thay đổi ngày cấp
  const handleIssueDateChange = (date: Date | null) => {
    if (date) {
      setFormData({
        ...formData,
        issueDate: date.toISOString().split("T")[0],
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

    if (!formData.address?.city?.trim()) {
      newErrors["address.city"] = "Thành phố không được để trống";
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
                value={formData.issueDate ? new Date(formData.issueDate) : null}
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

          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              Địa chỉ nơi cấp
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              name="city"
              label="Thành phố"
              value={formData.address?.city || ""}
              onChange={handleAddressChange}
              fullWidth
              error={!!errors["address.city"]}
              helperText={errors["address.city"]}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              name="country"
              label="Quốc gia"
              value={formData.address?.country || ""}
              onChange={handleAddressChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              name="district"
              label="Quận/Huyện"
              value={formData.address?.district || ""}
              onChange={handleAddressChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              name="ward"
              label="Phường/Xã"
              value={formData.address?.ward || ""}
              onChange={handleAddressChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              name="street"
              label="Đường"
              value={formData.address?.street || ""}
              onChange={handleAddressChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={2}>
            <TextField
              name="number"
              label="Số nhà"
              value={formData.address?.number || ""}
              onChange={handleAddressChange}
              fullWidth
            />
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
