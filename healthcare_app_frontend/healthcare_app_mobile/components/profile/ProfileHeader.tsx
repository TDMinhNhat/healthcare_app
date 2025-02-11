import type React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ProfileHeaderProps {
  name: string;
  email: string;
  imageUrl: string;
  onEditPress: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  name,
  email,
  imageUrl,
  onEditPress,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUrl }} style={styles.image} />
        <TouchableOpacity style={styles.editButton} onPress={onEditPress}>
          <Ionicons name="pencil" size={18} color="" />
        </TouchableOpacity>
      </View>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.email}>{email}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 16,
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    width: 130,
    height: 130,
    borderRadius: 70,
  },
  editButton: {
    position: "absolute",
    right: 6,
    bottom: 6,
    backgroundColor: "#fff",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  name: {
    fontSize: 20,
    fontWeight: "600",
    color: "#5B21B6",
    marginTop: 12,
  },
  email: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
});
