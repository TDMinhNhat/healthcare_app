import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import i18n from "../utils/locales/i18n";

interface SearchBoxProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onSubmit?: () => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({
  value,
  onChangeText,
  placeholder = i18n.t("search"),
  onSubmit,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, isFocused && styles.containerFocused]}>
      <Ionicons
        name="search-outline"
        size={20}
        color={isFocused ? "#007AFF" : "#666"}
      />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={(t) => onChangeText(t)}
        placeholder={placeholder}
        placeholderTextColor="#666"
        onSubmitEditing={onSubmit}
        returnKeyType="search"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        autoCorrect={false}
        autoCapitalize="none"
        spellCheck={false}
        keyboardType="default"
      />
      <TouchableOpacity style={styles.filterButton}>
        <AntDesign
          name="filter"
          size={20}
          color={isFocused ? "#007AFF" : "#666"}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
    borderWidth: 1,
    borderColor: "transparent",
  },
  containerFocused: {
    backgroundColor: "#ffffff",
    borderColor: "#007AFF",
    borderWidth: 1,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    padding: 0,
  },
  filterButton: {
    marginLeft: 8,
  },
});

export default SearchBox;
