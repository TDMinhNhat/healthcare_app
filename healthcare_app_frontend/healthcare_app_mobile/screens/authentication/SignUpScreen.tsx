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
import HeaderAuthentication from "./HeaderAuthentication";
export default function SignUpScreen() {
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
          {i18n.t("registerYourNewAccount")}
        </Text>
        <Text
          style={{
            marginTop: 10,
            marginBottom: 40,
            fontSize: 16,
          }}
        >
          {i18n.t("enterYourInformationBelow")}
        </Text>
      </View>
      <Formik
        initialValues={{ name: "", email: "", password: "" }}
        validationSchema={Yup.object({
          name: Yup.string().required("Required"),
          email: Yup.string().email().required("Required"),
          password: Yup.string().required("Required"),
        })}
        onSubmit={(values) => {
          const { name, email, password } = values;
          console.log(name, email, password);
        }}
      >
        {({ handleSubmit }) => (
          <View style={{ width: "100%", gap: 20 }}>
            <TextInput
              name="name"
              label="Name"
              placeholder={i18n.t("enterName")}
            />
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
                alignItems: "center",
                gap: 10,
              }}
            >
              <Checkbox
                style={{}}
                value={isChecked}
                onValueChange={setChecked}
                color={colors.main.primary}
              />
              <Text
                style={{
                  color: colors.textIcon.contentPrimary,
                  flexShrink: 1,
                  flex: 1,
                }}
              >
                {i18n.t("byCreateAnAccount")}
              </Text>
            </View>
            <Button title="Login" onPress={() => handleSubmit()} />
          </View>
        )}
      </Formik>

      <View style={{ flexDirection: "row", marginTop: 20, gap: 5 }}>
        <Text>{i18n.t("alreadyHaveAnAccount")}</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={{ color: colors.main.primary }}>{i18n.t("login")}</Text>
        </TouchableOpacity>
      </View>
    </Layout>
  );
}
