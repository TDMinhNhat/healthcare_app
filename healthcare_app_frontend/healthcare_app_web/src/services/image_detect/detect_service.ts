import axios from "axios";
import axiosConfig from "../axiosConfig";

const API_URL = "http://localhost:8081/image_detect/face/register";

export const registerFace = async (blob: Blob) => {
  const formData = new FormData();
  formData.append("file", blob, "image.jpg");

  const response = await axios.post(`${API_URL}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
