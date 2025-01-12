import {
    Box, Button,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import { useState, useEffect } from "react";
import "../../styles/tab-users-admin.scss"

function UsersAdminComponent({ tabUserContentLanguage }:{ tabUserContentLanguage: object }) {

    const solveDeleteUser = (event, id) => {

    }

    return (
        <Stack direction={"column"}>
            <Stack direction={"row"} className={"d-flex flex-row justify-content-evenly mt-3"}>
                <Box className={"box-item d-flex flex-column align-items-center justify-content-center text-white p-1"} sx={{backgroundColor: "red"}}>
                    <Typography variant={"h6"} className={"text-center"}>{tabUserContentLanguage.total_users_system}</Typography>
                    <Typography variant={"h4"}>105</Typography>
                </Box>
                <Box className={"box-item d-flex flex-column align-items-center justify-content-center text-white p-1"} sx={{backgroundColor: "blue"}}>
                    <Typography variant={"h6"} className={"text-center"}>{tabUserContentLanguage.total_users_patient}</Typography>
                    <Typography variant={"h4"}>80</Typography>
                </Box>
                <Box className={"box-item d-flex flex-column align-items-center justify-content-center text-white p-1"} sx={{backgroundColor: "purple"}}>
                    <Typography variant={"h6"} className={"text-center"}>{tabUserContentLanguage.total_users_doctor}</Typography>
                    <Typography variant={"h4"}>20</Typography>
                </Box>
                <Box className={"box-item d-flex flex-column align-items-center justify-content-center text-white p-1"} sx={{backgroundColor: "green"}}>
                    <Typography variant={"h6"} className={"text-center"}>{tabUserContentLanguage.total_users_manager}</Typography>
                    <Typography variant={"h4"}>4</Typography>
                </Box>
            </Stack>
            <Stack direction={"column"}>
                <Box>

                </Box>
                <Box>

                </Box>
            </Stack>
            <TableContainer id={"table"} component={Paper} className={"mt-5 w-100 d-flex flex-row"}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align={"center"}>{tabUserContentLanguage.table.id}</TableCell>
                            <TableCell align={"center"}>{tabUserContentLanguage.table.userId}</TableCell>
                            <TableCell align={"center"}>{tabUserContentLanguage.table.first_name}</TableCell>
                            <TableCell align={"center"}>{tabUserContentLanguage.table.last_name}</TableCell>
                            <TableCell align={"center"}>{tabUserContentLanguage.table.user_name}</TableCell>
                            <TableCell align={"center"}>{tabUserContentLanguage.table.email}</TableCell>
                            <TableCell align={"center"}>{tabUserContentLanguage.table.phone}</TableCell>
                            <TableCell align={"center"}>{tabUserContentLanguage.table.role}</TableCell>
                            <TableCell align={"center"}>{tabUserContentLanguage.table.status}</TableCell>
                            <TableCell align={"center"}>{tabUserContentLanguage.table.action}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell align={"center"}>1</TableCell>
                            <TableCell align={"center"}>1</TableCell>
                            <TableCell align={"center"}>John</TableCell>
                            <TableCell align={"center"}>Doe</TableCell>
                            <TableCell align={"center"}>john.doe</TableCell>
                            <TableCell align={"center"}>1</TableCell>
                            <TableCell align={"center"}>John</TableCell>
                            <TableCell align={"center"}>Doe</TableCell>
                            <TableCell align={"center"}>john.doe</TableCell>
                            <TableCell align={"center"}>
                                <Button variant={"contained"} color={"error"} onClick={(event) => solveDeleteUser(event, 1)}>{tabUserContentLanguage.table.btn_delete}</Button>
                                <Button variant={"contained"} color={"error"} onClick={(event) => solveDeleteUser(event, 1)}>{tabUserContentLanguage.table.btn_view_detail}</Button>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Stack>
    )
}

export default UsersAdminComponent;