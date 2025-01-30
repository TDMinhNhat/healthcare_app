import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from "@react-navigation/native";
interface DoctorCardProps {
  name: string;
  specialty: string;
  qualifications: string;
  rating: number;
  imageUrl: string;
  isBookmarked?: boolean;
  onBookmarkPress?: () => void;
}

export const DoctorCard = ({
  name,
  specialty,
  qualifications,
  rating,
  imageUrl,
  isBookmarked = false,
  onBookmarkPress,
}: DoctorCardProps) => {
  const [isMarked, setIsMarked] = useState(isBookmarked);
  const navigation: NavigationProp<ParamListBase> = useNavigation();
  const handleBookmarkPress = () => {
    setIsMarked(!isMarked);
    onBookmarkPress?.(); // Call the function if it exists
  };
  const handleNavigateDetails = () => {
    navigation.navigate("DoctorDetail");
  };
  return (
    <TouchableOpacity style={styles.container} onPress={handleNavigateDetails}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <View style={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.specialty}>{specialty}</Text>
            <Text style={styles.qualifications}>{qualifications}</Text>
          </View>
          <TouchableOpacity
            style={styles.bookmark}
            onPress={handleBookmarkPress}
          >
            <Ionicons
              name={isMarked ? "bookmark" : "bookmark-outline"}
              size={24}
              color="#5B21B6"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.footer}>
          <View style={styles.rating}>
            <AntDesign name="star" size={16} color="#F59E0B" />
            <Text style={styles.ratingText}>{rating}</Text>
          </View>
          <View style={styles.location}>
            <AntDesign name="enviromento" size={16} color="#666" />
            <Text style={styles.locationText}>2.5 km</Text>
          </View>
          <TouchableOpacity style={styles.mapButton}>
            <AntDesign name="enviroment" size={16} color="#5B21B6" />
            <Text style={styles.mapButtonText}>Map</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    // padding: 12,
    backgroundColor: "#fff",
    // borderRadius: 12,
    marginBottom: 14,
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.1,
    // shadowRadius: 3,
    // elevation: 3,
  },
  image: {
    width: 108,
    height: 132,
    borderRadius: 10,
    marginRight: 12,
  },
  content: {
    flex: 1,
    padding: 12,
    backgroundColor: "#faf3ed",
    borderRadius: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111",
  },
  specialty: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },
  qualifications: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  bookmark: {
    padding: 4,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: "500",
    color: "#111",
  },
  location: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },
  locationText: {
    marginLeft: 4,
    fontSize: 14,
    color: "#666",
  },
  mapButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 6,
    backgroundColor: "#F3E8FF",
    borderRadius: 6,
  },
  mapButtonText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: "500",
    color: "#5B21B6",
  },
});
