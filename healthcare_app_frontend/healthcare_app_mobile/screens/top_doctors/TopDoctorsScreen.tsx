import React, { useState, useMemo } from "react";
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
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
  useTheme,
} from "@react-navigation/native";

const specialties = [
  { id: "1", name: "All", isSelected: true },
  { id: "2", name: "Heart", isSelected: false },
  { id: "3", name: "Brain", isSelected: false },
  { id: "4", name: "Dental", isSelected: false },
  { id: "5", name: "Eye", isSelected: false },
  { id: "6", name: "Bone", isSelected: false },
];

const doctors = [
  {
    id: "1",
    name: "Dr. Uroos Fatima",
    specialty: "Heart",
    qualifications: "MBBS, MD - Cardiology",
    rating: 4.3,
    imageUrl: "https://randomuser.me/api/portraits/women/41.jpg",
  },
  {
    id: "2",
    name: "Dr. Sarah Wilson",
    specialty: "Brain",
    qualifications: "MBBS, MD - Neurology",
    rating: 4.8,
    imageUrl: "https://randomuser.me/api/portraits/women/42.jpg",
  },
  {
    id: "3",
    name: "Dr. John Smith",
    specialty: "Dental",
    qualifications: "BDS, MDS - Dental Surgery",
    rating: 4.5,
    imageUrl: "https://randomuser.me/api/portraits/men/41.jpg",
  },
  {
    id: "4",
    name: "Dr. Mary Johnson",
    specialty: "Eye",
    qualifications: "MBBS, MS - Ophthalmology",
    rating: 4.7,
    imageUrl: "https://randomuser.me/api/portraits/women/43.jpg",
  },
  {
    id: "5",
    name: "Dr. Robert Lee",
    specialty: "Bone",
    qualifications: "MBBS, MS - Orthopedics",
    rating: 4.6,
    imageUrl: "https://randomuser.me/api/portraits/men/42.jpg",
  },
];

export const TopDoctorsScreen = () => {
  const navigation: NavigationProp<ParamListBase> = useNavigation();

  const [selectedSpecialty, setSelectedSpecialty] = useState("All");

  // lưu lại kết quả sau khi filter, chỉ filter lại khi selectedSpecialty thay đổi
  const filteredDoctors = useMemo(() => {
    // dùng useMemo để tối ưu hóa việc render lại
    if (selectedSpecialty === "All") return doctors;
    return doctors.filter((doctor) => doctor.specialty === selectedSpecialty);
  }, [selectedSpecialty]);

  const handleNavigateFavouriteDoctors = () => {
    // Navigate to FavouriteDoctorsScreen
    navigation.navigate("FavoriteDoctors");
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.title}>Top Doctors</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="search" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleNavigateFavouriteDoctors}
          >
            <Ionicons name="bookmark-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView>
        <View style={styles.specialtiesWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.specialtiesContainer}
          >
            {specialties.map((specialty) => (
              <TouchableOpacity
                key={specialty.id}
                style={[
                  styles.specialtyChip,
                  selectedSpecialty === specialty.name &&
                    styles.selectedSpecialty,
                ]}
                onPress={() => setSelectedSpecialty(specialty.name)}
              >
                <Text
                  style={[
                    styles.specialtyText,
                    selectedSpecialty === specialty.name &&
                      styles.selectedSpecialtyText,
                  ]}
                >
                  {specialty.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.resultHeader}>
          <Text style={styles.resultText}>
            Found {filteredDoctors.length} doctors
          </Text>
        </View>

        <View style={styles.doctorsContainer}>
          {filteredDoctors.map((doctor) => (
            <DoctorCard key={doctor.id} {...doctor} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "flex-start",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    marginLeft: 16,
  },
  specialtiesWrapper: {
    marginVertical: 16,
  },
  specialtiesContainer: {
    paddingHorizontal: 16,
  },
  resultHeader: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  resultText: {
    fontSize: 14,
    color: "#64748B",
    fontWeight: "500",
  },
  doctorsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  specialtyChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: "#F3F4F6",
  },
  selectedSpecialty: {
    backgroundColor: "#5B21B6",
  },
  specialtyText: {
    fontSize: 14,
    color: "#4B5563",
  },
  selectedSpecialtyText: {
    color: "#fff",
    fontWeight: "500",
  },
});
