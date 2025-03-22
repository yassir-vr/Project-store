import React from "react";
import { Drawer, List, ListItem, ListItemText, Divider, Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { AccountCircle, ShoppingCart } from "@mui/icons-material";
import HomeIcon from '@mui/icons-material/Home';

const Sidebar = () => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 240,
          backgroundColor: "#2c3e50",
          color: "white",
          boxShadow: 3,
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <Box sx={{ padding: 2, textAlign: "center", borderBottom: "1px solid #34495e" }}>
        <Typography variant="h6" color="white" fontWeight="bold" fontSize={20}>
          Mon Espace
        </Typography>
      </Box>
      <Divider sx={{ backgroundColor: "#34495e" }} />
      <List>
        <ListItem button component={Link} to="/user/profile" sx={{ "&:hover": { backgroundColor: "#34495e" }, display: "flex", alignItems: "center", paddingY: 1, color: "white" }}>
          <AccountCircle sx={{ color: "white", marginRight: 2 }} aria-label="Mon compte" />
          <ListItemText primary="Mon compte" />
        </ListItem>
        <ListItem button component={Link} to="/user/orders" sx={{ "&:hover": { backgroundColor: "#34495e" }, display: "flex", alignItems: "center", paddingY: 1, color: "white" }}>
          <ShoppingCart sx={{ color: "white", marginRight: 2 }} aria-label="Mes commandes" />
          <ListItemText primary="Mes commandes" />
        </ListItem>
        <ListItem button component={Link} to="/" sx={{ "&:hover": { backgroundColor: "#34495e" }, display: "flex", alignItems: "center", paddingY: 1, color: "white" }}>
          <HomeIcon sx={{ color: "white", marginRight: 2 }} aria-label="Retour à l'accueil" />
          <ListItemText primary="Home" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;