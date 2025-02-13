import React, { forwardRef, useState } from "react";
import { View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import i18n from "../utils/locales/i18n";

interface SearchBoxProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onSubmit?: () => void;
  onPress?: () => void;
  onFocus?: () => void;
}

const SearchBox = forwardRef<TextInput, SearchBoxProps>(
  (
    {
      value,
      onChangeText,
      placeholder = i18n.t("search"),
      onSubmit,
      onPress,
      onFocus,
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = () => {
      setIsFocused(true);
      onFocus?.();
    };

    return (
      <View style={[styles.container, isFocused && styles.containerFocused]}>
        <Ionicons
          name="search-outline"
          size={20}
          color={isFocused ? "#007AFF" : "#666"}
        />
        <TextInput
          ref={ref}
          style={styles.input}
          value={value}
          onChangeText={(t) => onChangeText(t)}
          placeholder={placeholder}
          placeholderTextColor="#666"
          onSubmitEditing={onSubmit}
          returnKeyType="search"
          onFocus={handleFocus}
          onBlur={() => setIsFocused(false)}
          autoCorrect={false}
          autoCapitalize="none"
          spellCheck={false}
          keyboardType="default"
        />
        {value.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => onChangeText("")}
          >
            <Ionicons
              name="close-circle"
              size={20}
              color={isFocused ? "#007AFF" : "#666"}
            />
          </TouchableOpacity>
        )}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  containerFocused: {
    borderColor: "#007AFF",
    borderWidth: 2,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  clearButton: {
    marginLeft: 10,
  },
});

export default SearchBox;
