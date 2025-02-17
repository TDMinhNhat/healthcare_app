var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var app = express();
var {Server} = require("socket.io")
var {Eureka} = require("eureka-js-client")
const server = require('http').createServer(app);
const Doctor = require("./models/doctor.js");
const DoctorRepository = require("./repositories/doctor.repository.js");

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Connect to eureka server
const client = new Eureka({
    instance: {
        app: "GPS_SERVICE",
        hostName: "localhost",
        ipAddr: "127.0.0.1",
        port: {
            "$": 3000,
            "@enabled": true
        },
        vipAddress: "gps_service",
        dataCenterInfo: {
            "@class": "com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo",
            name: "MyOwn"
        },
        leaseInfo: {
            renewalIntervalInSecs: 30,
            durationInSecs: 90,
        },
    },
    eureka: {
        host: "localhost",
        port: 8761,
        servicePath: "/eureka/apps/",
    }
})
client.start((error) => {
    console.log(error || "Eureka started!")
})

// Websocket server
const io = new Server(server, {
    path: "/gps"
})
io.on("connection", async (socket) => {
    socket.on("send_doctor_connect", async (data) => {
        const doctor = new Doctor(
            data.userId,
            data.latitude,
            data.longitude
        )

        const result = await new DoctorRepository().add(doctor);
        const getListDoctorConnect = await new DoctorRepository().getAll();
        // io.emit("get_doctor_connect", data);
        io.emit("get_all_doctors_connect", getListDoctorConnect);
    })

    socket.on("send_doctor_disconnect", async (data) => {
        /*io.emit("get_doctor_disconnect", data);*/
        await new DoctorRepository().delete(data)
        const getListDoctorConnect = await new DoctorRepository().getAll();
        io.emit("get_all_doctors_connect", getListDoctorConnect)
    })
})

// Server listening
server.listen(3000, () => {
    console.log("The server running port 3000")
})

module.exports = app;
