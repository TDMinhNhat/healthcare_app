const { Kafka } = require("kafkajs");

const kafka = new Kafka({
    clientId: "chat_service",
    brokers: ["kafka:29092"],
})

module.exports = kafka;