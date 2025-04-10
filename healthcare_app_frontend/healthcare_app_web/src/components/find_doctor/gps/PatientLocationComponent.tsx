import { Socket } from "socket.io-client";
import { Marker, Popup } from "react-leaflet";
import { Typography, Box } from "@mui/material";
import { useState, useEffect } from "react";
import L from "leaflet";

export default function PatientLocationComponent({
  latitude,
  longitude,
  socket,
}: {
  latitude: number;
  longitude: number;
  socket: Socket;
}) {
  const [listPatients, setListPatients] = useState<[]>([]);

  const markerIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png", // Custom icon URL
    iconSize: [40, 40], // Width & Height of icon
    iconAnchor: [20, 40], // Anchor point of the icon
    popupAnchor: [0, -40], // Where the popup appears relative to the marker
  });

  useEffect(() => {
    socket.on("get_all_doctors_connect", (data: []) => {
      if (data.length === 0) {
        setListPatients([]);
      }

      data.map((patient: any) => {
        if (
          (patient.latitude === latitude && patient.longitude === longitude) ||
          patient.latitude === null ||
          patient.longitude === null
        ) {
          console.log("A same as location or latitude or longitude is null");
        } else {
          setListPatients([...listPatients, patient]);
        }
      });
    });
  }, []);

  return (
    <>
      {listPatients.map((patient, index) => {
        return (
          <Marker
            key={index.toString()}
            position={[patient.latitude, patient.longitude]}
            icon={markerIcon}
          >
            <Popup>
              <Box sx={{ p: 1 }}>
                <Typography variant="h6">{`${patient.firstName} ${patient.lastName}`}</Typography>
                <Typography variant="body2">ID: {patient.userId}</Typography>
                <Typography variant="body2">Phone: {patient.phone}</Typography>
                <Typography variant="body2">Email: {patient.email}</Typography>
                <Typography variant="body2">
                  Gender: {patient.sex ? "Male" : "Female"}
                </Typography>
                {patient.dob && (
                  <Typography variant="body2">
                    DOB: {new Date(patient.dob).toLocaleDateString()}
                  </Typography>
                )}
              </Box>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
}
