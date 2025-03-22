import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EmailIcon from "@mui/icons-material/Email";
import BadgeIcon from "@mui/icons-material/Badge";
import Sidebar from "./Sidebar";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "" });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("Pas de token trouvé !");
          return;
        }

        const response = await axios.get("http://127.0.0.1:8000/api/user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(response.data);
        setFormData({ name: response.data.name, email: response.data.email });
      } catch (error) {
        console.error("Erreur lors du chargement du profil :", error);
      }
    };

    fetchProfile();
  }, []);

  const handleEditProfile = () => {
    setEditMode(true);
  };

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "http://127.0.0.1:8000/api/user",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUser(response.data);
      setEditMode(false);
      setSnackbarMessage("Profil mis à jour avec succès !");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil :", error);
      setSnackbarMessage("Erreur lors de la mise à jour du profil.");
      setSnackbarOpen(true);
    }
  };

  const handleChangePassword = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://127.0.0.1:8000/api/user/change-password",
        passwordData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOpenPasswordDialog(false);
      setSnackbarMessage("Mot de passe changé avec succès !");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Erreur lors du changement de mot de passe :", error);
      setSnackbarMessage("Erreur lors du changement de mot de passe.");
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  if (!user) return <Typography align="center">Chargement...</Typography>;

  return (
    <Box sx={{ display: "flex", bgcolor: "#F5F7FA", minHeight: "100vh" }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: "bold", color: "#333" }}
        >
          Mon Compte
        </Typography>
        <Container maxWidth="sm">
          <Card sx={{ mt: 5, p: 3, textAlign: "center", boxShadow: 3 }}>
            <Avatar
              sx={{ width: 80, height: 80, margin: "auto", bgcolor: "primary.main" }}
              alt={user.name}
            >
              <AccountCircleIcon sx={{ fontSize: 50 }} />
            </Avatar>
            <CardContent>
              {editMode ? (
                <>
                  <TextField
                    label="Nom"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSaveProfile}
                    sx={{ mt: 2 }}
                  >
                    Enregistrer
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => setEditMode(false)}
                    sx={{ mt: 2, ml: 2 }}
                  >
                    Annuler
                  </Button>
                </>
              ) : (
                <>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    {user.name}
                  </Typography>
                  <Box display="flex" alignItems="center" justifyContent="center" gap={1} mb={1}>
                    <EmailIcon color="primary" />
                    <Typography variant="body1">{user.email}</Typography>
                  </Box>
                  
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleEditProfile}
                    sx={{ mt: 2 }}
                  >
                    Modifier le profil
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => setOpenPasswordDialog(true)}
                    sx={{ mt: 2, ml: 2 }}
                  >
                    Changer le mot de passe
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </Container>
      </Box>

      {/* Boîte de dialogue pour changer le mot de passe */}
      <Dialog open={openPasswordDialog} onClose={() => setOpenPasswordDialog(false)}>
        <DialogTitle>Changer le mot de passe</DialogTitle>
        <DialogContent>
          <TextField
            label="Mot de passe actuel"
            type="password"
            fullWidth
            margin="normal"
            value={passwordData.currentPassword}
            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
          />
          <TextField
            label="Nouveau mot de passe"
            type="password"
            fullWidth
            margin="normal"
            value={passwordData.newPassword}
            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPasswordDialog(false)} color="secondary">
            Annuler
          </Button>
          <Button onClick={handleChangePassword} color="primary">
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar pour les messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default UserProfile;