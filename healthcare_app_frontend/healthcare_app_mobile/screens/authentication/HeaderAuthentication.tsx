import { View } from "react-native";
import BackButton from "../../components/BackButton";

export default function HeaderAuthentication() {
  return (
    <View
      style={{
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        position: "absolute",
        top: 10,
        left: 20,
        right: 0,
      }}
    >
      <BackButton />
    </View>
  );
}
