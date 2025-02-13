import { createStaticNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/authentication/LoginScreen";
import SignUpScreen from "../screens/authentication/SignUpScreen";

const DoctorStack = createNativeStackNavigator({
  screens: {
    Login: LoginScreen,
    SignUp: {
      screen: SignUpScreen,
    },
  },
});
export const DoctorNavigation = createStaticNavigation(DoctorStack);
