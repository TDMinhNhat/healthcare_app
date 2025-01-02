import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { theme } from "./theme/theme";
import { PatientNavigation } from "./navigation/PatientNavigation";
import { DoctorNavigation } from "./navigation/DoctorNavigation";

export default function App() {
  const userRole = "patient";

  if (userRole === "patient") {
    return <PatientNavigation theme={theme} />;
  }
  return <DoctorNavigation theme={theme} />;
}
