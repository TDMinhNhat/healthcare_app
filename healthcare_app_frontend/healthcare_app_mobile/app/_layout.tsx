import {Stack} from "expo-router";
export default function Layout() {
    return (
        <Stack>
            <Stack.Screen name={"index"} options={{
                headerShown: false,
            }}/>
            <Stack.Screen name={"forgot_password"} options={{
                headerShown: false,
            }}/>
            <Stack.Screen name={"register"} options={{
                headerShown: false,
            }}/>
        </Stack>
    )
}