import {
    Box,
    Button,
    TextField,
    Stack,
    Typography,
    RadioGroup,
    Radio,
    FormControlLabel,
    Checkbox
} from "@mui/material";
import {useState} from "react";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {Dayjs} from "dayjs";
import registerAccount from "../../controllers/register-account.controller.ts"

function InputInfoComponent({ registerLanguage, handleNext, activeStep, setRegisterUserData }:{ registerLanguage: object, handleNext: void, activeStep: number, setRegisterUserData: void }) {

    const [firstName, setFirstName] = useState<string>();
    const [lastName, setLastName] = useState<string>();
    const [sex, setSex] = useState<boolean>(false);
    const [dob, setDob] = useState<Dayjs>();
    const [phone, setPhone] = useState<string>();
    const [username, setUsername] = useState<string>();
    const [email, setEmail] = useState<string>();
    const [password, setPassword] = useState<string>();
    const [repeatPassword, setRepeatPassword] = useState<string>();
    const [acceptEula, setAcceptEula] = useState<boolean>(false);
    const [address, setAddress] = useState<object>({
        "number": null,
        "street": null,
        "ward": null,
        "district": null,
        "city": null,
        "country": null
    });

    const checkPatternName = (field: string) => {
        if(field === undefined || field === null || field === ""){
            return { result: true, message: registerLanguage.input_info.error.null};
        } else if(/[0-9]+/g.test(field)) {
            return { result: true, message: registerLanguage.input_info.error.contains_number};
        } else if(/\W/g.test(field)) {
            return { result: true, message: registerLanguage.input_info.error.contains_special_character};
        }
        return { result: false, message: ""};
    }

    const checkDob = (field: Dayjs) => {
        if(field === null || field === undefined) {
            return { result: true, message: registerLanguage.input_info.error.null };
        } else {
            return { result: false, message: ""};
        }
    }

    const checkPhone = (field: string) => {
        if(field === null || field === undefined || field === "") {
            return { result: true, message: registerLanguage.input_info.error.null };
        } else if(/\D+/g.test(field)) {
            return { result: true, message: registerLanguage.input_info.error.contains_text };
        }
        return { result: false, message: "" };
    }

    const checkUsername = (field: string) => {
        if(field === null || field === undefined || field === "") {
            return { result: true, message: registerLanguage.input_info.error.null };
        } else if(/^[0-9]+/g.test(field)) {
            return { result: true, message: registerLanguage.input_info.error.start_number }
        }
        return { result: false, message: "" };
    }

    const checkEmail = (field: string) => {
        if(field === null || field === undefined || field === "") {
            return { result: true, message: registerLanguage.input_info.error.null };
        } else if(!(/.+@/g.test(field))) {
            return { result: true, message: registerLanguage.input_info.error.invalid_email };
        }
        return { result: false, message: "" };
    }

    const checkPassword = (field: string) => {
        if(field === null || field === undefined || field === "") {
            return { result: true, message: registerLanguage.input_info.error.null };
        }
        return { result: false, message: "" };
    }

    const checkRepeatPassword = (field: string) => {
        if(field === null || field === undefined === field === "") {
            return { result: true, message: registerLanguage.input_info.error.null};
        } else if(field !== password) {
            return { result: true, message: registerLanguage.input_info.error.not_match_password };
        }
        return { result: false, message: "" };
    }

    const checkNumberAddress = (field: string) => {
        if(field === null || field === undefined || field === "") {
            return { result: false, message: "" };
        } else if(/\D+/g.test(field)) {
            return { result: true, message: registerLanguage.input_info.error.contains_text };
        }
        return { result: false, message: "" };
    }

    const checkIsNext = () => {
        if(checkPatternName(firstName).result || checkPatternName(lastName).result || checkDob(dob).result || checkPhone(phone).result || checkUsername(username).result || checkEmail(email).result || checkPassword(password).result || checkRepeatPassword(repeatPassword).result || checkNumberAddress(address.number).result || !acceptEula) {
            return false;
        }
        return true;
    }

    const addIconForce = () => {
        return <Typography variant={"p"} color={"error"}>*</Typography>
    }

    const solveRegisterAccount: void = async () => {
        const registerData = {
            "firstName": firstName,
            "lastName": lastName,
            "sex": sex,
            "phone": phone,
            "dob": dob,
            "username": username,
            "email": email,
            "password": password,
            "address": address
        }
        setRegisterUserData(registerData);
        handleNext();
    }

    return (
        <Stack direction={"column"} className={"w-100 h-100 d-flex flex-column justify-content-between"}>
            <Stack direction={"column"}>
                <Stack direction={"row"}>
                    <Box className={"d-flex flex-row align-items-start"}>
                        <Typography>{addIconForce()} {registerLanguage.input_info.last_name}:</Typography>
                        <TextField variant={"standard"} className={"ms-3"} sx={{width: "200px"}} onChange={(e) => setLastName(e.target.value)} error={checkPatternName(lastName).result} helperText={checkPatternName(lastName).message}/>
                    </Box>
                    <Box className={"d-flex flex-row align-items-start ms-5"}>
                        <Typography>{addIconForce()} {registerLanguage.input_info.first_name}:</Typography>
                        <TextField variant={"standard"} className={"ms-3"} sx={{width: "200px"}} onChange={(e) => setFirstName(e.target.value)} error={checkPatternName(firstName).result} helperText={checkPatternName(firstName).message}/>
                    </Box>
                    <Box className={"d-flex flex-row align-items-center ms-5"}>
                        <Typography>{addIconForce()} {registerLanguage.input_info.sex}:</Typography>
                        <RadioGroup
                            value={sex}
                            onChange={(e) => setSex(e.target.value)}
                            className={"d-flex flex-row align-items-start ms-4"}
                        >
                            <FormControlLabel value={false} control={<Radio />} label={registerLanguage.input_info.sex_male}/>
                            <FormControlLabel value={true} control={<Radio />} label={registerLanguage.input_info.sex_female}/>
                        </RadioGroup>
                    </Box>
                </Stack>
                <Stack direction={"row"} className={"mt-5"}>
                    <Box className={"d-flex flex-row align-items-start"}>
                        <Typography>{addIconForce()} {registerLanguage.input_info.phone}:</Typography>
                        <TextField variant={"standard"} className={"ms-3"} sx={{width: "200px"}} onChange={(e) => setPhone(e.target.value)} error={checkPhone(phone).result} helperText={checkPhone(phone).message}/>
                    </Box>
                    <Box className={"d-flex flex-row align-items-start ms-5"}>
                        <Typography>{addIconForce()} {registerLanguage.input_info.date_of_birth}:</Typography>
                        <Box className={"ms-3 d-flex flex-column justify-content-between"}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker value={dob} onChange={(newValue) => setDob(newValue)} />
                            </LocalizationProvider>
                            <Typography variant={"caption"} color={"error"}>
                                {checkDob(dob).message}
                            </Typography>
                        </Box>
                    </Box>
                </Stack>
                <Stack direction={"row"} className={"mt-5"}>
                    <Box className={"d-flex flex-row align-items-start"}>
                        <Typography>{addIconForce()} {registerLanguage.input_info.username}:</Typography>
                        <TextField variant={"standard"} className={"ms-3"} sx={{width: "200px"}} onChange={(e) => setUsername(e.target.value)} error={checkUsername(username).result} helperText={checkUsername(username).message}/>
                    </Box>
                    <Box className={"d-flex flex-row align-items-start ms-5"}>
                        <Typography>{addIconForce()} {registerLanguage.input_info.email}:</Typography>
                        <TextField variant={"standard"} className={"ms-3"} sx={{width: "200px"}} onChange={(e) => setEmail(e.target.value)} error={checkEmail(email).result} helperText={checkEmail(email).message} />
                    </Box>
                </Stack>
                <Stack direction={"row"} className={"mt-5"}>
                    <Box className={"d-flex flex-row align-items-start"}>
                        <Typography>{addIconForce()} {registerLanguage.input_info.password}:</Typography>
                        <TextField variant={"standard"} className={"ms-3"} sx={{width: "200px"}} onChange={(e) => setPassword(e.target.value)} error={checkPassword(password).result} helperText={checkPassword(password).message}/>
                    </Box>
                    <Box className={"d-flex flex-row align-items-start ms-5"}>
                        <Typography>{addIconForce()} {registerLanguage.input_info.repeat_password}:</Typography>
                        <TextField variant={"standard"} className={"ms-3"} sx={{width: "200px"}} onChange={(e) => setRepeatPassword(e.target.value)} error={checkRepeatPassword(repeatPassword).result} helperText={checkRepeatPassword(repeatPassword).message}/>
                    </Box>
                </Stack>
                <Stack direction={"row"} className={"mt-5"}>
                    <Box className={"d-flex flex-row align-items-start"}>
                        <Typography>{registerLanguage.input_info.address.number}:</Typography>
                        <TextField variant={"standard"} className={"ms-3"} sx={{width: "150px"}} onChange={(e) => setAddress({...address, "number": e.target.value})} error={checkNumberAddress(address.number).result} helperText={checkNumberAddress(address.number).message} />
                    </Box>
                    <Box className={"d-flex flex-row align-items-start ms-5"}>
                        <Typography>{registerLanguage.input_info.address.street}:</Typography>
                        <TextField variant={"standard"} className={"ms-3"} sx={{width: "150px"}} onChange={(e) => setAddress({...address, "street": e.target.value})} />
                    </Box>
                    <Box className={"d-flex flex-row align-items-start ms-5"}>
                        <Typography>{registerLanguage.input_info.address.ward}:</Typography>
                        <TextField variant={"standard"} className={"ms-3"} sx={{width: "150px"}} onChange={(e) => setAddress({...address, "ward": e.target.value})} />
                    </Box>
                </Stack>
                <Stack direction={"row"} className={"mt-5"}>
                    <Box className={"d-flex flex-row align-items-start"}>
                        <Typography>{registerLanguage.input_info.address.district}:</Typography>
                        <TextField variant={"standard"} className={"ms-3"} sx={{width: "150px"}} onChange={(e) => setAddress({...address, "district": e.target.value})} />
                    </Box>
                    <Box className={"d-flex flex-row align-items-start ms-5"}>
                        <Typography>{registerLanguage.input_info.address.city}:</Typography>
                        <TextField variant={"standard"} className={"ms-3"} sx={{width: "150px"}} onChange={(e) => setAddress({...address, "city": e.target.value})} />
                    </Box>
                </Stack>
                <Stack direction={"row"} className={"mt-3"}>
                    <Box className={"d-flex flex-row align-items-center"}>
                        <Checkbox checked={acceptEula} onChange={(e) => setAcceptEula(e.target.checked)}/>
                        <Typography className={"ms-3"}>{registerLanguage.input_info.eula}</Typography>
                    </Box>
                </Stack>
            </Stack>
            <Stack direction={"row"} className={"d-flex flex-row justify-content-end mb-4"}>
                <Box>
                    {activeStep !== 4 &&
                        <Button color="success" disabled={!checkIsNext()} variant={"contained"} onClick={() => solveRegisterAccount()}>
                            {registerLanguage.button_next}
                        </Button>
                    }
                </Box>
            </Stack>
        </Stack>
    )
}

export default InputInfoComponent;