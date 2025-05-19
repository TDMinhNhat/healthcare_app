import { Container } from "@mui/material";
import Benefits from "../components/home/Benefits.tsx";
import Footer from "../components/home/Footer.tsx";
import Hero from "../components/home/Hero.tsx";
import Navbar from "../components/home/Navbar.tsx";
import Services from "../components/home/Services.tsx";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { ROUTING } from "../constants/routing";
import DiseaseList from "../components/home/Disease.tsx";
import ChatBot from "../components/chatbot/ChatBot.tsx";

function HomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Kiểm tra xem người dùng đã đăng nhập chưa
    const user = localStorage.getItem("user");
    const role = localStorage.getItem("role");

    if (user && role) {
      // Người dùng đã đăng nhập, chuyển hướng dựa trên vai trò
      if (role === "doctor") {
        navigate(ROUTING.DOCTOR);
      } else if (role === "patient") {
        navigate(ROUTING.PATIENT);
      } else {
        navigate(ROUTING.ADMIN);
      }
    }
    // Nếu không có người dùng hoặc vai trò, ở lại trang chủ
  }, [navigate]);

  return (
    <Container maxWidth={false} disableGutters={true}>
      <Navbar />
      <Hero />
      <Services />
      <DiseaseList />
      {/* <Specialists /> */}
      <Benefits />
      <Footer />
      <ChatBot />
    </Container>
  );
}

export default HomePage;
