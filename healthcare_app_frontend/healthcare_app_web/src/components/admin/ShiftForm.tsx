import React, { useEffect } from "react";
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
} from "@mui/material";
import { Shift } from "../../types/shift";
import { useFormik } from "formik";
import * as Yup from "yup";

// Interface định nghĩa các props cho component ShiftForm
// Cho phép sử dụng chung một form cho cả thêm mới và chỉnh sửa
interface ShiftFormProps {
  open: boolean; // Trạng thái hiển thị của modal
  onClose: () => void; // Hàm xử lý khi đóng modal
  onSubmit: (shift: Partial<Shift>) => void; // Hàm xử lý khi submit form
  shift?: Shift | null; // Thông tin ca làm việc (khi chỉnh sửa)
  mode: "add" | "edit"; // Chế độ form: thêm mới hoặc chỉnh sửa
}

// Schema validation sử dụng Yup
// Định nghĩa các quy tắc kiểm tra dữ liệu nhập vào
const validationSchema = Yup.object({
  shift: Yup.number()
    .required("Số ca làm việc là bắt buộc")
    .min(1, "Số ca làm việc phải lớn hơn 0"),
  start: Yup.string()
    .required("Giờ bắt đầu là bắt buộc")
    .matches(
      /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
      "Giờ không đúng định dạng (HH:MM)"
    ),
  end: Yup.string()
    .required("Giờ kết thúc là bắt buộc")
    .matches(
      /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
      "Giờ không đúng định dạng (HH:MM)"
    ),
});

const ShiftForm: React.FC<ShiftFormProps> = ({
  open,
  onClose,
  onSubmit,
  shift,
  mode,
}) => {
  // Sử dụng formik để quản lý form và validation
  const formik = useFormik({
    initialValues: {
      shift: 0,
      start: "",
      end: "",
      status: true,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  // Effect để cập nhật giá trị form khi chuyển sang chế độ chỉnh sửa
  // Hoặc reset form khi chuyển sang chế độ thêm mới
  useEffect(() => {
    if (shift && mode === "edit") {
      formik.setValues({
        shift: shift.shift,
        start: shift.start,
        end: shift.end,
        status: shift.status,
      });
    } else if (mode === "add") {
      formik.resetForm();
      formik.setValues({
        shift: 0,
        start: "",
        end: "",
        status: true,
      });
    }
  }, [shift, mode, open]);

  // Xử lý đóng modal và reset form
  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  // Xác định tiêu đề và nút bấm dựa trên chế độ form
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
            <Grid item xs={12} sm={6}>
              <TextField
                name="start"
                label="Giờ bắt đầu"
                value={formik.values.start}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.start && Boolean(formik.errors.start)}
                helperText={formik.touched.start && formik.errors.start}
                fullWidth
                required
                placeholder="HH:MM"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="end"
                label="Giờ kết thúc"
                value={formik.values.end}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.end && Boolean(formik.errors.end)}
                helperText={formik.touched.end && formik.errors.end}
                fullWidth
                required
                placeholder="HH:MM"
              />
            </Grid>
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
            disabled={formik.isSubmitting}
          >
            {buttonText}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ShiftForm;
