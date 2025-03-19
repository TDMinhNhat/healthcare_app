const {Server} = require("socket.io");

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
        })

        //The doctor accepts a patient join the call room
        socket.on("acceptPatient", (data) => {
            socket.to("waiting: " + data.scheduleId).emit("patientAccepted", data);
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
            socket.leave("waiting: " + data.scheduleId);
            socket.join("clinic: " + data.scheduleId);
        })
    }
}

module.exports = run;