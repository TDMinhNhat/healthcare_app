const { Kafka } = require("kafkajs");

const kafka = new Kafka({
    clientId: "chat_service",
    brokers: ["localhost:9092"],
})

module.exports = kafka;