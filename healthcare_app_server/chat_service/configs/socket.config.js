const {Server} = require("socket.io");
const kafka = require("./kafka.config")
const {Partitioners} = require("kafkajs");

const run = (server) => {
    const io = new Server(server, {
        path: "/chat"
    });

    io.on("connection", async (socket) => {
        doctor(socket);
        patient(socket);
    })

    const doctor = (socket) => {
        // Doctor joining the room
        socket.on("doctorJoinRoom", (data) => {
            socket.join("clinic: " + data.scheduleId);
            socket.join("waiting: " + data.scheduleId);

            socket.to("waiting: " + data.scheduleId).emit("doctorJoined", data);
        })

        //The doctor accepts a patient join the call room
        socket.on("acceptPatient", (data) => {
            socket.to("waiting: " + data.scheduleId).emit("patientAccepted", data);
            socket.to("waiting: " + data.scheduleId).emit("queueUpdate", data);
        })

        //The doctor rejects a patient join the call room
        socket.on("removeWaitingQueue", (data) => {
            socket.to("waiting: " + data.scheduleId).emit("removePatient", data);
        })

        //The doctor was finished the call room
        socket.on("finishExamination", (data) => {
            const producer = kafka.producer({
                allowAutoTopicCreation: true,
                createPartitioner: Partitioners.LegacyPartitioner,
                retry: { retries: 5 }
            });
            (async () => {
                await producer.connect();

                const message = {
                    topic: "update_status_bookAppointment",
                    messages: [{ value: JSON.stringify({ data, "status": "DONE" })}]
                };

                await producer.send(message);
                await producer.disconnect();
            })().catch((error) => { console.log(error) })

            socket.to("clinic: " + data.currentPatient.scheduleId).emit("patientDone", data);
        })
    }

    const patient = (socket) => {
        //The patient joining the waiting room
        socket.on("joinWaitingQueue", (data) => {
            socket.join("waiting: " + data.scheduleId);
            socket.to("waiting: " + data.scheduleId).emit("patientQueueUpdate", data);
        })

        //The patient joining the call room
        socket.on("patientJoinRoom", (data) => {
            socket.to("waiting: " + data.scheduleId).emit("queueUpdate", data);

            socket.leave("waiting: " + data.scheduleId);
            socket.join("clinic: " + data.scheduleId);
        })

        //The patient cancel joining the waiting room
        socket.on("cancelWaitingQueue", (data) => {
            socket.to("waiting: " + data.scheduleId).emit("listenCancelWaitingQueue", data);
        })
    }
}

module.exports = run;