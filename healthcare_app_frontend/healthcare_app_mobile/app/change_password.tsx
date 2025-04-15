import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Formik } from "formik";
import * as Yup from "yup";
import { Ionicons } from "@expo/vector-icons";
import { updateInfo } from "../services/authenticate/user_service";
import { setUser } from "../redux/slices/userSlice";
import { router } from "expo-router";

const ChangePasswordSchema = Yup.object().shape({
  oldPassword: Yup.string().required("Vui lòng nhập mật khẩu cũ"),
  newPassword: Yup.string()
    .min(6, "Mật khẩu mới phải có ít nhất 6 ký tự")
    .required("Vui lòng nhập mật khẩu mới"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword"), null], "Mật khẩu xác nhận không khớp")
    .required("Vui lòng xác nhận mật khẩu mới"),
});

export default function ChangePasswordScreen() {
  const user = useSelector((state: any) => state.user.user);
  const dispatch = useDispatch();
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleChangePassword = async (values: any, { resetForm }: any) => {
    setAlert(null);
    setIsSubmitting(true);
    try {
      if (!user?.password || values.oldPassword !== user.password) {
        setAlert({ type: "error", message: "Mật khẩu cũ không đúng." });
        setIsSubmitting(false);
        return;
      }
      const apiData = { ...user, password: values.newPassword };
      const response = await updateInfo(user.userId, apiData);
      if (response.data && response.data.code === 200) {
        const updatedUser = {
          ...user,
          ...response.data.data,
          password: values.newPassword,
        };
        dispatch(setUser(updatedUser));
        setAlert({ type: "success", message: "Đổi mật khẩu thành công!" });
        resetForm();
        setTimeout(() => {
          router.back();
        }, 1000);
      } else {
        setAlert({
          type: "error",
          message: response.data?.message || "Đổi mật khẩu thất bại.",
        });
      }
    } catch (error) {
      setAlert({ type: "error", message: "Có lỗi xảy ra. Vui lòng thử lại." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Đổi mật khẩu</Text>
        {alert && (
          <View
            style={[
              styles.alert,
              alert.type === "success" ? styles.success : styles.error,
            ]}
          >
            <Text style={styles.alertText}>{alert.message}</Text>
          </View>
        )}
        <Formik
          initialValues={{
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
          }}
          validationSchema={ChangePasswordSchema}
          onSubmit={handleChangePassword}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <View>
              {/* Mật khẩu cũ */}
              <Text style={styles.label}>Mật khẩu cũ</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  secureTextEntry={!showOld}
                  value={values.oldPassword}
                  onChangeText={handleChange("oldPassword")}
                  onBlur={handleBlur("oldPassword")}
                  placeholder="Nhập mật khẩu cũ"
                />
                <TouchableOpacity
                  onPress={() => setShowOld((s) => !s)}
                  style={styles.eyeButton}
                >
                  <Ionicons
                    name={showOld ? "eye-off" : "eye"}
                    size={22}
                    color="#555"
                  />
                </TouchableOpacity>
              </View>
              {touched.oldPassword && errors.oldPassword && (
                <Text style={styles.errorText}>{errors.oldPassword}</Text>
              )}

              {/* Mật khẩu mới */}
              <Text style={styles.label}>Mật khẩu mới</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  secureTextEntry={!showNew}
                  value={values.newPassword}
                  onChangeText={handleChange("newPassword")}
                  onBlur={handleBlur("newPassword")}
                  placeholder="Nhập mật khẩu mới"
                />
                <TouchableOpacity
                  onPress={() => setShowNew((s) => !s)}
                  style={styles.eyeButton}
                >
                  <Ionicons
                    name={showNew ? "eye-off" : "eye"}
                    size={22}
                    color="#555"
                  />
                </TouchableOpacity>
              </View>
              {touched.newPassword && errors.newPassword && (
                <Text style={styles.errorText}>{errors.newPassword}</Text>
              )}

              {/* Xác nhận mật khẩu mới */}
              <Text style={styles.label}>Xác nhận mật khẩu mới</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  secureTextEntry={!showConfirm}
                  value={values.confirmPassword}
                  onChangeText={handleChange("confirmPassword")}
                  onBlur={handleBlur("confirmPassword")}
                  placeholder="Nhập lại mật khẩu mới"
                />
                <TouchableOpacity
                  onPress={() => setShowConfirm((s) => !s)}
                  style={styles.eyeButton}
                >
                  <Ionicons
                    name={showConfirm ? "eye-off" : "eye"}
                    size={22}
                    color="#555"
                  />
                </TouchableOpacity>
              </View>
              {touched.confirmPassword && errors.confirmPassword && (
                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
              )}

              <TouchableOpacity
                style={[styles.button, isSubmitting && styles.buttonDisabled]}
                onPress={() => handleSubmit()}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Đổi mật khẩu</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    justifyContent: "center",
  },
  content: {
    marginHorizontal: 24,
    padding: 24,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 18,
    textAlign: "center",
    color: "#0056b3",
  },
  label: {
    fontSize: 15,
    marginTop: 12,
    marginBottom: 5,
    color: "#333",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 2,
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: "#333",
  },
  eyeButton: {
    padding: 8,
  },
  button: {
    backgroundColor: "#26b9c8",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 24,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  errorText: {
    color: "#ff6b6b",
    fontSize: 12,
    marginBottom: 2,
    marginLeft: 2,
  },
  alert: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  success: {
    backgroundColor: "#e0f7fa",
  },
  error: {
    backgroundColor: "#ffebee",
  },
  alertText: {
    color: "#333",
    fontSize: 15,
    textAlign: "center",
  },
});
