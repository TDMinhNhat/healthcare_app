import {Container, Box, Typography, Step, Stepper, StepLabel} from "@mui/material";
import React, {useState} from "react";
import InputInfoComponent from "../components/register/InputInfoComponent";
import FaceDetectComponent from "../components/register/FaceDetectComponent.tsx";
import EmailVerifyComponent from "../components/register/EmailVerifyComponent.tsx";
import CompleteRegisterComponent from "../components/register/CompleteRegisterComponent.tsx";

function RegisterPage({registerLanguage}: { registerLanguage: object }) {

    const steps = registerLanguage.tabs;
    const [registerUserData, setRegisterUserData] = useState<object>();
    const [activeStep, setActiveStep] = useState(0);
    const [skipped, setSkipped] = useState(new Set<number>());
    const isStepSkipped = (step: number) => {
        return skipped.has(step);
    };

    const handleNext = () => {
        let newSkipped = skipped;
        if (isStepSkipped(activeStep)) {
            newSkipped = new Set(newSkipped.values());
            newSkipped.delete(activeStep);
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped(newSkipped);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    return (
        <Container className={"container-fluid w-100"} maxWidth={false} disableGutters={false}>
            <Box className={"z-0 fixed-top"}>
                <img
                    alt={"register"}
                    src={"background_register.png"}
                    width={"100%"}
                />
            </Box>
            <Box className={"w-50 bg-white position-absolute top-50 start-50 translate-middle shadow-lg rounded p-5"} sx={{height: "80%"}}>
                <Box className={"h-100"}>
                    <Stepper activeStep={activeStep}>
                        {steps.map((item, index) => {
                            const stepProps: { completed?: boolean } = {};
                            const labelProps: {
                                optional?: React.ReactNode;
                            } = {};
                            if (isStepSkipped(index)) {
                                stepProps.completed = false;
                            }
                            return (
                                <Step key={item.name} {...stepProps}>
                                    <StepLabel {...labelProps}>
                                        <Typography variant={"p"}>{item.name}</Typography>
                                    </StepLabel>
                                </Step>
                            );
                        })}
                    </Stepper>
                    <Box className={"mt-3"}></Box>
                    {activeStep === 0 && <InputInfoComponent registerLanguage={registerLanguage} handleNext={handleNext} handleBack={handleBack} activeStep={activeStep} setRegisterUserData={setRegisterUserData} />}
                    {activeStep === 1 && <FaceDetectComponent registerLanguage={registerLanguage} handleNext={handleNext} activeStep={activeStep} registerUserData={registerUserData}/>}
                    {activeStep === 2 && <EmailVerifyComponent registerLanguage={registerLanguage} handleNext={handleNext} handleBack={handleBack} activeStep={activeStep} registerUserData={registerUserData}/>}
                    {activeStep === 3 && <CompleteRegisterComponent registerLanguage={registerLanguage}/>}
                </Box>
            </Box>
        </Container>
    )
}

export default RegisterPage;