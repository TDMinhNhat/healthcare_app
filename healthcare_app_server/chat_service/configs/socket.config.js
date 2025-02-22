const { Server } = require("socket.io");
const userFeign = require("../feigns/user.feign");
const FriendRepository = require("../repositories/mariadb/friend.repository");

const run = (server) => {
    const io = new Server(server, {
        path: "/chat"
    });

    io.on("connection", async (socket) => {
        socket.on("send_request_search_user", (data) => {
            io.to(socket.id).emit("receive_result_search_user", "Hello from server");
        })

        socket.on("send_get_user_chat_private", () => {
            io.to(socket.id).emit("get_user_chat_private", "List Private");
        })

        socket.on("send_get_user_chat_group", () => {
            io.to(socket.id).emit("get_user_chat_group", "List Group");
        })

        socket.on("send_request_search_add_friend", async(data) => {
            const result = await userFeign.getListSearchUser(data.input).then(response => response.data).catch(error => {
                console.log(error);
                return error;
            })

            io.to(socket.id).emit("get_search_add_friend", result);
        })

        socket.on("send_request_add_friend", (data) => {
            const senderId = data.senderId;
            const receiverId = data.receiverId;

            const friendRepository = new FriendRepository();
            friendRepository.addFriend(senderId, receiverId);
        })
    })
}

module.exports = run;