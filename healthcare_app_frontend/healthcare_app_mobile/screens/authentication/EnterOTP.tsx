import {
  NavigationProp,
  ParamListBase,
  useNavigation,
  useTheme,
} from "@react-navigation/native";
import Layout from "../Layout";
import HeaderAuthentication from "./HeaderAuthentication";
import { Text, TouchableOpacity, View } from "react-native";
import i18n from "../../utils/locales/i18n";
import FieldOTP from "../../components/FieldOTP";
import Button from "../../components/Button";
import { useEffect, useState } from "react";
const EXPIRED_TIME = 10; // PHÚT
export default function EnterOTP() {
  const navigation: NavigationProp<ParamListBase> = useNavigation();
  const { colors } = useTheme();
  const handleVerify = () => {
    // Verify OTP
    navigation.navigate("Home");
  };
  const [timeLeft, setTimeLeft] = useState(EXPIRED_TIME); // 3 phút
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleResendOTP = async () => {
    try {
      setIsResending(true);
      // Gọi API resend OTP ở đây
      // await resendOTPApi();

      // Reset countdown
      setTimeLeft(EXPIRED_TIME);
      //  Toast.show({
      //    type: "success",
      //    text1: i18n.t("otpResent"),
      //  });
    } catch (error) {
      //  Toast.show({
      //    type: "error",
      //    text1: i18n.t("otpResendFailed"),
      //  });
    } finally {
      setIsResending(false);
    }
  };

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
          marginVertical: 40,
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
          {i18n.t("enterYourOTP")}
        </Text>
      </View>
      {/* OTP input field */}
      <View
        style={{
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 40,
          gap: 20,
        }}
      >
        <FieldOTP
          length={4}
          onComplete={(otp) => {
            console.log(otp);
            handleVerify(); // truyền otp vào làm tham số
          }}
        />
        <Text
          style={{
            color: timeLeft <= Math.floor(EXPIRED_TIME / 3) ? "red" : "#666",
          }}
        >
          {timeLeft > 0
            ? `${i18n.t("resendOTPin")}: ${Math.floor(timeLeft / 60)}:${(
                timeLeft % 60
              )
                .toString()
                .padStart(2, "0")}` // Format giờ:phút
            : ""}
        </Text>

        {timeLeft === 0 && (
          <TouchableOpacity
            onPress={handleResendOTP}
            disabled={isResending}
            style={{ marginTop: 20 }}
          >
            <Text style={{ color: colors.main.primary }}>
              {isResending ? i18n.t("sending") : i18n.t("resendOTP")}
            </Text>
          </TouchableOpacity>
        )}
        <Button
          title={i18n.t("verify")}
          onPress={() => navigation.navigate("ResetPassword")}
          style={{ width: "100%" }}
        />
      </View>
    </Layout>
  );
}
