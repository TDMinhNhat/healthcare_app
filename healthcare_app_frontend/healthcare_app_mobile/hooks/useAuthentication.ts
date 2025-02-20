import { useMutation } from "@tanstack/react-query";
import { login, signUp } from "../services/authService";
import { useDispatch } from "react-redux";
import { setUser } from "../store/userSlice";
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from "@react-navigation/native";
import { SCREENS } from "../constants/constants";

export const useAuthentication = () => {
  const dispatch = useDispatch();
  const navigation: NavigationProp<ParamListBase> = useNavigation();

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      login(email, password),
    onSuccess: (data) => {
      dispatch(setUser(data.data.user));
      navigation.navigate("Main");
    },
    onError: (error) => {
      console.error("Login failed:", error);
      return error;
    },
  });

  const signUpMutation = useMutation({
    mutationFn: ({
      firstName,
      lastName,
      email,
      password,
      sex,
      dateOfBirth,
    }: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      sex: boolean;
      dateOfBirth: Date;
    }) => signUp(firstName, lastName, email, password, sex, dateOfBirth),
    onSuccess: (response) => {
      // You can check response data here
      console.log("Sign up response:", response);
      if (response.data.success) {
        navigation.navigate(SCREENS.LOGIN);
      }
      return response;
    },
    onError: (error) => {
      console.error("Sign up failed:", error);
      return error;
    },
  });

  return {
    loginMutation,
    signUpMutation,
  };
};
