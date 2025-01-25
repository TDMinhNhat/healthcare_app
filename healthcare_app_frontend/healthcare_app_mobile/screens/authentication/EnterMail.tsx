import {
  NavigationProp,
  ParamListBase,
  useNavigation,
  useTheme,
} from "@react-navigation/native";
import { useState } from "react";
import { Text, View } from "react-native";
import Layout from "../Layout";
import HeaderAuthentication from "./HeaderAuthentication";
import i18n from "../../utils/locales/i18n";
import { Formik } from "formik";
import * as Yup from "yup";
import TextInput from "../../components/TextInput";
import Button from "../../components/Button";

export default function EnterMail() {
  const navigation: NavigationProp<ParamListBase> = useNavigation();
  const { colors } = useTheme();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  //   const resetPassword = async () => {
  //     try {
  //       setMessage("");
  //       setError("");
  //       setLoading(true);
  //       await auth.sendPasswordResetEmail(email);
  //       setMessage("Check your inbox for further instructions");
  //     } catch {
  //       setError("Failed to reset password");
  //     }
  //     setLoading(false);
  //   };

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
        initialValues={{ email: "a@gmail.com" }}
        validationSchema={Yup.object({
          email: Yup.string().email().required("Required"),
        })}
        onSubmit={(values) => {
          setEmail(values.email);
          //   resetPassword();
          navigation.navigate("EnterOTP");
        }}
      >
        {({ handleSubmit }) => (
          <View
            style={{
              width: "100%",
              gap: 20,
              flex: 1,
            }}
          >
            <TextInput
              name="email"
              label="Email"
              placeholder={i18n.t("enterEmail")}
            />
            <Button title={i18n.t("confirm")} onPress={() => handleSubmit()} />
          </View>
        )}
      </Formik>
    </Layout>
  );
}
