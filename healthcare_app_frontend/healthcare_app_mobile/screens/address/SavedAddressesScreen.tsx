import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import BackButton from "../../components/BackButton";
import { useSelector } from "react-redux";
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
  useTheme,
} from "@react-navigation/native";
interface Address {
  id: string;
  name: string;
  address: string;
  isDefault?: boolean;
}

export default function SavedAddressesScreen() {
  const navigation: NavigationProp<ParamListBase> = useNavigation();
  const currentLocation = useSelector(
    (state: any) => state.user.currentLocation
  );
  const [savedAddresses] = useState<Address[]>([
    {
      id: "1",
      name: "Nhà",
      address: "123 Nguyễn Văn Linh, Quận 7, TP.HCM",
      isDefault: true,
    },
    {
      id: "2",
      name: "Văn phòng",
      address: "456 Lê Văn Lương, Quận 7, TP.HCM",
    },
  ]);

  const handleAddNewAddress = () => {
    navigation.navigate("AddNewAddress");
  };

  const handleSelectAddress = (address: Address) => {
    navigation.navigate("MapScreen", { selectedAddress: address });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.title}>Địa chỉ đã lưu</Text>
      </View>

      <ScrollView>
        <View style={styles.currentLocationContainer}>
          <Text style={styles.currentLocationTitle}>Vị trí hiện tại</Text>
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            style={styles.currentLocationText}
          >
            {currentLocation?.address || "Đang tải..."}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.addAddressButton}
          onPress={handleAddNewAddress}
        >
          <Ionicons name="add-circle-outline" size={24} color="#007AFF" />
          <Text style={styles.addAddressText}>Thêm địa chỉ mới</Text>
        </TouchableOpacity>

        <View style={styles.savedAddressContainer}>
          <Text style={styles.savedAddressTitle}>Địa chỉ đã lưu</Text>
          {savedAddresses.map((address) => (
            <TouchableOpacity
              key={address.id}
              style={styles.addressItem}
              onPress={() => handleSelectAddress(address)}
            >
              <Text style={styles.addressName}>{address.name}</Text>
              <Text style={styles.addressText}>{address.address}</Text>
              {address.isDefault && (
                <View style={styles.defaultTag}>
                  <Text style={styles.defaultTagText}>Mặc định</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 16,
  },
  currentLocationContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  currentLocationTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  currentLocationText: {
    color: "#666",
    flexShrink: 1,
  },
  addAddressButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  addAddressText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#007AFF",
  },
  savedAddressContainer: {
    padding: 16,
  },
  savedAddressTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
  },
  addressItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  addressName: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  addressText: {
    color: "#666",
  },
  defaultTag: {
    position: "absolute",
    right: 16,
    top: 16,
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  defaultTagText: {
    color: "#4CAF50",
    fontSize: 12,
  },
});
