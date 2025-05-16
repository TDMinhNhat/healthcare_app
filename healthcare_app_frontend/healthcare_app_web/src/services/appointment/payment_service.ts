import axios from "axios";
import axiosConfig from "../axiosConfig";

const prefix = "appointment/api/v1/payment";

interface PaymentParams {
  accountNumber: string;
  subAccount: string;
  bankingName: string;
  price: number;
  bookAppointmentId: string;
  content: string;
}

export const createPayment = async (paymentParams: PaymentParams) => {
  const response = await axiosConfig.post(`${prefix}`, paymentParams);
  return response.data;
};

export const checkPayment = async (
  transaction_date_min: string,
  amount_in: number
) => {
  const response = await axios.get(
    `https://my.sepay.vn/userapi/transactions/list`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_TOKEN}`,
      },
      params: {
        account_number: import.meta.env.VITE_ACC,
        transaction_date_min: transaction_date_min,
        amount_in: amount_in,
      },
    }
  );
  return response.data;
};
