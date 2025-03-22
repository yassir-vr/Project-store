import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import axios from "axios";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  IconButton,
} from "@mui/material";
import { Category, ShoppingCart, Receipt } from "@mui/icons-material";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ categories: 0, products: 0, orders: 0 });

  useEffect(() => {
    // Récupérer les catégories
    axios
      .get("http://127.0.0.1:8000/api/categories")
      .then((res) =>
        setStats((prev) => ({ ...prev, categories: res.data.length }))
      )
      .catch((err) => console.error("Erreur chargement catégories :", err));

    // Récupérer les produits
    axios
      .get("http://127.0.0.1:8000/api/products")
      .then((res) =>
        setStats((prev) => ({ ...prev, products: res.data.data.length }))
      )
      .catch((err) => console.error("Erreur chargement produits :", err));

    // Récupérer les commandes
    axios
      .get("http://127.0.0.1:8000/api/orders")
      .then((res) => setStats((prev) => ({ ...prev, orders: res.data.length })))
      .catch((err) => console.error("Erreur chargement commandes :", err));
  }, []);

  return (
    <Box sx={{ display: "flex", bgcolor: "#F5F7FA", minHeight: "100vh" }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: "bold", color: "#333" }}
        >
          Tableau de Bord
        </Typography>

        <Grid container spacing={3}>
          {/* Catégories */}
          <Grid item xs={12} sm={4}>
            <Card
              sx={{
                bgcolor: "#1976D2",
                color: "white",
                textAlign: "center",
                p: 2,
              }}
            >
              <CardContent>
                <IconButton sx={{ color: "white" }}>
                  <Category fontSize="large" />
                </IconButton>
                <Typography variant="h6">Catégories</Typography>
                <Typography variant="h4" fontWeight="bold">
                  {stats.categories}
                </Typography>
                <Button
                  variant="contained"
                  color="black"
                  size="small"
                  sx={{ mt: 2 }}
                  onClick={() => navigate("/admin/categories")}
                >
                  Voir plus
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Produits */}
          <Grid item xs={12} sm={4}>
            <Card
              sx={{
                bgcolor: "#388E3C",
                color: "white",
                textAlign: "center",
                p: 2,
              }}
            >
              <CardContent>
                <IconButton sx={{ color: "white" }}>
                  <ShoppingCart fontSize="large" />
                </IconButton>
                <Typography variant="h6">Produits</Typography>
                <Typography variant="h4" fontWeight="bold">
                  {stats.products}
                </Typography>
                <Button
                  variant="contained"
                  color="black"
                  size="small"
                  sx={{ mt: 2 }}
                  onClick={() => navigate("/admin/products")}
                >
                  Voir plus
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Commandes */}
          <Grid item xs={12} sm={4}>
            <Card
              sx={{
                bgcolor: "#D32F2F",
                color: "white",
                textAlign: "center",
                p: 2,
              }}
            >
              <CardContent>
                <IconButton sx={{ color: "white" }}>
                  <Receipt fontSize="large" />
                </IconButton>
                <Typography variant="h6">Commandes</Typography>
                <Typography variant="h4" fontWeight="bold">
                  {stats.orders}
                </Typography>
                <Button
                  variant="contained"
                  color="black"
                  size="small"
                  sx={{ mt: 2 }}
                  onClick={() => navigate("/admin/orders")}
                >
                  Voir plus
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
