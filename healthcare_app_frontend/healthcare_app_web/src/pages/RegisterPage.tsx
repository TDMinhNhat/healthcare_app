import {Container, Box, Stack, Typography, Step, Stepper, StepLabel, Button} from "@mui/material";
import React, {useState} from "react";
import InputInfoComponent from "../components/register/InputInfoComponent";
import RegisterAccountComponent from "../components/register/RegisterAccountComponent.tsx";
import FaceDetectComponent from "../components/register/FaceDetectComponent.tsx";
import EmailVerifyComponent from "../components/register/EmailVerifyComponent.tsx";
import CompleteRegisterComponent from "../components/register/CompleteRegisterComponent.tsx";

function RegisterPage({registerLanguage}: { registerLanguage: object }) {

    const steps = registerLanguage.tabs;
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
            <Box className={"w-75 h-75 bg-white position-absolute top-50 start-50 translate-middle shadow-lg rounded p-5"}>
                <Box className={"h-100"}>
                    <Stepper activeStep={activeStep}>
                        {steps.map((item, index) => {
                            const stepProps: { completed?: boolean } = {};
                            const labelProps: {
                                optional?: React.ReactNode;
                            } = {};
                            if (item.isOptional) {
                                labelProps.optional = (
                                    <Typography variant="caption">{item.optional}</Typography>
                                );
                            }
                            if (isStepSkipped(index)) {
                                stepProps.completed = false;
                            }
                            return (
                                <Step key={item.name} {...stepProps}>
                                    <StepLabel {...labelProps}>
                                        <Typography variant={"h6"}>{item.name}</Typography>
                                    </StepLabel>
                                </Step>
                            );
                        })}
                    </Stepper>
                    {activeStep === 0 && <InputInfoComponent registerLanguage={registerLanguage} handleNext={handleNext} handleBack={handleBack} activeStep={activeStep} />}
                    {activeStep === 1 && <RegisterAccountComponent registerLanguage={registerLanguage} handleNext={handleNext} handleBack={handleBack} activeStep={activeStep}/>}
                    {activeStep === 2 && <EmailVerifyComponent registerLanguage={registerLanguage} handleNext={handleNext} handleBack={handleBack} activeStep={activeStep}/>}
                    {activeStep === 3 && <FaceDetectComponent registerLanguage={registerLanguage} handleNext={handleNext} activeStep={activeStep} />}
                    {activeStep === 4 && <CompleteRegisterComponent registerLanguage={registerLanguage}/>}
                </Box>
            </Box>
        </Container>
    )
}

export default RegisterPage;