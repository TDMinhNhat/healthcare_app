import React, { useState, useRef, useEffect } from "react";
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
  Image,
  KeyboardAvoidingView,
  Switch,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { CameraView, useCameraPermissions, CameraType } from "expo-camera";
import { useRouter } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { registerFace } from "../services/image_detect/detect_service";
import { signUp } from "../services/authenticate/auth_service";
import * as ImagePicker from "expo-image-picker";
import { Formik } from "formik";
import * as Yup from "yup";

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
    .email("Định dạng email không hợp lệ")
    .required("Email là bắt buộc"),
  phone: Yup.string()
    .matches(/^\d{10,}$/, "Số điện thoại phải có ít nhất 10 chữ số")
    .required("Số điện thoại là bắt buộc"),
  password: Yup.string()
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
    .required("Mật khẩu là bắt buộc"),
});

export default function Register() {
  const router = useRouter();

  // Quyền truy cập camera và các trạng thái liên quan
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraType, setCameraType] = useState<CameraType>("front");
  const [isCameraReady, setIsCameraReady] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  // Trạng thái phát hiện khuôn mặt
  const [isDetecting, setIsDetecting] = useState(false);

  // Thêm ref để theo dõi interval
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Các bước trong quy trình đăng ký
  const [registrationStep, setRegistrationStep] = useState<1 | 2>(1);
  const [detectedFaceImage, setDetectedFaceImage] = useState<string | null>(
    null
  );

  // Hiển thị bộ chọn ngày
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Trạng thái đang tải
  const [isLoading, setIsLoading] = useState(false);

  // Hiển thị/ẩn mật khẩu
  const [showPassword, setShowPassword] = useState(false);

  // Add a comment to clarify gender handling
  // Switch: true = female (Nữ), false = male (Nam)
  const [gender, setGender] = useState<"male" | "female">("female");
  const [birthDate, setBirthDate] = useState<Date>(new Date());
  const [dateError, setDateError] = useState<string | null>(null);

  // Yêu cầu quyền truy cập camera khi component được tạo
  useEffect(() => {
    requestPermission();
  }, []);

  // Xử lý khi camera sẵn sàng
  const onCameraReady = () => {
    setIsCameraReady(true);
  };

  // Thiết lập chụp ảnh liên tục khi ở bước 1 và camera sẵn sàng
  useEffect(() => {
    // Chỉ bắt đầu chụp liên tục khi camera sẵn sàng và đang ở bước 1
    if (isCameraReady && registrationStep === 1 && !isDetecting) {
      // Xóa interval cũ nếu có
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      // Thiết lập interval mới để chụp ảnh mỗi 2 giây
      intervalRef.current = setInterval(async () => {
        if (!cameraRef.current || isDetecting) return;

        try {
          setIsDetecting(true);

          const photo = await cameraRef.current.takePictureAsync({
            quality: 1,
            skipProcessing: true,
            shutterSound: false,
          });

          // Gửi hình ảnh đến API phát hiện khuôn mặt
          const result = await registerFace({
            uri: photo.uri,
            type: "image/jpeg",
          });

          console.log("Kết quả nhận diện khuôn mặt:", result);

          if (result.code === 200 && result.message === "New User") {
            // Dừng interval khi phát hiện thành công
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }

            setDetectedFaceImage(result.data);
            setRegistrationStep(2);
            Alert.alert("Thành công", "Nhận diện khuôn mặt thành công!");
          }
          // Không hiển thị alert khi thất bại, chỉ log ra console
        } catch (error) {
          console.error("Lỗi khi nhận diện khuôn mặt:", error);
        } finally {
          setIsDetecting(false);
        }
      }, 1000);
    }

    // Cleanup function để dọn dẹp interval khi component unmount hoặc deps thay đổi
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isCameraReady, registrationStep, isDetecting]);

  // Hàm quay lại bước phát hiện khuôn mặt
  const goBackToFaceDetection = () => {
    setDetectedFaceImage(null);
    setRegistrationStep(1);
    // useEffect sẽ tự động bắt đầu chụp lại khi registrationStep thay đổi
  };

  // Xử lý thay đổi ngày tháng
  const handleDateChange = (date?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (date) {
      // Xác thực ngày (không phải ngày trong tương lai)
      if (date > new Date()) {
        setDateError("Ngày sinh không thể là ngày trong tương lai");
      } else {
        setDateError(null);
        setBirthDate(date);
      }
    }
  };

  // Hiển thị khi đang yêu cầu quyền truy cập camera
  if (!permission) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#26b9c8" />
        <Text style={styles.text}>Đang yêu cầu quyền truy cập camera...</Text>
      </SafeAreaView>
    );
  }

  // Hiển thị khi quyền truy cập camera bị từ chối
  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.error}>Quyền truy cập camera bị từ chối.</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Cấp quyền</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      {/* Phần đầu trang */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            if (registrationStep === 2) {
              goBackToFaceDetection();
            } else {
              router.back();
            }
          }}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {registrationStep === 1 ? "Xác thực khuôn mặt" : "Đăng ký"}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Bước 1: Phát hiện khuôn mặt */}
      {registrationStep === 1 && (
        <View style={styles.cameraContainer}>
          <Text style={styles.instruction}>
            Vui lòng nhìn thẳng vào camera để hệ thống xác thực khuôn mặt tự
            động
          </Text>

          <View style={styles.cameraWrapper}>
            <CameraView
              ref={cameraRef}
              style={styles.camera}
              facing={cameraType}
              onCameraReady={onCameraReady}
              mode="picture"
            />

            {/* Lớp phủ với chỉ báo phát hiện */}
            <View style={styles.detectionOverlay}>
              <ActivityIndicator size="large" color="#26b9c8" />
              <Text style={styles.detectionText}>
                {isDetecting
                  ? "Đang nhận diện khuôn mặt..."
                  : "Đang tìm kiếm khuôn mặt..."}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Bước 2: Biểu mẫu đăng ký với Formik */}
      {registrationStep === 2 && (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1, width: "100%" }}
        >
          <Formik
            initialValues={{
              firstName: "",
              lastName: "",
              username: "",
              email: "",
              phone: "",
              password: "",
            }}
            validationSchema={validationSchema}
            onSubmit={async (values) => {
              try {
                setIsLoading(true);
                // Format date as DD-MM-YYYY instead of YYYY-MM-DD
                const day = birthDate.getDate().toString().padStart(2, "0");
                const month = (birthDate.getMonth() + 1)
                  .toString()
                  .padStart(2, "0");
                const year = birthDate.getFullYear();
                const dob = `${day}-${month}-${year}`;
                const isFemale = gender === "female";
                const response = await signUp(
                  values.firstName,
                  values.lastName,
                  values.email,
                  values.password,
                  values.username,
                  isFemale,
                  dob,
                  values.phone,
                  detectedFaceImage || ""
                );
                if (response.status === 200 && response.data.code === 200) {
                  Alert.alert("Thành công", "Đăng ký tài khoản thành công!", [
                    { text: "OK", onPress: () => router.replace("/") },
                  ]);
                } else {
                  Alert.alert(
                    "Lỗi",
                    response.data.message || "Đăng ký thất bại"
                  );
                }
              } catch (error) {
                console.error("Lỗi đăng ký:", error);
                Alert.alert("Lỗi", "Đã xảy ra lỗi trong quá trình đăng ký");
              } finally {
                setIsLoading(false);
              }
            }}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <ScrollView style={styles.formContainer}>
                {/* Phần họ và tên */}
                <View style={styles.formRow}>
                  <View style={styles.formColumn}>
                    <Text style={styles.label}>Tên</Text>
                    <TextInput
                      style={[
                        styles.input,
                        touched.firstName && errors.firstName
                          ? styles.inputError
                          : null,
                      ]}
                      value={values.firstName}
                      onChangeText={handleChange("firstName")}
                      onBlur={handleBlur("firstName")}
                      placeholder="Tên"
                    />
                    {touched.firstName && errors.firstName ? (
                      <Text style={styles.errorText}>{errors.firstName}</Text>
                    ) : null}
                  </View>
                  <View style={styles.formColumn}>
                    <Text style={styles.label}>Họ</Text>
                    <TextInput
                      style={[
                        styles.input,
                        touched.lastName && errors.lastName
                          ? styles.inputError
                          : null,
                      ]}
                      value={values.lastName}
                      onChangeText={handleChange("lastName")}
                      onBlur={handleBlur("lastName")}
                      placeholder="Họ"
                    />
                    {touched.lastName && errors.lastName ? (
                      <Text style={styles.errorText}>{errors.lastName}</Text>
                    ) : null}
                  </View>
                </View>

                {/* Tên đăng nhập */}
                <Text style={styles.label}>Tên đăng nhập</Text>
                <TextInput
                  style={[
                    styles.input,
                    touched.username && errors.username
                      ? styles.inputError
                      : null,
                  ]}
                  value={values.username}
                  onChangeText={handleChange("username")}
                  onBlur={handleBlur("username")}
                  placeholder="Tên đăng nhập"
                />
                {touched.username && errors.username ? (
                  <Text style={styles.errorText}>{errors.username}</Text>
                ) : null}

                {/* Email */}
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={[
                    styles.input,
                    touched.email && errors.email ? styles.inputError : null,
                  ]}
                  value={values.email}
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  placeholder="Email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                {touched.email && errors.email ? (
                  <Text style={styles.errorText}>{errors.email}</Text>
                ) : null}

                {/* Số điện thoại */}
                <Text style={styles.label}>Số điện thoại</Text>
                <TextInput
                  style={[
                    styles.input,
                    touched.phone && errors.phone ? styles.inputError : null,
                  ]}
                  value={values.phone}
                  onChangeText={handleChange("phone")}
                  onBlur={handleBlur("phone")}
                  placeholder="Số điện thoại"
                  keyboardType="phone-pad"
                />
                {touched.phone && errors.phone ? (
                  <Text style={styles.errorText}>{errors.phone}</Text>
                ) : null}

                {/* Mật khẩu */}
                <Text style={styles.label}>Mật khẩu</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={[
                      styles.input,
                      styles.passwordInput,
                      touched.password && errors.password
                        ? styles.inputError
                        : null,
                    ]}
                    value={values.password}
                    onChangeText={handleChange("password")}
                    onBlur={handleBlur("password")}
                    placeholder="Mật khẩu"
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity
                    style={styles.passwordVisibilityButton}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Ionicons
                      name={showPassword ? "eye-off" : "eye"}
                      size={24}
                      color="#555"
                    />
                  </TouchableOpacity>
                </View>
                {touched.password && errors.password ? (
                  <Text style={styles.errorText}>{errors.password}</Text>
                ) : null}

                {/* Ngày sinh */}
                <Text style={styles.label}>Ngày sinh</Text>
                <TouchableOpacity
                  style={styles.datePickerButton}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={styles.datePickerButtonText}>
                    {birthDate.toLocaleDateString()}
                  </Text>
                  <Ionicons name="calendar" size={24} color="#555" />
                </TouchableOpacity>
                {dateError ? (
                  <Text style={styles.errorText}>{dateError}</Text>
                ) : null}
                {showDatePicker && (
                  <DateTimePicker
                    value={birthDate}
                    mode="date"
                    display="default"
                    onChange={(event, date) => handleDateChange(date)}
                    maximumDate={new Date()}
                  />
                )}

                {/* Giới tính */}
                <Text style={styles.label}>Giới tính</Text>
                <View style={styles.genderContainer}>
                  <View style={styles.genderBox}>
                    <TouchableOpacity
                      style={[
                        styles.genderOption,
                        gender === "female" && styles.activeGender,
                      ]}
                      onPress={() => setGender("female")}
                    >
                      <Text
                        style={[
                          styles.genderText,
                          gender === "female" && styles.activeGenderText,
                        ]}
                      >
                        Nữ
                      </Text>
                    </TouchableOpacity>
                    <Switch
                      trackColor={{ false: "#26b9c8", true: "#26b9c8" }}
                      thumbColor="#ffffff"
                      ios_backgroundColor="#767577"
                      onValueChange={() =>
                        setGender(gender === "female" ? "male" : "female")
                      }
                      value={gender === "female"}
                    />
                    <TouchableOpacity
                      style={[
                        styles.genderOption,
                        gender === "male" && styles.activeGender,
                      ]}
                      onPress={() => setGender("male")}
                    >
                      <Text
                        style={[
                          styles.genderText,
                          gender === "male" && styles.activeGenderText,
                        ]}
                      >
                        Nam
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Nút đăng ký */}
                <TouchableOpacity
                  style={styles.registerButton}
                  onPress={() => handleSubmit()}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.registerButtonText}>Đăng ký</Text>
                  )}
                </TouchableOpacity>

                {/* Liên kết đăng nhập */}
                <View style={styles.loginContainer}>
                  <Text style={styles.loginText}>Đã có tài khoản?</Text>
                  <TouchableOpacity onPress={() => router.replace("/")}>
                    <Text style={styles.loginLink}>Đăng nhập</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </Formik>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
}

