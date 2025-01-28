import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";

type IconName = React.ComponentProps<typeof AntDesign>["name"];

const categories: {
  id: string;
  title: string;
  price: number;
  originalPrice: number;
  color: string;
  icon: IconName;
}[] = [
  {
    id: "1",
    title: "Video Consultation Chat",
    price: 13.77,
    originalPrice: 14.97,
    color: "#57315a",
    icon: "videocamera",
  },
  {
    id: "2",
    title: "Clinic Visit Appointment",
    price: 11.77,
    originalPrice: 13.97,
    color: "#F87171",
    icon: "calendar",
  },
  {
    id: "3",
    title: "Magnetic Resonance",
    price: 15.77,
    originalPrice: 16.97,
    color: "#F59E0B",
    icon: "scan1",
  },
];

export const Categories = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Categories</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[styles.card, { backgroundColor: category.color }]}
          >
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <View style={styles.iconContainer}>
                <AntDesign name={category.icon} size={24} color="#fff" />
              </View>
              <View style={styles.priceContainer}>
                <Text style={styles.price}>${category.price}</Text>
                <Text style={styles.originalPrice}>
                  ${category.originalPrice}
                </Text>
              </View>
            </View>
            <Text style={styles.cardTitle}>{category.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  seeAll: {
    color: "#5B21B6",
    fontWeight: "500",
  },
  card: {
    width: 200,
    padding: 16,
    borderRadius: 12,
    marginLeft: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  cardTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    marginTop: 12,
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  price: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
  originalPrice: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
    textDecorationLine: "line-through",
  },
});
