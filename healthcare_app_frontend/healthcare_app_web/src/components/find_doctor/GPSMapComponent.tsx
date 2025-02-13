import {useEffect, useState} from "react";
import {Box, Typography} from "@mui/material";
import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { io } from "socket.io-client";

const socket = io("ws://localhost:8081", {
    path: "/gps",
    transports: ["websocket", "polling"],
});

socket.on("connect", () => {
    console.log("Success connect socket to the server");
    socket.emit("send_doctor_connect", {
        latitude: 10.822029 + Math.random() * 0.0001,
        longitude: 106.687045 + Math.random() * 0.0001,
        name: "Doctor " + Math.floor(Math.random() * 1000),
    })
})

export default function GPSMapComponent({ language }: { language: object }) {

    const [successDetectGPS, setSuccessDetectGPS] = useState(false);
    const [latitude, setLatitude] = useState<number | null>();
    const [longitude, setLongitude] = useState<number | null>();
    const [listDoctor, setListDoctor] = useState<[]>([]);

    socket.on("get_doctor_connect", (data) => {
        console.log("A doctor is connected to the server", data);
        setListDoctor([...listDoctor, data]);
    })

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setSuccessDetectGPS(true);
                    setLatitude(position.coords.latitude);
                    setLongitude(position.coords.longitude);
                },
                (error) => {
                    console.error("Error getting location:", error)
                    setSuccessDetectGPS(false);
                    setLatitude(10.822088);
                    setLongitude(106.686959);
                },
                {enableHighAccuracy: true, timeout: 10000, maximumAge: 0}
            );
        }
    }, []);

    const position = () => {
        if (latitude != undefined && longitude != undefined) {
            return [latitude, longitude];
        } else {
            return [10.822107, 106.686959];
        }
    }

    return (
        <Box className={"ms-0 me-0 mt-2 mb-2 container-fluid w-100 h-100"}>
            {latitude != undefined && longitude != undefined && (
                <MapContainer center={position()} zoom={23} scrollWheelZoom={true}
                              style={{height: "850px", width: "100%"}}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>

                    {successDetectGPS &&
                        <Marker position={position()}>
                            <Popup>
                                <Typography>You're here</Typography>
                            </Popup>
                        </Marker>
                    }

                    {listDoctor.map((doctor, index) => {
                            return (
                                <Marker key={index.toString()} position={[doctor.latitude, doctor.longitude]}>
                                    <Popup>
                                        <Typography>{doctor.name}</Typography>
                                    </Popup>
                                </Marker>
                            )
                        })
                    }
                </MapContainer>
            )}
        </Box>
    )
}