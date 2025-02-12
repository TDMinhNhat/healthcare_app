import React, { useState } from "react";
import { useSelector } from "react-redux";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import NotificationBell from "../../components/NotficationBell";
import SearchBox from "../../components/SearchBox";
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
  useTheme,
} from "@react-navigation/native";

export const HeaderHome = () => {
  const [value, onChangeText] = useState("");
  const navigation: NavigationProp<ParamListBase> = useNavigation();
  const currentLocation = useSelector(
    (state: any) => state.user.currentLocation
  );
  const locationText = currentLocation
    ? `${currentLocation.address}`
    : "Loading...";

  const handleNotifications = () => {
    console.log("Notifications clicked");
    // TODO: Add navigation to notifications screen
    // navigation.navigate('Notifications');
  };

  const handleSearchPress = () => {
    navigation.navigate("SearchScreen");
  };

  const handleNavigateChooseAddress = () => {
    navigation.navigate("SavedAddresses");
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <TouchableOpacity
          style={styles.locationContainer}
          onPress={handleNavigateChooseAddress}
        >
          <AntDesign name="enviroment" size={20} color="#000" />
          <Text numberOfLines={1} style={styles.locationText}>
            {locationText}
          </Text>
        </TouchableOpacity>
        <NotificationBell
          hasNotification={true}
          onPress={() => handleNotifications()}
        />
      </View>
      <SearchBox
        value={value}
        onChangeText={onChangeText}
        onFocus={handleSearchPress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 6,
    backgroundColor: "#fff",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 16,
  },
  locationText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
    flex: 1,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    padding: 12,
    borderRadius: 8,
  },
  searchPlaceholder: {
    flex: 1,
    marginLeft: 8,
    color: "#666",
  },
  filterButton: {
    marginLeft: 8,
  },
});
