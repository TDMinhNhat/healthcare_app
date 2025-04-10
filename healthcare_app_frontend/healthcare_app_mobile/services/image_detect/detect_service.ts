import axios from "axios";
import axiosConfig from "../axiosConfig";

const API_URL = `http://${process.env.EXPO_PUBLIC_HOST_ID}:8081/image_detect/face`;

export const registerFace = async (blob: Blob) => {
  const formData = new FormData();
  formData.append("file", blob, "image.jpg");

  const response = await axios.post(`${API_URL}/register`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const detectFace = async (blob: Blob) => {
  const formData = new FormData();
  formData.append("file", blob, "image.jpg");

  const response = await axios.post(`${API_URL}/auth`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
