import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StatusBar,
  Platform,
  Modal,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { detectFace } from "../services/image_detect/detect_service";
import * as Location from "expo-location";
import * as FileSystem from "expo-file-system";
import { navigate } from "expo-router/build/global-state/routing";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";
import { Formik } from "formik";
import * as Yup from "yup";

const socket = io(`wss://${process.env.EXPO_PUBLIC_HOST_ID}`, {
  path: "/image_detect/socket",
  transports: ["websocket", "polling"],
  reconnection: true,
  reconnectionAttempts: 10,
  autoConnect: false,
});

export default function Emergency() {
  const user = useSelector((state: any) => state.user.user);
  const [permission, requestPermission] = useCameraPermissions(); // State quản lý quyền truy cập camera
  const [cameraType, setCameraType] = useState<CameraType>("back"); // State quản lý loại camera (trước/sau)
  const [isCameraReady, setIsCameraReady] = useState(false); // State kiểm tra camera đã sẵn sàng chưa
  const [isPreview, setIsPreview] = useState(false); // State kiểm tra đang ở chế độ xem trước ảnh
  const [capturedImage, setCapturedImage] = useState<string | null>(null); // State lưu trữ đường dẫn ảnh đã chụp
  const [isUploading, setIsUploading] = useState(false); // State kiểm tra đang upload ảnh
  const [mode, setMode] = useState<"camera" | "gallery">("camera"); // State chế độ chụp ảnh hoặc chọn từ thư viện
  const [mediaLibraryPermission, setMediaLibraryPermission] = useState<
    boolean | null
  >(null); // State quản lý quyền truy cập thư viện ảnh
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [locationErrorMsg, setLocationErrorMsg] = useState<string | null>(null);
  // Add missing state
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [detectionResponse, setDetectionResponse] = useState<any>(null);
  // Add new state for success modal
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Thêm state cho tự động chụp
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const cameraRef = useRef<CameraView>(null); // Tham chiếu đến component camera
  const router = useRouter(); // Hook điều hướng

  // Yêu cầu quyền truy cập thư viện ảnh khi component được render
  useEffect(() => {
    (async () => {
      const { status: mediaLibraryStatus } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      setMediaLibraryPermission(mediaLibraryStatus === "granted");

      if (mediaLibraryStatus !== "granted") {
        Alert.alert(
          "Quyền truy cập bị từ chối",
          "Bạn cần cấp quyền truy cập thư viện ảnh để sử dụng tính năng này.",
          [{ text: "OK" }]
        );
      }
    })();
  }, []);

  useEffect(() => {
    console.log("Setting up socket connection...");
    socket.connect();

    socket.on("disconnect", (reason) => {
      console.log("Socket disconnected. Reason:", reason);
    });

    socket.on("connect_error", (error) => {
      console.log("Socket connection error:", error.message);
    });

    // Return cleanup function
    return () => {
      console.log("Cleaning up socket connection...");
      socket.disconnect();
    };
  }, []); // Empty dependency array ensures this only runs once

  // Thêm hàm gửi dữ liệu khẩn cấp
  const sendEmergencyData = (phone: string) => {
    if (!detectionResponse) {
      console.log("No detection response data available");
      return;
    }

    // console.log("Sending emergency data with phone:", phone);

    let dataToSend =
      detectionResponse.data === "New User"
        ? detectionResponse.data
        : detectionResponse.data.data;

    // Thêm số điện thoại vào dữ liệu
    if (typeof dataToSend === "object") {
      dataToSend = { ...dataToSend, emergencyContact: phone };
    } else {
      dataToSend = { data: dataToSend, emergencyContact: phone };
    }

    // console.log("Final data being sent:", dataToSend);

    socket.emit("send_data_emergency", dataToSend);

    // Alert.alert("Đã phát hiện", "Hình ảnh đã được xử lý!");
    if (user) {
      router.replace("/(tabs)/profile");
    } else {
      router.replace("/");
    }
  };

  // Thiết lập chụp ảnh tự động khi camera sẵn sàng
  useEffect(() => {
    // Always clear interval if modal is showing
    if ((showPhoneModal || showSuccessModal) && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      return;
    }

    // Don't start interval if modal is showing
    if (
      isCameraReady &&
      mode === "camera" &&
      !isPreview &&
      !showPhoneModal &&
      !showSuccessModal
    ) {
      console.log("Setting up auto-capture interval");
      // Xóa interval cũ nếu có
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      // Thiết lập interval mới để chụp ảnh mỗi 1 giây
      intervalRef.current = setInterval(async () => {
        if (!cameraRef.current) return;

        try {
          // Chụp ảnh với chất lượng cao và không bỏ qua xử lý
          const photo = await cameraRef.current.takePictureAsync({
            quality: 1,
            skipProcessing: true,
            shutterSound: false,
          });

          // Gửi ảnh đến API phát hiện
          const response = await detectFace({
            uri: photo.uri,
            type: "image/jpeg",
          });

          console.log("Kết quả nhận diện:", response);

          // Kiểm tra kết quả và xử lý
          if (response && response.code === 200) {
            // Dừng interval khi phát hiện thành công
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }

            // Lưu trữ phản hồi để sử dụng sau
            setDetectionResponse(response);

            // Only show success modal if a user is logged in
            if (user) {
              setShowSuccessModal(true);
            } else {
              // If no user, show phone modal directly
              setShowPhoneModal(true);
            }
          }
        } catch (error) {
          console.error("Lỗi khi xử lý ảnh:", error);
        }
      }, 2000); // Chụp mỗi 1 giây
    }

    return () => {
      // Cleanup function only cleans up the interval now
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isCameraReady, isPreview, showPhoneModal, showSuccessModal, mode]); // Added showSuccessModal to dependencies

  // Hàm được gọi khi camera sẵn sàng sử dụng
  const onCameraReady = () => {
    setIsCameraReady(true);
  };

  // Hàm chụp ảnh sử dụng camera
  const takePicture = async () => {
    if (cameraRef.current && isCameraReady) {
      try {
        // Chụp ảnh với chất lượng cao nhất và không bỏ qua xử lý
        const photo = await cameraRef.current.takePictureAsync({
          quality: 1,
          skipProcessing: false,
        });

        // Không nén ảnh nữa, sử dụng trực tiếp URI của ảnh gốc
        setCapturedImage(photo.uri);
        setIsPreview(true); // Chuyển sang chế độ xem trước
      } catch (error) {
        console.error("Error taking picture:", error);
        Alert.alert("Lỗi", "Không thể chụp ảnh. Vui lòng thử lại.");
      }
    }
  };

  // Hàm chọn ảnh từ thư viện thiết bị
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // Chỉ cho phép chọn ảnh
        allowsEditing: true, // Cho phép chỉnh sửa trước khi chọn
        aspect: [4, 3], // Tỷ lệ khung hình
        quality: 1, // Chất lượng ảnh 100% (thay vì 0.8)
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setCapturedImage(result.assets[0].uri);
        setIsPreview(true); // Chuyển sang chế độ xem trước
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Lỗi", "Không thể chọn ảnh. Vui lòng thử lại.");
    }
  };

  // Utility function to convert URI to Blob
  const uriToBlob = async (uri: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function () {
        reject(new Error("uriToBlob failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });
  };

  // Hàm upload ảnh lên server
  const uploadImage = async () => {
    if (!capturedImage) {
      Alert.alert("Lỗi", "Không có ảnh để tải lên.");
      return;
    }

    setIsUploading(true);

    try {
      // Sử dụng dịch vụ detectFace để tải ảnh lên server với ảnh nguyên gốc
      const response = await detectFace({
        uri: capturedImage,
        type: "image/jpeg",
      });

      // Xử lý phản hồi từ server
      console.log("Phản hồi từ server:", response);

      // Hiển thị thông báo thành công
      Alert.alert(
        "Thành công",
        "Ảnh đã được gửi thành công. Đội ngũ y tế sẽ liên hệ với bạn sớm nhất có thể.",
        [
          {
            text: "OK",
            onPress: () => {
              // Quay về màn hình trước đó
              router.replace("/(tabs)/appointments");
            },
          },
        ]
      );
    } catch (error) {
      console.error("Upload error:", error);
      Alert.alert("Lỗi", "Không thể tải ảnh lên. Vui lòng thử lại sau.");
    } finally {
      setIsUploading(false);
    }
  };

  // Hủy xem trước và quay lại chế độ chụp ảnh/chọn ảnh
  const cancelPreview = () => {
    setCapturedImage(null);
    setIsPreview(false);
  };

  // Chuyển đổi giữa camera trước và sau
  const switchCamera = () => {
    setCameraType(cameraType === "back" ? "front" : "back");
  };

  // Quay lại màn hình trước đó
  const handleBack = () => {
    router.back();
  };

  // Chuyển đổi giữa chế độ camera và chọn ảnh từ thư viện
  const toggleMode = () => {
    // Dừng interval nếu đang chuyển từ chế độ camera sang chế độ thư viện
    if (mode === "camera" && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setMode(mode === "camera" ? "gallery" : "camera");

    if (isPreview) {
      cancelPreview();
    }
  };

  // Hiển thị khi chưa có thông tin về quyền truy cập
  if (!permission) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#26b9c8" />
        <Text style={styles.text}>Đang yêu cầu quyền truy cập...</Text>
      </SafeAreaView>
    );
  }

  // Hiển thị khi không có quyền truy cập camera
  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.error}>Không có quyền truy cập camera.</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Cấp quyền</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { marginTop: 10 }]}
          onPress={handleBack}
        >
          <Text style={styles.buttonText}>Quay lại</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // Phone validation schema using Yup
  const PhoneSchema = Yup.object().shape({
    phone: Yup.string()
      .matches(/^[0-9]{10}$/, "Số điện thoại phải có 10 chữ số")
      .required("Số điện thoại không được để trống"),
  });

  // Fix modal implementation to handle interval clearing
  const PhoneNumberModal = () => (
    <Modal
      visible={showPhoneModal}
      transparent={true}
      animationType="fade"
      onRequestClose={() => {
        // Ensure interval is not restarted accidentally
        setShowPhoneModal(false);
      }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Số điện thoại liên hệ</Text>
          <Text style={styles.modalText}>
            Vui lòng nhập số điện thoại để chúng tôi có thể liên hệ trong trường
            hợp khẩn cấp
          </Text>

          <Formik
            initialValues={{ phone: "" }}
            validationSchema={PhoneSchema}
            onSubmit={(values) => {
              // Clear interval before closing modal to prevent immediate restart
              if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
              }
              setShowPhoneModal(false);
              sendEmergencyData(values.phone);
            }}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
              isValid,
              dirty,
            }) => (
              <>
                <TextInput
                  style={[
                    styles.phoneInput,
                    errors.phone && touched.phone ? styles.inputError : null,
                  ]}
                  value={values.phone}
                  onChangeText={handleChange("phone")}
                  onBlur={handleBlur("phone")}
                  placeholder="Nhập số điện thoại"
                  keyboardType="phone-pad"
                  autoFocus
                  maxLength={10}
                />

                {errors.phone && touched.phone && (
                  <Text style={styles.errorText}>{errors.phone}</Text>
                )}

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => {
                      // Ensure interval is not restarted accidentally
                      if (intervalRef.current) {
                        clearInterval(intervalRef.current);
                        intervalRef.current = null;
                      }
                      setShowPhoneModal(false);
                    }}
                  >
                    <Text style={styles.buttonText}>Hủy</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.modalButton,
                      styles.confirmButton,
                      !isValid || !dirty ? styles.disabledButton : null,
                    ]}
                    onPress={handleSubmit}
                    disabled={!isValid || !dirty}
                  >
                    <Text style={styles.buttonText}>Xác nhận</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </Formik>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );

  // Add success modal component
  const SuccessModal = () => (
    <Modal
      visible={showSuccessModal}
      transparent={true}
      animationType="fade"
      onRequestClose={() => {
        setShowSuccessModal(false);
      }}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Thành công</Text>
          <Text style={styles.modalText}>
            Đã phát hiện, hình ảnh đã được xử lý!
          </Text>

          <TouchableOpacity
            style={[
              styles.modalButton,
              styles.confirmButton,
              { alignSelf: "center" },
            ]}
            onPress={() => {
              setShowSuccessModal(false);

              // Check if user has phone
              if (user && user.phone) {
                sendEmergencyData(user.phone);
              } else {
                // Show phone modal if no phone number
                setShowPhoneModal(true);
              }
            }}
          >
            <Text style={styles.buttonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  // Giao diện chính của màn hình khẩn cấp
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Phần header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hỗ Trợ Khẩn Cấp</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Nội dung chính */}
      <View style={styles.mainContainer}>
        {isPreview ? (
          // Hiển thị ảnh đã chụp hoặc chọn
          <View style={styles.previewContainer}>
            <Image
              source={{ uri: capturedImage || "" }}
              style={styles.preview}
            />

            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity
                style={[styles.actionButton, styles.cancelButton]}
                onPress={cancelPreview}
              >
                <Text style={styles.actionButtonText}>Chụp lại</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.uploadButton]}
                onPress={uploadImage}
                disabled={isUploading}
              >
                {isUploading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.actionButtonText}>Gửi ảnh</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        ) : mode === "camera" ? (
          // Hiển thị giao diện camera
          <View style={styles.cameraContainer}>
            <CameraView
              ref={cameraRef}
              style={styles.camera}
              facing={cameraType}
              onCameraReady={onCameraReady}
              mode="picture"
            />

            <View style={styles.controlsContainer}>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={switchCamera}
              >
                <MaterialIcons name="flip-camera-ios" size={28} color="white" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.captureButton}
                onPress={takePicture}
                disabled={true}
              >
                <View style={styles.captureButtonInner} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.controlButton}
                onPress={toggleMode}
                disabled={true}
              >
                <MaterialIcons name="photo-library" size={28} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          // Hiển thị giao diện chọn ảnh từ thư viện
          <View style={styles.galleryContainer}>
            <TouchableOpacity style={styles.galleryButton} onPress={pickImage}>
              <MaterialIcons name="photo-library" size={50} color="#26b9c8" />
              <Text style={styles.galleryText}>Chọn ảnh từ thư viện</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.cameraButton]}
              onPress={toggleMode}
            >
              <Text style={styles.buttonText}>
                <MaterialIcons name="camera-alt" size={18} color="#fff" /> Chụp
                ảnh mới
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Phần hướng dẫn */}
      {!isPreview && (
        <View style={styles.instructionContainer}>
          <Text style={styles.instructionTitle}>Hỗ trợ y tế khẩn cấp</Text>
          <Text style={styles.instructionText}>
            {mode === "camera"
              ? "Hệ thống đang tự động chụp và phân tích hình ảnh. Bạn có thể chuyển đổi camera hoặc chọn ảnh từ thư viện."
              : "Chụp ảnh vùng bị thương hoặc triệu chứng của bạn. Đội ngũ y tế sẽ đánh giá và liên hệ với bạn trong thời gian sớm nhất."}
          </Text>
        </View>
      )}

      {/* Modal nhập số điện thoại */}
      <PhoneNumberModal />

      {/* Add Success Modal */}
      <SuccessModal />
    </SafeAreaView>
  );
}

