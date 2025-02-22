const mariadb = require("mariadb")

async function checkAndCreateDb() {
    const conn = await mariadb.createConnection({
        host: "localhost",
        user: "root",
        password: "123456789",
        port: 3306
    })

    await conn.query("CREATE DATABASE IF NOT EXISTS chat_service")

    await conn.query("USE chat_service")

    await conn.query(`
        CREATE TABLE IF NOT EXISTS friend (
            sender_id NVARCHAR(50) NOT NULL,
            receiver_id NVARCHAR(50) NOT NULL,
            status INT NOT NULL,
            created_at DATETIME NOT NULL,
            updated_at DATETIME NOT NULL,
            PRIMARY KEY (sender_id, receiver_id)
        )
    `)

    await conn.query(`
        CREATE TABLE IF NOT EXISTS \`group\` (
            id BIGINT NOT NULL AUTO_INCREMENT,
            group_id NVARCHAR(15) NOT NULL,
            group_name NVARCHAR(100) NOT NULL,
            group_description NVARCHAR(1000),
            allow_join BOOLEAN NOT NULL,
            allow_invite BOOLEAN NOT NULL,
            allow_notification BOOLEAN NOT NULL,
            allow_chat BOOLEAN NOT NULL,
            wait_for_response BOOLEAN NOT NULL,
            created_at DATETIME NOT NULL,
            updated_at DATETIME NOT NULL,
            status INT NOT NULL,
            PRIMARY KEY (id)
        )
    `)
}

async function getPool() {
    await checkAndCreateDb();

    return mariadb.createPool({
        host: "localhost",
        user: "root",
        password: "123456789",
        database: "chat_service",
        connectionLimit: 10
    });
}

module.exports = getPool;