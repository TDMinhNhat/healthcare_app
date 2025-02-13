var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var app = express();
var {Server} = require("socket.io")
var {Eureka} = require("eureka-js-client")
const server = require('http').createServer(app);

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

// Server listening
server.listen(3000, () => {
    console.log("The server running port 3000")
})

module.exports = app;
