import {Box, Container, MenuItem, Select, Stack, Typography} from "@mui/material";
import FacebookIcon from '@mui/icons-material/Facebook';
import XIcon from '@mui/icons-material/X';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import "../styles/footer.scss"

function FooterComponent({ footer, setLanguage, languageType }:{ footer: object, setLanguage: void, languageType: string }) {
    return (
        <Container id={"footer"} maxWidth={false} disableGutters={true}>
            <Box className={"d-flex justify-content-between align-items-center p-5"}>
                <Stack direction={"column"} className={"d-flex flex-column align-items-start w-25"}>
                    <Box>
                        <img
                            alt={"logo"}
                            src={"logo.png"}
                            width={250}
                            height={75}
                        />
                    </Box>
                    <Box className={"mt-4"}>
                        <Typography>{ footer.description }</Typography>
                    </Box>
                    <Box className={"mt-4"}>
                        <Typography>{ footer.copyright }</Typography>
                    </Box>
                </Stack>
                <Stack direction={"column"}>
                    <Stack direction={"row"}>
                        <Box className={"social-item"}>
                            <FacebookIcon fontSize={"large"} style={{color: "blue"}} />
                        </Box>
                        <Box className={"social-item ms-5"} >
                            <XIcon fontSize={"large"} />
                        </Box>
                        <Box className={"social-item ms-5"}>
                            <LinkedInIcon fontSize={"large"} style={{color: "darkblue"}}/>
                        </Box>
                        <Box className={"social-item ms-5"}>
                            <InstagramIcon fontSize={"large"} style={{color: "orange"}}/>
                        </Box>
                    </Stack>
                    <Box className={"mt-5"}>
                        <Typography>{ footer.select_language }:</Typography>
                        <Select
                            id={"select_language"}
                            value={languageType}
                            onChange={(e) => setLanguage(e.target.value)}
                            sx={{width: 280}}
                        >
                            <MenuItem value={"vietnamese"}>
                                <Box className={"d-flex flex-row align-items-center"}>
                                    <img alt={"vietnam_flag"} src={"vietnam_flag.png"} width={40} height={25}/>
                                    <Typography className={"ms-2 fw-bold"}>Vietnamese</Typography>
                                </Box>
                            </MenuItem>
                            <MenuItem value={"english"}>
                                <Box className={"d-flex flex-row align-items-center"}>
                                    <img alt={"english_flag"} src={"american_flag.png"} width={40} height={25}/>
                                    <Typography className={"ms-2 fw-bold"}>English</Typography>
                                </Box>
                            </MenuItem>
                        </Select>
                    </Box>
                </Stack>
            </Box>
        </Container>
    )
}

export default FooterComponent;