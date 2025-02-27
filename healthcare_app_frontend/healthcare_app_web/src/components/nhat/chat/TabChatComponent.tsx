import {Socket} from "socket.io-client";
import {
    Avatar,
    Box,
    Button,
    Fab,
    List,
    ListItem,
    ListItemAvatar, ListItemText,
    Modal,
    Stack,
    Tab,
    Tabs,
    TextField,
    Typography
} from "@mui/material";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import SearchIcon from '@mui/icons-material/Search';
import {useState, useLayoutEffect, useEffect} from "react";

export default function TabChatComponent({socket, tabLanguage}: { socket: Socket, tabLanguage: object }) {

    const user: object = JSON.parse(sessionStorage.getItem("user") as string)
    const [openAddFriend, setOpenAddFriend] = useState<boolean>(false);
    const [openCreateGroup, setOpenCreateGroup] = useState<boolean>(false);
    const [tabChat, setTabChat] = useState<string>("private");
    const [listUser, setListUser] = useState<[]>([]);
    const [listGroup, setListGroup] = useState<[]>([]);
    const [listFriend, setListFriend] = useState<[]>([]);
    const [listUserAddFriend, setListUserAddFriend] = useState<[]>([]);
    const [inputSearchUser, setInputSearchUser] = useState<string>("");
    const [inputSearchAddFriend, setInputSearchAddFriend] = useState<string>("")
    const [inputSearchCreateGroup, setInputSearchCreateGroup] = useState<string>("");

    useEffect(() => {
        socket.on("receive_result_search_user", (data) => {

        })

        socket.on("get_user_chat_private", (data) => {
            console.log(data);
            setListUser(data);
        })

        socket.on("get_user_chat_group", (data) => {
            setListGroup(data);
        })

        socket.on("get_search_add_friend", (data) => {
            data = data.filter((target: object) => target.userId !== user.userId);
            setListUserAddFriend(data);
        })

        socket.on("get_user_friend", (data) => {
            console.log(data);
            setListFriend(data);
        })
    }, []);

    useEffect(() => {
        if (tabChat === "private") {
            socket.emit("send_get_user_chat_private")
        } else if(tabChat === "group") {
            socket.emit("send_get_user_chat_group")
        } else {
            socket.emit("send_get_user_friend", { senderId: user.userId });
        }
    }, [tabChat]);

    useEffect(() => {
        if(inputSearchAddFriend.length > 0) {
            socket.emit("send_request_search_add_friend", {"input": inputSearchAddFriend});
        }
    }, [inputSearchAddFriend]);

    useLayoutEffect(() => {
        socket.emit("send_request_search_user", {"inputSearch": inputSearchUser});
    }, [inputSearchUser]);

    const solveAddFriend: void = (senderId: string, receiverId: string) => {
        socket.emit("send_request_add_friend", { "senderId": senderId, "receiverId": receiverId });
    }

    const changeInputSearch = (event) => {
        setInputSearchUser(event.target.value);
    }

    const checkRoleUser: string = (role: string) => {
        if(role === "USER") {
            return tabLanguage.add_friend_modal.role.user;
        } else if(role === "DOCTOR") {
            return tabLanguage.add_friend_modal.role.doctor;
        } else {
            return tabLanguage.add_friend_modal.role.admin;
        }
    }

    const checkFriendStatus = (status: number) => {
        if(status === 0) {
            return tabLanguage.tab_friend.status.wait;
        } else {
            return tabLanguage.tab_friend.status.friend;
        }
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
                                        <List>
                                            {listUserAddFriend.map((target: object, index: number) => {
                                                return (
                                                    <ListItem
                                                        key={index.toString()}
                                                        alignItems={"center"}
                                                        secondaryAction={
                                                            <Button variant={"contained"} color={"success"}
                                                                    onClick={() => solveAddFriend(user.userId, target.userId)}>{tabLanguage.add_friend_modal.btn_add}
                                                            </Button>
                                                        }
                                                    >
                                                        <ListItemAvatar>
                                                            <Avatar alt={target.username} src={target.avatar} />
                                                        </ListItemAvatar>
                                                        <ListItemText
                                                            primary={target.username + " - " + target.userId}
                                                            secondary={tabLanguage.add_friend_modal.role.title + ": " + checkRoleUser(target.role.roleName)}
                                                        />
                                                    </ListItem>
                                                )
                                            })}
                                        </List>
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
                    <Tab label={tabLanguage.tabs.private_chat} value={"private"} className={"col-4"}/>
                    <Tab label={tabLanguage.tabs.group_chat} value={"group"} className={"col-4"}/>
                    <Tab label={tabLanguage.tabs.list_friend} value={"friend"} className={"col-4"}/>
                </Tabs>
            </Box>
            <List className={"w-100 h-100"}>
                { tabChat === "friend" && listFriend.map((friend: object, index: number) => {
                    return (
                        <ListItem
                            key={index.toString()}
                            alignItems={"center"}
                        >
                            <ListItemAvatar>
                                <Avatar alt={friend.username} src={friend.avatar} />
                            </ListItemAvatar>
                            <ListItemText
                                primary={friend.firstName + " " + friend.lastName}
                                secondary={tabLanguage.add_friend_modal.role.title + ": " + checkRoleUser(friend.role) + " - " + checkFriendStatus(friend.friend_status)}
                            />
                        </ListItem>
                    )
                })}
            </List>
        </Stack>
    )
}