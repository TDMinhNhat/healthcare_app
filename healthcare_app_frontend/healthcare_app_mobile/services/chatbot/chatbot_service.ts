import axiosConfig from "../axiosConfig";

export const sendMessage = async (message: string) => {
  const response = await axiosConfig.post("/chatbot/api/v1/chat/send", {
    message: message,
  });
  return response.data;
};
