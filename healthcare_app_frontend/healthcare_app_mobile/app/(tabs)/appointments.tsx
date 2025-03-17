import {SafeAreaView, Text} from "react-native";
import { useLocalSearchParams } from "expo-router";
import AppointmentPatientComponent from "../../components/patients/AppointmentsComponent";
import AppointmentDoctorComponent from "../../components/doctors/AppointmentsComponent";

export default function AppointmentTab() {
    
    const user = useLocalSearchParams();

    return (
        <SafeAreaView>
            {
                user.role === "patient" && <AppointmentPatientComponent />
            }
            {
                user.role === "doctor" && <AppointmentDoctorComponent />
            }
        </SafeAreaView>
    )
}