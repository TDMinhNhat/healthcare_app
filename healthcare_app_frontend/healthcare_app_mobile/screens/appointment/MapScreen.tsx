import { StyleSheet, View, Pressable, Animated } from "react-native";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import Geolocation from "@react-native-community/geolocation";
import { useEffect, useState, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import { DoctorCard } from "../../components/DoctorCard";
import { SafeAreaView } from "react-native-safe-area-context";

const sampleHospitals = [
  {
    id: 1,
    name: "Bệnh viện Chợ Rẫy",
    coordinate: {
      latitude: 10.7578,
      longitude: 106.6587,
    },
    doctor: {
      name: "Dr. Nguyễn Văn A",
      specialty: "Cardiologist",
      qualifications: "MD, PhD",
      rating: 4.8,
      imageUrl: "https://randomuser.me/api/portraits/women/41.jpg",
    },
  },
  {
    id: 2,
    name: "Bệnh viện 115",
    coordinate: {
      latitude: 10.7697,
      longitude: 106.6751,
    },
    doctor: {
      name: "Dr. Trần Thị B",
      specialty: "Neurologist",
      qualifications: "MD, FRCP",
      rating: 4.9,
      imageUrl: "https://randomuser.me/api/portraits/women/42.jpg",
    },
  },
  {
    id: 3,
    name: "Bệnh viện Đại học Y Dược",
    coordinate: {
      latitude: 10.7539,
      longitude: 106.6633,
    },
    doctor: {
      name: "Dr. Lê Văn C",
      specialty: "Pediatrician",
      qualifications: "MD, MSc",
      rating: 4.7,
      imageUrl: "https://randomuser.me/api/portraits/men/41.jpg",
    },
  },
];

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  locationButton: {
    position: "absolute",
    right: 20,
    bottom: 200,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 30,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    padding: 16,
    paddingBottom: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default function MapScreen() {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const mapRef = useRef<MapView | null>(null);

  useEffect(() => {
    Geolocation.requestAuthorization();

    Geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => console.log("Error", error),
      // yêu cầu vị trí chính xác nhất có thể, quá 20s trả về error, cache 1s lấy vị trí mới
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 } // 20s
    );
  }, []);

  const moveToCurrentLocation = () => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        },
        1000
      );
    }
  };

  interface Hospital {
    id: number;
    name: string;
    coordinate: {
      latitude: number;
      longitude: number;
    };
    doctor?: Doctor;
  }

  interface Doctor {
    name: string;
    specialty: string;
    qualifications: string;
    rating: number;
    imageUrl: string;
  }

  const handleMarkerPress = (hospital: Hospital): void => {
    setSelectedDoctor(hospital.doctor || null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={{
          latitude: location?.latitude || 10.7769,
          longitude: location?.longitude || 106.7009,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {location && (
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title="Vị trí của bạn"
            pinColor="blue"
          />
        )}
        {sampleHospitals.map((hospital) => (
          <Marker
            key={hospital.id}
            coordinate={hospital.coordinate}
            title={hospital.name}
            onPress={() => handleMarkerPress(hospital)}
          />
        ))}
      </MapView>
      <Pressable style={styles.locationButton} onPress={moveToCurrentLocation}>
        <Ionicons name="locate" size={24} color="#000" />
      </Pressable>

      {selectedDoctor && (
        <View style={styles.bottomSheet}>
          <DoctorCard {...selectedDoctor} />
        </View>
      )}
    </SafeAreaView>
  );
}
