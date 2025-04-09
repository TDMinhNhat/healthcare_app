import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useState } from "react";
import { Link, useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import AuthenticateService from "../services/authenticate/authenticateService";
import { setUser } from "@/redux/slices/userSlice";
import { useDispatch } from "react-redux";
import { Formik } from "formik";
import * as Yup from "yup";
import * as encoding from "text-encoding";

// Define validation schema using Yup
const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Email không hợp lệ").required("Email là bắt buộc"),
  password: Yup.string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .required("Mật khẩu là bắt buộc"),
});

export default function HomeScreen() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogin = async (values: { email: string; password: string }) => {
    const result = await new AuthenticateService()
      .checkLogin(values.email, values.password)
      .then((response) => response.data)
      .catch((error) => {
        console.log(error);
        return null;
      });

    if (result === null) {
      Alert.alert("Lỗi", "Server có lỗi");
    } else if (result.code === 200) {
      Alert.alert("Thành công", "Đăng Nhập Thành Công");
      console.log("result", result.data.user);
      dispatch(setUser(result.data.user));
      router.navigate({
        pathname: "/(tabs)/dashboard",
        params: result.data,
      });
    } else {
      Alert.alert("Thất bại", "Đăng Nhập Thất Bại");
    }
  };

  return (
    <Formik
      initialValues={{
        email: "tdminhnhat13092003@gmail.com",
        password: "123456789",
      }}
      validationSchema={LoginSchema}
      onSubmit={handleLogin}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
      }) => (
        <SafeAreaView style={style.main}>
          <View style={style.container}>
            <View>
              <Text style={style.title}>ĐĂNG NHẬP</Text>
            </View>
            <View style={style.itemArea}>
              <TextInput
                inputMode={"email"}
                value={values.email}
                placeholder={"Nhập tài khoản email"}
                onChangeText={handleChange("email")}
                onBlur={() => {
                  handleBlur("email");
                  if (touched.email && errors.email) {
                    Alert.alert("Lỗi", errors.email);
                  }
                }}
                style={style.input}
              />
            </View>
            <View style={style.itemAreaPassword}>
              <TextInput
                secureTextEntry={!showPassword}
                value={values.password}
                placeholder={"Nhập mật khẩu"}
                onChangeText={handleChange("password")}
                onBlur={() => {
                  handleBlur("password");
                  if (touched.password && errors.password) {
                    Alert.alert("Lỗi", errors.password);
                  }
                }}
                style={style.inputPassword}
              />
              <MaterialCommunityIcons
                name={showPassword ? "eye-off" : "eye"}
                size={24}
                color="#aaa"
                style={style.togglePassword}
                onPress={() => setShowPassword(!showPassword)}
              />
            </View>
            <View style={style.itemArea}>
              <Link href={"/register"}>
                <View>
                  <Text style={style.buttonDirectLink}>Tạo Tài Khoản</Text>
                </View>
              </Link>
              <Link href={"/forgot_password"}>
                <View>
                  <Text style={style.buttonDirectLink}>Quên Mật Khẩu</Text>
                </View>
              </Link>
            </View>
            <View style={style.itemArea}>
              <TouchableOpacity
                style={style.button}
                onPress={() => {
                  // Validate manually before submitting
                  if (errors.email) {
                    Alert.alert("Lỗi", errors.email);
                    return;
                  }
                  if (errors.password) {
                    Alert.alert("Lỗi", errors.password);
                    return;
                  }
                  handleSubmit();
                }}
              >
                <Text style={style.buttonText}>Đăng Nhập</Text>
              </TouchableOpacity>
            </View>

            <View style={style.itemArea}>
              <TouchableOpacity
                style={style.button}
                onPress={() => router.push("/emergency")}
              >
                <Text style={style.buttonText}>Khẩn cấp</Text>
              </TouchableOpacity>
            </View>
            <View style={style.itemArea}>
              <View style={{ width: "100%" }}>
                <Text style={{ textAlign: "center" }}>Hoặc</Text>
              </View>
            </View>
            <View style={[style.itemArea, style.socialButtonArea]}>
              <Pressable style={[style.socialButton, { borderColor: "blue" }]}>
                <FontAwesome5 name="facebook" size={24} color="blue" />
                <Text style={[style.socialButtonText, { color: "blue" }]}>
                  Facebook
                </Text>
              </Pressable>
              <Pressable
                style={[style.socialButton, { borderColor: "orange" }]}
              >
                <FontAwesome name="google" size={24} color="orange" />
                <Text style={[style.socialButtonText, { color: "orange" }]}>
                  Google
                </Text>
              </Pressable>
              <Pressable style={[style.socialButton, { borderColor: "black" }]}>
                <FontAwesome name="apple" size={24} color="black" />
                <Text style={[style.socialButtonText, { color: "black" }]}>
                  Apple
                </Text>
              </Pressable>
            </View>
          </View>
        </SafeAreaView>
      )}
    </Formik>
  );
}

const style = StyleSheet.create({
  main: {
    width: "100%",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    width: "85%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
  },
  itemArea: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
  },
  itemAreaPassword: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
    width: "100%",
    borderStyle: "solid",
    borderColor: "black",
    borderWidth: 1,
  },
  input: {
    width: "100%",
    borderStyle: "solid",
    borderColor: "black",
    borderWidth: 1,
    padding: 8,
  },
  inputPassword: {
    width: "90%",
    padding: 8,
  },
  togglePassword: {
    marginRight: 10,
  },
  buttonDirectLink: {
    color: "#26b9c8",
    textDecorationLine: "underline",
  },
  button: {
    backgroundColor: "#26b9c8",
    padding: 10,
    width: "100%",
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
  },
  socialButtonArea: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  socialButton: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderStyle: "solid",
    borderWidth: 1,
    padding: 10,
  },
  socialButtonText: {
    marginLeft: 5,
  },
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    marginTop: 5,
    alignSelf: "flex-start",
    fontSize: 12,
  },
});
