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
import { logOut, updateUser } from "../../redux/slices/userSlice";
import * as ImagePicker from "expo-image-picker";
import { updatePatientAvatar } from "../../services/authenticate/user_service";

// Component chính cho tab hồ sơ người dùng
export default function ProfileTab() {
  // Lấy thông tin người dùng từ Redux store
  const user = useSelector((state: any) => state.user.user);
  // Khởi tạo dispatch để gửi actions
  const dispatch = useDispatch();

  // Hàm xử lý khi người dùng muốn chỉnh sửa hồ sơ
  const handleEditProfile = () => {
    if (user?.userId) {
      router.push({
        pathname: "/edit-profile",
        params: { userId: user.userId },
      });
    }
  };

  // Hàm xử lý khi người dùng muốn cập nhật ảnh đại diện
  const handleUpdateAvatar = async () => {
    try {
      // Yêu cầu quyền truy cập vào thư viện ảnh
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Quyền truy cập",
          "Cần quyền truy cập vào thư viện ảnh để thay đổi ảnh đại diện."
        );
        return;
      }

      // Mở trình chọn ảnh
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        console.log("Selected image:", selectedImage);
        // Gọi API cập nhật ảnh đại diện
        const response = await updatePatientAvatar(user.userId, {
          uri: selectedImage.uri,
        });

        if (response.data && response.data.code === 200) {
          // Lấy URL ảnh đại diện mới từ response
          const newAvatarUrl = response.data.data.avatar;

          // Cập nhật Redux store với ảnh đại diện mới
          dispatch(
            updateUser({
              ...user,
              avatar: newAvatarUrl,
            })
          );

          Alert.alert("Thành công", "Ảnh đại diện đã được cập nhật");
        } else {
          Alert.alert("Lỗi", "Không thể cập nhật ảnh đại diện");
        }
      }
    } catch (error) {
      console.error("Error updating avatar:", error);
      Alert.alert("Lỗi", "Đã xảy ra lỗi khi cập nhật ảnh đại diện");
    }
  };

  // Hàm xử lý khi người dùng bấm vào nút khẩn cấp
  const handleEmergency = () => {
    // Chuyển hướng trực tiếp đến trang khẩn cấp thay vì hiển thị thông báo
    router.push("/emergency");
  };

  // Hàm xử lý khi người dùng đăng xuất
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

  // Render giao diện người dùng
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
              <TouchableOpacity onPress={handleUpdateAvatar}>
                <Image
                  source={{
                    uri: user?.avatar || "https://via.placeholder.com/150",
                  }}
                  style={styles.avatar}
                />
              </TouchableOpacity>
            </View>

            {/* Hiển thị thông tin họ tên */}
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Họ và tên:</Text>
              <Text style={styles.infoValue}>
                {user ? `${user.firstName} ${user.lastName}` : "Chưa cung cấp"}
              </Text>
            </View>

            {/* Hiển thị thông tin email */}
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email:</Text>
              <Text style={styles.infoValue} numberOfLines={2}>
                {user?.email || "Chưa cung cấp"}
              </Text>
            </View>

            {/* Hiển thị thông tin số điện thoại */}
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Số điện thoại:</Text>
              <Text style={styles.infoValue}>
                {user?.phone || "Chưa cung cấp"}
              </Text>
            </View>

            {/* Hiển thị thông tin ngày sinh */}
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Ngày sinh:</Text>
              <Text style={styles.infoValue}>
                {user?.dob || "Chưa xác định"}
              </Text>
            </View>

            {/* Hiển thị thông tin giới tính */}
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Giới tính:</Text>
              <Text style={styles.infoValue}>
                {user?.sex !== undefined
                  ? user.sex
                    ? "Nữ"
                    : "Nam"
                  : "Chưa xác định"}
              </Text>
            </View>

            {/* Hiển thị thông tin địa chỉ */}
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
          {/* Nút khẩn cấp */}
          <TouchableOpacity style={styles.menuItem} onPress={handleEmergency}>
            <View style={[styles.menuIconContainer, styles.emergencyIcon]}>
              <Ionicons name="warning-outline" size={20} color="#dc3545" />
            </View>
            <Text style={styles.menuText}>Khẩn cấp</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          {/* Nút tài khoản ngân hàng */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push("/bank-account")}
          >
            <View
              style={[styles.menuIconContainer, { backgroundColor: "#e8f5e9" }]}
            >
              <Ionicons name="card-outline" size={20} color="#4caf50" />
            </View>
            <Text style={styles.menuText}>Tài khoản ngân hàng</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          {/* Nút đổi mật khẩu */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push("/change_password")}
          >
            <View
              style={[styles.menuIconContainer, { backgroundColor: "#e3f2fd" }]}
            >
              <Ionicons name="key-outline" size={20} color="#1976d2" />
            </View>
            <Text style={styles.menuText}>Đổi mật khẩu</Text>
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
    position: "relative",
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
    alignItems: "center", // Căn giữa ảnh đại diện
  },
  infoRow: {
    flexDirection: "row",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    width: "100%",
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
