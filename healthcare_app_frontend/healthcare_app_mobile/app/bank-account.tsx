import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { router } from "expo-router";
import {
  addBankAccount,
  getPatientBankAccount,
  updateBankAccount,
} from "../services/authenticate/user_service";

// Define the BankAccount interface
interface BankAccount {
  id?: number;
  userId: string;
  accountNumber: string;
  bankName: string;
}

// Danh sách các ngân hàng phổ biến ở Việt Nam
const VIETNAMESE_BANKS = [
  "BIDV - Ngân hàng TMCP Đầu tư và Phát triển Việt Nam",
  "Vietcombank - Ngân hàng TMCP Ngoại thương Việt Nam",
  "VietinBank - Ngân hàng TMCP Công thương Việt Nam",
  "Agribank - Ngân hàng Nông nghiệp và Phát triển Nông thôn Việt Nam",
  "Techcombank - Ngân hàng TMCP Kỹ thương Việt Nam",
  "ACB - Ngân hàng TMCP Á Châu",
  "MBBank - Ngân hàng TMCP Quân đội",
  "TPBank - Ngân hàng TMCP Tiên Phong",
  "VPBank - Ngân hàng TMCP Việt Nam Thịnh Vượng",
  "HDBank - Ngân hàng TMCP Phát triển TP Hồ Chí Minh",
  "SacomBank - Ngân hàng TMCP Sài Gòn Thương Tín",
  "OCB - Ngân hàng TMCP Phương Đông",
  "Eximbank - Ngân hàng TMCP Xuất Nhập khẩu Việt Nam",
  "LienVietPostBank - Ngân hàng TMCP Bưu điện Liên Việt",
  "SHB - Ngân hàng TMCP Sài Gòn - Hà Nội",
  "VIB - Ngân hàng TMCP Quốc tế Việt Nam",
];

// Schema validation dùng Yup
const bankAccountSchema = Yup.object({
  accountNumber: Yup.string()
    .required("Vui lòng nhập số tài khoản")
    .matches(/^\d{8,19}$/, "Số tài khoản không hợp lệ (8-19 chữ số)"),
  bankName: Yup.string().required("Vui lòng chọn ngân hàng"),
});

