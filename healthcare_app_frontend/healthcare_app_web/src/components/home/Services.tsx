import {
  Box,
  Container,
  Grid2,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import { Support, HealthAndSafety, Public, Shield } from "@mui/icons-material";

const services = [
  {
    icon: <Support />,
    title: "Hỗ Trợ Khách Hàng",
    description: "Hỗ trợ 24/7 cho tất cả nhu cầu chăm sóc sức khỏe của bạn",
  },
  {
    icon: <HealthAndSafety />,
    title: "Dịch Vụ Khám Tổng Quát",
    description: "Kiểm tra sức khỏe toàn diện",
  },
  {
    icon: <Public />,
    title: "Chuyên Gia Trực Tuyến",
    description: "Kết nối với chuyên gia trực tuyến",
  },
  {
    icon: <Shield />,
    title: "Bảo Mật và An Toàn",
    description: "Dữ liệu của bạn được bảo vệ an toàn với chúng tôi",
  },
];

export default function Services() {
  return (
    <Box sx={{ py: 8, backgroundColor: "secondary.light" }}>
      <Container>
        <Typography variant="h2" align="center" gutterBottom>
          Sức khỏe tinh thần của bạn là ưu tiên hàng đầu của chúng tôi.
        </Typography>
        <Grid2 container spacing={4} sx={{ mt: 4 }}>
          {services.map((service) => (
            <Grid2 size={{ xs: 12, sm: 6, md: 3 }} key={service.title}>
              <Card
                elevation={0}
                sx={{ height: "100%", backgroundColor: "transparent" }}
              >
                <CardContent sx={{ textAlign: "center" }}>
                  <Box sx={{ color: "primary.main", mb: 2 }}>
                    {service.icon}
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    {service.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {service.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid2>
          ))}
        </Grid2>
      </Container>
    </Box>
  );
}
