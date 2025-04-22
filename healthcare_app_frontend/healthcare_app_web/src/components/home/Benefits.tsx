import { Box, Container, Grid2, Typography } from "@mui/material";
import { LocalHospital, AttachMoney, Psychology } from "@mui/icons-material";

const benefits = [
  {
    icon: <LocalHospital />,
    title: "Chăm Sóc Toàn Diện Tinh thần",
    description: "Dịch vụ y tế đầy đủ từ khám bệnh đến điều trị",
  },
  {
    icon: <AttachMoney />,
    title: "Chi Phí Tư Vấn Thấp",
    description: "Dịch vụ chăm sóc sức khỏe giá cả phải chăng cho mọi người",
  },
  {
    icon: <Psychology />,
    title: "Điều Trị Chuyên Nghiệp",
    description: "Đội ngũ y bác sĩ giàu kinh nghiệm và trình độ chuyên môn cao",
  },
];

export default function Benefits() {
  return (
    <Box sx={{ py: 8, backgroundColor: "secondary.light" }}>
      <Container>
        <Grid2 container spacing={4} alignItems="center">
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Box
              component="img"
              src="/benefit.jpg"
              alt="Quy trình y tế"
              sx={{ width: "100%", borderRadius: 2 }}
            />
          </Grid2>
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Typography variant="h2" gutterBottom>
              Lợi Ích Khi Sử Dụng Dịch Vụ Của Chúng Tôi
            </Typography>
            {benefits.map((benefit) => (
              <Box
                key={benefit.title}
                sx={{ display: "flex", alignItems: "center", mb: 3 }}
              >
                <Box sx={{ color: "primary.main", mr: 2 }}>{benefit.icon}</Box>
                <Box>
                  <Typography variant="h6">{benefit.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {benefit.description}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Grid2>
        </Grid2>
      </Container>
    </Box>
  );
}
