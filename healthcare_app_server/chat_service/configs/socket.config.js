const {Server} = require("socket.io");
const userFeign = require("../feigns/user.feign");
const FriendRepository = require("../repositories/mariadb/friend.repository");

const run = (server) => {
    const io = new Server(server, {
        path: "/chat"
    });

    io.on("connection", async (socket) => {

    })
}

module.exports = run;