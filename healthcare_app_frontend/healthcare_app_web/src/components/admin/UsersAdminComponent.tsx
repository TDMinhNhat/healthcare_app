import {Box, Stack, Typography} from "@mui/material";
import { useState, useEffect } from "react";
import "../../styles/tab-users-admin.scss"

function UsersAdminComponent() {
    return (
        <Stack direction={"column"}>
            <Stack direction={"row"} className={"d-flex flex-row justify-content-evenly mt-3"}>
                <Box className={"box-item d-flex flex-column align-items-center justify-content-center text-white p-3"} sx={{backgroundColor: "red"}}>
                    <Typography variant={"h5"} className={"text-center"}>Số Người Dùng</Typography>
                    <Typography variant={"h3"}>105</Typography>
                </Box>
                <Box className={"box-item d-flex flex-column align-items-center justify-content-center text-white p-3"} sx={{backgroundColor: "blue"}}>
                    <Typography variant={"h5"} className={"text-center"}>Số Bệnh Nhân</Typography>
                    <Typography variant={"h3"}>80</Typography>
                </Box>
                <Box className={"box-item d-flex flex-column align-items-center justify-content-center text-white p-3"} sx={{backgroundColor: "purple"}}>
                    <Typography variant={"h5"} className={"text-center"}>Số Bác Sĩ</Typography>
                    <Typography variant={"h3"}>20</Typography>
                </Box>
                <Box className={"box-item d-flex flex-column align-items-center justify-content-center text-white p-3"} sx={{backgroundColor: "green"}}>
                    <Typography variant={"h5"} className={"text-center"}>Số Quản Lý</Typography>
                    <Typography variant={"h3"}>4</Typography>
                </Box>
            </Stack>
            <Stack direction={"column"}>
                <Box>

                </Box>
                <Box>

                </Box>
            </Stack>
            <Box>

            </Box>
        </Stack>
    )
}

export default UsersAdminComponent;