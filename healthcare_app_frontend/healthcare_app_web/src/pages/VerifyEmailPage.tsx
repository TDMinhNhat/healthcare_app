import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Link,
} from "@mui/material";
import { Grid2 } from "@mui/material";

const COUNTDOWN_TIME = 30; // seconds

const validationSchema = Yup.object({
  otp: Yup.string()
    .matches(/^[0-9]{6}$/, "OTP must be exactly 6 digits")
    .required("OTP is required"),
});

export default function VerifyEmailPage() {
  const [countdown, setCountdown] = useState(COUNTDOWN_TIME);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0 && !canResend) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown, canResend]);

  const formik = useFormik({
    initialValues: {
      otp: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log(values);
      // Handle OTP verification
    },
  });

  const handleResendOTP = () => {
    if (canResend) {
      // Handle resend OTP logic here
      console.log("Resending OTP...");
      setCountdown(COUNTDOWN_TIME);
      setCanResend(false);
    }
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
          Verify Your Email
        </Typography>
        <Typography variant="body2" align="center" sx={{ mb: 3 }}>
          We've sent a verification code to your email address. Please enter the
          code below.
        </Typography>

        <form onSubmit={formik.handleSubmit}>
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12 }}>
              <TextField
                fullWidth
                id="otp"
                name="otp"
                label="Enter 6-digit OTP"
                value={formik.values.otp}
                onChange={formik.handleChange}
                error={formik.touched.otp && Boolean(formik.errors.otp)}
                helperText={formik.touched.otp && formik.errors.otp}
                inputProps={{
                  maxLength: 6,
                }}
              />
            </Grid2>

            <Grid2 size={{ xs: 12 }}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                type="submit"
                size="large"
              >
                Verify
              </Button>
            </Grid2>

            <Grid2 size={{ xs: 12 }} sx={{ textAlign: "center" }}>
              <Typography variant="body2" sx={{ mt: 2 }}>
                Didn't receive the code?{" "}
                <Link
                  component="button"
                  onClick={handleResendOTP}
                  sx={{
                    textDecoration: "none",
                    cursor: canResend ? "pointer" : "default",
                    color: canResend ? "primary.main" : "text.disabled",
                  }}
                  disabled={!canResend}
                >
                  {canResend ? "Resend OTP" : `Resend OTP in ${countdown}s`}
                </Link>
              </Typography>
            </Grid2>
          </Grid2>
        </form>
      </Box>
    </Container>
  );
}