export default function BankAccountScreen() {
  // Replace useNavigation with expo-router
  // const navigation = useNavigation();

  // Lấy thông tin người dùng từ Redux store
  const user = useSelector((state: any) => state.user.user);

  // State quản lý dữ liệu và trạng thái trang
  const [bankAccount, setBankAccount] = useState<BankAccount | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);

  // Khởi tạo Formik
  const formik = useFormik({
    initialValues: {
      accountNumber: "",
      bankName: "",
    },
    validationSchema: bankAccountSchema,
    onSubmit: async (values) => {
      handleSave(values);
    },
    enableReinitialize: true,
  });

  // Lấy thông tin tài khoản ngân hàng khi component được tải
  useEffect(() => {
    const fetchBankAccountData = async () => {
      if (!user || !user.userId) {
        setError("Không tìm thấy thông tin người dùng");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getPatientBankAccount(user.userId);

        if (response.data.code === 200 && response.data.data) {
          // Đã có tài khoản ngân hàng
          const bankAccountData = response.data.data;
          setBankAccount(bankAccountData);

          // Cập nhật giá trị ban đầu cho Formik
          formik.setValues({
            accountNumber: bankAccountData.accountNumber || "",
            bankName: bankAccountData.bankName || "",
          });
        } else {
          // Chưa có tài khoản ngân hàng
          setBankAccount(null);
          setIsEditing(true); // Cho phép thêm mới ngay
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin tài khoản ngân hàng:", error);
        setError(
          "Đã xảy ra lỗi khi tải thông tin tài khoản ngân hàng. Vui lòng thử lại sau."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBankAccountData();
  }, [user]);

  // Hàm xử lý khi người dùng bấm nút Lưu
  const handleSave = async (values: {
    accountNumber: string;
    bankName: string;
  }) => {
    try {
      setSaveLoading(true);

      let response;
      if (bankAccount) {
        // Using real API implementation for update
        response = await updateBankAccount(
          user.userId,
          values.bankName,
          values.accountNumber
        );
        setSuccess("Cập nhật tài khoản ngân hàng thành công!");
      } else {
        // Using real API for adding new bank account
        response = await addBankAccount(
          user.userId,
          values.bankName,
          values.accountNumber
        );
        setSuccess("Thêm tài khoản ngân hàng thành công!");
      }

      if (response.data.code === 200 || response.data.code === 201) {
        setBankAccount(response.data.data);
        setIsEditing(false);
      } else {
        setError(
          "Không thể lưu thông tin tài khoản ngân hàng. Vui lòng thử lại."
        );
      }
    } catch (error) {
      console.error("Lỗi khi lưu thông tin tài khoản ngân hàng:", error);
      setError(
        "Đã xảy ra lỗi khi lưu thông tin tài khoản ngân hàng. Vui lòng thử lại sau."
      );
    } finally {
      setSaveLoading(false);
    }
  };

  // Hàm xử lý khi người dùng bấm nút Hủy
  const handleCancel = () => {
    if (bankAccount) {
      // Khôi phục dữ liệu từ state ban đầu
      formik.resetForm({
        values: {
          accountNumber: bankAccount.accountNumber,
          bankName: bankAccount.bankName,
        },
      });
      setIsEditing(false);
    } else {
      // Quay lại trang trước nếu đang thêm mới và hủy
      router.back();
    }

    // Xóa thông báo
    setError(null);
    setSuccess(null);
  };

  // Hàm xử lý khi người dùng bấm nút Chỉnh sửa
  const handleEdit = () => {
    setIsEditing(true);
    setError(null);
    setSuccess(null);
  };

  // Render giao diện tải khi đang loading
  if (loading && !bankAccount) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066cc" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>← Quay lại</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Quản lý tài khoản ngân hàng</Text>
        </View> */}

        {/* Hiển thị thông báo lỗi nếu có */}
        {error && (
          <View style={styles.alertError}>
            <Text style={styles.alertText}>{error}</Text>
          </View>
        )}

        {/* Hiển thị thông báo thành công nếu có */}
        {success && (
          <View style={styles.alertSuccess}>
            <Text style={styles.alertText}>{success}</Text>
          </View>
        )}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Thông tin tài khoản ngân hàng</Text>
          <View style={styles.divider} />

          {/* Trường nhập số tài khoản */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Số tài khoản</Text>
            <TextInput
              style={[
                styles.input,
                !isEditing && styles.disabledInput,
                formik.touched.accountNumber &&
                  formik.errors.accountNumber &&
                  styles.inputError,
              ]}
              placeholder="Nhập số tài khoản"
              value={formik.values.accountNumber}
              onChangeText={formik.handleChange("accountNumber")}
              onBlur={formik.handleBlur("accountNumber")}
              editable={isEditing}
              keyboardType="numeric"
            />
            {formik.touched.accountNumber && formik.errors.accountNumber && (
              <Text style={styles.errorText}>
                {formik.errors.accountNumber}
              </Text>
            )}
          </View>

          {/* Trường chọn ngân hàng */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Ngân hàng</Text>
            {isEditing ? (
              <View
                style={[
                  styles.pickerContainer,
                  formik.touched.bankName &&
                    formik.errors.bankName &&
                    styles.inputError,
                ]}
              >
                <Picker
                  selectedValue={formik.values.bankName}
                  onValueChange={(itemValue) =>
                    formik.setFieldValue("bankName", itemValue)
                  }
                  enabled={isEditing}
                  style={styles.picker}
                >
                  <Picker.Item label="Chọn ngân hàng" value="" />
                  {VIETNAMESE_BANKS.map((bank) => (
                    <Picker.Item key={bank} label={bank} value={bank} />
                  ))}
                </Picker>
              </View>
            ) : (
              <Text style={styles.valueText}>
                {formik.values.bankName || "Chưa chọn ngân hàng"}
              </Text>
            )}
            {formik.touched.bankName && formik.errors.bankName && (
              <Text style={styles.errorText}>{formik.errors.bankName}</Text>
            )}
          </View>
        </View>

        {/* Các nút thao tác */}
        <View style={styles.buttonContainer}>
          {isEditing ? (
            <>
              <TouchableOpacity
                onPress={handleCancel}
                style={[styles.button, styles.cancelButton]}
                disabled={saveLoading}
              >
                <Text style={styles.cancelButtonText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => formik.handleSubmit()}
                style={[styles.button, styles.saveButton]}
                disabled={saveLoading}
              >
                {saveLoading ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text style={styles.buttonText}>Lưu thay đổi</Text>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              onPress={handleEdit}
              style={[styles.button, styles.editButton]}
              disabled={loading}
            >
              <Text style={styles.buttonText}>Chỉnh sửa</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContainer: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    marginRight: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: "#0066cc",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  alertError: {
    backgroundColor: "#ffebee",
    padding: 15,
    borderRadius: 5,
    marginBottom: 15,
    borderLeftWidth: 5,
    borderLeftColor: "#f44336",
  },
  alertSuccess: {
    backgroundColor: "#e8f5e9",
    padding: 15,
    borderRadius: 5,
    marginBottom: 15,
    borderLeftWidth: 5,
    borderLeftColor: "#4caf50",
  },
  alertText: {
    fontSize: 14,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginBottom: 15,
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  disabledInput: {
    backgroundColor: "#f5f5f5",
    color: "#666",
  },
  inputError: {
    borderColor: "#f44336",
  },
  errorText: {
    color: "#f44336",
    fontSize: 14,
    marginTop: 5,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    backgroundColor: "#fff",
    minHeight: 50,
    justifyContent: "center",
  },
  picker: {
    minHeight: 50,
  },
  valueText: {
    fontSize: 16,
    padding: 10,
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  button: {
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 120,
  },
  cancelButton: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#dddddd",
  },
  cancelButtonText: {
    color: "#333333",
    fontSize: 16,
    fontWeight: "500",
  },
  saveButton: {
    backgroundColor: "#2196f3",
  },
  editButton: {
    backgroundColor: "#2196f3",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#ffffff",
  },
});
