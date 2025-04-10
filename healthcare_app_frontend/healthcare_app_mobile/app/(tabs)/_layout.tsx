import { Tabs, useLocalSearchParams } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useState } from "react";

export default function TabLayout() {
  const user = useLocalSearchParams();
  const [tab, setTab] = useState<string>("dashboard");

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#26b9c8",
        tabBarInactiveTintColor: "black",
        tabBarInactiveBackgroundColor: "white",
        tabBarActiveBackgroundColor: "#e7e4e4",
      }}
      screenListeners={{
        tabPress: (e) => {
          const name = e.target?.split("-")[0];
          setTab(name === undefined ? "dashboard" : name);
        },
      }}
    >
      <Tabs.Screen
        name={"dashboard"}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <FontAwesome
              name="home"
              size={28}
              color={tab === "dashboard" ? "#26b9c8" : "black"}
            />
          ),
          title: "Trang Chủ",
          href: "/(tabs)/dashboard",
        }}
      />
      <Tabs.Screen
        name={"appointments"}
        initialParams={user}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons
              name="event"
              size={28}
              color={tab === "appointments" ? "#26b9c8" : "black"}
            />
          ),
          title: "Lịch Hẹn",
          href: "/(tabs)/appointments",
        }}
      />
      {/* <Tabs.Screen
        name={"work_schedule"}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons
              name="work"
              size={28}
              color={tab === "work_schedule" ? "#26b9c8" : "black"}
            />
          ),
          title: "Lịch Làm Việc",
          href: user.role === "doctor" ? "/(tabs)/work_schedule" : null,
        }}
      /> */}
      <Tabs.Screen
        name={"medical-records"}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons
              name="local-hospital"
              size={28}
              color={tab === "medical-records" ? "#26b9c8" : "black"}
            />
          ),
          title: "Hồ Sơ Bệnh Án",
          href: "/(tabs)/medical-records",
        }}
      />
      <Tabs.Screen
        name={"profile"}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            // <Feather
            //   name="user"
            //   size={28}
            //   color={tab === "profile" ? "#26b9c8" : "black"}
            // />
            <FontAwesome
              name="user"
              size={28}
              color={tab === "profile" ? "#26b9c8" : "black"}
            />
          ),
          title: "Hồ sơ",
          href: "/(tabs)/profile",
        }}
      />
    </Tabs>
  );
}
