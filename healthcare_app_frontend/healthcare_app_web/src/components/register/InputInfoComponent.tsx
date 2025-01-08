import {Box, Button, Stack, Typography} from "@mui/material";

function InputInfoComponent({ registerLanguage, handleNext, handleBack, activeStep }:{ registerLanguage: object, handleNext: void, handleBack: void, activeStep: number }) {
    return (
        <Stack direction={"column"} className={"w-100 h-100 d-flex flex-column justify-content-between"}>
            <Box>

            </Box>
            <Stack direction={"row"} className={"d-flex justify-content-between mb-4"}>
                {activeStep !== 4 &&
                    <Button
                        color="secondary"
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        variant={"contained"}
                        sx={{mr: 1}}
                    >
                        <Typography>{registerLanguage.button_back}</Typography>
                    </Button>
                }

                <Box>
                    {activeStep !== 4 &&
                        <Button color="success" variant={"contained"} onClick={handleNext}>
                            {registerLanguage.button_next}
                        </Button>
                    }
                </Box>
            </Stack>
        </Stack>
    )
}

export default InputInfoComponent;