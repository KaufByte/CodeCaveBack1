import React from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Avatar,
  Divider,
} from "@mui/material";
import {
  Home,
  List as ListIcon,
  Subscriptions,
  Payments,
  Settings,
  Help,
  ExitToApp,
} from "@mui/icons-material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useTranslation } from "react-i18next";
import ThemeToggle from "./ThemeToggle";
import logo from "../assets/LogoCC-removebg-preview.png";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
const Sidebar: React.FC = () => {
  const { isDarkMode } = useTheme();
  const { t } = useTranslation("sidebar"); 
  const location = useLocation();
  const navigate = useNavigate();
  const userString = localStorage.getItem("currentUser");
  const user = userString ? JSON.parse(userString) : null;
  const isAdmin = user?.role === "admin";
  const menuItems = [
    { key: "main", icon: <Home />, path: "/" },
    { key: "feed", icon: <ListIcon />, path: "/feed" },
    { key: "subscription", icon: <Subscriptions />, path: "/subscriptions" },
    { key: "payments", icon: <Payments />, path: "/payment" },
    { key: "settings", icon: <Settings />, path: "/settings" },
    { key: "support", icon: <Help />, path: "/support" },
    ...(isAdmin ? [{ key: "Studio", icon: <AdminPanelSettingsIcon />, path: "/studio" }] : []),
  ];

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        "& .MuiDrawer-paper": {
          width: 305,
          backgroundColor: isDarkMode ? "#1e1e1e" : "#f8f9fa",
          color: isDarkMode ? "#fff" : "#000",
          padding: 2,
          borderRight: isDarkMode ? "1px solid #333" : "1px solid #ddd",
          transition: "all 0.3s ease-in-out",
        },
      }}
    >
      <Box display="flex" alignItems="center" justifyContent="space-between" p={2}>
        <Avatar src={logo} alt="Logo" sx={{ width: 120, height: 80 }} />
        <ThemeToggle />
      </Box>

      <Divider sx={{ backgroundColor: isDarkMode ? "#555" : "#ddd", mb: 2 }} />

      <List>
        {menuItems.map(({ key, icon, path }) => (
          <ListItemButton
            key={key}
            component={Link}
            to={path}
            selected={location.pathname === path}
            sx={{
              mb: 1.4,
              borderRadius: 2,
              px: 2.2,
              py: 1.6,
              display: "flex",
              alignItems: "center",
              gap: 2,
              transition: "all 0.25s ease",
              backgroundColor: isDarkMode ? "#151515" : "#eeeeee",
              "&:hover": {
                transform: "translateY(-2px)",
                backgroundColor: isDarkMode ? "#2a2a2a" : "#e6e6e6",
              },
            }}
          >
            <ListItemIcon sx={{ color: isDarkMode ? "#fff" : "#000", minWidth: 34 }}>
              {icon}
            </ListItemIcon>
            <ListItemText
              primary={t(key)} 
              primaryTypographyProps={{
                fontSize: "1.1rem",
                fontWeight: 600,
              }}
            />
          </ListItemButton>
        ))}
      </List>

      <Divider sx={{ backgroundColor: isDarkMode ? "#555" : "#ddd", mt: 2 }} />

      <List>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            mt: 1.5,
            borderRadius: 2,
            px: 2.2,
            py: 1.6,
            display: "flex",
            alignItems: "center",
            gap: 2,
            backgroundColor: isDarkMode ? "#151515" : "#eeeeee",
            transition: "all 0.25s ease",
            "&:hover": {
              transform: "translateY(-2px)",
              backgroundColor: isDarkMode ? "#2a2a2a" : "#e6e6e6",
            },
          }}
        >
          <ListItemIcon sx={{ color: isDarkMode ? "#fff" : "#000", minWidth: 34 }}>
            <ExitToApp />
          </ListItemIcon>
          <ListItemText
            primary={t("logout")} 
            primaryTypographyProps={{
              fontSize: "1.05rem",
              fontWeight: 600,
            }}
          />
        </ListItemButton>
      </List>
    </Drawer>
  );
};

export default Sidebar;
