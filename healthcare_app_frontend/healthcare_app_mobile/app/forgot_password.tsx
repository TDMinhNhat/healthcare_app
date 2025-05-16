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
import * as Yup from "yup";
import { Formik } from "formik";
import { resetPassword } from "../services/authenticate/auth_service";
import { useRouter } from "expo-router";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Địa chỉ email không hợp lệ")
    .required("Email là bắt buộc"),
});

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const router = useRouter();

  if (isSubmitted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.successContainer}>
          <Text style={styles.successTitle}>
            Yêu cầu đặt lại mật khẩu đã được gửi!
          </Text>
          <Text style={styles.successMessage}>
            Chúng tôi đã gửi mật khẩu mới đến email {submittedEmail}. Vui lòng
            kiểm tra hộp thư của bạn.
          </Text>
          <TouchableOpacity
            style={[styles.button, styles.fullWidthButton]}
            onPress={() => router.replace("/")}
          >
            <Text style={styles.buttonText}>Quay lại</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Formik
        initialValues={{ email: "" }}
        validationSchema={validationSchema}
        onSubmit={async (values) => {
          try {
            setIsLoading(true);
            const response = await resetPassword(values.email);

            if (response.data.code === 200 && response.data.data === true) {
              setSubmittedEmail(values.email);
              setIsSubmitted(true);
              Alert.alert(
                "Thành công",
                "Mật khẩu mới đã được gửi đến email của bạn!"
              );
            } else {
              Alert.alert(
                "Lỗi",
                response.data.message || "Không thể đặt lại mật khẩu."
              );
            }
          } catch (error) {
            console.error("Lỗi khi đặt lại mật khẩu:", error);
            Alert.alert("Lỗi", "Đã xảy ra lỗi. Vui lòng thử lại sau.");
          } finally {
            setIsLoading(false);
          }
        }}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <View style={styles.formContainer}>
            <Text style={styles.title}>Quên mật khẩu</Text>
            <Text style={styles.instructions}>
              Nhập email của bạn để nhận mật khẩu mới
            </Text>

            <TextInput
              style={[
                styles.input,
                touched.email && errors.email ? styles.inputError : null,
              ]}
              placeholder="Địa chỉ Email"
              keyboardType="email-address"
              value={values.email}
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
            />
            {touched.email && errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}

            <TouchableOpacity
              style={[
                styles.button,
                styles.fullWidthButton,
                isLoading && styles.buttonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Gửi yêu cầu</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </Formik>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#f8f8f8",
  },
  formContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  instructions: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  inputError: {
    borderColor: "#ff6b6b",
  },
  errorText: {
    color: "#ff6b6b",
    fontSize: 12,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#26b9c8",
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  successContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  successMessage: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  fullWidthButton: {
    width: "100%",
  },
});
