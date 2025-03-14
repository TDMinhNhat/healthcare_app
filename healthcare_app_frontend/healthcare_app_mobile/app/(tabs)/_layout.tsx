import {Tabs} from "expo-router";

export default function TabLayout() {
    return (
        <Tabs>
            <Tabs.Screen name={"dashboard"} options={{
                headerShown: false
            }} />
            <Tabs.Screen name={"appointments"} options={{
                headerShown: false
            }}/>
            <Tabs.Screen name={"users"} options={{
                headerShown: false
            }} />
        </Tabs>
    )
}