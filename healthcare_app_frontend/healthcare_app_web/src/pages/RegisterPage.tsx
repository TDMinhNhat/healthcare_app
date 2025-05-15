import { useState, useEffect, useRef, useCallback } from "react";
import Webcam from "react-webcam";
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
  FormControlLabel,
  RadioGroup,
  Radio,
  FormControl,
  FormLabel,
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
} from "@mui/icons-material";
import { signUp } from "../services/authenticate/auth_service";
import { useNavigate } from "react-router";
import { formatDateToString } from "../utils/dateUtils";
import { toast } from "react-toastify";
import { ROUTING } from "../constants/routing";
import { registerFace } from "../services/image_detect/detect_service";

// Schema xác thực dữ liệu đầu vào cho form đăng ký
const validationSchema = Yup.object({
  firstName: Yup.string()
    .required("Tên là bắt buộc")
    .min(2, "Tên phải có ít nhất 2 ký tự"),
  lastName: Yup.string()
    .required("Họ là bắt buộc")
    .min(2, "Họ phải có ít nhất 2 ký tự"),
  username: Yup.string()
    .required("Tên đăng nhập là bắt buộc")
    .min(3, "Tên đăng nhập phải có ít nhất 3 ký tự"),
  email: Yup.string()
    .email("Địa chỉ email không hợp lệ")
    .required("Email là bắt buộc"),
  phone: Yup.string()
    .matches(/^[0-9]+$/, "Số điện thoại chỉ được chứa chữ số")
    .min(10, "Số điện thoại phải có ít nhất 10 chữ số")
    .required("Số điện thoại là bắt buộc"),
  password: Yup.string()
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
    .max(20, "Mật khẩu không được vượt quá 20 ký tự")
    .required("Mật khẩu là bắt buộc"),
  birthDate: Yup.date()
    .max(new Date(), "Ngày sinh không thể là ngày trong tương lai")
    .required("Ngày sinh là bắt buộc"),
  gender: Yup.string().required("Giới tính là bắt buộc"),
  rememberMe: Yup.boolean(),
});

