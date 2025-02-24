import { Box, Container, Grid2, Typography } from "@mui/material";
import { LocalHospital, AttachMoney, Psychology } from "@mui/icons-material";

const benefits = [
  {
    icon: <LocalHospital />,
    title: "Modern Clinic",
    description: "State-of-the-art facilities and equipment",
  },
  {
    icon: <AttachMoney />,
    title: "Low Consultation Fees",
    description: "Affordable healthcare services for everyone",
  },
  {
    icon: <Psychology />,
    title: "Professional Treatment",
    description: "Experienced and qualified medical professionals",
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
              src="https://picsum.photos/800/600?random=1"
              alt="Medical Procedure"
              sx={{ width: "100%", borderRadius: 2 }}
            />
          </Grid2>
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Typography variant="h2" gutterBottom>
              The Benefits of utilizing Medicare
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
