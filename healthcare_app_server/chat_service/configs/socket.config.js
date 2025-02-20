const { Server } = require("socket.io");

const run = (server) => {
    const io = new Server(server, {
        path: "/chat"
    });

    io.on("connection", async (socket) => {
        console.log("A user has connected to the server");
    })
}

module.exports = run;