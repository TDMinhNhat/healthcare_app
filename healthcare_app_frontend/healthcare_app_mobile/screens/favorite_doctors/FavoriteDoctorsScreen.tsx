import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { DoctorCard } from "../../components/DoctorCard";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "../../components/BackButton";
import Header from "../../components/Header";

const favouriteDoctors = [
  {
    id: "1",
    name: "Dr. Mimi Deb Jhilik",
    specialty: "Acupuncture",
    qualifications: "MBBS, MD",
    rating: 4.8,
    imageUrl: "/placeholder.svg?height=160&width=160",
    isBookmarked: true,
  },
  {
    id: "2",
    name: "Dr. Snigdha Roy",
    specialty: "Colonoscopy",
    qualifications: "MBBS, MD",
    rating: 4.8,
    imageUrl: "/placeholder.svg?height=160&width=160",
    isBookmarked: true,
  },
];

export const FavouriteDoctorsScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Header title="Favourite Doctors" />

      <ScrollView style={styles.doctorsContainer}>
        {favouriteDoctors.map((doctor) => (
          <DoctorCard key={doctor.id} {...doctor} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  doctorsContainer: {
    paddingHorizontal: 16,
  },
});
