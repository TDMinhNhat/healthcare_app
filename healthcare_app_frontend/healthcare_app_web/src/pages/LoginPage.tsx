import { useState } from "react";
import {Box, Container, Stack, Tab, Tabs, Typography} from "@mui/material";
import LoginStandard from "../components/login/LoginStandard.tsx";
import LoginFace from "../components/login/LoginFace.tsx";
import LoginOthersApp from "../components/login/LoginOthersApp.tsx"

function LoginPage({ loginLanguage } : { loginLanguage:object }) {

    const [tab, setTab] = useState("standard");

    return (
        <Container maxWidth={false} disableGutters={true}>
            <Box className={"z-0 fixed-top"}>
                <img
                    alt={"background_login"}
                    src={"background_login.png"}
                    width={"100%"}
                />
            </Box>
            <Box className={"d-flex align-items-center justify-content-center bg-white position-absolute top-50 start-50 translate-middle p-5 shadow-lg rounded"}
            style={{width: "45%"}}>
                <Stack direction={"column"}>
                    <Stack direction={"column"} className={"d-flex flex-column align-items-center"}>
                        <Box className={"d-flex justify-content-center"}>
                            <img
                                alt={"logo"}
                                src={"logo.png"}
                                width={"50%"}
                            />
                        </Box>
                    </Stack>
                    <Box className={"w-100 mt-5"}>
                        <Tabs className={"d-flex justify-content-between"} value={tab} onChange={(e, newValue) => setTab(newValue)}>
                            <Tab label={loginLanguage.login_standard} value={"standard"}/>
                            <Tab label={loginLanguage.login_face} value={"face"}/>
                            <Tab label={loginLanguage.login_others_app} value={"others_app"}/>
                        </Tabs>

                        <Box className={"mt-3"}>
                            {tab === "standard" && <LoginStandard loginLanguage={loginLanguage}/>}
                            {tab === "face" && <LoginFace loginLanguage={loginLanguage}/>}
                            {tab === "others_app" && <LoginOthersApp loginLanguage={loginLanguage}/>}
                        </Box>
                    </Box>
                </Stack>
            </Box>
        </Container>
    )
}

export default LoginPage;