import {Box, Button, Input, InputAdornment, Stack, Typography} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import KeyIcon from "@mui/icons-material/Key";
import {Link} from "react-router";
import {useState} from "react";

function LoginStandard({ loginLanguage } : { loginLanguage: object}) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const solveLogin = () => {

    }

    return (
        <Box>
            <Box className={"w-100"}>
                <Typography variant={"h6"} className={"fw-bold"}>{loginLanguage.email}:</Typography>
                <Input className={"w-100 fs-5"} startAdornment={
                    <InputAdornment position={"start"}>
                        <EmailIcon />
                    </InputAdornment>
                } onChange={(e) => setEmail(e.target.value)}/>
            </Box>
            <Box className={"w-100 mt-4"}>
                <Typography variant={"h6"} className={"fw-bold"}>{loginLanguage.password}:</Typography>
                <Input className={"w-100 fs-5"} type={"password"} startAdornment={
                    <InputAdornment position={"start"}>
                        <KeyIcon />
                    </InputAdornment>
                } onChange={(e) => setPassword(e.target.value)}/>
            </Box>
            <Stack direction={"row"} className={"w-100 d-flex justify-content-between mt-3"}>
                <Box>
                    <Link to={"/forgot_pass"}>
                        <Typography>{loginLanguage.link_forgot_pass}</Typography>
                    </Link>
                </Box>
                <Box>
                    <Link to={"/register"}>
                        <Typography>{loginLanguage.link_register}</Typography>
                    </Link>
                </Box>
            </Stack>
            <Box className={"w-100 mt-3"}>
                <Button className={"w-100"} variant="contained" onClick={() => solveLogin()}>{loginLanguage.button_login}</Button>
            </Box>
        </Box>
    )
}

export default LoginStandard;