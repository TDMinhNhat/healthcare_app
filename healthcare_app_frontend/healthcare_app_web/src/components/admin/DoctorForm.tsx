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
} from "@mui/material";
import { Doctor } from "../../types/doctor";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { vi } from "date-fns/locale";

interface DoctorFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Doctor>) => void;
  doctor: Doctor | null;
  mode: "add" | "edit";
}

const DoctorForm: React.FC<DoctorFormProps> = ({
  open,
  onClose,
  onSubmit,
  doctor,
  mode,
}) => {
  // State để lưu trữ dữ liệu form
  const [formData, setFormData] = useState<Partial<Doctor>>({
    firstName: "",
    lastName: "",
    sex: true,
    dob: "",
    phone: "",
    email: "",
    specialization: "",
    status: true,
  });

  // State cho validation
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Cập nhật dữ liệu form khi prop doctor thay đổi
  useEffect(() => {
    if (doctor && mode === "edit") {
      setFormData({
        firstName: doctor.firstName,
        lastName: doctor.lastName,
        sex: doctor.sex,
        dob: doctor.dob,
        phone: doctor.phone,
        email: doctor.email,
        specialization: doctor.specialization,
        status: doctor.status,
      });
    } else {
      // Reset form khi thêm mới
      setFormData({
        firstName: "",
        lastName: "",
        sex: true,
        dob: "",
        phone: "",
        email: "",
        specialization: "",
        status: true,
      });
    }
    // Reset errors
    setErrors({});
  }, [doctor, mode, open]);

  // Xử lý thay đổi input
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    if (name) {
      setFormData({
        ...formData,
        [name]: value,
      });
      // Clear error when field is changed
      if (errors[name]) {
        setErrors({
          ...errors,
          [name]: "",
        });
      }
    }
  };

  // Xử lý thay đổi ngày sinh
  const handleDateChange = (date: Date | null) => {
    if (date) {
      setFormData({
        ...formData,
        dob: date.toISOString().split("T")[0],
      });
      if (errors["dob"]) {
        setErrors({
          ...errors,
          dob: "",
        });
      }
    }
  };

  // Validate form trước khi submit
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.firstName?.trim()) {
      newErrors.firstName = "Họ không được để trống";
    }

    if (!formData.lastName?.trim()) {
      newErrors.lastName = "Tên không được để trống";
    }

    if (!formData.specialization?.trim()) {
      newErrors.specialization = "Chuyên khoa không được để trống";
    }

    if (!formData.dob) {
      newErrors.dob = "Ngày sinh không được để trống";
    }

    if (!formData.phone?.trim()) {
      newErrors.phone = "Số điện thoại không được để trống";
    } else if (!/^[0-9]{10,11}$/.test(formData.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }

    if (!formData.email?.trim()) {
      newErrors.email = "Email không được để trống";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Xử lý submit form
  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {mode === "add" ? "Thêm bác sĩ mới" : "Chỉnh sửa thông tin bác sĩ"}
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            Thông tin cơ bản
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                name="firstName"
                label="Họ"
                value={formData.firstName || ""}
                onChange={handleChange}
                fullWidth
                error={!!errors.firstName}
                helperText={errors.firstName}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                name="lastName"
                label="Tên"
                value={formData.lastName || ""}
                onChange={handleChange}
                fullWidth
                error={!!errors.lastName}
                helperText={errors.lastName}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.sex}>
                <InputLabel>Giới tính</InputLabel>
                <Select
                  name="sex"
                  value={formData.sex === undefined ? "" : formData.sex}
                  label="Giới tính"
                  onChange={handleChange}
                >
                  <MenuItem value={true}>Nam</MenuItem>
                  <MenuItem value={false}>Nữ</MenuItem>
                </Select>
                {errors.sex && <FormHelperText>{errors.sex}</FormHelperText>}
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                adapterLocale={vi}
              >
                <DatePicker
                  label="Ngày sinh"
                  value={formData.dob ? new Date(formData.dob) : null}
                  onChange={handleDateChange}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.dob,
                      helperText: errors.dob,
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                name="phone"
                label="Số điện thoại"
                value={formData.phone || ""}
                onChange={handleChange}
                fullWidth
                error={!!errors.phone}
                helperText={errors.phone}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                name="email"
                label="Email"
                type="email"
                value={formData.email || ""}
                onChange={handleChange}
                fullWidth
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                name="specialization"
                label="Chuyên khoa"
                value={formData.specialization || ""}
                onChange={handleChange}
                fullWidth
                error={!!errors.specialization}
                helperText={errors.specialization}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  name="status"
                  value={formData.status === undefined ? "" : formData.status}
                  label="Trạng thái"
                  onChange={handleChange}
                >
                  <MenuItem value={true}>Đang hoạt động</MenuItem>
                  <MenuItem value={false}>Không hoạt động</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
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

export default DoctorForm;
