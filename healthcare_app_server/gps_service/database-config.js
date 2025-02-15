const { createClient } = require("redis")

const client = createClient();

(async () => {
    await client.connect()
})().catch(error => console.log(error))

module.exports = client;