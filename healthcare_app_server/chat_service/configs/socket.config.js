const {Server} = require("socket.io");
const {updateBookAppointmentStatus} = require("../feigns/book-appointment.feign");

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
            socket.to("clinic: " + data.scheduleId).emit("patientDone", data);
            updateBookAppointmentStatus(data.bookAppointment.id, "DONE").catch((error) => { console.log(error) });
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
    }
}

module.exports = run;