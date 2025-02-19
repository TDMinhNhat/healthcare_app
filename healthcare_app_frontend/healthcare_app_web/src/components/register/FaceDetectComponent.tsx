import {Box, Stack} from "@mui/material";

function FaceDetectComponent({ registerLanguage, handleNext, activeStep }:{ registerLanguage: object, handleNext: void, activeStep: number}) {
    return (
        <Stack direction={"column"} className={"w-100 h-100 d-flex flex-column justify-content-between"}>
            <Box>

            </Box>
            <Stack direction={"row"} className={"d-flex justify-content-end mb-4"}>

            </Stack>
        </Stack>
    )
}

export default FaceDetectComponent;