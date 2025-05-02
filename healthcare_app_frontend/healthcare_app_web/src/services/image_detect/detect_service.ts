import axiosConfig from "../axiosConfig";

const prefix = "/image_detect/face/register";

export const registerFace = async (blob: Blob) => {
  const formData = new FormData();
  formData.append("file", blob, "image.jpg");

  const response = await axiosConfig.post(`${prefix}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
