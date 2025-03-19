import { SafeAreaView } from "react-native-safe-area-context";
import WorkScheduleComponent from "@/components/doctors/WorkScheduleComponent";

export default function WorkScheduleTab() {
    return (
        <SafeAreaView style={{width: "100%", height: "100%"}}>
            <WorkScheduleComponent />
        </SafeAreaView>
    )
}