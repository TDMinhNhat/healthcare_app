import {Stack} from "@mui/material";
import WebCam, {Webcam} from "react-webcam";
import {useEffect, useRef} from "react";
import axios from "axios";
import registerAccount from "../../controllers/register.controller.ts";

function FaceDetectComponent({ registerLanguage, handleNext, registerUserData }:{ registerLanguage: object, handleNext: void, registerUserData: object }) {

    let intervalId = useRef(null)
    const webcamRef = useRef(null);

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

    const stopCamera = () => {
        if (webcamRef.current && webcamRef.current.video) {
            const stream = webcamRef.current.video.srcObject;
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
                webcamRef.current.video.srcObject = null;
            }
        }
    }

    useEffect(() => {
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

            const result = await axios.post("http://localhost:8081/image_detect/face/register", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }).then(response => response.data).catch(error => console.log("Server return an error: ", error))

            if(result.code === 200) {
                const imageDetect: string = result.data;
                const getRegisterData: object = registerUserData;
                const resultAddUser = await registerAccount.addUser(
                    getRegisterData.firstName,
                    getRegisterData.lastName,
                    getRegisterData.sex,
                    getRegisterData.phone,
                    getRegisterData.dob,
                    getRegisterData.username,
                    getRegisterData.email,
                    getRegisterData.password,
                    getRegisterData.address,
                    imageDetect
                ).then(response => response.data).catch(error => console.log(error));

                if(resultAddUser.code === 200) {
                    sessionStorage.setItem("register_user_id", resultAddUser.data.id);
                    stopCamera();
                    handleNext();
                }
            }
        }, 1000);

        return () => {
            clearInterval(intervalId.current);
        }
    }, []);

    return (
        <Stack direction={"column"} className={"w-100 h-100"}>
            <WebCam
                audio={false}
                height={800}
                width={800}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{
                    facingMode: "face"
                }}
                screenshotQuality={1}
            />
        </Stack>
    )
}

export default FaceDetectComponent;