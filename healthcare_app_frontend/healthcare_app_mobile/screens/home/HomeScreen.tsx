import React from "react";
import { ScrollView, StatusBar, StyleSheet } from "react-native";
import { HeaderHome } from "./HeaderHome";
import { PromoBanner } from "../../components/PromoBanner";
import { Categories } from "../../components/Categories";
import { TopDoctors } from "../../components/TopDoctors";
import { AntDesign } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
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
export const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <HeaderHome />
      <ScrollView>
        <PromoBanner />
        <Categories arrayObject={categories} />
        <TopDoctors />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // marginTop: StatusBar.currentHeight,
  },
});
