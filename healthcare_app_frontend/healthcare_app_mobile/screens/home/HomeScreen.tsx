import React, { useEffect } from "react";
import { ScrollView, StatusBar, StyleSheet, View } from "react-native";
import { useDispatch } from "react-redux";
import Geolocation from "@react-native-community/geolocation";
import { setCurrentLocation } from "../../store/userSlice";
import { HeaderHome } from "./HeaderHome";
import { PromoBanner } from "../../components/PromoBanner";
import { Categories } from "../../components/Categories";
import { TopDoctors } from "../../components/TopDoctors";
import { AntDesign } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
type IconName = React.ComponentProps<typeof AntDesign>["name"];

const getAddressFromCoordinates = async (lat: number, lng: number) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
    );
    const data = await response.json();
    return data.display_name;
  } catch (error) {
    console.error("Error fetching address:", error);
    return "Address not found";
  }
};

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
  const dispatch = useDispatch();

  useEffect(() => {
    const getLocation = () => {
      Geolocation.getCurrentPosition(
        async (position) => {
          try {
            const address = await getAddressFromCoordinates(
              position.coords.latitude,
              position.coords.longitude
            );

            dispatch(
              setCurrentLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                address: address,
              })
            );
          } catch (error) {
            console.error(error);
          }
        },
        (error) => console.log(error),
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
      );
    };

    getLocation();
  }, []);

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
