import {Socket} from "socket.io-client";
import {Marker, Popup} from "react-leaflet";
import {Typography} from "@mui/material";
import {useState, useEffect} from "react";

export default function DoctorLocationComponent({ latitude, longitude, socket }: { latitude: number, longitude: number ,socket: Socket }) {

    const [listDoctor, setListDoctor] = useState<[]>([]);

    useEffect(() => {
        socket.on("get_all_doctors_connect", (data: []) => {
            if(data.length === 0) {
                setListDoctor([]);
            }

            data.map((doctor: object) => {
                if((doctor.latitude === latitude && doctor.longitude === longitude) || doctor.latitude === null || doctor.longitude === null) {
                    console.log("A same as location or latitude or longitude is null");
                } else {
                    setListDoctor([...listDoctor, doctor]);
                }
            })
        })
    }, [])

    return (
        <>
            {listDoctor.map((doctor, index) => {
                return (
                    <Marker key={index.toString()} position={[doctor.latitude, doctor.longitude]}>
                        <Popup>
                            <Typography>{doctor.doctorId}</Typography>
                        </Popup>
                    </Marker>
                )
            })
            }
        </>
    )
}