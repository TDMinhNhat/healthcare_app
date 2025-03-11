import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Grid2 } from "@mui/material"; // Changed to Grid2
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Link,
  FormControlLabel,
  RadioGroup,
  Radio,
  FormControl,
  FormLabel,
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
} from "@mui/icons-material";
import { signUp } from "../services/authenticate/auth_service";
import { useNavigate } from "react-router";
import { formatDateToString } from "../utils/dateUtils";
import { toast } from "react-toastify";
import { ROUTING } from "../constants/routing";

const validationSchema = Yup.object({
  firstName: Yup.string()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters"),
  lastName: Yup.string()
    .required("Last name is required")
    .min(2, "Last name must be at least 2 characters"),
  username: Yup.string()
    .required("Username is required")
    .min(3, "Username must be at least 3 characters"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phone: Yup.string()
    .matches(/^[0-9]+$/, "Phone number must contain only digits")
    .min(10, "Phone number must be at least 10 digits")
    .required("Phone number is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  birthDate: Yup.date()
    .max(new Date(), "Birth date cannot be in the future")
    .required("Birth date is required"),
  gender: Yup.string().required("Gender is required"),
  rememberMe: Yup.boolean(),
});

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      phone: "",
      password: "",
      birthDate: "",
      gender: "female", // Changed from "" to "female"
      rememberMe: false,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        // Convert gender to boolean (male = true, female = false)
        const isMale = values.gender === "male";
        const birthDate = new Date(values.birthDate);

        const response = await signUp(
          values.firstName,
          values.lastName,
          values.email,
          values.password,
          values.username,
          isMale,
          formatDateToString(birthDate),
          values.phone
        );

        if (response.status === 200 && response.data.code === 200) {
          toast.success("Account created successfully!");
          setTimeout(() => navigate(ROUTING.LOGIN), 2000);
        } else {
          toast.error(response.data.message || "Registration failed");
        }
      } catch (error) {
        console.error("Registration error:", error);
        toast.error("An error occurred during registration");
      }
    },
  });

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          p: 3,
          mt: 4,
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: "background.paper",
        }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Create an Account
        </Typography>
        <Typography variant="body2" align="center" sx={{ mb: 3 }}>
          Already have an account? <Link href="/login">Log in</Link>
        </Typography>

        <form onSubmit={formik.handleSubmit}>
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 6 }}>
              <TextField
                fullWidth
                id="firstName"
                name="firstName"
                label="First Name"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                error={
                  formik.touched.firstName && Boolean(formik.errors.firstName)
                }
                helperText={formik.touched.firstName && formik.errors.firstName}
              />
            </Grid2>
            <Grid2 size={{ xs: 6 }}>
              <TextField
                fullWidth
                id="lastName"
                name="lastName"
                label="Last Name"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                error={
                  formik.touched.lastName && Boolean(formik.errors.lastName)
                }
                helperText={formik.touched.lastName && formik.errors.lastName}
              />
            </Grid2>
            <Grid2 size={{ xs: 12 }}>
              <TextField
                fullWidth
                id="username"
                name="username"
                label="Username"
                value={formik.values.username}
                onChange={formik.handleChange}
                error={
                  formik.touched.username && Boolean(formik.errors.username)
                }
                helperText={formik.touched.username && formik.errors.username}
              />
            </Grid2>
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
                id="phone"
                name="phone"
                label="Phone Number"
                value={formik.values.phone}
                onChange={formik.handleChange}
                error={formik.touched.phone && Boolean(formik.errors.phone)}
                helperText={formik.touched.phone && formik.errors.phone}
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
            <Grid2 size={{ xs: 6 }}>
              <TextField
                fullWidth
                id="birthDate"
                name="birthDate"
                label="Birth Date"
                type="date"
                value={formik.values.birthDate}
                onChange={formik.handleChange}
                error={
                  formik.touched.birthDate && Boolean(formik.errors.birthDate)
                }
                helperText={formik.touched.birthDate && formik.errors.birthDate}
                InputLabelProps={{ shrink: true }}
              />
            </Grid2>
            <Grid2 size={{ xs: 6 }}>
              <FormControl fullWidth>
                <FormLabel>Gender</FormLabel>
                <RadioGroup
                  row
                  name="gender"
                  value={formik.values.gender}
                  onChange={formik.handleChange}
                >
                  <FormControlLabel
                    value="female"
                    control={<Radio />}
                    label="Female"
                  />
                  <FormControlLabel
                    value="male"
                    control={<Radio />}
                    label="Male"
                  />
                </RadioGroup>
              </FormControl>
            </Grid2>

            <Grid2 size={{ xs: 12 }}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                type="submit"
                size="large"
                sx={{ mt: 1 }}
              >
                Sign Up
              </Button>
            </Grid2>
          </Grid2>
        </form>

        <Divider sx={{ mt: 3, mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Or sign up with
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
