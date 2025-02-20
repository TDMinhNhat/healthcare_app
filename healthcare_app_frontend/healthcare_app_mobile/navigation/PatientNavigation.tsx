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
import { ProfileScreen } from "../screens/profile/ProfileScreen";
import { EditProfileScreen } from "../screens/profile/EditProfileScreen";
import SearchScreen from "../screens/search/SearchSreen";
import CameraScreen from "../screens/appointment/CameraScreen";
import MapScreen from "../screens/appointment/MapScreen";
import SavedAddressesScreen from "../screens/address/SavedAddressesScreen";
import { SCREENS } from "../constants/constants";

const PatientStack = createNativeStackNavigator({
  screens: {
    [SCREENS.LOGIN]: {
      screen: LoginScreen,
      options: {
        headerShown: false,
      },
    },
    [SCREENS.SIGN_UP]: {
      screen: SignUpScreen,
      options: {
        headerShown: false,
      },
    },
    [SCREENS.ENTER_MAIL]: {
      screen: EnterMail,
      options: {
        headerShown: false,
      },
    },
    [SCREENS.ENTER_OTP]: {
      screen: EnterOTP,
      options: {
        headerShown: false,
      },
    },
    [SCREENS.RESET_PASSWORD]: {
      screen: ResetPassword,
      options: {
        headerShown: false,
      },
    },
    [SCREENS.MAIN]: {
      screen: BottomTabNavigator,
      options: {
        headerShown: false,
      },
    },
    [SCREENS.TOP_DOCTORS]: {
      screen: TopDoctorsScreen,
      options: {
        headerShown: false,
      },
    },
    [SCREENS.FAVORITE_DOCTORS]: {
      screen: FavouriteDoctorsScreen,
      options: {
        headerShown: false,
      },
    },
    [SCREENS.DOCTOR_DETAIL]: {
      screen: DoctorDetailsScreen,
      options: {
        headerShown: false,
      },
    },
    [SCREENS.EDIT_PROFILE]: {
      screen: EditProfileScreen,
      options: {
        headerShown: false,
      },
    },
    [SCREENS.SEARCH]: {
      screen: SearchScreen,
      options: {
        headerShown: false,
      },
    },
    [SCREENS.MAP]: {
      screen: MapScreen,
      options: {
        headerShown: false,
      },
    },
    [SCREENS.CAMERA_DETECT]: {
      screen: CameraScreen,
      options: {
        headerShown: false,
      },
    },
    [SCREENS.SAVED_ADDRESSES]: {
      screen: SavedAddressesScreen,
      options: {
        headerShown: false,
      },
    },
  },
});
export const PatientNavigation = createStaticNavigation(PatientStack);
