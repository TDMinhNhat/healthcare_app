import {
  NavigationProp,
  ParamListBase,
  useNavigation,
  useTheme,
} from "@react-navigation/native";
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Platform,
} from "react-native";
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
import { SCREENS } from "../../constants/constants";
import { useAuthentication } from "../../hooks/useAuthentication";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function SignUpScreen() {
  const navigation: NavigationProp<ParamListBase> = useNavigation();
  const { colors } = useTheme();
  const [isChecked, setChecked] = useState(false);
  const { signUpMutation } = useAuthentication();
  const [error, setError] = useState<string | null>(null);
  const [sex, setSex] = useState(true); // true for male, false for female
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleNavigateLogin = () => {
    navigation.navigate(SCREENS.LOGIN);
  };

  const formatDate = (date: Date) => {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  return (
    <Layout
      style={{
        // height: "100%",
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
          {i18n.t("registerAccount")}
        </Text>
        <Text
          style={{
            marginTop: 10,
            marginBottom: 40,
            fontSize: 16,
            textAlign: "center",
            alignSelf: "center",
          }}
        >
          {i18n.t("enterYourInformationBelow")}
        </Text>
      </View>

      <Formik
        initialValues={{
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          dateOfBirth: new Date(),
        }}
        validationSchema={Yup.object({
          firstName: Yup.string().required("Required"),
          lastName: Yup.string().required("Required"),
          email: Yup.string().email().required("Required"),
          password: Yup.string()
            .required("Required")
            .min(8, "Password must be at least 8 characters"),
          dateOfBirth: Yup.date().required("Required"),
        })}
        onSubmit={(values) => {
          if (!isChecked) {
            setError("Please accept the terms and conditions");
            return;
          }
          setError(null);
          const { firstName, lastName, email, password, dateOfBirth } = values;
          signUpMutation.mutate({
            firstName,
            lastName,
            email,
            password,
            sex,
            dateOfBirth,
          });
        }}
      >
        {({ handleSubmit, values, setFieldValue }) => (
          <View style={{ width: "100%", gap: 20 }}>
            <TextInput
              name="firstName"
              label="First Name"
              placeholder={i18n.t("enterName")}
            />
            <TextInput
              name="lastName"
              label="Last Name"
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

            <View>
              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                Date of Birth
              </Text>
              <TouchableOpacity
                style={{
                  padding: 12,
                  borderWidth: 1,
                  borderColor: "#E5E7EB",
                  borderRadius: 8,
                }}
                onPress={() => setShowDatePicker(true)}
              >
                <Text>{formatDate(values.dateOfBirth)}</Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={values.dateOfBirth}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(Platform.OS === "ios");
                    if (selectedDate) {
                      setFieldValue("dateOfBirth", selectedDate);
                    }
                  }}
                />
              )}
            </View>

            <View>
              <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
                Gender
              </Text>
              <View style={{ flexDirection: "row", gap: 12 }}>
                <TouchableOpacity
                  style={{
                    paddingVertical: 8,
                    paddingHorizontal: 24,
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: sex ? "#5B21B6" : "#E5E7EB",
                    backgroundColor: sex ? "#5B21B6" : "transparent",
                  }}
                  onPress={() => setSex(true)}
                >
                  <Text style={{ color: sex ? "#fff" : "#666" }}>Male</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    paddingVertical: 8,
                    paddingHorizontal: 24,
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: !sex ? "#5B21B6" : "#E5E7EB",
                    backgroundColor: !sex ? "#5B21B6" : "transparent",
                  }}
                  onPress={() => setSex(false)}
                >
                  <Text style={{ color: !sex ? "#fff" : "#666" }}>
                    Female
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
              }}
            >
              <Checkbox
                value={isChecked}
                onValueChange={(value) => {
                  setChecked(value);
                  setError(null);
                }}
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

            {error && (
              <Text style={{ color: "red", textAlign: "center" }}>{error}</Text>
            )}

            {signUpMutation.error && (
              <Text style={{ color: "red", textAlign: "center" }}>
                {signUpMutation.error.message}
              </Text>
            )}

            <Button
              title={
                signUpMutation.isPending ? "Loading..." : i18n.t("register")
              }
              onPress={() => handleSubmit()}
              disabled={signUpMutation.isPending}
            />

            {signUpMutation.isPending && (
              <ActivityIndicator color={colors.main.primary} />
            )}
          </View>
        )}
      </Formik>

      <View
        style={{
          flexDirection: "row",
          marginTop: 20,
          gap: 5,
        }}
      >
        <Text>{i18n.t("alreadyHaveAnAccount")}</Text>
        <TouchableOpacity onPress={handleNavigateLogin}>
          <Text style={{ color: colors.main.primary }}>{i18n.t("login")}</Text>
        </TouchableOpacity>
      </View>
    </Layout>
  );
}
