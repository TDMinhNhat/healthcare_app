import {Socket} from "socket.io-client";
import {Marker, Popup} from "react-leaflet";
import {Typography} from "@mui/material";
import {useState, useEffect} from "react";

export default function DoctorLocationComponent({ latitude, longitude, socket }: { latitude: number, longitude: number ,socket: Socket }) {

    const [listDoctor, setListDoctor] = useState<[]>([]);

    useEffect(() => {
        socket.on("get_doctor_connect", (data) => {
            console.log(data);
            if((data.latitude === latitude && data.longitude === longitude) || data.latitude === null || data.longitude === null) {
                console.log("A same as location or latitude or longitude is null");
            } else {
                return setListDoctor([...listDoctor, data]);
            }
        })
    }, [])

    return (
        <>
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
        </>
    )
}