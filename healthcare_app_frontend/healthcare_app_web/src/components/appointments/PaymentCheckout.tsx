import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  CardMedia,
  Alert,
} from "@mui/material";
import { checkPayment } from "../../services/appointment/payment_service";
import { v4 as uuidv4 } from "uuid";
import { format, subHours } from "date-fns"; // Import date-fns functions
import { useSelector } from "react-redux";

interface PaymentCheckoutProps {
  onPaymentComplete: () => Promise<void>; // Hàm gọi khi thanh toán hoàn tất
  workSchedule: any; // Thông tin lịch làm việc của bác sĩ
  loading: boolean; // Trạng thái đang xử lý
}

const PaymentCheckout: React.FC<PaymentCheckoutProps> = ({
  onPaymentComplete, // gọi nó khi check thành công để tạo lịch hẹn
  workSchedule,
  loading,
}) => {
  const user = useSelector((state: any) => state.user.user); // Lấy thông tin người dùng từ Redux store
  const appointmentFee = 5000; // Phí khám bệnh (đơn vị VND)
  const code = workSchedule.id + user.userId.replace(/-/g, ""); // Tạo mã giao dịch duy nhất
  const acc = import.meta.env.VITE_ACC; // Số tài khoản từ biến môi trường
  const bank = import.meta.env.VITE_BANK; // Mã ngân hàng từ biến môi trường
  // Biến trạng thái cho việc xác minh thanh toán
  const [verifyingPayment, setVerifyingPayment] = useState(false);
  // Thêm state để hiển thị thông báo lỗi
  const [paymentError, setPaymentError] = useState<string | null>(null);

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Thông tin thanh toán
        </Typography>

        <Typography variant="body1" sx={{ mb: 2 }}>
          Phí khám bệnh: {appointmentFee} VNĐ
        </Typography>

        {paymentError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {paymentError}
          </Alert>
        )}

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
      </Paper>
    </Box>
  );
};

export default PaymentCheckout;
