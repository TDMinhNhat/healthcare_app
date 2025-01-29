import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface NotificationBellProps {
  hasNotification?: boolean;
  onPress?: () => void;
}

const NotificationBell: React.FC<NotificationBellProps> = ({
  hasNotification = false,
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Ionicons name="notifications-outline" size={24} color="#333" />
      {hasNotification && <View style={styles.badge} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    justifyContent: "center",
    alignItems: "center",
    position: "relative", // Thêm position relative để đảm bảo badge hiển thị đúng
  },
  badge: {
    position: "absolute",
    right: 0,
    top: 0,
    backgroundColor: "#FF3B30",
    borderRadius: 5,
    width: 10,
    height: 10,
    borderWidth: 1,
    borderColor: "white",
  },
});

export default NotificationBell;
