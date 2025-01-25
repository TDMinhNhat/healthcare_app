import {
  NavigationProp,
  ParamListBase,
  useNavigation,
  useTheme,
} from "@react-navigation/native";
import Layout from "../Layout";
import HeaderAuthentication from "./HeaderAuthentication";
import { Text, View } from "react-native";
import i18n from "../../utils/locales/i18n";
import { Formik } from "formik";
import * as Yup from "yup";
import Button from "../../components/Button";
import TextInput from "../../components/TextInput";

export default function ResetPassword() {
  const navigation: NavigationProp<ParamListBase> = useNavigation();
  const { colors } = useTheme();
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
      <HeaderAuthentication />
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
            textAlign: "center",
          }}
        >
          {i18n.t("resetPassword")}
        </Text>
        <Text
          style={{
            marginTop: 10,
            marginBottom: 40,
            fontSize: 16,
          }}
        >
          {i18n.t("enterEmailToSendOTP")}
        </Text>
      </View>
      <Formik
        initialValues={{ password: "", confirmPassword: "" }}
        validationSchema={Yup.object({
          password: Yup.string()
            .min(6, "Password must be at least 6 characters")
            .required("Required"),
          confirmPassword: Yup.string()
            .oneOf([Yup.ref("password"), undefined], "Passwords must match") // undefined để khi không có giá trị thì nó không bị fail
            .required("Required"),
        })}
        onSubmit={(values) => {
          console.log(values);
          navigation.navigate("Home");
        }}
      >
        {({ handleSubmit }) => (
          <View style={{ width: "100%", gap: 20 }}>
            <TextInput
              name="password"
              label="Password"
              placeholder={i18n.t("enterPassword")}
            />
            <TextInput
              name="confirmPassword"
              label="Confirm Password"
              placeholder={i18n.t("confirmPassword")}
            />
            <Button title={i18n.t("register")} onPress={() => handleSubmit()} />
          </View>
        )}
      </Formik>
    </Layout>
  );
}
