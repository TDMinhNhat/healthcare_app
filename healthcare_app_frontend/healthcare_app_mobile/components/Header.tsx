import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import BackButton from "./BackButton";
import { Ionicons } from "@expo/vector-icons";
import { ComponentProps } from "react";

interface HeaderProps {
  title: string;
  icon?: ComponentProps<typeof Ionicons>["name"];
  icon2?: ComponentProps<typeof Ionicons>["name"];
  onPress?: () => void;
  onPress2?: () => void;
}
export default function Header({
  title,
  icon,
  icon2,
  onPress,
  onPress2,
}: HeaderProps) {
  const hasIcons = icon || icon2;

  return (
    <View style={styles.header}>
      <BackButton />
      <Text style={[styles.title, { flex: 1, textAlign: "center" }]}>
        {title}
      </Text>
      {hasIcons && (
        <View style={styles.iconsContainer}>
          {icon && (
            <TouchableOpacity style={styles.iconButton} onPress={onPress}>
              <Ionicons name={icon} size={24} color="#000" />
            </TouchableOpacity>
          )}
          {icon2 && (
            <TouchableOpacity
              style={[styles.iconButton, { marginLeft: 8 }]}
              onPress={onPress2}
            >
              <Ionicons name={icon2} size={24} color="#000" />
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
  },
  iconButton: {
    padding: 4,
  },
  iconsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});
