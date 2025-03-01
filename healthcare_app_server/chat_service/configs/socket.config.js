const {Server} = require("socket.io");
const chat = require("../sockets/chat.socket");
const call = require("../sockets/call.socket");
const redisClient = require("../configs/redis.config");

const run = (server) => {
    const io = new Server(server, {
        path: "/chat"
    });

    io.on("connection", async (socket) => {
        console.log("A user has connected to the server");

        socket.on("send_user_connect", (data) => {
            const { userId } = data;
            redisClient.set(userId, socket.id);
        })

        chat(socket);
        call(socket);
    })
}

module.exports = run;