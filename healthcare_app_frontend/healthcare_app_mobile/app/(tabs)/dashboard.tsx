import { SafeAreaView, Text } from "react-native";
import { useSelector } from "react-redux";

export default function DashboardTab() {
  const user = useSelector((state: any) => state.user.user);
  console.log("user", user);
  return (
    <SafeAreaView>
      <Text>DashBoard Tab Component</Text>
    </SafeAreaView>
  );
}
