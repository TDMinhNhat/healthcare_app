import React, { ReactNode, useState } from "react";
import { BaseLayout } from "./BaseLayout";
import {
  List,
  ListItemIcon,
  ListItemText,
  Divider,
  ListItemButton,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import EventNoteIcon from "@mui/icons-material/EventNote";
import PersonIcon from "@mui/icons-material/Person";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import ChatIcon from "@mui/icons-material/Chat";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { Outlet, useNavigate } from "react-router";

interface DoctorLayoutProps {
  children: ReactNode;
}

export default function DoctorLayout() {
  const navigate = useNavigate();
  const [currentTitle, setCurrentTitle] = useState("Dashboard");

  const titleMap: Record<string, string> = {
    "/doctor/dashboard": "Dashboard",
    "/doctor/appointments": "Appointments",
    "/doctor/schedule": "Schedule",
    "/doctor/patients": "My Patients",
    "/doctor/prescriptions": "Prescriptions",
    "/doctor/chat": "Messages",
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setCurrentTitle(titleMap[path] || "Doctor Dashboard");
  };

  const sidebarContent = (
    <>
      <List>
        <ListItemButton onClick={() => handleNavigation("/doctor/dashboard")}>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>
        <ListItemButton
          onClick={() => handleNavigation("/doctor/appointments")}
        >
          <ListItemIcon>
            <EventNoteIcon />
          </ListItemIcon>
          <ListItemText primary="Appointments" />
        </ListItemButton>
        <ListItemButton onClick={() => handleNavigation("/doctor/schedule")}>
          <ListItemIcon>
            <CalendarMonthIcon />
          </ListItemIcon>
          <ListItemText primary="My Schedule" />
        </ListItemButton>
        <ListItemButton onClick={() => handleNavigation("/doctor/patients")}>
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText primary="My Patients" />
        </ListItemButton>
      </List>
      <Divider />
      <List>
        <ListItemButton
          onClick={() => handleNavigation("/doctor/prescriptions")}
        >
          <ListItemIcon>
            <MedicalServicesIcon />
          </ListItemIcon>
          <ListItemText primary="Prescriptions" />
        </ListItemButton>
        <ListItemButton onClick={() => handleNavigation("/doctor/chat")}>
          <ListItemIcon>
            <ChatIcon />
          </ListItemIcon>
          <ListItemText primary="Messages" />
        </ListItemButton>
      </List>
    </>
  );

  return (
    <BaseLayout
      title={`Doctor ${currentTitle}`}
      sidebarContent={sidebarContent}
    >
      <Outlet />
    </BaseLayout>
  );
}
