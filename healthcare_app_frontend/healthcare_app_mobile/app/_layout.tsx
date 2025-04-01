import { store } from "@/redux/store";
import { Stack } from "expo-router";
import { Provider } from "react-redux";

export default function Layout() {
  return (
    <Provider store={store}>
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name={"index"}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name={"forgot_password"}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name={"register"}
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </Provider>
  );
}
