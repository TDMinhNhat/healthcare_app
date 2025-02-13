import {useEffect, useState} from "react";
import {Container, Box, Typography} from "@mui/material";
import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function GPSMapComponent({ language }:{ language: object }) {

    const [latitude, setLatitude] = useState<number | null>();
    const [longitude, setLongitude] = useState<number | null>();

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLatitude(position.coords.latitude);
                    setLongitude(position.coords.longitude);
                },
                (error) => console.error("Error getting location:", error),
                {enableHighAccuracy: true, timeout: 10000, maximumAge: 0}
            );
        }
    }, []);

    return (
        <Box className={"ms-0 me-0 mt-2 mb-2 container-fluid w-100 h-100"}>
            { latitude != undefined && longitude != undefined && (
                <MapContainer center={[latitude, longitude]} zoom={23} scrollWheelZoom={true} style={{ height: "850px", width: "100%" }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                    <Marker position={[latitude, longitude]}>
                        <Popup>You are here!</Popup>
                    </Marker>
                </MapContainer>
            )}
            { latitude == undefined && longitude == undefined && (
                <Box>
                    <Typography>Make sure you had allow access your location to use</Typography>
                </Box>
            )}
        </Box>

    )
}