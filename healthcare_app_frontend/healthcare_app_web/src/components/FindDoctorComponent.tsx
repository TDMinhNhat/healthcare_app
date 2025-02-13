import { useState } from "react";
import {Container} from "@mui/material";
import FaceDetectComponent from "./find_doctor/FaceDetectComponent.tsx";
import GPSMapComponent from "./find_doctor/GPSMapComponent.tsx";
import InputInfoComponent from "./find_doctor/InputInfoComponent.tsx";

function FindDoctorComponent({ language }:{ language: object }) {

    const [step, setStep] = useState("authenticate");

    return (
        <Container className={"container-fluid w-100 h-100"}>
            { step === "authenticate" && <FaceDetectComponent language={language} setStep={setStep} /> }
            { step === "info" && <InputInfoComponent language={language.input_info} setStep={setStep}/> }
            { step === "gps" && <GPSMapComponent language={language} /> }
        </Container>
    )
}

export default FindDoctorComponent;