import { createStaticNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/authentication/LoginScreen";
import SignUpScreen from "../screens/authentication/SignUpScreen";
import HomeScreen from "../screens/home/HomeScreen";
import ResetPass from "../screens/authentication/ResetPass";

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
    ResetPass: {
      screen: ResetPass,
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
