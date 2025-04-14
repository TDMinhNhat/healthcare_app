// Import các thư viện và components cần thiết
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
  FormHelperText,
} from "@mui/material";
import { Address } from "../../types";
import { updateInfo } from "../../services/authenticate/user_service";
import { useDispatch } from "react-redux";
import { setUser } from "../../stores/slices/user.slice";
import { Formik, Form, Field, FormikHelpers } from "formik";
import * as Yup from "yup";
import { format, parse, isValid } from "date-fns";

// Định nghĩa kiểu dữ liệu cho props của component
interface EditProfileModalProps {
  open: boolean; // Trạng thái hiển thị của modal
  onClose: () => void; // Hàm đóng modal
  onSave: (data: any) => void; // Hàm xử lý khi lưu thông tin
  userData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dob: string;
    sex: boolean | string;
    address: Address | null;
  }; // Dữ liệu người dùng hiện tại
}

// Component modal chỉnh sửa thông tin cá nhân
export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  open,
  onClose,
  onSave,
  userData,
}) => {
  const dispatch = useDispatch();
  // State quản lý trạng thái loading
  const [loading, setLoading] = useState(false);
  // State quản lý thông báo snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  // Chuyển đổi định dạng ngày từ DD-MM-YYYY sang YYYY-MM-DD cho input date
  const formatDateForInput = (dateStr: string) => {
    if (!dateStr) return "";

    // Thử phân tích ngày với định dạng DD-MM-YYYY
    let date = parse(dateStr, "dd-MM-yyyy", new Date());

    // Nếu ngày hợp lệ, chuyển đổi sang định dạng YYYY-MM-DD
    if (isValid(date)) {
      return format(date, "yyyy-MM-dd");
    }

    // Kiểm tra xem ngày đã ở định dạng YYYY-MM-DD chưa
    date = parse(dateStr, "yyyy-MM-dd", new Date());
    if (isValid(date)) {
      return dateStr;
    }

    // Trả về chuỗi gốc nếu không thể phân tích
    return dateStr;
  };

  // Chuyển đổi định dạng ngày từ YYYY-MM-DD về DD-MM-YYYY cho API
  const formatDateForApi = (dateStr: string) => {
    if (!dateStr) return "";

    // Thử phân tích ngày với định dạng YYYY-MM-DD
    const date = parse(dateStr, "yyyy-MM-dd", new Date());

    // Nếu ngày hợp lệ, chuyển đổi sang định dạng DD-MM-YYYY
    if (isValid(date)) {
      return format(date, "dd-MM-yyyy");
    }

    // Trả về chuỗi gốc nếu không thể phân tích
    return dateStr;
  };

  // Giá trị ban đầu của form
  const initialValues = {
    firstName: userData.firstName || "",
    lastName: userData.lastName || "",
    email: userData.email || "",
    phone: userData.phone || "",
    dob: formatDateForInput(userData.dob) || "",
    sex: userData.sex !== undefined ? userData.sex : true,
    address: userData.address || null,
  };

  // Xác thực form sử dụng Yup
  const validationSchema = Yup.object({
    firstName: Yup.string().required("Trường này là bắt buộc"),
    lastName: Yup.string().required("Trường này là bắt buộc"),
    email: Yup.string()
      .email("Email không hợp lệ")
      .required("Trường này là bắt buộc"),
    phone: Yup.string()
      .required("Trường này là bắt buộc")
      .matches(/^\d{10,11}$/, "Số điện thoại không hợp lệ"),
    dob: Yup.string().required("Trường này là bắt buộc"),
    // Xác thực địa chỉ đã được loại bỏ theo yêu cầu
  });

  // Xử lý khi người dùng gửi form
  const handleSubmit = async (
    values: typeof initialValues,
    { setSubmitting }: FormikHelpers<typeof initialValues>
  ) => {
    setLoading(true);

    try {
      // Lấy userId từ localStorage
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = user.userId;

      // Định dạng dữ liệu cho API
      const apiData = {
        ...values,
        password: user.password,
        dob: formatDateForApi(values.dob),
      };

      if (!userId) {
        throw new Error("User ID not found");
      }
      console.log("API Data:", apiData);
      console.log("User ID:", userId);
      // Gọi API cập nhật thông tin
      const response = await updateInfo(userId, apiData);

      if (response.data && response.data.code === 200) {
        // Sử dụng dữ liệu phản hồi thay vì giá trị form
        const responseData = response.data.data;

        // Tạo đối tượng user cập nhật kết hợp dữ liệu hiện có với phản hồi từ server
        const updatedUser = {
          ...user,
          ...responseData, // Sử dụng dữ liệu phản hồi từ server
        };

        // Cập nhật state cục bộ thông qua callback
        onSave(updatedUser);

        // Cập nhật Redux store
        dispatch(setUser(updatedUser));

        // Lưu vào localStorage
        localStorage.setItem("user", JSON.stringify(updatedUser));

        // Hiển thị thông báo thành công
        setSnackbar({
          open: true,
          message: "Cập nhật thông tin thành công",
          severity: "success",
        });

        // Đóng modal
        onClose();
      } else {
        throw new Error(
          response.data?.message || "Cập nhật thông tin thất bại"
        );
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setSnackbar({
        open: true,
        message:
          error instanceof Error
            ? error.message
            : "Cập nhật thông tin thất bại",
        severity: "error",
      });
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  // Đóng thông báo snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      {/* Modal chỉnh sửa thông tin cá nhân */}
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Chỉnh sửa thông tin cá nhân</DialogTitle>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            isSubmitting,
            setFieldValue,
          }) => (
            <Form>
              <DialogContent>
                <Grid container spacing={2}>
                  {/* Trường nhập tên */}
                  <Grid item xs={12} md={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      label="Tên"
                      name="firstName"
                      value={values.firstName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.firstName && Boolean(errors.firstName)}
                      helperText={touched.firstName && errors.firstName}
                      margin="normal"
                    />
                  </Grid>
                  {/* Trường nhập họ */}
                  <Grid item xs={12} md={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      label="Họ"
                      name="lastName"
                      value={values.lastName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.lastName && Boolean(errors.lastName)}
                      helperText={touched.lastName && errors.lastName}
                      margin="normal"
                    />
                  </Grid>
                  {/* Trường nhập email */}
                  <Grid item xs={12} md={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      label="Email"
                      name="email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.email && Boolean(errors.email)}
                      helperText={touched.email && errors.email}
                      margin="normal"
                      type="email"
                    />
                  </Grid>
                  {/* Trường nhập số điện thoại */}
                  <Grid item xs={12} md={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      label="Số điện thoại"
                      name="phone"
                      value={values.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.phone && Boolean(errors.phone)}
                      helperText={touched.phone && errors.phone}
                      margin="normal"
                    />
                  </Grid>
                  {/* Trường chọn ngày sinh */}
                  <Grid item xs={12} md={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      label="Ngày sinh"
                      name="dob"
                      value={values.dob}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.dob && Boolean(errors.dob)}
                      helperText={touched.dob && errors.dob}
                      margin="normal"
                      type="date"
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  {/* Trường chọn giới tính */}
                  <Grid item xs={12} md={6}>
                    <FormControl
                      fullWidth
                      margin="normal"
                      error={touched.sex && Boolean(errors.sex)}
                    >
                      <InputLabel>Giới tính</InputLabel>
                      <Field
                        as={Select}
                        name="sex"
                        value={values.sex}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        label="Giới tính"
                      >
                        <MenuItem value={false}>Nam</MenuItem>
                        <MenuItem value={true}>Nữ</MenuItem>
                      </Field>
                      {touched.sex && errors.sex && (
                        <FormHelperText>{errors.sex}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  {/* Phần nhập địa chỉ */}
                  <Grid item xs={12}>
                    <Box sx={{ mt: 2, mb: 1, fontWeight: "bold" }}>Địa chỉ</Box>
                  </Grid>

                  {/* Trường nhập số nhà */}
                  <Grid item xs={12} md={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      label="Số nhà"
                      name="address.number"
                      value={values.address?.number || ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      margin="normal"
                    />
                  </Grid>
                  {/* Trường nhập tên đường */}
                  <Grid item xs={12} md={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      label="Đường"
                      name="address.street"
                      value={values.address?.street || ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      margin="normal"
                    />
                  </Grid>
                  {/* Trường nhập phường/xã */}
                  <Grid item xs={12} md={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      label="Phường/Xã"
                      name="address.ward"
                      value={values.address?.ward || ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      margin="normal"
                    />
                  </Grid>
                  {/* Trường nhập quận/huyện */}
                  <Grid item xs={12} md={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      label="Quận/Huyện"
                      name="address.district"
                      value={values.address?.district || ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      margin="normal"
                    />
                  </Grid>
                  {/* Trường nhập thành phố */}
                  <Grid item xs={12} md={12}>
                    <Field
                      as={TextField}
                      fullWidth
                      label="Thành phố"
                      name="address.city"
                      value={values.address?.city || ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      margin="normal"
                    />
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                {/* Nút hủy */}
                <Button onClick={onClose} disabled={loading || isSubmitting}>
                  Hủy
                </Button>
                {/* Nút lưu */}
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading || isSubmitting}
                >
                  {loading || isSubmitting ? (
                    <CircularProgress size={24} />
                  ) : (
                    "Lưu"
                  )}
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>

      {/* Thông báo kết quả */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};