// Định nghĩa kiểu dáng giao diện
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    marginTop: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  text: {
    marginTop: 10,
    fontSize: 16,
    textAlign: "center",
  },
  error: {
    marginTop: 20,
    color: "red",
    fontSize: 16,
    textAlign: "center",
  },
  button: {
    marginTop: 15,
    backgroundColor: "#26b9c8",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  instruction: {
    textAlign: "center",
    marginVertical: 15,
    fontSize: 16,
    paddingHorizontal: 30,
    color: "#555",
  },
  cameraContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
  },
  cameraWrapper: {
    width: "90%",
    aspectRatio: 3 / 4,
    borderRadius: 20,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginTop: 15,
  },
  camera: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  controlsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    padding: 20,
    marginTop: 20,
  },
  controlButton: {
    marginTop: 10,
    padding: 15,
    borderRadius: 30,
    backgroundColor: "rgba(38, 185, 200, 0.8)",
    marginHorizontal: 20,
  },
  detectionOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  detectionText: {
    color: "#fff",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(38, 185, 200, 0.2)",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#26b9c8",
  },
  statusText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  formContainer: {
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },
  formRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  formColumn: {
    width: "48%",
  },
  label: {
    fontSize: 16,
    marginTop: 12,
    marginBottom: 5,
    color: "#333",
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
  },
  inputError: {
    borderColor: "#ff6b6b",
  },
  errorText: {
    color: "#ff6b6b",
    fontSize: 12,
    marginTop: 3,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  passwordInput: {
    flex: 1,
  },
  passwordVisibilityButton: {
    position: "absolute",
    right: 15,
  },
  datePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  datePickerButtonText: {
    fontSize: 16,
    color: "#333",
  },
  genderContainer: {
    marginTop: 10,
    marginBottom: 15,
  },
  genderBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  genderOption: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  activeGender: {
    backgroundColor: "rgba(38, 185, 200, 0.15)",
  },
  genderText: {
    fontSize: 16,
    color: "#555",
  },
  activeGenderText: {
    color: "#26b9c8",
    fontWeight: "600",
  },
  switch: {
    marginHorizontal: 20,
  },
  registerButton: {
    backgroundColor: "#26b9c8",
    paddingVertical: 15,
    borderRadius: 5,
    marginTop: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  loginText: {
    color: "#555",
  },
  loginLink: {
    color: "#26b9c8",
    marginLeft: 5,
    fontWeight: "500",
  },
});
