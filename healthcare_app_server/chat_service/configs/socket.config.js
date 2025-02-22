const {Server} = require("socket.io");
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

        socket.on("send_request_search_add_friend", async (data) => {
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

        socket.on("send_get_user_friend", async (data) => {
            const resultFriends = await new FriendRepository().getFriendBySenderId(data.senderId).then(result => result).catch(() => null);
            const result = await Promise.all(
                resultFriends.map(async (friend) => {
                    try {
                        const response = await userFeign.getUserInfo(friend.receiver_id)
                        return {
                            id: response.id,
                            userId: response.userId,
                            firstName: response.firstName,
                            lastName: response.lastName,
                            phone: response.phone,
                            avatar: response.avatar,
                            role: response.role.roleName,
                            friend_status: friend.status
                        }
                    } catch (error) {
                        console.log(error);
                        return null;
                    }
                })
            );
            io.to(socket.id).emit("get_user_friend", result);
        })
    })
}

module.exports = run;