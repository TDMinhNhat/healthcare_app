import { TouchableOpacity, TouchableOpacityProps } from "react-native";
interface IconButtonProps extends TouchableOpacityProps {
  icon: React.ReactNode;
  styel?: any;
  onPress: () => void;
}

export default function IconButton(props: IconButtonProps) {
  const { icon, onPress, style, ...rest } = props;
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        {
          padding: 10,
          backgroundColor: "#f8f8f8",
          borderRadius: 12,
          width: 90,
          justifyContent: "center",
          alignItems: "center",
          boxShadow: "0 5px 2px rgba(0, 0, 0, 0.09)",
        },
        style,
      ]}
      {...rest}
    >
      {icon}
    </TouchableOpacity>
  );
}
