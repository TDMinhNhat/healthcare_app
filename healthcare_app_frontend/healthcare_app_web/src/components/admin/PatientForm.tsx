import React, { useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import { User } from "../../types/user";
import { useFormik } from "formik";
import * as Yup from "yup";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { vi } from "date-fns/locale";

// Interface định nghĩa các props cho component PatientForm
// Cho phép sử dụng chung một form cho cả thêm mới và chỉnh sửa
interface PatientFormProps {
  open: boolean; // Trạng thái hiển thị của modal
  onClose: () => void; // Hàm xử lý khi đóng modal
  onSubmit: (patient: Partial<User>) => void; // Hàm xử lý khi submit form
  patient?: User | null; // Thông tin bệnh nhân (khi chỉnh sửa)
  mode: "add" | "edit"; // Chế độ form: thêm mới hoặc chỉnh sửa
}

// Schema validation sử dụng Yup
// Định nghĩa các quy tắc kiểm tra dữ liệu nhập vào
const validationSchema = Yup.object({
  firstName: Yup.string()
    .required("Tên là bắt buộc")
    .min(2, "Tên phải có ít nhất 2 ký tự"),
  lastName: Yup.string()
    .required("Họ là bắt buộc")
    .min(2, "Họ phải có ít nhất 2 ký tự"),
  sex: Yup.boolean().required("Giới tính là bắt buộc"),
  dob: Yup.date()
    .required("Ngày sinh là bắt buộc")
    .max(new Date(), "Ngày sinh không thể là ngày trong tương lai"),
  phone: Yup.string()
    .required("Số điện thoại là bắt buộc")
    .matches(/^[0-9]{10,11}$/, "Số điện thoại phải có 10-11 chữ số"),
  email: Yup.string().required("Email là bắt buộc").email("Email không hợp lệ"),
  status: Yup.boolean().required("Trạng thái là bắt buộc"),
});

const PatientForm: React.FC<PatientFormProps> = ({
  open,
  onClose,
  onSubmit,
  patient,
  mode,
}) => {
  // Sử dụng formik để quản lý form và validation
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      sex: true,
      dob: new Date().toISOString().split("T")[0],
      phone: "",
      email: "",
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
    if (patient && mode === "edit") {
      formik.setValues({
        firstName: patient.firstName,
        lastName: patient.lastName,
        sex: patient.sex,
        dob: patient.dob,
        phone: patient.phone,
        email: patient.email,
        status: patient.status,
      });
    } else if (mode === "add") {
      formik.resetForm();
    }
  }, [patient, mode]);

  // Xử lý đóng modal và reset form
  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  // Xác định tiêu đề và nút bấm dựa trên chế độ form
  const title =
    mode === "add" ? "Thêm bệnh nhân mới" : "Chỉnh sửa thông tin bệnh nhân";
  const buttonText = mode === "add" ? "Thêm bệnh nhân" : "Lưu thay đổi";

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {/* Form nhập thông tin bệnh nhân */}
            <Grid item xs={12} md={6}>
              <TextField
                name="firstName"
                label="Họ"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.firstName && Boolean(formik.errors.firstName)
                }
                helperText={formik.touched.firstName && formik.errors.firstName}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="lastName"
                label="Tên"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.lastName && Boolean(formik.errors.lastName)
                }
                helperText={formik.touched.lastName && formik.errors.lastName}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl
                fullWidth
                error={formik.touched.sex && Boolean(formik.errors.sex)}
              >
                <InputLabel>Giới tính</InputLabel>
                <Select
                  name="sex"
                  value={formik.values.sex}
                  label="Giới tính"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <MenuItem value={false}>Nam</MenuItem>
                  <MenuItem value={true}>Nữ</MenuItem>
                </Select>
                {formik.touched.sex && formik.errors.sex && (
                  <FormHelperText>{formik.errors.sex as string}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                adapterLocale={vi}
              >
                <DatePicker
                  label="Ngày sinh"
                  value={new Date(formik.values.dob)}
                  onChange={(newValue) => {
                    if (newValue) {
                      const dateStr = newValue.toISOString().split("T")[0];
                      formik.setFieldValue("dob", dateStr);
                    }
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: formik.touched.dob && Boolean(formik.errors.dob),
                      helperText:
                        formik.touched.dob && (formik.errors.dob as string),
                      onBlur: () => formik.setFieldTouched("dob", true),
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="phone"
                label="Số điện thoại"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.phone && Boolean(formik.errors.phone)}
                helperText={formik.touched.phone && formik.errors.phone}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="email"
                label="Email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                fullWidth
                required
                type="email"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl
                fullWidth
                error={formik.touched.status && Boolean(formik.errors.status)}
              >
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  name="status"
                  value={formik.values.status}
                  label="Trạng thái"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <MenuItem value={true}>Đang hoạt động</MenuItem>
                  <MenuItem value={false}>Không hoạt động</MenuItem>
                </Select>
                {formik.touched.status && formik.errors.status && (
                  <FormHelperText>
                    {formik.errors.status as string}
                  </FormHelperText>
                )}
              </FormControl>
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

export default PatientForm;
