import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";

interface PaymentCheckoutProps {
  onPaymentComplete: () => Promise<void>;
  onBack: () => void;
  loading: boolean;
}

const PaymentCheckout: React.FC<PaymentCheckoutProps> = ({
  onPaymentComplete,
  onBack,
  loading,
}) => {
  const appointmentFee = 500000; // Fee in VND
  const appointmentId = new Date().getTime().toString().slice(-6); // Generate a unique ID for the transaction - taking last 6 digits

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Thông tin thanh toán
        </Typography>

        <Typography variant="body1" sx={{ mb: 2 }}>
          Phí khám bệnh: 500.000 VNĐ
        </Typography>

        <Card sx={{ mt: 3, mb: 3 }}>
          <CardContent>
            <Grid
              container
              spacing={2}
              alignItems="center"
              justifyContent="center"
            >
              <Grid
                item
                xs={12}
                md={5}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <CardMedia
                  component="img"
                  image={`https://qr.sepay.vn/img?bank=MBBank&acc=0903252427&template=compact&amount=${appointmentFee}&des=DH${appointmentId}`}
                  alt="QR Payment Code"
                  sx={{
                    width: { xs: "100%", sm: "80%", md: "100%" },
                    maxWidth: "250px",
                    height: "auto",
                  }}
                />
              </Grid>
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
                        Bùi Tấn Việt
                      </Typography>
                    </Grid>

                    <Grid item xs={5}>
                      <Typography variant="body2">Số TK:</Typography>
                    </Grid>
                    <Grid item xs={7}>
                      <Typography variant="body2" fontWeight="bold">
                        0903252427
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
                        DH{appointmentId}
                      </Typography>
                    </Grid>
                  </Grid>

                  <Typography variant="body2" sx={{ mt: 2 }}>
                    Sử dụng app ngân hàng để quét mã QR hoặc chuyển khoản thủ
                    công theo thông tin trên
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
          <Button onClick={onBack} disabled={loading}>
            Quay lại
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={onPaymentComplete}
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : "Hoàn tất thanh toán"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default PaymentCheckout;
