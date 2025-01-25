import { createStaticNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/authentication/LoginScreen";
import SignUpScreen from "../screens/authentication/SignUpScreen";
import HomeScreen from "../screens/home/HomeScreen";
import EnterOTP from "../screens/authentication/EnterOTP";
import EnterMail from "../screens/authentication/EnterMail";
import ResetPassword from "../screens/authentication/ResetPassword";

const PatientStack = createNativeStackNavigator({
  screens: {
    Login: {
      screen: LoginScreen,
      options: {
        headerShown: false,
      },
    },
    SignUp: {
      screen: SignUpScreen,
      options: {
        headerShown: false,
      },
    },
    EnterMail: {
      screen: EnterMail,
      options: {
        headerShown: false,
      },
    },
    EnterOTP: {
      screen: EnterOTP,
      options: {
        headerShown: false,
      },
    },
    ResetPassword: {
      screen: ResetPassword,
      options: {
        headerShown: false,
      },
    },
    Home: {
      screen: HomeScreen,
      options: {
        // headerShown: false,
      },
    },
  },
});
export const PatientNavigation = createStaticNavigation(PatientStack);
