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

const socket = io(`ws://${process.env.EXPO_PUBLIC_HOST_ID}:8081`, {
  path: "/image_detect/socket",
  transports: ["websocket", "polling"],
  reconnection: true,
  reconnectionAttempts: 10,
  autoConnect: false,
});

export default function Emergency() {
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

  // Thêm state cho tự động chụp
  const [isDetecting, setIsDetecting] = useState(false);
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

  // Thiết lập chụp ảnh tự động khi camera sẵn sàng
  useEffect(() => {
    if (isCameraReady && mode === "camera" && !isPreview && !isDetecting) {
      // Xóa interval cũ nếu có
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      // Thiết lập interval mới để chụp ảnh mỗi 1 giây
      intervalRef.current = setInterval(async () => {
        if (!cameraRef.current) return;

        try {
          setIsDetecting(true);

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
            // Nếu có dữ liệu
            // if (response.data && response.data.length > 0) {
            // Hiển thị ảnh đã chụp
            // setCapturedImage(photo.uri);

            // Dừng interval khi phát hiện thành công
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            socket.emit(
              "send_data_emergency",
              response.data === "New User" ? response.data : response.data.data
            );

            // setIsPreview(true);
            Alert.alert("Đã phát hiện", "Hình ảnh đã được xử lý!");
            router.replace("/");
            // }
          }
        } catch (error) {
          console.error("Lỗi khi xử lý ảnh:", error);
        } finally {
          setIsDetecting(false);
        }
      }, 1000); // Chụp mỗi 1 giây
    }

    return () => {
      // Cleanup function only cleans up the interval now
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isCameraReady, mode, isPreview, isDetecting]);

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
                style={[
                  styles.actionButton,
                  styles.uploadButton,
                  isUploading && styles.disabledButton,
                ]}
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

            {/* Lớp phủ hiển thị trạng thái đang phát hiện */}
            {isDetecting && (
              <View style={styles.detectionOverlay}>
                <ActivityIndicator size="large" color="#26b9c8" />
                <Text style={styles.detectionText}>Đang phát hiện...</Text>
              </View>
            )}

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
                disabled={!isCameraReady || isDetecting}
              >
                <View style={styles.captureButtonInner} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.controlButton}
                onPress={toggleMode}
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
});
