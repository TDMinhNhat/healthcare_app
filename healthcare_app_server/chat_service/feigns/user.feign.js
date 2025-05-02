const axios = require("axios");

const getUserIdByRoomId = async (roomId) => {
    return await axios({
        method: "get",
        url: "http://localhost:11000/appointment/api/v1/appointments/roomId",
        params: {
            "roomId": roomId
        }
    }).then((response) => response.data).catch((error) => {
        console.log(error);
        return null;
    })
}

module.exports = { getUserIdByRoomId };