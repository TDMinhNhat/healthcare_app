import {
  NavigationProp,
  ParamListBase,
  useNavigation,
  useTheme,
} from "@react-navigation/native";
import { Image, Text, TouchableOpacity, View } from "react-native";
import Button from "../../components/Button";
import { Formik } from "formik";
import * as Yup from "yup";
import TextInput from "../../components/TextInput";
import i18n from "../../utils/locales/i18n";
import Layout from "../Layout";
import { useState } from "react";
import Checkbox from "expo-checkbox";
import IconButton from "../../components/IconButton";
export default function LoginScreen() {
  const navigation: NavigationProp<ParamListBase> = useNavigation();
  const { colors } = useTheme();
  const [isChecked, setChecked] = useState(false);
  return (
    <Layout
      style={{
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: "#fff",
      }}
    >
      <View
        style={{
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 40,
        }}
      >
        <Text
          style={{
            fontSize: 34,
            fontWeight: "bold",
            color: colors.main.primary,
          }}
        >
          {i18n.t("welcomeMessage")}
        </Text>
        <Text
          style={{
            marginTop: 10,
            marginBottom: 40,
            fontSize: 16,
          }}
        >
          {i18n.t("loginMessage")}
        </Text>
      </View>
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={Yup.object({
          email: Yup.string().email().required("Required"),
          password: Yup.string().required("Required"),
        })}
        onSubmit={(values) => {
          const { email, password } = values;
          console.log(email, password);
        }}
      >
        {({ handleSubmit }) => (
          <View style={{ width: "100%", gap: 20 }}>
            <TextInput
              name="email"
              label="Email"
              placeholder={i18n.t("enterEmail")}
            />
            <TextInput
              name="password"
              label="Password"
              placeholder={i18n.t("enterPassword")}
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
              >
                <Checkbox
                  style={{}}
                  value={isChecked}
                  onValueChange={setChecked}
                  color={colors.main.primary}
                />
                <Text style={{ color: colors.textIcon.contentPrimary }}>
                  {i18n.t("rememberMe")}
                </Text>
              </View>
              <TouchableOpacity>
                <Text style={{ color: colors.main.primary }}>
                  {i18n.t("forgotPassword")}
                </Text>
              </TouchableOpacity>
            </View>
            <Button title="Login" onPress={() => handleSubmit()} />
          </View>
        )}
      </Formik>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginVertical: 20,
          width: "100%",
        }}
      >
        <View style={{ flex: 1, height: 0.5, backgroundColor: "black" }} />
        <View>
          <Text style={{ width: 40, textAlign: "center" }}>or</Text>
        </View>
        <View style={{ flex: 1, height: 0.5, backgroundColor: "black" }} />
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          width: "100%",
        }}
      >
        <IconButton
          onPress={() => console.log("login with facebook")}
          icon={
            <Image
              source={require("../../assets/icons/facebook.png")}
              style={{ width: 30, height: 30 }}
            />
          }
        />
        <IconButton
          onPress={() => console.log("login with google")}
          icon={
            <Image
              source={require("../../assets/icons/google.png")}
              style={{ width: 30, height: 30 }}
            />
          }
        />
        <IconButton
          onPress={() => console.log("login with microsoft")}
          icon={
            <Image
              source={require("../../assets/icons/microsoft.png")}
              style={{ width: 30, height: 30 }}
            />
          }
        />
      </View>

      <View style={{ flexDirection: "row", marginTop: 20, gap: 5 }}>
        <Text>{i18n.t("dontHaveAnAccount")}</Text>
        <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
          <Text style={{ color: colors.main.primary }}>
            {i18n.t("register")}
          </Text>
        </TouchableOpacity>
      </View>
    </Layout>
  );
}
