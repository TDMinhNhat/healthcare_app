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
  Divider,
  CircularProgress,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Google,
  Facebook,
  Apple,
  Face,
} from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { login } from "../services/auth_service";
import { setUser } from "../stores/slices/user.slice";
import { toast } from "react-toastify";
import { ROUTING } from "../constants/routing";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
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
            // lưu thông tin user vào localStorage
            // localStorage.setItem("user", JSON.stringify(userData.user));
            toast.success("Login successful!");

            sessionStorage.setItem("user", JSON.stringify(userData.user));

            // console.log("userData", userData);
            if (userData.role === "doctor") {
              setTimeout(() => navigate(ROUTING.DOCTOR), 1500); // Redirect after showing toast
            } else if (userData.role === "patient") {
              setTimeout(() => navigate(ROUTING.PATIENT), 1500); // Redirect after showing toast
            } else {
              setTimeout(() => navigate(ROUTING.ADMIN), 1500);
            }
          } else {
            toast.error(
              response.data.message ||
                "Login failed. Please check your credentials."
            );
          }
        } else {
          toast.error("Login failed. Please check your credentials.");
        }
      } catch (error) {
        console.error("Login error:", error);
        toast.error("Login failed. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleFaceLogin = () => {
    console.log("Face detection login");
    // Handle face detection login
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
          Welcome Back
        </Typography>
        <Typography variant="body2" align="center" sx={{ mb: 3 }}>
          New to our platform? <Link href="/register">Create an account</Link>
        </Typography>

        <form onSubmit={formik.handleSubmit}>
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12 }}>
              <TextField
                fullWidth
                id="email"
                name="email"
                label="Email Address"
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
                label="Password"
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
                href="/forgot-password"
                sx={{
                  display: "block",
                  textAlign: "right",
                  mb: 1,
                }}
              >
                Forgot password?
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
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </Grid2>

            <Grid2 size={{ xs: 12 }}>
              <Button
                fullWidth
                variant="outlined"
                color="primary"
                size="large"
                startIcon={<Face />}
                onClick={handleFaceLogin}
                sx={{ mt: 1 }}
              >
                Sign in with Face ID
              </Button>
            </Grid2>
          </Grid2>
        </form>

        <Divider sx={{ mt: 3, mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Or continue with
          </Typography>
        </Divider>

        <Grid2 container spacing={2}>
          <Grid2 size={{ xs: 4 }}>
            <Button fullWidth variant="outlined" startIcon={<Google />}>
              Google
            </Button>
          </Grid2>
          <Grid2 size={{ xs: 4 }}>
            <Button fullWidth variant="outlined" startIcon={<Facebook />}>
              Facebook
            </Button>
          </Grid2>
          <Grid2 size={{ xs: 4 }}>
            <Button fullWidth variant="outlined" startIcon={<Apple />}>
              Apple
            </Button>
          </Grid2>
        </Grid2>
      </Box>
    </Container>
  );
}
