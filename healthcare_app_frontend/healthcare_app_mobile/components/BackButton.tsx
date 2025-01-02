import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from "@react-navigation/native";
import { Image, TouchableOpacity } from "react-native";

export default function BackButton() {
  const navigation: NavigationProp<ParamListBase> = useNavigation();
  const handlePress = () => {
    navigation.goBack();
  };
  return (
    <TouchableOpacity
      style={{
        borderWidth: 1,
        borderColor: "black",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 16,
        padding: 12,
      }}
      onPress={handlePress}
    >
      <Image
        source={require("../assets/icons/arrow-back.png")}
        style={{ height: 18, width: 18 }}
      />
    </TouchableOpacity>
  );
}
