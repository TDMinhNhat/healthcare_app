import { useLayoutEffect } from "react";
import {io} from "socket.io-client";
import {Box, Stack} from "@mui/material";
import ChatAreaComponent from "../components/chat/ChatAreaComponent.tsx";
import TabChatComponent from "../components/chat/TabChatComponent.tsx";

const socket = io("ws://localhost:8081", {
    path: "/chat",
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 10,
    autoConnect: false
});

export default function ChatPage({ chatLanguage }:{ chatLanguage: object }) {

    const user: object = JSON.parse(sessionStorage.getItem("user") as string);

    useLayoutEffect(() => {
        if(user !== null && user !== undefined) {
            socket.connect();
        } else {
            window.location.href = "/login";
        }
    }, [])

    return (
        <Stack direction={"row"} className={"w-100 h-100 d-flex flex-row position-fixed"}>
            <Box className={"col-3"}>
                <TabChatComponent tabLanguage={chatLanguage.tab} socket={socket} />
            </Box>
            <Box className={"col-9 bg-info"}>
                <ChatAreaComponent areaChatLanguage={chatLanguage.area_chat} socket={socket} />
            </Box>
        </Stack>
    )
}