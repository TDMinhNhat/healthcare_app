import {useEffect, useRef} from 'react';
import WebCam from 'react-webcam';
import {Box, Container, Typography} from "@mui/material";
import axios from "axios";

function FindDoctorComponent({ language }:{ language: object }) {

    const webcamRef = useRef(null);
    let intervalId = useRef(null);

    const checkCameraPermission = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            stream.getTracks().forEach(track => track.stop());
            return true;
        } catch (error) {
            console.log("Camera is not access: ", error);
            return false;
        }
    }

    useEffect(() => {
        intervalId.current = setInterval(async () => {

            const hasPermission = await checkCameraPermission();
            if(!hasPermission) {
                console.log("Camera is required for authentication");
                return;
            }

            const base64Image = webcamRef.current.getScreenshot();
            const byteCharacters = atob(base64Image.split(",")[1]);
            const byteNumbers = new Array(byteCharacters.length).fill().map((_, i) => byteCharacters.charCodeAt(i));
            const byteArray = new Uint8Array(byteNumbers);

            for (let i = 0; i < byteCharacters.length; i++) {
                byteArray[i] = byteCharacters.charCodeAt(i);
            }

            const blob = new Blob([byteArray], { type: "image/jpeg" });

            const formData = new FormData();
            formData.append("file", blob, "image.jpg");

            const result = await axios.post("http://localhost:8000/image_detect/face/auth", formData,{
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }).then(response => response.data).catch(error => console.log("Server return an error: ", error))

            if(result === 200) {
                clearInterval(intervalId.current);
            } else {
                console.log(result);
            }
        }, 2000)
    }, [])

    return (
        <Container>
            <Box>
                <Typography>{language.face_detect.title}</Typography>
                <Typography>{language.face_detect.description}</Typography>
            </Box>
            <WebCam
                audio={false}
                height={720}
                width={1280}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{
                    facingMode: "face"
                }}
                screenshotQuality={1}
                onUserMedia={() => {
                    console.log('a');
                }}
            />
            <Box>
                <Typography>{language.face_detect.notice}</Typography>
            </Box>
        </Container>
    )
}

export default FindDoctorComponent;