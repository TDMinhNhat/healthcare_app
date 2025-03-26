var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var app = express();
var { Eureka } = require("eureka-js-client");
var server = require("http").createServer(app);
// var mongodb = require("./configs/mongodb.config");
var kafka = require("./configs/kafka.config");
var socketRun = require("./configs/socket.config.js");

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const client = new Eureka({
    instance: {
        app: "CHAT_SERVICE",
        hostName: "localhost",
        ipAddr: "127.0.0.1",
        port: {
            "$": 4000,
            "@enabled": true
        },
        vipAddress: "chat_service",
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

server.listen(4000, () => {
    console.log("The server is running the port 4000");
    socketRun(server);
})

module.exports = app;
