import { useState } from "react";
import {Box, Button, Container, Input, InputAdornment, Stack, Typography} from "@mui/material";
import EmailIcon from '@mui/icons-material/Email';
import KeyIcon from '@mui/icons-material/Key';
import {Link} from "react-router";

function LoginPage({ loginLanguage } : { loginLanguage:object }) {
    return (
        <Container maxWidth={false} disableGutters={true}>
            <Box className={"z-0 fixed-top"}>
                <img
                    alt={"background_login"}
                    src={"background_login.png"}
                    width={"100%"}
                />
            </Box>
            <Box className={"d-flex align-items-center justify-content-center bg-white position-absolute top-50 start-50 translate-middle p-5"}>
                <Stack direction={"column"}>
                    <Stack direction={"column"} className={"d-flex flex-column align-items-center"}>
                        <Box className={"d-flex justify-content-center"}>
                            <img
                                alt={"logo"}
                                src={"logo.png"}
                                width={"50%"}
                            />
                        </Box>
                        <Box>
                            <Typography variant={"h3"}>{loginLanguage.title}</Typography>
                        </Box>
                    </Stack>
                </Stack>
            </Box>
        </Container>
    )
}

export default LoginPage;