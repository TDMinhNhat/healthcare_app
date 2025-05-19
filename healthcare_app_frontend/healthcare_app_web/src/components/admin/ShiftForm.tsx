import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  FormHelperText,
} from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Shift } from "../../types/shift";
import { useFormik } from "formik";
import * as Yup from "yup";
import { formatTimeFromTimeString } from "../../utils/dateUtils";

// Interface định nghĩa các props cho component ShiftForm
// Cho phép sử dụng chung một form cho cả thêm mới và chỉnh sửa
interface ShiftFormProps {
  open: boolean; // Trạng thái hiển thị của modal
  onClose: () => void; // Hàm xử lý khi đóng modal
  onSubmit: (shift: Partial<Shift>) => void; // Hàm xử lý khi submit form
  shift?: Shift | null; // Thông tin ca làm việc (khi chỉnh sửa)
  mode: "add" | "edit"; // Chế độ form: thêm mới hoặc chỉnh sửa
}

// Simplified schema validation for shift number only
const validationSchema = Yup.object({
  shift: Yup.number()
    .required("Số ca làm việc là bắt buộc")
    .min(1, "Số ca làm việc phải lớn hơn 0"),
});

const ShiftForm: React.FC<ShiftFormProps> = ({
  open,
  onClose,
  onSubmit,
  shift,
  mode,
}) => {
  // State for time validation error
  const [timeError, setTimeError] = useState<string | null>(null);

  // Sử dụng formik để quản lý form
  const formik = useFormik({
    initialValues: {
      shift: 0,
      start: "",
      end: "",
      status: true,
      // Thêm các trường thời gian để quản lý giá trị Date của time picker
      startTime: null as Date | null,
      endTime: null as Date | null,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      // Validate times before submitting
      if (!validateTimes(values.startTime, values.endTime)) {
        return; // Don't submit if validation fails
      }

      // Submit with the string values
      onSubmit({
        shift: values.shift,
        start: values.start,
        end: values.end,
        status: values.status,
      });
    },
  });

  // Custom time validation function
  const validateTimes = (
    startTime: Date | null,
    endTime: Date | null
  ): boolean => {
    // Clear previous error
    setTimeError(null);

    // If either time is not set, don't validate yet
    if (!startTime || !endTime) {
      return true;
    }

    // Check if end time is after start time
    if (endTime <= startTime) {
      setTimeError("Giờ kết thúc phải sau giờ bắt đầu");
      return false;
    }

    return true;
  };

  // Effect để cập nhật giá trị form khi chuyển sang chế độ chỉnh sửa
  useEffect(() => {
    if (shift && mode === "edit") {
      const startTime = parseTimeString(shift.start);
      const endTime = parseTimeString(shift.end);

      formik.setValues({
        shift: shift.shift,
        start: shift.start,
        end: shift.end,
        status: shift.status,
        startTime: startTime,
        endTime: endTime,
      });

      // Validate times after setting values
      validateTimes(startTime, endTime);
    } else if (mode === "add") {
      formik.resetForm();
      formik.setValues({
        shift: 0,
        start: "",
        end: "",
        status: true,
        startTime: null,
        endTime: null,
      });
      setTimeError(null);
    }
  }, [shift, mode, open]);

  // Helper to parse time string to Date object
  const parseTimeString = (timeStr: string): Date | null => {
    if (!timeStr) return null;

    try {
      const today = new Date();

      if (timeStr.includes(":")) {
        const [hours, minutes] = timeStr.split(":").map(Number);
        today.setHours(hours, minutes, 0, 0);
        return today;
      }

      if (timeStr.includes("-")) {
        return formatTimeFromTimeString(timeStr, "date");
      }

      return today;
    } catch (e) {
      console.error("Error parsing time string:", timeStr, e);
      return null;
    }
  };

  // Handle time picker changes
  const handleStartTimeChange = (newValue: Date | null) => {
    formik.setFieldValue("startTime", newValue);
    // Đồng bộ start vs startTime
    if (newValue) {
      // Convert Date object to string format "HH:mm"
      const timeString = `${String(newValue.getHours()).padStart(
        2,
        "0"
      )}:${String(newValue.getMinutes()).padStart(2, "0")}`;
      formik.setFieldValue("start", timeString);

      // Validate times whenever start time changes
      validateTimes(newValue, formik.values.endTime);
    }
  };

  const handleEndTimeChange = (newValue: Date | null) => {
    formik.setFieldValue("endTime", newValue);
    // Đồng bộ endTime và end
    if (newValue) {
      const timeString = `${String(newValue.getHours()).padStart(
        2,
        "0"
      )}:${String(newValue.getMinutes()).padStart(2, "0")}`;
      formik.setFieldValue("end", timeString);

      // Validate times whenever end time changes
      validateTimes(formik.values.startTime, newValue);
    }
  };

  // Xử lý đóng modal và reset form
  const handleClose = () => {
    formik.resetForm();
    setTimeError(null);
    onClose();
  };

  // Xác định tiêu đề và nút bấm
  const title =
    mode === "add" ? "Thêm ca làm việc mới" : "Chỉnh sửa thông tin ca làm việc";
  const buttonText = mode === "add" ? "Thêm ca làm việc" : "Lưu thay đổi";

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="shift"
                label="Số ca làm việc"
                type="number"
                value={formik.values.shift}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.shift && Boolean(formik.errors.shift)}
                helperText={formik.touched.shift && formik.errors.shift}
                fullWidth
                required
                inputProps={{ min: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    name="status"
                    checked={formik.values.status}
                    onChange={formik.handleChange}
                  />
                }
                label="Hoạt động"
              />
            </Grid>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Grid item xs={12} sm={6}>
                <TimePicker
                  label="Giờ bắt đầu"
                  value={formik.values.startTime}
                  onChange={handleStartTimeChange}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TimePicker
                  label="Giờ kết thúc"
                  value={formik.values.endTime}
                  onChange={handleEndTimeChange}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                      error: Boolean(timeError),
                    },
                  }}
                />
                {timeError && (
                  <FormHelperText error>{timeError}</FormHelperText>
                )}
              </Grid>
            </LocalizationProvider>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="error">
            Hủy
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={formik.isSubmitting || Boolean(timeError)}
          >
            {buttonText}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ShiftForm;
