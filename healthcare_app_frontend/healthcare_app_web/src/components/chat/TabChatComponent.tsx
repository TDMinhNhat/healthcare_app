import {Socket} from "socket.io-client";
import {Box, Fab, List, Stack, TextField} from "@mui/material";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import SearchIcon from '@mui/icons-material/Search';
import {useState, useLayoutEffect} from "react";

export default function TabChatComponent({socket, tabLanguage}: { socket: Socket, tabLanguage: object }) {

    const [inputSearchUser, setInputSearchUser] = useState("");

    useLayoutEffect(() => {

    }, [inputSearchUser]);

    const changeInputSearch = (event) => {
        setInputSearchUser(event.target.value);
    }

    const addFriend = () => {
        console.log("Click add friend");
    }

    const addGroup = () => {
        console.log("Click add group");
    }

    return (
        <Stack direction={"column"}>
            <Stack direction={"row"} className={"w-100 p-3 d-flex flex-row justify-content-between align-items-center"}>
                <Box className={"mt-3 col-8"}>
                    <TextField variant={"standard"} label={tabLanguage.search.title} slotProps={{
                        input: {
                            startAdornment: <SearchIcon />
                        }
                    }} onChange={changeInputSearch} fullWidth/>
                </Box>
                <Stack direction={"row"}>
                    <Fab color={"primary"} size={"small"} className={"me-2"}>
                        <PersonAddIcon/>
                    </Fab>
                    <Fab color={"secondary"} size={"small"}>
                        <GroupAddIcon/>
                    </Fab>
                </Stack>
            </Stack>
            <List className={"w-100 h-100"}>

            </List>
        </Stack>
    )
}