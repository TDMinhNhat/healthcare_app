import React, { useState } from "react";
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  Alert,
  Switch,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useSelector, useDispatch } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { updateUser } from "../redux/slices/userSlice"; // Cập nhật đường dẫn import
import { User } from "../types/user";
import { format, parse } from "date-fns";

export default function EditProfileScreen() {
  const params = useLocalSearchParams();
  const { userId } = params;
  const user = useSelector((state: any) => state.user.user);
  const dispatch = useDispatch();

  // Xử lý ngày tháng đúng cách với date-fns
  const parseDob = () => {
    if (!user?.dob) return new Date();

    try {
      // Giả định rằng dob lưu ở định dạng "dd-MM-yyyy"
      if (typeof user.dob === "string" && user.dob.includes("-")) {
        return parse(user.dob, "dd-MM-yyyy", new Date());
      }
      // Nếu là timestamp hoặc định dạng khác
      return new Date(user.dob);
    } catch (error) {
      console.log("Error parsing date:", error);
      return new Date();
    }
  };

  // Cập nhật state để khớp với các thuộc tính trong giao diện User
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [sex, setSex] = useState(user?.sex !== undefined ? user.sex : true);
  const [dob, setDob] = useState(parseDob());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Xử lý địa chỉ
  const [number, setNumber] = useState(user?.address?.number || "");
  const [street, setStreet] = useState(user?.address?.street || "");
  const [ward, setWard] = useState(user?.address?.ward || "");
  const [district, setDistrict] = useState(user?.address?.district || "");
  const [city, setCity] = useState(user?.address?.city || "");
  const [country, setCountry] = useState(user?.address?.country || "");

  const formatDate = (date: Date) => {
    return format(date, "dd-MM-yyyy"); // Định dạng DD-MM-YYYY using date-fns
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDob(selectedDate);
    }
  };

  const handleSaveProfile = () => {
    // Kiểm tra các trường bắt buộc
    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !phone.trim()
    ) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ các trường bắt buộc");
      return;
    }

    // Cập nhật thông tin người dùng trong Redux với cấu trúc chính xác
    dispatch(
      updateUser({
        ...user,
        firstName,
        lastName,
        email,
        phone,
        sex,
        dob: formatDate(dob),
        address: {
          id: user?.address?.id || 0,
          number,
          street,
          ward,
          district,
          city,
          country,
        },
      })
    );

    // Hiển thị thông báo thành công
    Alert.alert("Thành công", "Hồ sơ đã được cập nhật thành công", [
      { text: "OK", onPress: () => router.back() },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#0056b3" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chỉnh sửa hồ sơ</Text>
        <View style={styles.placeholder} />
      </View> */}

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* Ảnh hồ sơ */}
          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri: user?.avatar || "https://via.placeholder.com/150",
              }}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.editAvatarButton}>
              <Ionicons name="camera" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Các trường biểu mẫu - Cập nhật để phù hợp với giao diện User */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Họ*</Text>
            <TextInput
              style={styles.input}
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Nhập họ của bạn"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Tên*</Text>
            <TextInput
              style={styles.input}
              value={lastName}
              onChangeText={setLastName}
              placeholder="Nhập tên của bạn"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Email*</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Nhập email của bạn"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Số điện thoại*</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="Nhập số điện thoại của bạn"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Ngày sinh</Text>
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text>{formatDate(dob)}</Text>
              <Ionicons name="calendar" size={20} color="#0056b3" />
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={dob}
                mode="date"
                display="default"
                onChange={onDateChange}
              />
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Giới tính</Text>
            <View style={styles.sexToggle}>
              <Text>Nữ</Text>
              <Switch
                value={sex}
                onValueChange={setSex}
                trackColor={{ false: "#e0e0e0", true: "#0056b380" }}
                thumbColor={sex ? "#0056b3" : "#f4f3f4"}
                style={{ marginHorizontal: 10 }}
              />
              <Text>Nam</Text>
            </View>
          </View>

          {/* Các trường địa chỉ */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Thông tin địa chỉ</Text>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Số nhà</Text>
            <TextInput
              style={styles.input}
              value={number}
              onChangeText={setNumber}
              placeholder="Nhập số nhà/tòa nhà của bạn"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Đường</Text>
            <TextInput
              style={styles.input}
              value={street}
              onChangeText={setStreet}
              placeholder="Nhập tên đường của bạn"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Phường/Xã</Text>
            <TextInput
              style={styles.input}
              value={ward}
              onChangeText={setWard}
              placeholder="Nhập phường/xã của bạn"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Quận/Huyện</Text>
            <TextInput
              style={styles.input}
              value={district}
              onChangeText={setDistrict}
              placeholder="Nhập quận/huyện của bạn"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Thành phố</Text>
            <TextInput
              style={styles.input}
              value={city}
              onChangeText={setCity}
              placeholder="Nhập thành phố của bạn"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Quốc gia</Text>
            <TextInput
              style={styles.input}
              value={country}
              onChangeText={setCountry}
              placeholder="Nhập quốc gia của bạn"
            />
          </View>

          {/* Nút lưu */}
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveProfile}
          >
            <Text style={styles.saveButtonText}>Lưu thay đổi</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    backgroundColor: "#fff",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 24,
    position: "relative",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#0056b3",
  },
  editAvatarButton: {
    position: "absolute",
    bottom: 0,
    right: "35%",
    backgroundColor: "#0056b3",
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#0056b3",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 24,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  sectionHeader: {
    marginVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0056b3",
  },
  sexToggle: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  datePickerButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
});
