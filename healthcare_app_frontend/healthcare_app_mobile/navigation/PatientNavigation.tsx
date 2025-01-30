import { createStaticNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/authentication/LoginScreen";
import SignUpScreen from "../screens/authentication/SignUpScreen";

import EnterOTP from "../screens/authentication/EnterOTP";
import EnterMail from "../screens/authentication/EnterMail";
import ResetPassword from "../screens/authentication/ResetPassword";
import { HomeScreen } from "../screens/home/HomeScreen";
import BottomTabNavigator from "./BottomTabNavigator";
import { TopDoctorsScreen } from "../screens/top_doctors/TopDoctorsScreen";
import { FavouriteDoctorsScreen } from "../screens/favorite_doctors/FavoriteDoctorsScreen";
import DoctorDetailsScreen from "../screens/doctor_detail/DoctorDetailScreen";

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
    Main: {
      screen: BottomTabNavigator,
      options: {
        headerShown: false,
      },
    },
    TopDoctors: {
      screen: TopDoctorsScreen,
      options: {
        headerShown: false,
      },
    },
    FavoriteDoctors: {
      screen: FavouriteDoctorsScreen,
      options: {
        headerShown: false,
      },
    },
    DoctorDetail: {
      screen: DoctorDetailsScreen,
      options: {
        headerShown: false,
      },
    },
  },
});
export const PatientNavigation = createStaticNavigation(PatientStack);
