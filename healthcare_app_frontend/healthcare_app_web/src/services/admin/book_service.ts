import axiosConfig from "../axiosConfig";

const prefix = "admin/api/v1/appointments";

export const getCancelBookings = async () => {
  const response = await axiosConfig.get(`${prefix}/status`, {
    params: {
      status: "CANCELLED",
    },
  });
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
