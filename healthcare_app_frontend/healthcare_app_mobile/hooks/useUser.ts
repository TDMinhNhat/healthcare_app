import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setUser } from "../store/userSlice";
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from "@react-navigation/native";
import { getUserById } from "../services/authService";

const useUserQuery = (id: string | undefined) => {
  const dispatch = useDispatch();
  const navigation: NavigationProp<ParamListBase> = useNavigation();

  const userQuery = useQuery<any>({
    queryKey: ["user", id],
    queryFn: () => getUserById(id),
    enabled: id !== undefined, // only fetch when id is defined
    staleTime: Infinity, // fresh data is always available, no need to refetch
  });

  useEffect(() => {
    if (userQuery.data?.data) {
      console.log(userQuery.data.data);
      dispatch(setUser(userQuery.data.data));
      navigation.navigate("Home");
    } else if (userQuery.isError) {
      console.log(userQuery.error?.message);
    }
  }, [userQuery, dispatch, navigation]);

  return userQuery;
};

export const useUser = {
  useUserQuery,
};
