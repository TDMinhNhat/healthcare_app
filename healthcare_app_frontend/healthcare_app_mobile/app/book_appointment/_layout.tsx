import { Stack } from "expo-router";
import React from "react";
import { StatusBar } from "react-native";

export default function BookAppointmentLayout() {
  return (
    <>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "#ffffff",
          },
          headerTintColor: "#26b9c8",
          headerTitleStyle: {
            fontWeight: "600",
          },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
            title: "Đặt lịch khám",
          }}
        />
        <Stack.Screen
          name="date-time-selection"
          options={{
            headerShown: false,
            title: "Chọn ngày giờ khám",
            presentation: "card",
          }}
        />
        <Stack.Screen
          name="payment-checkout"
          options={{
            headerShown: false,
            title: "Thanh toán",
            presentation: "card",
          }}
        />
        <Stack.Screen
          name="confirmation"
          options={{
            headerShown: false,
            title: "Xác nhận đặt lịch",
            headerBackVisible: false,
            gestureEnabled: false,
          }}
        />
      </Stack>
    </>
  );
}
