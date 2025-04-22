import {
  Box,
  Container,
  Typography,
  Grid2,
  Card,
  CardMedia,
  CardContent,
  Button,
} from "@mui/material";

const specialists = [
  {
    name: "Bác sĩ Sarah Hoàng",
    specialty: "Chuyên khoa Tim mạch",
    image: "https://picsum.photos/300/300",
  },
  {
    name: "Bác sĩ Amanda Nguyễn",
    specialty: "Chuyên khoa Thần kinh",
    image: "https://picsum.photos/300/300",
  },
  {
    name: "Bác sĩ Richard Trần",
    specialty: "Phẫu thuật",
    image: "https://picsum.photos/300/300",
  },
  {
    name: "Bác sĩ Victor Lê",
    specialty: "Nhi khoa",
    image: "https://picsum.photos/300/300",
  },
];

export default function Specialists() {
  return (
    <Box sx={{ py: 8 }}>
      <Container>
        <Typography variant="h2" align="center" gutterBottom>
          Chuyên Gia Hàng Đầu
        </Typography>
        <Grid2 container spacing={4} sx={{ mt: 4 }}>
          {specialists.map((specialist) => (
            <Grid2 size={{ xs: 12, sm: 6, md: 3 }} key={specialist.name}>
              <Card sx={{ height: "100%" }}>
                <CardMedia
                  component="img"
                  height="300"
                  image={specialist.image}
                  alt={specialist.name}
                />
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography variant="h6" gutterBottom>
                    {specialist.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    {specialist.specialty}
                  </Typography>
                  <Button variant="contained" color="primary">
                    Đặt Lịch Ngay
                  </Button>
                </CardContent>
              </Card>
            </Grid2>
          ))}
        </Grid2>
      </Container>
    </Box>
  );
}
