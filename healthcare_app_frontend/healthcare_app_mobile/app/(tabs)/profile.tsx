import React from "react";
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
import { useSelector } from "react-redux";

export default function ProfileTab() {
  const user = useSelector((state: any) => state.user.user);

  const handleViewMedicalRecords = () => {
    // Navigate to medical records screen
    // Pass the current user's ID if available
    if (user?.userId) {
      router.push({
        pathname: "/medical-records",
        params: { userId: user.userId },
      });
    } else {
      router.push("/medical-records");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Profile Tab</Text>

        {/* Medical Records Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleViewMedicalRecords}
        >
          <Text style={styles.buttonText}>View Medical Records</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  content: {
    padding: 16,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 24,
  },
  button: {
    backgroundColor: "#0056b3",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
