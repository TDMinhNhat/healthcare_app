import { useMutation } from "@tanstack/react-query";
import { login } from "../services/authService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";

export const useAuthentication = () => {
  const dispatch = useDispatch();
  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      login(email, password),
    onSuccess: (data) => {
      console.log("Login successful:", data.data.token);
      AsyncStorage.setItem("accessToken", data.data.token);
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });

  return {
    loginMutation,
  };
};
