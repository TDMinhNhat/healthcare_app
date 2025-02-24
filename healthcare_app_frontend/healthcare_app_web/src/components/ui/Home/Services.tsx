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
    title: "Customer Support",
    description: "24/7 support for all your healthcare needs",
  },
  {
    icon: <HealthAndSafety />,
    title: "Checkup Services",
    description: "Comprehensive medical checkups",
  },
  {
    icon: <Public />,
    title: "Online Specialist",
    description: "Connect with specialists online",
  },
  {
    icon: <Shield />,
    title: "Privacy and Security",
    description: "Your data is safe with us",
  },
];

export default function Services() {
  return (
    <Box sx={{ py: 8, backgroundColor: "secondary.light" }}>
      <Container>
        <Typography variant="h2" align="center" gutterBottom>
          Your health requirements are our first focus.
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
