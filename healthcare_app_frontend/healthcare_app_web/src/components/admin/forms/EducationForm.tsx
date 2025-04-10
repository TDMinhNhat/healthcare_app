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
} from "@mui/material";
import { DoctorEducation } from "../../../types/doctor";
import { Diploma } from "../../../types/enums";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { vi } from "date-fns/locale";

interface EducationFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: DoctorEducation) => void;
  education: DoctorEducation | null;
  mode: "add" | "edit";
}

const EducationForm: React.FC<EducationFormProps> = ({
  open,
  onClose,
  onSubmit,
  education,
  mode,
}) => {
  // State để lưu trữ dữ liệu form
  const [formData, setFormData] = useState<Partial<DoctorEducation>>({
    schoolName: "",
    joinedDate: "",
    graduateDate: "",
    diploma: "BACHELOR",
  });

  // State cho validation
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Cập nhật dữ liệu form khi prop education thay đổi
  useEffect(() => {
    if (education && mode === "edit") {
      setFormData({
        ...education,
      });
    } else {
      // Reset form khi thêm mới
      setFormData({
        schoolName: "",
        joinedDate: "",
        graduateDate: "",
        diploma: "BACHELOR",
      });
    }
    // Reset errors
    setErrors({});
  }, [education, mode, open]);

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
      // Xóa lỗi khi trường được thay đổi
      if (errors[name]) {
        setErrors({
          ...errors,
          [name]: "",
        });
      }
    }
  };

  // Xử lý thay đổi ngày
  const handleJoinedDateChange = (date: Date | null) => {
    if (date) {
      setFormData({
        ...formData,
        joinedDate: date.toISOString().split("T")[0],
      });
      if (errors["joinedDate"]) {
        setErrors({
          ...errors,
          joinedDate: "",
        });
      }
    }
  };

  const handleGraduateDateChange = (date: Date | null) => {
    if (date) {
      setFormData({
        ...formData,
        graduateDate: date.toISOString().split("T")[0],
      });
      if (errors["graduateDate"]) {
        setErrors({
          ...errors,
          graduateDate: "",
        });
      }
    }
  };

  // Validate form trước khi submit
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.schoolName?.trim()) {
      newErrors.schoolName = "Tên trường không được để trống";
    }

    if (!formData.joinedDate) {
      newErrors.joinedDate = "Ngày bắt đầu không được để trống";
    }

    if (!formData.graduateDate) {
      newErrors.graduateDate = "Ngày kết thúc không được để trống";
    }

    if (formData.joinedDate && formData.graduateDate) {
      const joinedDate = new Date(formData.joinedDate);
      const graduateDate = new Date(formData.graduateDate);
      if (joinedDate > graduateDate) {
        newErrors.graduateDate = "Ngày kết thúc phải sau ngày bắt đầu";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Xử lý submit form
  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData as DoctorEducation);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {mode === "add" ? "Thêm học vấn mới" : "Chỉnh sửa thông tin học vấn"}
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              name="schoolName"
              label="Tên trường"
              value={formData.schoolName || ""}
              onChange={handleChange}
              fullWidth
              error={!!errors.schoolName}
              helperText={errors.schoolName}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.diploma}>
              <InputLabel>Bằng cấp</InputLabel>
              <Select
                name="diploma"
                value={formData.diploma || ""}
                label="Bằng cấp"
                onChange={handleChange}
              >
                <MenuItem value="BACHELOR">Cử nhân</MenuItem>
                <MenuItem value="MASTER">Thạc sĩ</MenuItem>
                <MenuItem value="DOCTOR">Tiến sĩ</MenuItem>
                <MenuItem value="PROFESSOR">Giáo sư</MenuItem>
              </Select>
              {errors.diploma && (
                <FormHelperText>{errors.diploma}</FormHelperText>
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
                  formData.joinedDate ? new Date(formData.joinedDate) : null
                }
                onChange={handleJoinedDateChange}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.joinedDate,
                    helperText: errors.joinedDate,
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
                  formData.graduateDate ? new Date(formData.graduateDate) : null
                }
                onChange={handleGraduateDateChange}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.graduateDate,
                    helperText: errors.graduateDate,
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

export default EducationForm;
