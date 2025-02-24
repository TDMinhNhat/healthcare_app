import { Box, Container, Grid2, Typography, Link } from "@mui/material";
import Logo from "./Logo";

export default function Footer() {
  return (
    <Box sx={{ bgcolor: "primary.main", color: "white", py: 6 }}>
      <Container>
        <Grid2 container spacing={4}>
          <Grid2 size={{ xs: 12, md: 4 }}>
            <Logo />
            <Typography variant="body2" sx={{ mt: 2 }}>
              Providing quality healthcare services for a better tomorrow.
            </Typography>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 2 }}>
            <Typography variant="h6" gutterBottom>
              Company
            </Typography>
            <Link href="#" color="inherit" display="block">
              About
            </Link>
            <Link href="#" color="inherit" display="block">
              Careers
            </Link>
            <Link href="#" color="inherit" display="block">
              Contact
            </Link>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 2 }}>
            <Typography variant="h6" gutterBottom>
              Services
            </Typography>
            <Link href="#" color="inherit" display="block">
              Appointments
            </Link>
            <Link href="#" color="inherit" display="block">
              Treatments
            </Link>
            <Link href="#" color="inherit" display="block">
              Specialists
            </Link>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 2 }}>
            <Typography variant="h6" gutterBottom>
              Resources
            </Typography>
            <Link href="#" color="inherit" display="block">
              Blog
            </Link>
            <Link href="#" color="inherit" display="block">
              News
            </Link>
            <Link href="#" color="inherit" display="block">
              FAQ
            </Link>
          </Grid2>
          <Grid2 size={{ xs: 12, md: 2 }}>
            <Typography variant="h6" gutterBottom>
              Legal
            </Typography>
            <Link href="#" color="inherit" display="block">
              Privacy
            </Link>
            <Link href="#" color="inherit" display="block">
              Terms
            </Link>
            <Link href="#" color="inherit" display="block">
              Cookie Policy
            </Link>
          </Grid2>
        </Grid2>
      </Container>
    </Box>
  );
}