// Định nghĩa styles cho component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  mainContainer: {
    flex: 1,
    justifyContent: "center",
  },
  cameraContainer: {
    flex: 1,
    width: "100%",
  },
  camera: {
    flex: 1,
  },
  controlsContainer: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 20,
  },
  controlButton: {
    padding: 15,
    borderRadius: 30,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 5,
    borderColor: "#fff",
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  captureButtonInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#fff",
  },
  galleryContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  galleryButton: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#26b9c8",
    borderStyle: "dashed",
    marginBottom: 20,
    width: "100%",
  },
  galleryText: {
    fontSize: 16,
    marginTop: 10,
    color: "#333",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#26b9c8",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  cameraButton: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  previewContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
  },
  preview: {
    width: "100%",
    height: "70%",
    resizeMode: "contain",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
  },
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    minWidth: 120,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#757575",
  },
  uploadButton: {
    backgroundColor: "#26b9c8",
  },
  disabledButton: {
    backgroundColor: "#aaa",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  instructionContainer: {
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  instructionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
    textAlign: "center",
  },
  instructionText: {
    fontSize: 14,
    color: "#eee",
    textAlign: "center",
    lineHeight: 20,
  },
  text: {
    color: "#fff",
    fontSize: 16,
    marginTop: 16,
  },
  error: {
    color: "#ff6b6b",
    fontSize: 16,
    textAlign: "center",
    margin: 20,
  },
  // Thêm style cho overlay phát hiện
  detectionOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  detectionText: {
    color: "#fff",
    fontSize: 16,
    marginTop: 10,
    fontWeight: "bold",
  },
  // Thêm style cho modal số điện thoại
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "100%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  modalText: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: "center",
    color: "#555",
  },
  phoneInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
  },
  inputError: {
    borderColor: "#ff6b6b",
  },
  errorText: {
    color: "#ff6b6b",
    fontSize: 12,
    marginBottom: 15,
    marginLeft: 5,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 120,
    alignItems: "center",
  },
  confirmButton: {
    backgroundColor: "#26b9c8",
  },
  disabledButton: {
    backgroundColor: "#aaa",
    opacity: 0.7,
  },
});
