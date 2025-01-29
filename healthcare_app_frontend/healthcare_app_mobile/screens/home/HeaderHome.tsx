import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import NotificationBell from "../../components/NotficationBell";
import SearchBox from "../../components/SearchBox";

export const HeaderHome = () => {
  const [value, onChangeText] = useState("");
  const handleNotifications = () => {
    // Navigate to notifications screen or toggle notifications panel
    console.log("Notifications clicked");
    // TODO: Add navigation to notifications screen
    // navigation.navigate('Notifications');
  };

  const handleSearch = () => {
    console.log("Search clicked");
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
        <TouchableOpacity style={styles.locationContainer}>
          <AntDesign name="enviroment" size={20} color="#000" />
          <Text style={styles.locationText}>Seattle, USA</Text>
        </TouchableOpacity>
        <NotificationBell
          hasNotification={true}
          onPress={() => handleNotifications()}
        />
      </View>
      <SearchBox
        value={value}
        onChangeText={onChangeText}
        // placeholder="Search..."
        onSubmit={() => handleSearch()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
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
