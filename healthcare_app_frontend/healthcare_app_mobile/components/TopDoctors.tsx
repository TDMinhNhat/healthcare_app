import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { DoctorCard } from "./DoctorCard";

const doctors = [
  {
    id: "1",
    name: "Dr. Uroos Fatima",
    specialty: "Psychiatrist",
    qualifications: "MBBS, MD",
    rating: 4.8,
    imageUrl: "https://picsum.photos/200",
  },
  {
    id: "2",
    name: "Dr. Sarah Wilson",
    specialty: "Cardiologist",
    qualifications: "MBBS, MD, DM",
    rating: 4.9,
    imageUrl: "/placeholder.svg?height=160&width=160",
  },
];

export const TopDoctors = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Top Doctors</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>
      {doctors.map((doctor) => (
        <DoctorCard key={doctor.id} {...doctor} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  seeAll: {
    color: "#5B21B6",
    fontWeight: "500",
  },
});
