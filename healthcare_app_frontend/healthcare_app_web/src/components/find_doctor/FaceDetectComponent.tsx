import {Box, Container, Typography} from "@mui/material";
import WebCam from "react-webcam";
import {useEffect, useRef} from "react";
import axios from "axios";
import {useSelector, useDispatch} from "react-redux";
import { setUser } from "../../stores/slices/user.slice.ts";

export default function FaceDetectComponent({language, setStep}: { language: object, setStep: void }) {

    let intervalId = useRef(null)
    const webcamRef = useRef(null);
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const checkCameraPermission = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({video: true});
            stream.getTracks().forEach(track => track.stop());
            return true;
        } catch (error) {
            console.log("Camera is not access: ", error);
            return false;
        }
    }

    useEffect(() => {
        if(user == null) {
            intervalId.current = setInterval(async () => {
                const hasPermission = await checkCameraPermission();
                if (!hasPermission) {
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

                const blob = new Blob([byteArray], {type: "image/jpeg"});

                const formData = new FormData();
                formData.append("file", blob, "image.jpg");

                const result = await axios.post("http://localhost:8081/image_detect/face/auth", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }).then(response => response.data).catch(error => console.log("Server return an error: ", error))
                if (result.code === 200) {
                    if (result.message !== "New User") {
                        stopCamera();
                        sessionStorage.setItem("user", result.data);
                        dispatch(setUser(result.data))
                        setStep("gps");
                    } else {
                        sessionStorage.setItem("face_detect", result.data);
                        setStep("info");
                    }
                } else {
                    console.log(result);
                }
            }, 2000)

            return () => {
                clearInterval(intervalId.current)
            }
        } else {
            setStep("gps");
        }

    }, [])

    const stopCamera = () => {
        if (webcamRef.current && webcamRef.current.video) {
            const stream = webcamRef.current.video.srcObject;
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
                webcamRef.current.video.srcObject = null;
            }
        }
    }

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