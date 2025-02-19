import {Box, Button, Stack, TextField, Typography} from "@mui/material";
import { useState, useEffect } from "react";
import registerAccount from "../../controllers/register-account.ts";

function EmailVerifyComponent({ registerLanguage, activeStep, registerUserData }:{ registerLanguage: object, activeStep: number, registerUserData: object }) {

    const [inputOtpMessage, setInputOtpMessage] = useState<string>();

    const sendOtpMessage = () => {
        registerAccount.sendOtpMessage(registerUserData.email);
    }

    useEffect(() => {
        sendOtpMessage();
    }, [])

    const solveHandleNext = async () => {
        const getRegisterUserId: number = sessionStorage.getItem("register_user_id");
        if(getRegisterUserId !== null && getRegisterUserId !== undefined) {
            const result = await registerAccount.verifyOtpMessage(getRegisterUserId, inputOtpMessage).then(response => response.data).catch(error => error);
            if(result.code === 200) {
                sessionStorage.removeItem("register_user_id");

                // Direct to home page
                window.location.href = "/";
            }
        }
    }

    return (
        <Stack direction={"column"} className={"w-100 h-100 d-flex flex-column justify-content-between"}>
            <Stack direction={"column"}>
                <Box>
                    <Typography variant={"caption"}>{registerLanguage.verify_email.message_info}</Typography>
                    <Typography variant={"caption"} className={"text-decoration-underline text-primary"} onClick={() => sendOtpMessage()}>{registerLanguage.verify_email.button_resend_otp}</Typography>
                </Box>
                <Stack direction={"row"}>
                    <Typography>{registerLanguage.verify_email.label_input_otp}</Typography>
                    <TextField required onChange={(e) => setInputOtpMessage(e.target.value)}/>
                </Stack>
            </Stack>
            <Stack direction={"row"} className={"d-flex flex-row justify-content-end mb-4"}>
                <Box>
                    {activeStep !== 4 &&
                        <Button color="success" variant={"contained"} onClick={() => solveHandleNext()}>
                            {registerLanguage.button_next}
                        </Button>
                    }
                </Box>
            </Stack>
        </Stack>
    )
}

export default EmailVerifyComponent;