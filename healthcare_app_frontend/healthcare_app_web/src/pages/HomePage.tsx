import { Container } from "@mui/material";
import Benefits from "../components/ui/Home/Benefits.tsx";
import Footer from "../components/ui/Home/Footer.tsx";
import Hero from "../components/ui/Home/Hero.tsx";
import Navbar from "../components/ui/Home/Navbar.tsx";
import Services from "../components/ui/Home/Services.tsx";
import Specialists from "../components/ui/Home/Specialist.tsx";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { ROUTING } from "../constants/routing";

function HomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const user = localStorage.getItem("user");
    const role = localStorage.getItem("role");

    if (user && role) {
      // User is logged in, redirect based on role
      if (role === "doctor") {
        navigate(ROUTING.DOCTOR);
      } else if (role === "patient") {
        navigate(ROUTING.PATIENT);
      } else {
        navigate(ROUTING.ADMIN);
      }
    }
    // If no user or role, stay on the home page
  }, [navigate]);

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
