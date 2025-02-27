import { Container } from "@mui/material";
import Benefits from "../components/ui/Home/Benefits.tsx";
import Footer from "../components/ui/Home/Footer.tsx";
import Hero from "../components/ui/Home/Hero.tsx";
import Navbar from "../components/ui/Home/Navbar.tsx";
import Services from "../components/ui/Home/Services.tsx";
import Specialists from "../components/ui/Home/Specialist.tsx";

function HomePage() {
  return (
    <Container maxWidth={false} disableGutters={true}>
      <Navbar />
      <Hero />
      <Services />
      <Specialists />
      <Benefits />
      <Footer />
    </Container>
  );
}

export default HomePage;
