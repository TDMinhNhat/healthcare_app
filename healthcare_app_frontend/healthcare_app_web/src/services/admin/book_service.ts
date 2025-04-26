import axiosConfig from "../axiosConfig";

const prefix = "admin/api/v1/appointments";

export const getBookingsByStatus = async (status: string) => {
  const response = await axiosConfig.get(`${prefix}/status`, {
    params: {
      status: status,
    },
  });
  return response;
};

export const getAllBookings = async () => {
  const response = await axiosConfig.get(`${prefix}`);
  return response;
};

// Đánh dấu là đã hoàn tiền
export const assignPayback = async (bookAppointmentId: string) => {
  const response = await axiosConfig.post(
    `${prefix}/assign_paybackment`,
    null,
    {
      params: {
        bookAppointmentId: bookAppointmentId,
      },
    }
  );
  return response;
};
