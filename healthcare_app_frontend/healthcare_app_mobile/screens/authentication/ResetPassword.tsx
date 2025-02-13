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
import { useState } from "react";
import Modal from "../../components/Modal";

export default function ResetPassword() {
  const navigation: NavigationProp<ParamListBase> = useNavigation();
  const { colors } = useTheme();
  const [showToast, setShowToast] = useState(false);

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
            textAlign: "center",
          }}
        >
          {i18n.t("enterEmailToSendOTP")}
        </Text>
      </View>
      <Formik
        initialValues={{ password: "123456", confirmPassword: "123456" }}
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
          setShowToast(true);
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
      {showToast && (
        <Modal
          visible={showToast}
          type="success"
          title={i18n.t("resetPasswordSuccess")}
          message={i18n.t("yourPasswordHasBeenChanged")}
          buttonText={i18n.t("goToHome")}
          onClose={() => setShowToast(false)}
        />
      )}
    </Layout>
  );
}
