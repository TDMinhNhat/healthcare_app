import { useLayoutEffect } from "react";
import {io} from "socket.io-client";

const socket = io("ws://localhost:8081", {
    path: "/chat",
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 10,
    autoConnect: false
});
socket.on("connect", () => {
    console.log("Success connect to the server");
})

export default function ChatPage({ chatLanguage }:{ chatLanguage: object }) {
    useLayoutEffect(() => {
        socket.connect();
    }, [])

    return (
        <h1>Chat Page</h1>
    )
}