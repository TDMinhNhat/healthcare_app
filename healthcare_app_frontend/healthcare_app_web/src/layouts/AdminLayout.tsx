import React, { ReactNode } from "react";
import { BaseLayout } from "./BaseLayout";
import {
  List,
  ListItemIcon,
  ListItemText,
  Divider,
  ListItemButton,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import SettingsIcon from "@mui/icons-material/Settings";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import { useNavigate } from "react-router";
import { Outlet } from "react-router";

export const AdminLayout: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const sidebarContent = (
    <>
      <List>
        <ListItemButton onClick={() => handleNavigation("/admin/dashboard")}>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Thống kê" />
        </ListItemButton>
        <ListItemButton onClick={() => handleNavigation("/admin/users")}>
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="Quản lí bệnh nhân" />
        </ListItemButton>
        <ListItemButton onClick={() => handleNavigation("/admin/doctors")}>
          <ListItemIcon>
            <LocalHospitalIcon />
          </ListItemIcon>
          <ListItemText primary="Quản lí bác sĩ" />
        </ListItemButton>
        {/* Medical drug */}
        <ListItemButton onClick={() => handleNavigation("/admin/drugs")}>
          <ListItemIcon>
            <LocalHospitalIcon />
          </ListItemIcon>
          <ListItemText primary="Quản lí thuốc" />
        </ListItemButton>
        {/* quản lí ca làm việc */}
        <ListItemButton onClick={() => handleNavigation("/admin/shifts")}>
          <ListItemIcon>
            <AccessTimeIcon />
          </ListItemIcon>
          <ListItemText primary="Ca làm việc" />
        </ListItemButton>
        {/* Quản lí dịch vụ */}
        <ListItemButton onClick={() => handleNavigation("/admin/diseases")}>
          <ListItemIcon>
            <MedicalServicesIcon />
          </ListItemIcon>
          <ListItemText primary="Quản lí nhóm bệnh" />
        </ListItemButton>
        {/* Hoàn tiền */}
        <ListItemButton
          onClick={() => handleNavigation("/admin/cancel-appointment")}
        >
          <ListItemIcon>
            <EventBusyIcon />
          </ListItemIcon>
          <ListItemText primary="Quản lí Lịch hẹn" />
        </ListItemButton>
      </List>

      <Divider />
      {/* <List>
        <ListItemButton onClick={() => handleNavigation("/admin/settings")}>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItemButton>
      </List> */}
    </>
  );

  return (
    <BaseLayout title="Admin Dashboard" sidebarContent={sidebarContent}>
      <Outlet />
    </BaseLayout>
  );
};

export default AdminLayout;
