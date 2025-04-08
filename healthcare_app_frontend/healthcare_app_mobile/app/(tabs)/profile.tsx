import React from "react";
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { useSelector, useDispatch } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { logOut } from "../../redux/slices/userSlice";

export default function ProfileTab() {
  const user = useSelector((state: any) => state.user.user);
  const dispatch = useDispatch();

  const handleEditProfile = () => {
    if (user?.userId) {
      router.push({
        pathname: "/edit-profile",
        params: { userId: user.userId },
      });
    }
  };

  const handleEmergency = () => {
    // Chuyển hướng trực tiếp đến trang khẩn cấp thay vì hiển thị thông báo
    router.push("/emergency");
  };

  const handleLogout = () => {
    Alert.alert("Đăng xuất", "Bạn có chắc chắn muốn đăng xuất không?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Đăng xuất",
        style: "destructive",
        onPress: () => {
          dispatch(logOut());
          router.replace("/");
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Phần thông tin và hồ sơ kết hợp */}
        <View style={styles.infoSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Thông tin bệnh nhân</Text>
            <TouchableOpacity onPress={handleEditProfile}>
              <Ionicons name="create-outline" size={22} color="#0056b3" />
            </TouchableOpacity>
          </View>

          <View style={styles.infoCard}>
            {/* Ảnh đại diện bên trong thẻ thông tin */}
            <View style={styles.avatarContainer}>
              <Image
                source={{
                  uri: user?.avatar || "https://via.placeholder.com/150",
                }}
                style={styles.avatar}
              />
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Họ và tên:</Text>
              <Text style={styles.infoValue}>
                {user ? `${user.firstName} ${user.lastName}` : "Chưa cung cấp"}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email:</Text>
              <Text style={styles.infoValue} numberOfLines={2}>
                {user?.email || "Chưa cung cấp"}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Số điện thoại:</Text>
              <Text style={styles.infoValue}>
                {user?.phone || "Chưa cung cấp"}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Ngày sinh:</Text>
              <Text style={styles.infoValue}>
                {user?.dob || "Chưa xác định"}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Giới tính:</Text>
              <Text style={styles.infoValue}>
                {user?.sex !== undefined
                  ? user.sex
                    ? "Nam"
                    : "Nữ"
                  : "Chưa xác định"}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Địa chỉ:</Text>
              <Text style={styles.infoValue} numberOfLines={2}>
                {user?.address
                  ? `${user.address.number} ${user.address.street}, ${user.address.ward}, ${user.address.district}, ${user.address.city}, ${user.address.country}`
                  : "Chưa cung cấp"}
              </Text>
            </View>
          </View>
        </View>

        {/* Tùy chọn menu */}
        <View style={styles.menuContainer}>
          {/* Đã xóa mục chỉnh sửa hồ sơ */}
          <TouchableOpacity style={styles.menuItem} onPress={handleEmergency}>
            <View style={[styles.menuIconContainer, styles.emergencyIcon]}>
              <Ionicons name="warning-outline" size={20} color="#dc3545" />
            </View>
            <Text style={styles.menuText}>Khẩn cấp</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
        </View>

        {/* Tùy chọn đăng xuất */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#6c757d" />
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 10,
    marginTop: 5,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: "#0056b3",
  },
  userName: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 4,
    color: "#333",
  },
  userEmail: {
    fontSize: 16,
    color: "#777",
    marginBottom: 2,
  },
  userPhone: {
    fontSize: 14,
    color: "#777",
  },
  menuContainer: {
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#eef3fb",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  emergencyIcon: {
    backgroundColor: "#ffebee",
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    paddingVertical: 16,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#6c757d",
    marginLeft: 8,
  },
  infoSection: {
    backgroundColor: "#fff",
    marginBottom: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  infoCard: {
    padding: 15,
    alignItems: "center", // Center the avatar
  },
  infoRow: {
    flexDirection: "row",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    width: "100%", // Ensure full width
  },
  infoLabel: {
    width: "35%",
    fontSize: 15,
    color: "#666",
    fontWeight: "500",
  },
  infoValue: {
    flex: 1,
    fontSize: 15,
    color: "#333",
    flexShrink: 1,
  },
});
