import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  CardMedia,
  Alert,
  CircularProgress,
} from "@mui/material";
import { checkPayment } from "../../services/appointment/payment_service";
import {
  getAppointmentPrice,
  getAppointmentPriceByTypeDisease,
} from "../../services/appointment/price_service";
import { v4 as uuidv4 } from "uuid";
import { format, subHours } from "date-fns"; // Import date-fns functions
import { useSelector } from "react-redux";
import { Client } from "@stomp/stompjs";

interface PaymentCheckoutProps {
  onPaymentComplete: (paymentContent: string) => Promise<void>; // Hàm gọi khi thanh toán hoàn tất
  workSchedule: any; // Thông tin lịch làm việc của bác sĩ
  service: any; // Thông tin dịch vụ đã chọn
  loading: boolean; // Trạng thái đang xử lý
}

const PaymentCheckout: React.FC<PaymentCheckoutProps> = ({
  onPaymentComplete, // gọi nó khi check thành công để tạo lịch hẹn
  workSchedule,
  service, // thông tin dịch vụ đã chọn
  loading,
}) => {
  const user = useSelector((state: any) => state.user.user); // Lấy thông tin người dùng từ Redux store
  const [appointmentFee, setAppointmentFee] = useState<number>(0); // Phí khám bệnh từ API
  const [fetchingPrice, setFetchingPrice] = useState<boolean>(true); // Trạng thái đang tải giá
  const [priceError, setPriceError] = useState<string | null>(null); // Lỗi khi lấy giá
  const code = workSchedule.id + user.userId.replace(/-/g, ""); // Tạo mã giao dịch duy nhất
  const acc = import.meta.env.VITE_ACC; // Số tài khoản từ biến môi trường
  const bank = import.meta.env.VITE_BANK; // Mã ngân hàng từ biến môi trường
  // Biến trạng thái cho việc xác minh thanh toán
  const [verifyingPayment, setVerifyingPayment] = useState(false);
  // Thêm state để hiển thị thông báo lỗi
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const getIntervalNumber = useRef<Timeout | null>(null);

  const client = new Client({
    brokerURL: "ws://localhost:8081/appointment/socket",
    onConnect: () => {
      client.subscribe("/patient/result_check_payment", () => {
        setVerifyingPayment(true);
      });
    },
  });

  // Fetch giá phí khám bệnh từ API
  useEffect(() => {
    const fetchAppointmentPrice = async () => {
      try {
        setFetchingPrice(true);
        setPriceError(null);

        let response;
        if (service && service.name) {
          response = await getAppointmentPriceByTypeDisease(service.name);

          // Nếu dữ liệu là null, dù code là 200, lấy giá mặc định
          if (response.code === 200 && !response.data) {
            response = await getAppointmentPrice();
          }
        } else {
          // Nếu không có thông tin service, lấy giá mặc định
          response = await getAppointmentPrice();
        }
        console.log("response", response);
        if (response.code === 200 && response.data) {
          // Nếu dữ liệu là mảng, lọc ra các giá hợp lệ
          if (Array.isArray(response.data)) {
            const validPrices = response.data.filter(
              (item) => item.status === true
            );
            if (validPrices.length > 0) {
              setAppointmentFee(validPrices[0].price);
            } else {
              setPriceError("Không tìm thấy thông tin giá hợp lệ");
            }
          } else {
            setAppointmentFee(response.data.price);
          }
        } else {
          setPriceError("Không thể lấy thông tin phí khám bệnh");
          console.error("API error:", response);
        }
      } catch (error) {
        setPriceError("Có lỗi xảy ra khi lấy thông tin phí khám bệnh");
        console.error("Failed to fetch appointment price:", error);
      } finally {
        setFetchingPrice(false);
      }
    };

    fetchAppointmentPrice();
  }, [service]);

  useEffect(() => {
    client.activate();

    getIntervalNumber.current = setInterval(() => {
      if (appointmentFee > 0) {
        client.publish({
          destination: "/app/check_payment",
          body: JSON.stringify({
            amount_in: appointmentFee,
            transaction_content: code,
          }),
        });

        if (verifyingPayment) {
          onPaymentComplete(code).catch((error) => {
            console.log(error);
            setPaymentError(
              "Có lỗi xảy ra trong quá trình xác minh thanh toán."
            );
          });
        }
      }
    }, 1000);

    return () => {
      client.deactivate();
      clearInterval(getIntervalNumber.current);
    };
  }, [appointmentFee, verifyingPayment, code, client, onPaymentComplete]);

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Thông tin thanh toán
        </Typography>

        {fetchingPrice ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
            <CircularProgress size={24} />
            <Typography variant="body2" sx={{ ml: 2 }}>
              Đang tải thông tin phí khám bệnh...
            </Typography>
          </Box>
        ) : priceError ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {priceError}
          </Alert>
        ) : (
          <Typography variant="body1" sx={{ mb: 2 }}>
            Phí khám bệnh: {appointmentFee.toLocaleString("vi-VN")} VNĐ
          </Typography>
        )}

        {paymentError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {paymentError}
          </Alert>
        )}

        {!fetchingPrice && !priceError && (
          <Grid
            container
            spacing={2}
            alignItems="center"
            justifyContent="center"
            sx={{ mt: 2, mb: 2 }}
          >
            {/* Phần hiển thị mã QR */}
            <Grid
              item
              xs={12}
              md={5}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <CardMedia
                component="img"
                image={`https://qr.sepay.vn/img?bank=${bank}&acc=${acc}&template=compact&amount=${appointmentFee}&des=${code}`}
                alt="QR Payment Code"
                sx={{
                  width: { xs: "100%", sm: "80%", md: "100%" },
                  maxWidth: "250px",
                  height: "auto",
                }}
              />
            </Grid>
            {/* Phần hiển thị thông tin chuyển khoản */}
            <Grid item xs={12} md={7}>
              <Box sx={{ p: { xs: 2, md: 3 } }}>
                <Typography variant="body1" gutterBottom>
                  <strong>Thông tin chuyển khoản:</strong>
                </Typography>

                <Grid container spacing={1} mt={1}>
                  <Grid item xs={5}>
                    <Typography variant="body2">Chủ tài khoản:</Typography>
                  </Grid>
                  <Grid item xs={7}>
                    <Typography variant="body2" fontWeight="bold">
                      NGUYEN HO DANG QUANG
                    </Typography>
                  </Grid>

                  <Grid item xs={5}>
                    <Typography variant="body2">Ngân hàng:</Typography>
                  </Grid>
                  <Grid item xs={7}>
                    <Typography variant="body2" fontWeight="bold">
                      Ngân hàng TMCP Đầu tư và Phát triển Việt Nam (BIDV)
                    </Typography>
                  </Grid>

                  <Grid item xs={5}>
                    <Typography variant="body2">Số TK:</Typography>
                  </Grid>
                  <Grid item xs={7}>
                    <Typography variant="body2" fontWeight="bold">
                      {acc}
                    </Typography>
                  </Grid>

                  <Grid item xs={5}>
                    <Typography variant="body2">Số tiền:</Typography>
                  </Grid>
                  <Grid item xs={7}>
                    <Typography variant="body2" fontWeight="bold">
                      {appointmentFee.toLocaleString("vi-VN")}đ
                    </Typography>
                  </Grid>

                  <Grid item xs={5}>
                    <Typography variant="body2">Nội dung CK:</Typography>
                  </Grid>
                  <Grid item xs={7}>
                    <Typography variant="body2" fontWeight="bold">
                      {code}
                    </Typography>
                  </Grid>
                </Grid>

                <Typography variant="body2" sx={{ mt: 2 }}>
                  Sử dụng app ngân hàng để quét mã QR hoặc chuyển khoản thủ công
                  theo thông tin trên.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        )}
      </Paper>
    </Box>
  );
};

export default PaymentCheckout;
