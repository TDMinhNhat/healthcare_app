import {useLayoutEffect, useState} from "react";
import {useSelector} from "react-redux";
import {Box, Typography} from "@mui/material";
import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import DoctorLocationComponent from "./gps/DoctorLocationComponent.tsx";
import "leaflet/dist/leaflet.css";
import {io} from "socket.io-client";

const socket = io("ws://localhost:8081", {
    path: "/gps",
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 10
});
socket.on("connect", () => {
    console.log("Success connect socket to the server");
})

export default function GPSMapComponent({ language }: { language: object }) {

    const [successDetectGPS, setSuccessDetectGPS] = useState(false);
    const [latitude, setLatitude] = useState<number | null>();
    const [longitude, setLongitude] = useState<number | null>();
    const user = useSelector((state) => state.user);

    useLayoutEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const getLatitude: number = position.coords.latitude;
                    const getLongitude: number = position.coords.longitude;
                    socket.emit("send_doctor_connect", {latitude: getLatitude, longitude: getLongitude, userId: user.userId});
                    setLatitude(getLatitude);
                    setLongitude(getLongitude);
                    setSuccessDetectGPS(true);
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

        window.addEventListener("beforeunload", () => {
            console.log("User disconnect: ", user.userId + " at " + latitude + " " + longitude);
            socket.emit("send_doctor_disconnect", {latitude: latitude, longitude: longitude, userId: user.userId});
            socket.close();
        })
    }, []);



    const position = () => {
        if (latitude !== undefined && longitude !== undefined) {
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

                    <DoctorLocationComponent latitude={latitude} longitude={longitude} socket={socket} />
                </MapContainer>
            )}
        </Box>
    )
}