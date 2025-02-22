const getPool = require("../../configs/mariadb.config");
const Friend = require("../../models/mariadb/friend");

class FriendRepository {
    async addFriend(senderId, receiverId) {
        const friend = new Friend(senderId, receiverId);
        const conn = (await getPool()).getConnection();
        const result = conn.then(conn => conn.query(
            `INSERT INTO friend (sender_id, receiver_id, created_at, updated_at, status) VALUES (?, ?, ?, ?, ?)`,
            [friend.sender, friend.receiver, friend.created_at, friend.updated_at, friend.status])
        ).catch(error => {
            console.log(error);
            return null;
        })
    }

    async getFriendBySenderId(senderId) {
        const conn = (await getPool()).getConnection();
        return await conn.then(async (conn) => await conn.query(
            `SELECT * FROM friend WHERE sender_id = ?`,
            [senderId]).then(result => result)
        ).catch(error => {
            console.log(error);
            return null;
        })
    }
}

module.exports = FriendRepository;