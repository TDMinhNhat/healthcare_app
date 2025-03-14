import {Tabs} from "expo-router";

export default function TabLayout() {
    return (
        <Tabs>
            <Tabs.Screen name={"dashboard"} />
            <Tabs.Screen name={"appointments"} />
            <Tabs.Screen name={"users"} />
        </Tabs>
    )
}