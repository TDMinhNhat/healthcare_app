import {Socket} from "socket.io-client";
import {Box, Button, Fab, List, Modal, Stack, Tab, Tabs, TextField, Typography} from "@mui/material";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import SearchIcon from '@mui/icons-material/Search';
import {useState, useLayoutEffect, useEffect} from "react";

export default function TabChatComponent({socket, tabLanguage}: { socket: Socket, tabLanguage: object }) {

    const [openAddFriend, setOpenAddFriend] = useState(false);
    const [openCreateGroup, setOpenCreateGroup] = useState(false);
    const [tabChat, setTabChat] = useState("private");
    const [listUser, setListUser] = useState([]);
    const [listGroup, setListGroup] = useState([]);
    const [inputSearchUser, setInputSearchUser] = useState("");
    const [inputSearchAddFriend, setInputSearchAddFriend] = useState("");

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
        if (tabChat === "private") {
            socket.emit("send_get_user_chat_private")
        } else {
            socket.emit("send_get_user_chat_group")
        }
    }, [tabChat]);

    useLayoutEffect(() => {
        socket.emit("send_request_search_user", {"inputSearch": inputSearchUser});


    }, [inputSearchUser]);

    const changeInputSearch = (event) => {
        setInputSearchUser(event.target.value);
    }

    return (
        <Stack direction={"column"} className={"p-3"}>
            <Stack direction={"row"} className={"w-100 d-flex flex-row justify-content-between align-items-center"}>
                <Box className={"mt-3 col-8"}>
                    <TextField variant={"standard"} slotProps={{
                        input: {
                            startAdornment: <SearchIcon/>
                        }
                    }} placeholder={tabLanguage.search.placeholder} onChange={(e) => changeInputSearch(e)} fullWidth/>
                </Box>
                <Stack direction={"row"}>
                    <Fab color={"primary"} size={"small"} className={"me-2"} onClick={() => setOpenAddFriend(true)}>
                        <PersonAddIcon/>
                    </Fab>
                    { /* Modal for add friend */}
                    <Modal open={openAddFriend}
                           onClose={() => setOpenAddFriend(false)}>
                        <Stack direction={"column"} id={"modal_add_friend"}
                               className={"d-flex flex-column justify-content-between"}>
                            <Box className={"w-100"}>
                                <Typography className={"text-center"}
                                            variant={"h5"}>{tabLanguage.add_friend_modal.title}</Typography>
                                <Box className={"w-100 mt-3"}>
                                    <TextField variant={"standard"} slotProps={{
                                        input: {
                                            startAdornment: <SearchIcon/>
                                        }
                                    }}
                                               placeholder={tabLanguage.add_friend_modal.input_search_placeholder}
                                               onChange={(e) => setInputSearchAddFriend(e.target.value)}
                                               fullWidth
                                    />

                                    <Box className={"w-100 mt-5"}>

                                    </Box>
                                </Box>
                            </Box>
                            <Box className={"w-100 d-flex flex-row justify-content-end align-items-center"}>
                                <Button variant={"contained"} color={"error"}
                                        onClick={() => setOpenAddFriend(false)}>{tabLanguage.add_friend_modal.btn_cancel}</Button>
                            </Box>
                        </Stack>
                    </Modal>
                    <Fab color={"secondary"} size={"small"} onClick={() => setOpenCreateGroup(true)}>
                        <GroupAddIcon/>
                    </Fab>
                    { /* Modal for create a group */}
                    <Modal open={openCreateGroup} onClose={() => setOpenCreateGroup(false)}>
                        <Box>

                        </Box>
                    </Modal>
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