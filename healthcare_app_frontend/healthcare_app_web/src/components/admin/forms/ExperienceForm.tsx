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
  FormControlLabel,
  Checkbox,
  Box,
} from "@mui/material";
import { DoctorExperience } from "../../../types/doctor";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { vi } from "date-fns/locale";

interface ExperienceFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: DoctorExperience) => void;
  experience: DoctorExperience | null;
}

const ExperienceForm: React.FC<ExperienceFormProps> = ({
  open,
  onClose,
  onSubmit,
  experience,
}) => {
  // State để lưu trữ dữ liệu form
  const [formData, setFormData] = useState<Partial<DoctorExperience>>({
    compName: "",
    specialization: "",
    startDate: "",
    endDate: "",
    description: "",
    compAddress: {
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

  // State để kiểm soát tùy chọn "Hiện tại đang làm việc"
  const [isCurrentJob, setIsCurrentJob] = useState(false);

  // Cập nhật dữ liệu form khi prop experience thay đổi
  useEffect(() => {
    if (experience) {
      setFormData({
        ...experience,
      });

      // Kiểm tra nếu không có endDate thì đó là công việc hiện tại
      setIsCurrentJob(!experience.endDate);
    } else {
      // Reset form khi thêm mới
      setFormData({
        compName: "",
        specialization: "",
        startDate: "",
        endDate: "",
        description: "",
        compAddress: {
          id: 0,
          number: "",
          street: "",
          ward: "",
          district: "",
          city: "",
          country: "",
        },
      });
      setIsCurrentJob(false);
    }
    // Reset errors
    setErrors({});
  }, [experience, open]);

  // Xử lý thay đổi input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
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
  };

  // Xử lý thay đổi input address
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      compAddress: {
        ...(formData.compAddress || {}),
        [name]: value,
      },
    });

    // Clear error when field is changed
    if (errors[`compAddress.${name}`]) {
      setErrors({
        ...errors,
        [`compAddress.${name}`]: "",
      });
    }
  };

  // Xử lý thay đổi ngày bắt đầu
  const handleStartDateChange = (date: Date | null) => {
    if (date) {
      setFormData({
        ...formData,
        startDate: date.toISOString().split("T")[0],
      });
      if (errors["startDate"]) {
        setErrors({
          ...errors,
          startDate: "",
        });
      }
    }
  };

  // Xử lý thay đổi ngày kết thúc
  const handleEndDateChange = (date: Date | null) => {
    if (date) {
      setFormData({
        ...formData,
        endDate: date.toISOString().split("T")[0],
      });
      if (errors["endDate"]) {
        setErrors({
          ...errors,
          endDate: "",
        });
      }
    }
  };

  // Xử lý khi checkbox "Hiện tại đang làm việc" thay đổi
  const handleCurrentJobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsCurrentJob(e.target.checked);
    if (e.target.checked) {
      // Nếu là công việc hiện tại, xóa ngày kết thúc
      setFormData({
        ...formData,
        endDate: undefined,
      });
    }
  };

  // Validate form trước khi submit
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.compName?.trim()) {
      newErrors.compName = "Tên công ty không được để trống";
    }

    if (!formData.specialization?.trim()) {
      newErrors.specialization = "Chuyên môn không được để trống";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Ngày bắt đầu không được để trống";
    }

    if (!isCurrentJob && !formData.endDate) {
      newErrors.endDate = "Ngày kết thúc không được để trống";
    }

    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      if (startDate > endDate) {
        newErrors.endDate = "Ngày kết thúc phải sau ngày bắt đầu";
      }
    }

    if (!formData.compAddress?.city?.trim()) {
      newErrors["compAddress.city"] = "Thành phố không được để trống";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Xử lý submit form
  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData as DoctorExperience);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {experience
          ? "Chỉnh sửa thông tin kinh nghiệm"
          : "Thêm kinh nghiệm mới"}
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            <TextField
              name="compName"
              label="Tên công ty/Cơ sở y tế"
              value={formData.compName || ""}
              onChange={handleChange}
              fullWidth
              error={!!errors.compName}
              helperText={errors.compName}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              name="specialization"
              label="Chuyên môn/Vị trí"
              value={formData.specialization || ""}
              onChange={handleChange}
              fullWidth
              error={!!errors.specialization}
              helperText={errors.specialization}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <LocalizationProvider
              dateAdapter={AdapterDateFns}
              adapterLocale={vi}
            >
              <DatePicker
                label="Ngày bắt đầu"
                value={formData.startDate ? new Date(formData.startDate) : null}
                onChange={handleStartDateChange}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.startDate,
                    helperText: errors.startDate,
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                adapterLocale={vi}
              >
                <DatePicker
                  label="Ngày kết thúc"
                  value={formData.endDate ? new Date(formData.endDate) : null}
                  onChange={handleEndDateChange}
                  disabled={isCurrentJob}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.endDate,
                      helperText: errors.endDate,
                    },
                  }}
                />
              </LocalizationProvider>

              <FormControlLabel
                control={
                  <Checkbox
                    checked={isCurrentJob}
                    onChange={handleCurrentJobChange}
                    name="currentJob"
                    color="primary"
                  />
                }
                label="Hiện tại đang làm việc"
                sx={{ mt: 1 }}
              />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              Địa chỉ công ty
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              name="city"
              label="Thành phố"
              value={formData.compAddress?.city || ""}
              onChange={handleAddressChange}
              fullWidth
              error={!!errors["compAddress.city"]}
              helperText={errors["compAddress.city"]}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              name="country"
              label="Quốc gia"
              value={formData.compAddress?.country || ""}
              onChange={handleAddressChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              name="district"
              label="Quận/Huyện"
              value={formData.compAddress?.district || ""}
              onChange={handleAddressChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              name="ward"
              label="Phường/Xã"
              value={formData.compAddress?.ward || ""}
              onChange={handleAddressChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              name="street"
              label="Đường"
              value={formData.compAddress?.street || ""}
              onChange={handleAddressChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={2}>
            <TextField
              name="number"
              label="Số nhà"
              value={formData.compAddress?.number || ""}
              onChange={handleAddressChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              name="description"
              label="Mô tả công việc"
              value={formData.description || ""}
              onChange={handleChange}
              fullWidth
              multiline
              rows={4}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {experience ? "Lưu thay đổi" : "Thêm"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExperienceForm;
