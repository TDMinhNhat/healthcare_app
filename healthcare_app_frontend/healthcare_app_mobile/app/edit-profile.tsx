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
  ActivityIndicator,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useSelector, useDispatch } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { updateUser } from "../redux/slices/userSlice";
import { User } from "../types/user";
import { format, parse } from "date-fns";
import { Formik } from "formik";
import * as Yup from "yup";
import { updateInfo } from "../services/authenticate/user_service";

export default function EditProfileScreen() {
  const params = useLocalSearchParams();
  const { userId } = params;
  const user = useSelector((state: any) => state.user.user);
  const dispatch = useDispatch();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Quản lý giới tính và ngày sinh riêng biệt, không qua Formik
  const [sex, setSex] = useState(user?.sex !== undefined ? user.sex : true);
  const [dob, setDob] = useState(parseDob());

  const formatDate = (date: Date) => {
    return format(date, "dd-MM-yyyy");
  };

  // Validation schema với Yup - loại bỏ sex và dob
  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("Họ là bắt buộc"),
    lastName: Yup.string().required("Tên là bắt buộc"),
    email: Yup.string()
      .email("Email không hợp lệ")
      .required("Email là bắt buộc"),
    phone: Yup.string()
      .matches(/^[0-9]{10,}$/, "Số điện thoại phải có ít nhất 10 chữ số")
      .required("Số điện thoại là bắt buộc"),
    address: Yup.object().shape({
      number: Yup.string(),
      street: Yup.string(),
      ward: Yup.string(),
      district: Yup.string(),
      city: Yup.string(),
      country: Yup.string(),
    }),
  });

  const initialValues = {
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: {
      id: user?.address?.id || 0,
      number: user?.address?.number || "",
      street: user?.address?.street || "",
      ward: user?.address?.ward || "",
      district: user?.address?.district || "",
      city: user?.address?.city || "",
      country: user?.address?.country || "",
    },
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            try {
              setIsSubmitting(true);

              // Prepare data for API submission
              const apiData = {
                ...values,
                sex: sex, // Include sex state
                dob: formatDate(dob), // Format date properly
                password: user.password, // Include password from current user
              };

              // Call API to update user info
              const response = await updateInfo(user.userId, apiData);

              if (response.data && response.data.code === 200) {
                // Get updated data from server response
                const responseData = response.data.data;

                // Create updated user object
                const updatedUser = {
                  ...user,
                  ...responseData,
                };

                // Update Redux store
                dispatch(updateUser(updatedUser));

                // Show success message
                Alert.alert("Thành công", "Hồ sơ đã được cập nhật thành công", [
                  { text: "OK", onPress: () => router.back() },
                ]);
              } else {
                // Handle error from API
                Alert.alert(
                  "Lỗi",
                  response.data?.message ||
                    "Không thể cập nhật thông tin. Vui lòng thử lại.",
                  [{ text: "OK" }]
                );
              }
            } catch (error) {
              console.error("Error updating profile:", error);
              Alert.alert(
                "Lỗi",
                "Đã xảy ra lỗi khi cập nhật thông tin. Vui lòng thử lại sau.",
                [{ text: "OK" }]
              );
            } finally {
              setIsSubmitting(false);
            }
          }}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            values,
            errors,
            touched,
          }) => (
            <View style={styles.content}>
              {/* Ảnh hồ sơ (chỉ hiển thị không cập nhật) */}
              {/* <View style={styles.avatarContainer}>
                <Image
                  source={{
                    uri: user?.avatar || "https://via.placeholder.com/150",
                  }}
                  style={styles.avatar}
                />
              </View> */}

              {/* Các trường biểu mẫu - Sử dụng Formik */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Họ*</Text>
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
                  placeholder="Nhập họ của bạn"
                />
                {touched.firstName && errors.firstName && (
                  <Text style={styles.errorText}>{errors.firstName}</Text>
                )}
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Tên*</Text>
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
                  placeholder="Nhập tên của bạn"
                />
                {touched.lastName && errors.lastName && (
                  <Text style={styles.errorText}>{errors.lastName}</Text>
                )}
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Email*</Text>
                <TextInput
                  style={[
                    styles.input,
                    touched.email && errors.email ? styles.inputError : null,
                  ]}
                  value={values.email}
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  placeholder="Nhập email của bạn"
                  keyboardType="email-address"
                />
                {touched.email && errors.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Số điện thoại*</Text>
                <TextInput
                  style={[
                    styles.input,
                    touched.phone && errors.phone ? styles.inputError : null,
                  ]}
                  value={values.phone}
                  onChangeText={handleChange("phone")}
                  onBlur={handleBlur("phone")}
                  placeholder="Nhập số điện thoại của bạn"
                  keyboardType="phone-pad"
                />
                {touched.phone && errors.phone && (
                  <Text style={styles.errorText}>{errors.phone}</Text>
                )}
              </View>

              {/* Ngày sinh - quản lý riêng biệt */}
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
                    onChange={(event, selectedDate) => {
                      setShowDatePicker(false);
                      if (selectedDate) {
                        setDob(selectedDate);
                      }
                    }}
                  />
                )}
              </View>

              {/* Giới tính - quản lý riêng biệt */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Giới tính</Text>
                <View style={styles.sexToggle}>
                  <Text>Nam</Text>
                  <Switch
                    value={sex}
                    onValueChange={setSex}
                    trackColor={{ false: "#e0e0e0", true: "#0056b380" }}
                    thumbColor={sex ? "#0056b3" : "#f4f3f4"}
                    style={{ marginHorizontal: 10 }}
                  />
                  <Text>Nữ</Text>
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
                  value={values.address.number}
                  onChangeText={(text) => setFieldValue("address.number", text)}
                  placeholder="Nhập số nhà/tòa nhà của bạn"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Đường</Text>
                <TextInput
                  style={styles.input}
                  value={values.address.street}
                  onChangeText={(text) => setFieldValue("address.street", text)}
                  placeholder="Nhập tên đường của bạn"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Phường/Xã</Text>
                <TextInput
                  style={styles.input}
                  value={values.address.ward}
                  onChangeText={(text) => setFieldValue("address.ward", text)}
                  placeholder="Nhập phường/xã của bạn"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Quận/Huyện</Text>
                <TextInput
                  style={styles.input}
                  value={values.address.district}
                  onChangeText={(text) =>
                    setFieldValue("address.district", text)
                  }
                  placeholder="Nhập quận/huyện của bạn"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Thành phố</Text>
                <TextInput
                  style={styles.input}
                  value={values.address.city}
                  onChangeText={(text) => setFieldValue("address.city", text)}
                  placeholder="Nhập thành phố của bạn"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Quốc gia</Text>
                <TextInput
                  style={styles.input}
                  value={values.address.country}
                  onChangeText={(text) =>
                    setFieldValue("address.country", text)
                  }
                  placeholder="Nhập quốc gia của bạn"
                />
              </View>

              {/* Nút lưu */}
              <TouchableOpacity
                style={styles.saveButton}
                onPress={() => handleSubmit()}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.saveButtonText}>Lưu thay đổi</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </Formik>
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
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
  },
});
