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
        <Stack.Screen
          name={"appointment-details"}
          options={{
            headerShown: false,
            presentation: "card",
          }}
        />
        <Stack.Screen
          name={"waiting-room"}
          options={{
            headerShown: false,
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name={"book_appointment"}
          options={{
            title: "Đặt lịch khám bệnh",
            headerShown: true,
            presentation: "card",
          }}
        />
        {/* <Stack.Screen
          name={"medical-records"}
          options={{
            title: "Hồ sơ bệnh án",
            presentation: "card",
          }}
        /> */}
        <Stack.Screen
          name={"emergency"}
          options={{
            title: "Cấp cứu",
            headerShown: true,
            presentation: "card",
          }}
        />
        <Stack.Screen
          name={"medical-record-details"}
          options={{
            title: "Hồ sơ bệnh án",
            presentation: "card",
          }}
        />
      </Stack>
    </Provider>
  );
}
