import { useEffect, useState } from "react";
import * as LocalAuthentication from "expo-local-authentication";
import { Alert } from "react-native";

export const useBiometricAuth = () => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [supportsFingerprint, setSupportsFingerprint] = useState(false);
  const [supportsFaceID, setSupportsFaceID] = useState(false);

  // Kiểm tra thiết bị hỗ trợ sinh trắc học
  const checkBiometricSupport = async () => {
    try {
      const types =
        await LocalAuthentication.supportedAuthenticationTypesAsync();

      setSupportsFingerprint(
        types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)
      );
      setSupportsFaceID(
        types.includes(
          LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION
        )
      );
    } catch (error) {
      console.error("Error checking biometric support:", error);
    }
  };

  useEffect(() => {
    checkBiometricSupport();
  }, []);

  // Thực hiện xác thực sinh trắc học
  const authenticate = async (): Promise<boolean> => {
    try {
      setIsAuthenticating(true);

      // Kiểm tra thiết bị hỗ trợ sinh trắc học
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!hasHardware || !isEnrolled) {
        Alert.alert("Thiết bị không hỗ trợ hoặc chưa thiết lập sinh trắc học");
        return false;
      }

      // Xác thực
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Xác thực để đăng nhập",
        cancelLabel: "Hủy",
        disableDeviceFallback: false, // Cho phép fallback nếu cần
      });

      if (result.success) {
        Alert.alert("Xác thực thành công!");
        return true;
      } else {
        Alert.alert("Xác thực thất bại!");
        return false;
      }
    } catch (error) {
      console.error("Error during authentication:", error);
      Alert.alert("Đã xảy ra lỗi khi xác thực");
      return false;
    } finally {
      setIsAuthenticating(false);
    }
  };

  return {
    isAuthenticating,
    supportsFingerprint,
    supportsFaceID,
    authenticate,
    checkBiometricSupport,
  };
};
