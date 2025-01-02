import React, { useState } from "react";
import {
  Text,
  TextInput as RNTextInput,
  View,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { useField } from "formik";
import { MaterialIcons } from "@expo/vector-icons";

interface TextInputProps {
  name: string;
  label: string;
  placeholder: string;
}

const TextInput: React.FC<TextInputProps> = ({ name, label, placeholder }) => {
  const { colors } = useTheme();
  const [field, meta, helpers] = useField(name);
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!isPasswordVisible);
  };

  const isPassword = name.toLowerCase().includes("password");

  return (
    <View style={{}}>
      <Text
        style={{
          marginBottom: 10,
          fontSize: 16,
          color: colors.textIcon.contentPrimary,
        }}
      >
        {label}
      </Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          borderWidth: meta.touched && meta.error ? 1.4 : 1,
          borderRadius: 12,
          borderColor:
            meta.touched && meta.error
              ? colors.alertStatus.error
              : colors.greyscale[300],
          backgroundColor: colors.greyscale[100],
        }}
      >
        {isPassword && (
          <MaterialIcons
            name="lock"
            size={24}
            color={colors.greyscale[500]}
            style={{ marginHorizontal: 10 }}
          />
        )}
        <RNTextInput
          style={{
            flex: 1,
            height: 40,
            paddingHorizontal: 10,
            fontSize: 16,
          }}
          placeholder={placeholder}
          placeholderTextColor={colors.greyscale[500]}
          onChangeText={helpers.setValue}
          onBlur={field.onBlur(name)}
          value={field.value}
          secureTextEntry={isPassword && !isPasswordVisible}
        />
        {isPassword && (
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            style={{ marginHorizontal: 10 }}
          >
            <MaterialIcons
              name={isPasswordVisible ? "visibility" : "visibility-off"}
              size={24}
              color={colors.greyscale[500]}
            />
          </TouchableOpacity>
        )}
      </View>
      {meta.touched && meta.error && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 5,
          }}
        >
          <MaterialIcons
            name="error"
            size={18}
            color={colors.alertStatus.error}
          />
          <Text
            style={{
              fontSize: 14,
              color: colors.alertStatus.error,
            }}
          >
            {meta.error}
          </Text>
        </View>
      )}
    </View>
  );
};

export default TextInput;
