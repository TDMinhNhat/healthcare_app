import { useState } from "react";
import {Container} from "@mui/material";
import FaceDetect from "./find_doctor/FaceDetect.tsx";
import GPSMap from "./find_doctor/GPSMap.tsx";

function FindDoctorComponent({ language }:{ language: object }) {

    const [step, setStep] = useState("authenticate");

    return (
        <Container>
            { step === "authenticate" && <FaceDetect language={language} setStep={setStep} /> }
            { step === "gps" && <GPSMap language={language} /> }
        </Container>
    )
}

export default FindDoctorComponent;