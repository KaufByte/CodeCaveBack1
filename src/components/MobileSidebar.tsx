import React, { useState } from "react";
import { Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { Menu, Home, Feed, Subscriptions, Settings, Help } from "@mui/icons-material";
import { Link } from "react-router-dom";

const menuItems = [
  { text: "Головна", icon: <Home />, path: "/" },
  { text: "Стрічка", icon: <Feed />, path: "/feed" },
  { text: "Підписки", icon: <Subscriptions />, path: "/subscriptions" },
  { text: "Налаштування", icon: <Settings />, path: "/settings" },
  { text: "Підтримка", icon: <Help />, path: "/support" },
];

const MobileSidebar = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <IconButton onClick={() => setOpen(true)} sx={{ position: "absolute", top: 20, left: 20 }}>
        <Menu />
      </IconButton>
      <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton component={Link} to={item.path} onClick={() => setOpen(false)}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default MobileSidebar;
