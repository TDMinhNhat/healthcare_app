import { useTheme } from "@react-navigation/native";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal as RNModal,
  TouchableOpacity,
  Image,
} from "react-native";
import Button from "./Button";
import AntDesign from "@expo/vector-icons/AntDesign";
interface ToastProps {
  type: "success" | "error" | "info";
  visible: boolean;
  onClose: () => void;
  title: string;
  message: string;
  buttonText: string;
}
// src/components/Toast/icons.ts
const icons = {
  success: require("../assets/icons/completeSquare.png"),
  error: require("../assets/icons/completeSquare.png"),
  info: require("../assets/icons/completeSquare.png"),
};

const Modal: React.FC<ToastProps> = ({
  type,
  visible,
  onClose,
  title,
  message,
  buttonText,
  ...rest
}) => {
  const { colors } = useTheme();
  return (
    <RNModal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0,0,0,0.7)", // Changed opacity for blur effect
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            padding: 20,
            borderRadius: 10,
            width: "80%",
          }}
        >
          <View
            style={{
              alignItems: "center",
              // justifyContent: "center",
              gap: 20,
              width: "100%",
            }}
          >
            <AntDesign
              name="checksquare"
              size={65}
              color={colors.main.tertiary}
            />
            <Text
              style={{
                color: colors.main.primary,
                fontSize: 20,
                textAlign: "center",
              }}
            >
              {title}
            </Text>
            <Text style={{ fontSize: 14 }}>{message}</Text>
            <Button
              title={buttonText}
              onPress={onClose}
              style={{ width: "100%" }}
            />
          </View>
        </View>
      </View>
    </RNModal>
  );
};

export default Modal;
