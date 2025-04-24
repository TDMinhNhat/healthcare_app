import axiosConfig from "../axiosConfig";

const prefix = "/appointment/api/v1/price/price_type";

export const getAppointmentPrice = async () => {
  const response = await axiosConfig.get(`${prefix}`, {
    params: {
      price_type: "BOOK_APPOINTMENT",
    },
  });
  return response.data;
};

export const getAppointmentPriceByTypeDisease = async (price_type: string) => {
  const response = await axiosConfig.get(`${prefix}`, {
    params: {
      price_type: price_type,
    },
  });
  return response.data;
};
