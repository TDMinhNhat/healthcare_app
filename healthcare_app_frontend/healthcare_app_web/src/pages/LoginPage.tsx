import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Grid2 } from "@mui/material";
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Link,
  IconButton,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { login } from "../services/authenticate/auth_service";
import { setUser } from "../stores/slices/user.slice";
import { toast } from "react-toastify";
import { ROUTING } from "../constants/routing";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Địa chỉ email không hợp lệ")
    .required("Email là bắt buộc"),
  password: Yup.string()
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
    .max(50, "Mật khẩu không được vượt quá 50 ký tự")
    .required("Mật khẩu là bắt buộc"),
});

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        const response = await login(values.email, values.password);

        if (response.status === 200 && response.data.code === 200) {
          const userData = response.data.data;
          if (userData) {
            dispatch(setUser(userData.user));
            // Lưu thông tin người dùng vào localStorage
            toast.success("Đăng nhập thành công!");

            localStorage.setItem("user", JSON.stringify(userData.user));
            localStorage.setItem("role", userData.role);
            // console.log("userData", userData);
            if (userData.role === "doctor") {
              setTimeout(() => navigate(ROUTING.DOCTOR), 1500); // Chuyển hướng sau khi hiển thị thông báo
            } else if (userData.role === "patient") {
              setTimeout(() => navigate(ROUTING.PATIENT), 1500); // Chuyển hướng sau khi hiển thị thông báo
            } else {
              setTimeout(() => navigate(ROUTING.ADMIN), 1500);
            }
          } else {
            toast.error(
              response.data.message ||
                "Đăng nhập thất bại. Vui lòng kiểm tra thông tin đăng nhập."
            );
          }
        } else {
          toast.error(
            "Đăng nhập thất bại. Vui lòng kiểm tra thông tin đăng nhập."
          );
        }
      } catch (error) {
        console.error("Lỗi đăng nhập:", error);
        toast.error("Đăng nhập thất bại. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleFaceLogin = () => {
    console.log("Đăng nhập bằng nhận diện khuôn mặt");
    // Xử lý đăng nhập bằng nhận diện khuôn mặt
  };

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
          Chào Mừng Trở Lại
        </Typography>
        <Typography variant="body2" align="center" sx={{ mb: 3 }}>
          Bạn chưa có tài khoản? <Link href="/register">Tạo tài khoản</Link>
        </Typography>

        <form onSubmit={formik.handleSubmit}>
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12 }}>
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
              />
            </Grid2>
            <Grid2 size={{ xs: 12 }}>
              <TextField
                fullWidth
                id="password"
                name="password"
                label="Mật khẩu"
                type={showPassword ? "text" : "password"}
                value={formik.values.password}
                onChange={formik.handleChange}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={formik.touched.password && formik.errors.password}
                disabled={isLoading}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        disabled={isLoading}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid2>

            <Grid2 size={{ xs: 12 }}>
              <Link
                href={ROUTING.FORGET_PASSWORD}
                sx={{
                  display: "block",
                  textAlign: "right",
                  mb: 1,
                }}
              >
                Quên mật khẩu?
              </Link>
            </Grid2>

            <Grid2 size={{ xs: 12 }}>
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
              >
                {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
              </Button>
            </Grid2>

            {/* <Grid2 size={{ xs: 12 }}>
              <Button
                fullWidth
                variant="outlined"
                color="primary"
                size="large"
                startIcon={<Face />}
                onClick={handleFaceLogin}
                sx={{ mt: 1 }}
              >
                Đăng nhập bằng Face ID
              </Button>
            </Grid2> */}
          </Grid2>
        </form>
      </Box>
    </Container>
  );
}
