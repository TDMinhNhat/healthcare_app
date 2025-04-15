import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  InputAdornment,
  IconButton,
  Paper,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { setUser } from "../stores/slices/user.slice";
import { updateInfo } from "../services/authenticate/user_service";
import { useNavigate } from "react-router";

// Schema validate với Yup
const ChangePasswordSchema = Yup.object().shape({
  oldPassword: Yup.string().required("Vui lòng nhập mật khẩu cũ"),
  newPassword: Yup.string()
    .min(6, "Mật khẩu mới phải có ít nhất 6 ký tự")
    .required("Vui lòng nhập mật khẩu mới"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword"), null], "Mật khẩu xác nhận không khớp")
    .required("Vui lòng xác nhận mật khẩu mới"),
});

const ChangePasswordPage: React.FC = () => {
  // State để hiển thị/thay đổi mật khẩu
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  // State hiển thị thông báo
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const dispatch = useDispatch(); // Dùng để cập nhật Redux
  const navigate = useNavigate(); // Hook điều hướng

  // Hàm xử lý đổi mật khẩu thực tế
  const handleChangePassword = async (values: any, actions: any) => {
    setAlert(null);
    try {
      // Lấy user hiện tại từ localStorage
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = user.userId;
      // Kiểm tra mật khẩu cũ có đúng không
      if (!user.password || values.oldPassword !== user.password) {
        setAlert({ type: "error", message: "Mật khẩu cũ không đúng." });
        actions.setSubmitting(false);
        return;
      }
      // Gọi API updateInfo với password mới
      const apiData = { ...user, password: values.newPassword };
      const response = await updateInfo(userId, apiData);
      if (response.data && response.data.code === 200) {
        // Cập nhật lại user mới vào Redux và localStorage
        const updatedUser = {
          ...user,
          ...response.data.data,
          password: values.newPassword,
        };
        dispatch(setUser(updatedUser));
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setAlert({ type: "success", message: "Đổi mật khẩu thành công!" });
        actions.resetForm();
        // Quay về trang trước sau khi đổi mật khẩu thành công
        setTimeout(() => {
          navigate(-1);
        }, 1000);
      } else {
        setAlert({
          type: "error",
          message: response.data?.message || "Đổi mật khẩu thất bại.",
        });
      }
    } catch (error) {
      setAlert({ type: "error", message: "Có lỗi xảy ra. Vui lòng thử lại." });
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        {/* Tiêu đề trang */}
        <Typography variant="h5" fontWeight={600} mb={3} align="center">
          Đổi mật khẩu
        </Typography>
        {/* Hiển thị thông báo nếu có */}
        {alert && (
          <Alert severity={alert.type} sx={{ mb: 2 }}>
            {alert.message}
          </Alert>
        )}
        {/* Formik form */}
        <Formik
          initialValues={{
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
          }}
          validationSchema={ChangePasswordSchema}
          onSubmit={handleChangePassword}
        >
          {({ errors, touched, isSubmitting, handleChange, values }) => (
            <Form>
              {/* Trường mật khẩu cũ */}
              <Field name="oldPassword">
                {({ field }: any) => (
                  <TextField
                    {...field}
                    label="Mật khẩu cũ"
                    type={showOld ? "text" : "password"}
                    fullWidth
                    margin="normal"
                    error={touched.oldPassword && Boolean(errors.oldPassword)}
                    helperText={touched.oldPassword && errors.oldPassword}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowOld((s) => !s)}
                            edge="end"
                          >
                            {showOld ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              </Field>
              {/* Trường mật khẩu mới */}
              <Field name="newPassword">
                {({ field }: any) => (
                  <TextField
                    {...field}
                    label="Mật khẩu mới"
                    type={showNew ? "text" : "password"}
                    fullWidth
                    margin="normal"
                    error={touched.newPassword && Boolean(errors.newPassword)}
                    helperText={touched.newPassword && errors.newPassword}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowNew((s) => !s)}
                            edge="end"
                          >
                            {showNew ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              </Field>
              {/* Trường xác nhận mật khẩu mới */}
              <Field name="confirmPassword">
                {({ field }: any) => (
                  <TextField
                    {...field}
                    label="Xác nhận mật khẩu mới"
                    type={showConfirm ? "text" : "password"}
                    fullWidth
                    margin="normal"
                    error={
                      touched.confirmPassword && Boolean(errors.confirmPassword)
                    }
                    helperText={
                      touched.confirmPassword && errors.confirmPassword
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowConfirm((s) => !s)}
                            edge="end"
                          >
                            {showConfirm ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              </Field>
              {/* Nút submit */}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 3, fontWeight: 600 }}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Đang xử lý..." : "Đổi mật khẩu"}
              </Button>
            </Form>
          )}
        </Formik>
      </Paper>
    </Container>
  );
};

export default ChangePasswordPage;
