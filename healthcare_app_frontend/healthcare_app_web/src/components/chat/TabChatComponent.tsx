import {Socket} from "socket.io-client";
import {Box, Fab, List, Stack, Tab, Tabs, TextField} from "@mui/material";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import SearchIcon from '@mui/icons-material/Search';
import {useState, useLayoutEffect, useEffect} from "react";

export default function TabChatComponent({socket, tabLanguage}: { socket: Socket, tabLanguage: object }) {

    const [tabChat, setTabChat] = useState("private");
    const [listUser, setListUser] = useState([]);
    const [listGroup, setListGroup] = useState([]);
    const [inputSearchUser, setInputSearchUser] = useState("");

    useEffect(() => {
        socket.on("receive_result_search_user", (data) => {

        })

        socket.on("get_user_chat_private", (data) => {
            console.log(data);
            setListUser(data);
        })

        socket.on("get_user_chat_group", (data) => {
            console.log(data);
            setListGroup(data);
        })

    }, []);

    useEffect(() => {
        if(tabChat === "private") {
            socket.emit("send_get_user_chat_private")
        } else {
            socket.emit("send_get_user_chat_group")
        }
    }, [tabChat]);

    useLayoutEffect(() => {
        socket.emit("send_request_search_user", { "inputSearch": inputSearchUser });


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
        <Stack direction={"column"} className={"p-3"}>
            <Stack direction={"row"} className={"w-100 d-flex flex-row justify-content-between align-items-center"}>
                <Box className={"mt-3 col-8"}>
                    <TextField variant={"standard"} slotProps={{
                        input: {
                            startAdornment: <SearchIcon />
                        }
                    }} placeholder={tabLanguage.search.placeholder} onChange={(e) => changeInputSearch(e)} fullWidth/>
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
            <Box className={"w-100 mt-3"}>
                <Tabs value={tabChat} onChange={(_e, newValue) => setTabChat(newValue)}>
                    <Tab label={tabLanguage.tabs.private_chat} value={"private"} className={"col-6"}/>
                    <Tab label={tabLanguage.tabs.group_chat} value={"group"} className={"col-6"}/>
                </Tabs>
            </Box>
            <List className={"w-100 h-100"}>

            </List>
        </Stack>
    )
}