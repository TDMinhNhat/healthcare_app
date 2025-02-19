const mariadb = require("mariadb")

const pool = mariadb.createPool({
    host: "localhost",
    user: "root",
    password: "123456789",
    connectionLimit: 10
})

conn = (async () => {
    await pool.getConnection()
})()

module.exports = conn;