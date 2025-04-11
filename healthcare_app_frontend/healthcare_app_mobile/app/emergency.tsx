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
import { io, Socket } from "socket.io-client";
import * as FileSystem from "expo-file-system";

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

  const cameraRef = useRef<CameraView>(null); // Tham chiếu đến component camera
  const getIntervalNumber = useRef(0);
  const router = useRouter(); // Hook điều hướng
  const [socket, setSocket] = useState<Socket>(
    io(`ws://${process.env.EXPO_PUBLIC_HOST_ID}:8081`, {
      path: "/image_detect/socket",
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 10,
      autoConnect: false,
    })
  );

  // Lấy vị trí hiện tại
  useEffect(() => {
    async function getCurrentLocation() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocationErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      console.log("Current location:", location);
    }

    getCurrentLocation();
  }, []);

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

    socket.connect();
    socket.on("connect", () => {
      socket.on("emergency_detect_response", (data) => {});
    });

    getIntervalNumber.current = setInterval(() => {
      (async () => {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8, // Chất lượng ảnh 80%
        });

        const fileURI = photo.uri;
        const base64Image = await FileSystem.readAsStringAsync(fileURI, {
          encoding: FileSystem.EncodingType.Base64,
        });
        socket.emit("emergency_detect_request", {
          image: base64Image,
          fileName: "face.jpg",
        });
      })();
    }, 2000);

    return () => {
      socket.disconnect();
      clearInterval(getIntervalNumber.current);
    };
  }, []);

  // Hàm được gọi khi camera sẵn sàng sử dụng
  const onCameraReady = () => {
    setIsCameraReady(true);
  };

  // Hàm chụp ảnh sử dụng camera
  const takePicture = async () => {
    if (cameraRef.current && isCameraReady) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8, // Chất lượng ảnh 80%
        });

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
        quality: 0.8, // Chất lượng ảnh 80%
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
  const uriToBlob = async (uri: string): Promise<Blob> => {
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
      // Chuyển đổi URI ảnh thành Blob
      const imageBlob = await uriToBlob(capturedImage);

      // Sử dụng dịch vụ detectFace để tải ảnh lên server
      const response = await detectFace(imageBlob);

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
                disabled={!isCameraReady}
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
            Chụp ảnh vùng bị thương hoặc triệu chứng của bạn. Đội ngũ y tế sẽ
            đánh giá và liên hệ với bạn trong thời gian sớm nhất.
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
});
