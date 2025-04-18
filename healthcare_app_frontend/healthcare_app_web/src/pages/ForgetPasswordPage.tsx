import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Link,
  CircularProgress,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { ROUTING } from "../constants/routing";
import { resetPassword } from "../services/authenticate/auth_service";

// Định nghĩa schema validation
const validationSchema = Yup.object({
  email: Yup.string()
    .email("Địa chỉ email không hợp lệ")
    .required("Email là bắt buộc"),
});

export default function ForgetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        // Gọi API để yêu cầu đặt lại mật khẩu
        const response = await resetPassword(values.email);

        if (response.data.code === 200 && response.data.data === true) {
          setIsSubmitted(true);
          toast.success("Mật khẩu mới đã được gửi đến email của bạn!");
        } else {
          toast.error(
            response.data.message ||
              "Không thể đặt lại mật khẩu. Vui lòng thử lại sau."
          );
        }
      } catch (error) {
        console.error("Lỗi khi đặt lại mật khẩu:", error);
        toast.error("Đã xảy ra lỗi. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    },
  });

  // Nếu đã gửi yêu cầu thành công, hiển thị màn hình xác nhận
  if (isSubmitted) {
    return (
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4, mt: 8, textAlign: "center" }}>
          <Typography variant="h5" gutterBottom>
            Yêu cầu đặt lại mật khẩu đã được gửi!
          </Typography>
          <Typography variant="body1" paragraph>
            Chúng tôi đã gửi mật khẩu mới đến email {formik.values.email}. Vui
            lòng kiểm tra hộp thư của bạn.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate(ROUTING.LOGIN)}
            sx={{ mt: 2 }}
          >
            Quay lại trang đăng nhập
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          p: 3,
          mt: 8,
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: "background.paper",
        }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Quên mật khẩu
        </Typography>
        <Typography variant="body2" align="center" sx={{ mb: 3 }}>
          Nhập email của bạn để nhận mật khẩu mới
        </Typography>

        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            id="email"
            name="email"
            label="Địa chỉ Email"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            disabled={isLoading}
            margin="normal"
          />

          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            size="large"
            disabled={isLoading}
            startIcon={
              isLoading && <CircularProgress size={24} color="inherit" />
            }
            sx={{ mt: 3, mb: 2 }}
          >
            {isLoading ? "Đang xử lý..." : "Gửi yêu cầu"}
          </Button>

          <Typography align="center">
            <Link href={ROUTING.LOGIN} variant="body2">
              Quay lại đăng nhập
            </Link>
          </Typography>
        </form>
      </Box>
    </Container>
  );
}
