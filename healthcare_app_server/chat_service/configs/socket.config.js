const {Server} = require("socket.io");
const chat = require("../sockets/chat.socket");
const call = require("../sockets/call.socket");

const run = (server) => {
    const io = new Server(server, {
        path: "/chat"
    });

    io.on("connection", async (socket) => {
        console.log("A user has connected to the server");

        chat(socket);
        call(socket);
    })
}

module.exports = run;