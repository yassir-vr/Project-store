import React from "react";
import { Drawer, List, ListItem, ListItemText, Divider, Box, Typography, IconButton } from "@mui/material";
import { Link } from "react-router-dom"; // Pour la navigation avec React Router
import { Home, Category, ShoppingCart, Settings } from "@mui/icons-material"; // Icônes de MUI pour un meilleur design

const Sidebar = () => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 240,
          backgroundColor: "#2c3e50",  // Couleur de fond de la sidebar
          color: "white",  // Couleur du texte
          boxShadow: 3,  // Ajouter une ombre pour un effet de profondeur
          display: "flex",
          flexDirection: "column", // Assurer une disposition verticale
        },
      }}
    >
      <Box sx={{ padding: 2, textAlign: "center", borderBottom: "1px solid #34495e" }}>
        <Typography variant="h6" color="white" fontWeight="bold" fontSize={20}>
          Admin Dashboard
        </Typography>
      </Box>
      <Divider sx={{ backgroundColor: "#34495e" }} />
      <List>
        {/* Liens de navigation avec icônes et survol */}
        <ListItem button component={Link} to="/admin/dashboard" sx={{ "&:hover": { backgroundColor: "#34495e" }, display: "flex", alignItems: "center", paddingY: 1 , color: "white"}}>
          <Home sx={{ color: "white", marginRight: 2 }} />
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button component={Link} to="/admin/categories" sx={{ "&:hover": { backgroundColor: "#34495e" }, display: "flex", alignItems: "center", paddingY: 1 , color: "white"}}>
          <Category sx={{ color: "white", marginRight: 2 }} />
          <ListItemText primary="Catégories" />
        </ListItem>
        <ListItem button component={Link} to="/admin/products" sx={{ "&:hover": { backgroundColor: "#34495e" }, display: "flex", alignItems: "center", paddingY: 1 , color: "white"}}>
          <ShoppingCart sx={{ color: "white", marginRight: 2 }} />
          <ListItemText primary="Produits" />
        </ListItem>
        <ListItem button component={Link} to="/admin/orders" sx={{ "&:hover": { backgroundColor: "#34495e" }, display: "flex", alignItems: "center", paddingY: 1 , color: "white"}}>
          <ShoppingCart sx={{ color: "white", marginRight: 2 }} />
          <ListItemText primary="Orders" />
        </ListItem>
        <ListItem button component={Link} to="/settings" sx={{ "&:hover": { backgroundColor: "#34495e" }, display: "flex", alignItems: "center", paddingY: 1 , color: "white"}}>
          <Settings sx={{ color: "white", marginRight: 2 }} />
          <ListItemText primary="Paramètres" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
