import { useTheme } from "@react-navigation/native";
import React from "react";
import { Text, TouchableOpacity } from "react-native";
interface ButtonProps extends React.ComponentProps<typeof TouchableOpacity> {
  title: string;
}
const Button = (props: ButtonProps) => {
  const { title, ...rest } = props;
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      style={{
        backgroundColor: colors.main.primary, // Màu tím từ theme
        borderRadius: 46,
        paddingVertical: 12,
        paddingHorizontal: 24,
        alignItems: "center",
        justifyContent: "center",
      }}
      {...rest}
    >
      <Text
        style={{
          color: "#FFFFFF",
          fontSize: 16,
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;
