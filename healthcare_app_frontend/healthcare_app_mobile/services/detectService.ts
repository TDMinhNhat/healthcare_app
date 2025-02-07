import axios from "axios";

const API_URL = "http://192.168.1.10:3000";

export const detect = async (formData: FormData) => {
  try {
    const response = await axios.post(`${API_URL}/detect`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};
