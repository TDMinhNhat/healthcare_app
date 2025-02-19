import {Box, Button, Container, Stack, TextField, Typography} from "@mui/material";
import {Dayjs} from "dayjs";
import { useState } from "react";
import {DateTimeField, LocalizationProvider} from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import registerAccount from "../../controllers/register-account.controller.ts";

export default function InputInfoComponent({ language, setStep }:{ language: object, setStep: void }) {

    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [sex, setSex] = useState<boolean>(false);
    const [dob, setDob] = useState<Dayjs>();
    const [phone, setPhone] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [repeatPassword, setRepeatPassword] = useState<string>("");
    const [address, setAddress] = useState<object>({
        number: null,
        street: null,
        ward: null,
        district: null,
        city: null,
        country: null,
    });

    const submitForm = async () => {
        const imageDetect = sessionStorage.getItem("face_detect");
        const result = await registerAccount.addUser(firstName, lastName, sex, phone, dob, username, email, password, address, imageDetect).then(response => response.data).catch(error => console.log(error));
        if(result.code === 200) {
            sessionStorage.removeItem("face_detect");
            setStep("gps")
        } else {
            alert("Add user failed!")
        }
    }

    const clearForm = () => {
        setFirstName("")
        setLastName("")
        setDob()
        setPhone("")
        setUsername("")
        setEmail("")
        setPassword("")
        setRepeatPassword("")
        setAddress({
            number: null,
            street: null,
            ward: null,
            district: null,
            city: null,
            country: null,
        })
    }

    return (
        <Container className={"w-100"}>
            <Stack direction={"column"}>
                <Stack direction={"column"}>
                    <Box className={"w-100"}>
                        <Typography variant={"h3"} className={"text-center"}>{language.title}</Typography>
                    </Box>
                    <Box className={"w-100"}>
                        <Typography className={"text-center"}>{language.subtitle}</Typography>
                    </Box>
                </Stack>
                <Stack direction={"row"} className={"d-flex flex-row align-items-center mt-2"}>
                    <Typography variant={"h6"} className={"w-25"}>{language.first_name}:</Typography>
                    <TextField variant={"outlined"} size={"small"} defaultValue={firstName} fullWidth={true} onChange={(e) => setFirstName(e.target.value)} />
                </Stack>
                <Stack direction={"row"} className={"d-flex flex-row align-items-center mt-2"}>
                    <Typography variant={"h6"} className={"w-25"}>{language.last_name}:</Typography>
                    <TextField variant={"outlined"} size={"small"} defaultValue={lastName} fullWidth={true} onChange={(e) => setLastName(e.target.value)} />
                </Stack>
                <Stack direction={"row"} className={"d-flex flex-row align-items-center mt-2"}>
                    <Typography variant={"h6"} className={"w-25"}>{language.sex.title}:</Typography>
                    <TextField select fullWidth defaultValue={sex ? "F" : "M"} size={"small"} slotProps={{
                        select: {
                            native: true
                        }
                    }} onChange={(e) => setSex(e.target.value === "M")}>
                        <option key={"M"} value={"M"}>
                            {language.sex.male}
                        </option>
                        <option key={"F"} value={"F"}>
                            {language.sex.female}
                        </option>
                    </TextField>
                </Stack>
                <Stack direction={"row"} className={"d-flex flex-row align-items-center mt-2"}>
                    <Typography variant={"h6"} className={"w-25"}>{language.dob}:</Typography>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimeField
                            value={dob}
                            onChange={(newValue) => setDob(newValue)}
                            format={"L"}
                            size={"small"}
                            fullWidth={true}
                        />
                    </LocalizationProvider>
                </Stack>
                <Stack direction={"row"} className={"d-flex flex-row align-items-center mt-2"}>
                    <Typography variant={"h6"} className={"w-25"}>{language.phone}:</Typography>
                    <TextField variant={"outlined"} size={"small"} defaultValue={phone} fullWidth={true} onChange={(e) => setPhone(e.target.value)} />
                </Stack>
                <Stack direction={"row"} className={"d-flex flex-row align-items-center mt-2"}>
                    <Typography variant={"h6"} className={"w-25"}>{language.username}:</Typography>
                    <TextField variant={"outlined"} size={"small"} defaultValue={username} fullWidth={true} onChange={(e) => setUsername(e.target.value)} />
                </Stack>
                <Stack direction={"row"} className={"d-flex flex-row align-items-center mt-2"}>
                    <Typography variant={"h6"} className={"w-25"}>{language.email}:</Typography>
                    <TextField variant={"outlined"} size={"small"} defaultValue={email} fullWidth={true} onChange={(e) => setEmail(e.target.value)} />
                </Stack>
                <Stack direction={"row"} className={"d-flex flex-row align-items-center mt-2"}>
                    <Typography variant={"h6"} className={"w-25"}>{language.password}:</Typography>
                    <TextField variant={"outlined"} size={"small"} defaultValue={password} fullWidth={true} onChange={(e) => setPassword(e.target.value)} />
                </Stack>
                <Stack direction={"row"} className={"d-flex flex-row align-items-center mt-2"}>
                    <Typography variant={"h6"} className={"w-25"}>{language.repeat_password}:</Typography>
                    <TextField variant={"outlined"} size={"small"} defaultValue={repeatPassword} fullWidth={true} onChange={(e) => setRepeatPassword(e.target.value)} />
                </Stack>
                <Stack direction={"row"} className={"d-flex flex-row align-items-center mt-2"}>
                    <Typography variant={"h6"} className={"w-25"}>{language.address.title}:</Typography>
                </Stack>
                <Stack direction={"row"} className={"d-flex flex-row align-items-center justify-content-evenly mt-3 mb-3"}>
                    <Box>
                        <Button variant={"contained"} color={"warning"} onClick={() => clearForm()}>{language.btn_clear}</Button>
                    </Box>
                    <Box>
                        <Button variant={"contained"} color={"success"} onClick={() => submitForm()}>{language.btn_submit}</Button>
                    </Box>
                </Stack>
            </Stack>
        </Container>
    )
}