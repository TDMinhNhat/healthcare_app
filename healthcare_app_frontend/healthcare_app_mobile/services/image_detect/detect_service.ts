import axios from "axios";
import axiosConfig from "../axiosConfig";
import mime from "mime";

const prefix = `/image_detect/face`;

export const registerFace = async (image: { uri: string; type?: string }) => {
  const formData = new FormData();

  formData.append("file", {
    uri: image.uri,
    name: image.uri.split("/").pop(), // lấy phần tử cuối cùng trong đường dẫn, là file name
    type: image.type || mime.getType(image.uri) || "image/jpeg",
  });

  const response = await axiosConfig.post(`${prefix}/register`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    transformRequest: (data, headers) => {
      return formData; // ensures formData is passed as-is
    },
    onUploadProgress: (progressEvent) => {
      // use upload data, since it's an upload progress
      // iOS: {"isTrusted": false, "lengthComputable": true, "loaded": 123, "total": 98902}
    },
  });
  return response.data;
};

export const detectFace = async (image: { uri: string; type?: string }) => {
  const formData = new FormData();

  formData.append("file", {
    uri: image.uri,
    name: image.uri.split("/").pop(),
    type: image.type || mime.getType(image.uri) || "image/jpeg",
  });

  const response = await axiosConfig.post(`${prefix}/auth`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    transformRequest: (data, headers) => {
      return formData; // ensures formData is passed as-is
    },
  });
  return response.data;
};
