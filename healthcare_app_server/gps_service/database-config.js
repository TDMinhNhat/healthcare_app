import { createClient, RedisClient } from "node-redis"

const client = createClient();

client.on("error", err => console.log("Redis Error: ", err))
await client.connect();

module.exports = client;