import { Tabs } from "expo-router";
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Feather from '@expo/vector-icons/Feather';
import { Text } from "react-native";

export default function TabLayout() {

    const user = JSON.parse(sessionStorage.getItem("user") as string);

    return (
        <Tabs>
            <Tabs.Screen name={"dashboard"} options={{
                headerShown: false,
                tabBarIcon: ({ color, size }) => <AntDesign name="dashboard" size={24} color="black" />,
                title: "Tổng Quan"
            }} />
            <Tabs.Screen name={"appointments"} options={{
                headerShown: false,
                tabBarIcon: ({ color, size }) => <MaterialIcons name="event" size={28} color="black" />,
                title: "Lịch Hẹn"
            }} />
            <Tabs.Screen
                name={"work_schedule"}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => <MaterialIcons name="work" size={24} color="black" />,
                    title: "Lịch Làm Việc",
                }}
                redirect={user.role === "doctor" ? false : true}
            />
            <Tabs.Screen
                name={"emergency"}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => <MaterialIcons name="local-hospital" size={28} color="black" />,
                    title: "Cấp Cứu"
                }}
                redirect={user.role === "patient" ? false : true}
            />
            <Tabs.Screen name={"settings"} options={{
                headerShown: false,
                tabBarIcon: ({ color, size }) => <Feather name="settings" size={24} color="black" />,
                title: "Cài Đặt"
            }} />
        </Tabs>
    )
}