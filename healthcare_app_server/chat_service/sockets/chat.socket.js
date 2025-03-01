const { getUserIdByRoomId } = require("../feigns/user.feign");
const redisClient = require("../configs/redis.config");

module.exports = (socket) => {
    console.log("Working on chat socket");

    socket.on("send_chat_message", (data) => {
        const {userId, roomId} = data;
        getUserIdByRoomId(roomId).then((response) => {
            const data = response.data;
            const {patient, doctor} = data;
            const receiverId = userId === patient ? doctor : patient;
            redisClient.get(receiverId, (error, receiverSocketId) => {
                if (error) {
                    console.log(error);
                } else {
                    socket.to(receiverSocketId).emit("receive_chat_message", data);
                }
            })
        })
    })
}