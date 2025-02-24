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
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Google,
  Facebook,
  Apple,
  Face,
} from "@mui/icons-material";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log(values);
      // Handle login submission
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
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
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
              >
                Sign In
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
