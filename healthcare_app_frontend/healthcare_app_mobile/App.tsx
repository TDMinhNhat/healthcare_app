import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { theme } from "./theme/theme";
import { PatientNavigation } from "./navigation/PatientNavigation";
import { DoctorNavigation } from "./navigation/DoctorNavigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { store } from "./store/store";

const queryClient = new QueryClient();

export default function App() {
  const userRole = "patient";

  if (userRole === "patient") {
    return (
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <PatientNavigation theme={theme} />
        </Provider>
      </QueryClientProvider>
    );
  }
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <DoctorNavigation theme={theme} />
      </Provider>
    </QueryClientProvider>
  );
}
