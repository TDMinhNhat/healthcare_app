import { createStaticNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/authentication/LoginScreen";
import SignUpScreen from "../screens/authentication/SignUpScreen";
import HomeScreen from "../screens/home/HomeScreen";
import CameraDetect from "../components/CameraDetect";

const PatientStack = createNativeStackNavigator({
  screens: {
    detect: {
      screen: CameraDetect,
      options: {
        headerShown: false,
      },
    },
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
    Home: {
      screen: HomeScreen,
      options: {
        // headerShown: false,
      },
    },
  },
});
export const PatientNavigation = createStaticNavigation(PatientStack);
