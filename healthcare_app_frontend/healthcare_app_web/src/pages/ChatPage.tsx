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
socket.on("connect", () => {

})

export default function ChatPage({ chatLanguage }:{ chatLanguage: object }) {
    useLayoutEffect(() => {
        socket.connect();
    }, [])

    return (
        <Stack direction={"row"} className={"w-100 h-100 d-flex flex-row position-fixed"}>
            <Box className={"col-3 bg-black"}>
                <TabChatComponent />
            </Box>
            <Box className={"col-9 bg-info"}>
                <ChatAreaComponent />
            </Box>
        </Stack>
    )
}