export default function RegisterPage() {
  // Quản lý trạng thái hiển thị mật khẩu (ẩn/hiện)
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  // Lưu trữ dữ liệu hình ảnh khuôn mặt được phát hiện
  const [detectedFaceImage, setDetectedFaceImage] = useState(null);

  // Quản lý bước đăng ký: bước 1 - nhận diện khuôn mặt, bước 2 - nhập thông tin
  const [registrationStep, setRegistrationStep] = useState(1);
  // Tham chiếu đến webcam và interval để quản lý vòng đời
  const webcamRef = useRef(null);
  const intervalRef = useRef(null);

  // Khởi tạo formik để quản lý form và validation
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      phone: "",
      password: "",
      birthDate: "",
      gender: "female", // Mặc định là nữ
      rememberMe: false,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        // Chuyển đổi giới tính thành boolean (nữ = true, nam = false)
        const isFemale = values.gender === "female";
        const birthDate = new Date(values.birthDate);

        // Gửi thông tin đăng ký kèm hình ảnh khuôn mặt đến API
        const response = await signUp(
          values.firstName,
          values.lastName,
          values.email,
          values.password,
          values.username,
          isFemale,
          formatDateToString(birthDate),
          values.phone,
          detectedFaceImage // Gửi hình ảnh khuôn mặt đã phát hiện
        );

        // Xử lý phản hồi từ API
        if (response.status === 200 && response.data.code === 200) {
          toast.success("Tạo tài khoản thành công!");
          setTimeout(() => navigate(ROUTING.LOGIN), 2000);
        } else {
          toast.error(response.data.message || "Đăng ký thất bại");
        }
      } catch (error) {
        console.error("Lỗi đăng ký:", error);
        toast.error("Đã xảy ra lỗi trong quá trình đăng ký");
      }
    },
  });

  // Hàm dừng camera - được tạo bằng useCallback để tránh tạo lại hàm không cần thiết
  const stopCamera = useCallback(() => {
    if (webcamRef.current && webcamRef.current.video) {
      const stream = webcamRef.current.video.srcObject;
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        webcamRef.current.video.srcObject = null;
      }
    }
  }, []);

  // Quản lý quá trình nhận diện khuôn mặt tự động
  useEffect(() => {
    if (registrationStep === 1) {
      // Thiết lập interval để liên tục chụp ảnh và gửi lên API nhận diện
      intervalRef.current = setInterval(async () => {
        if (!webcamRef.current) return;

        try {
          // Lấy ảnh từ webcam dưới dạng base64
          const base64Image = webcamRef.current.getScreenshot();
          if (!base64Image) return;

          // Chuyển đổi base64 thành Blob để gửi lên server
          const byteCharacters = atob(base64Image.split(",")[1]);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: "image/jpeg" });

          // Sử dụng hàm registerFace thay vì gọi trực tiếp axios
          const result = await registerFace(blob);
          // .then((response) => {
          //   return response.data;
          // })
          // .catch((error) => {
          //   console.error("Error during face detection:", error);
          // });
          console.log("Kết quả nhận diện khuôn mặt:", result);
          // Nếu phát hiện được khuôn mặt, chuyển sang bước tiếp theo
          if (result.code === 200 && result.message == "New User") {
            setDetectedFaceImage(result.data);
            clearInterval(intervalRef.current);
            toast.success("Nhận diện khuôn mặt thành công!");
            setRegistrationStep(2); // Chuyển sang bước nhập thông tin
          }
        } catch (error) {
          console.error("Error detecting face:", error);
        }
      }, 1000); // Thử nhận diện mỗi giây
    }

    // Dọn dẹp interval khi component unmount hoặc bước đăng ký thay đổi
    return () => {
      clearInterval(intervalRef.current);
    };
  }, [registrationStep]);

  // Quản lý việc dừng camera khi chuyển bước hoặc unmount component
  useEffect(() => {
    if (registrationStep === 2) {
      stopCamera(); // Dừng camera khi chuyển sang bước nhập thông tin
    }

    // Dọn dẹp khi component unmount
    return () => {
      if (registrationStep === 1) {
        stopCamera(); // Đảm bảo dừng camera nếu đang ở bước nhận diện khuôn mặt
      }
    };
  }, [registrationStep, stopCamera]);

  return (
    <Container maxWidth="sm">
      {/* Vùng chứa chính của trang đăng ký */}
      <Box
        sx={{
          p: 3,
          mt: 4,
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: "background.paper",
        }}
      >
        {/* Tiêu đề phần đăng ký - thay đổi theo bước */}
        <Typography variant="h5" align="center" gutterBottom>
          {registrationStep === 1 ? "Xác thực khuôn mặt" : "Tạo Tài Khoản"}
        </Typography>

        {registrationStep === 1 ? (
          <>
            {/* Hướng dẫn cho người dùng trong bước nhận diện khuôn mặt */}
            <Typography variant="body2" align="center" sx={{ mb: 3 }}>
              Vui lòng nhìn thẳng vào camera để xác thực khuôn mặt
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {/* Khung hiển thị webcam cho nhận diện khuôn mặt */}
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  maxWidth: "400px",
                  margin: "0 auto",
                }}
              >
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  screenshotQuality={1}
                  videoConstraints={{
                    width: 640,
                    height: 480,
                    facingMode: "user",
                  }}
                  style={{
                    width: "100%",
                    borderRadius: "8px",
                  }}
                />
              </Box>
              {/* Thông báo trạng thái đang nhận diện */}
              <Typography
                variant="caption"
                sx={{ mt: 2, color: "text.secondary" }}
              >
                Đang tự động xác thực khuôn mặt...
              </Typography>
            </Box>
          </>
        ) : (
          <>
            {/* Hiển thị liên kết đến trang đăng nhập */}
            <Typography variant="body2" align="center" sx={{ mb: 3 }}>
              Bạn đã có tài khoản? <Link href="/login">Đăng nhập</Link>
            </Typography>

            {/* Form nhập thông tin đăng ký */}
            <form onSubmit={formik.handleSubmit}>
              <Grid2 container spacing={2}>
                {/* Trường nhập tên */}
                <Grid2 size={{ xs: 6 }}>
                  <TextField
                    fullWidth
                    id="firstName"
                    name="firstName"
                    label="Tên"
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.firstName &&
                      Boolean(formik.errors.firstName)
                    }
                    helperText={
                      formik.touched.firstName && formik.errors.firstName
                    }
                  />
                </Grid2>
                {/* Trường nhập họ */}
                <Grid2 size={{ xs: 6 }}>
                  <TextField
                    fullWidth
                    id="lastName"
                    name="lastName"
                    label="Họ"
                    value={formik.values.lastName}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.lastName && Boolean(formik.errors.lastName)
                    }
                    helperText={
                      formik.touched.lastName && formik.errors.lastName
                    }
                  />
                </Grid2>
                {/* Trường nhập tên đăng nhập */}
                <Grid2 size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    id="username"
                    name="username"
                    label="Tên đăng nhập"
                    value={formik.values.username}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.username && Boolean(formik.errors.username)
                    }
                    helperText={
                      formik.touched.username && formik.errors.username
                    }
                  />
                </Grid2>
                {/* Trường nhập email */}
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
                  />
                </Grid2>
                {/* Trường nhập số điện thoại */}
                <Grid2 size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    id="phone"
                    name="phone"
                    label="Số điện thoại"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    error={formik.touched.phone && Boolean(formik.errors.phone)}
                    helperText={formik.touched.phone && formik.errors.phone}
                  />
                </Grid2>
                {/* Trường nhập mật khẩu với chức năng ẩn/hiện */}
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
                    helperText={
                      formik.touched.password && formik.errors.password
                    }
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
                {/* Trường nhập ngày sinh */}
                <Grid2 size={{ xs: 6 }}>
                  <TextField
                    fullWidth
                    id="birthDate"
                    name="birthDate"
                    label="Ngày sinh"
                    type="date"
                    value={formik.values.birthDate}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.birthDate &&
                      Boolean(formik.errors.birthDate)
                    }
                    helperText={
                      formik.touched.birthDate && formik.errors.birthDate
                    }
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid2>
                {/* Lựa chọn giới tính */}
                <Grid2 size={{ xs: 6 }}>
                  <FormControl fullWidth>
                    <FormLabel>Giới tính</FormLabel>
                    <RadioGroup
                      row
                      name="gender"
                      value={formik.values.gender}
                      onChange={formik.handleChange}
                    >
                      <FormControlLabel
                        value="female"
                        control={<Radio />}
                        label="Nữ"
                      />
                      <FormControlLabel
                        value="male"
                        control={<Radio />}
                        label="Nam"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid2>

                {/* Nút đăng ký */}
                <Grid2 size={{ xs: 12 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    type="submit"
                    size="large"
                    sx={{ mt: 1 }}
                  >
                    Đăng Ký
                  </Button>
                </Grid2>
              </Grid2>
            </form>
          </>
        )}
      </Box>
    </Container>
  );
}
