import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import Sidebar from "./Sidebar";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Charger les commandes
    axios
      .get("http://127.0.0.1:8000/api/orders")
      .then((res) => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Erreur lors du chargement des commandes");
        setLoading(false);
      });
  }, []);

  const handleShowDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailsDialog(true);
  };

  const handleCloseDetails = () => {
    setShowDetailsDialog(false);
    setSelectedOrder(null);
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Box sx={{ display: "flex", bgcolor: "#F5F7FA", minHeight: "100vh" }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 1 }}>
        <h1>Commandes</h1>
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Client</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.name}</TableCell>
                  <TableCell>{order.total_price} DH</TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell>
                    {new Date(order.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleShowDetails(order)}
                    >
                      Détails
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {selectedOrder && (
          <Dialog
            open={showDetailsDialog}
            onClose={handleCloseDetails}
            fullWidth
            maxWidth="md" // Augmentez la largeur pour afficher l'image
          >
            <DialogTitle>Détails de la commande</DialogTitle>
            <DialogContent>
              <Typography variant="body1" gutterBottom>
                <strong>ID :</strong> {selectedOrder.id}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Client :</strong> {selectedOrder.name}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Total :</strong> {selectedOrder.total_price} DH
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Statut :</strong> {selectedOrder.status}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Date :</strong>{" "}
                {new Date(selectedOrder.created_at).toLocaleDateString()}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Articles :</strong>
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Image</TableCell>
                      <TableCell>Produit</TableCell>
                      <TableCell>Quantité</TableCell>
                      <TableCell>Prix</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedOrder.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          {item.product.image && (
                            <img
                              src={`http://127.0.0.1:8000/storage/${item.product.image}`} // Chemin de l'image
                              alt={item.product.title}
                              style={{ width: 50, height: 50, objectFit: "cover" }}
                            />
                          )}
                        </TableCell>
                        <TableCell>{item.product.title}</TableCell>
                        <TableCell>{item.quantity} {item.sale_attribute}</TableCell>
                        <TableCell>{item.price} DH</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDetails} color="secondary">
                Fermer
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </Box>
    </Box>
  );
};

export default Orders;