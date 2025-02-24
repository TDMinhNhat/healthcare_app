import { Box, Container, Typography, Button, Grid2 } from "@mui/material";
import { styled } from "@mui/material/styles";

const HeroBox = styled(Box)(({ theme }) => ({
  background: `linear-gradient(to right, ${theme.palette.background.paper} 60%, ${theme.palette.primary.light} 40%)`,
  padding: theme.spacing(8, 0),
}));

const FeatureCard = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: "white",
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  textAlign: "center",
}));

export default function Hero() {
  return (
    <HeroBox>
      <Container>
        <Grid2 container spacing={4} alignItems="center">
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Typography variant="h1" gutterBottom>
              Your Health Comes First.
            </Typography>
            <Typography variant="body1" paragraph>
              We provide the most full medical services, so every person could
              have the opportunity to receive qualitative medical help.
            </Typography>
            <Button variant="contained" size="large" sx={{ mt: 2 }}>
              Book Appointment
            </Button>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 6 }}>
            <Box
              component="img"
              src="/doctor.png"
              alt="Doctor"
              sx={{ width: "100%", maxWidth: 500 }}
            />
          </Grid2>
        </Grid2>
        <Grid2 container spacing={2} sx={{ mt: 4 }}>
          {[
            "24 Hours Services",
            "25 Years of Experience",
            "High Quality Care",
          ].map((feature) => (
            <Grid2 size={{ xs: 12, md: 4 }} key={feature}>
              <FeatureCard>
                <Typography variant="h6">{feature}</Typography>
              </FeatureCard>
            </Grid2>
          ))}
        </Grid2>
      </Container>
    </HeroBox>
  );
}
