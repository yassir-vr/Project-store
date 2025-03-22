import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import {
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
  Snackbar,
} from "@mui/material";

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [category, setCategory] = useState({
    title: "",
    description: "",
    image: null,
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  useEffect(() => {
    // Charger les catégories
    axios
      .get("http://127.0.0.1:8000/api/categories")
      .then((res) => {
        setCategories(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Erreur lors du chargement des catégories");
        setLoading(false);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!category.title) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    const formData = new FormData();
    formData.append("title", category.title);
    formData.append("description", category.description); // Ajout de la description

    if (category.image && category.image instanceof File) {
      formData.append("image", category.image);
    }

    const url = currentCategory
      ? `http://127.0.0.1:8000/api/categories/${currentCategory.id}`
      : "http://127.0.0.1:8000/api/categories";

    setLoadingSubmit(true);

    axios({
      method: currentCategory ? "put" : "post",
      url,
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then((res) => {
        setCategories((prevCategories) =>
          currentCategory
            ? prevCategories.map((cat) =>
                cat.id === currentCategory.id ? res.data.category : cat
              )
            : [...prevCategories, res.data.category]
        );
        setSuccessMessage(
          currentCategory
            ? "Catégorie modifiée avec succès !"
            : "Catégorie ajoutée avec succès !"
        );
        setLoadingSubmit(false);

        setTimeout(() => {
          window.location.reload();
        }, 1500);
      })
      .catch((err) => {
        console.error(
          "Erreur lors de la soumission du formulaire:",
          err.response ? err.response.data : err
        );
        setLoadingSubmit(false);
        setError(
          "Une erreur est survenue lors de la mise à jour de la catégorie."
        );
      });
  };

  useEffect(() => {
    if (currentCategory) {
      setCategory({
        title: currentCategory.title,
        description: currentCategory.description || "", // Pré-remplir la description
        image: null,
      });
    }
  }, [currentCategory]);

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setCategory({ ...category, image: e.target.files[0] });
    } else {
      setCategory({ ...category, [e.target.name]: e.target.value });
    }
  };

  const handleAddCategory = () => {
    setCurrentCategory(null);
    setCategory({
      title: "",
      description: "",
      image: null,
    });
    setShowForm(true);
  };

  const handleEditCategory = (category) => {
    setCurrentCategory(category);
    setCategory({
      title: category.title,
      description: category.description || "", // Pré-remplir la description
      image: null,
    });
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setCurrentCategory(null);
  };

  const handleDelete = () => {
    axios
      .delete(`http://127.0.0.1:8000/api/categories/${categoryToDelete.id}`)
      .then(() => {
        setCategories((prevCategories) =>
          prevCategories.filter((cat) => cat.id !== categoryToDelete.id)
        );
        setShowDeleteConfirmation(false);
      })
      .catch((err) => {
        setError("Erreur lors de la suppression de la catégorie");
      });
  };

  const openDeleteConfirmation = (category) => {
    setCategoryToDelete(category);
    setShowDeleteConfirmation(true);
  };

  const closeDeleteConfirmation = () => {
    setShowDeleteConfirmation(false);
    setCategoryToDelete(null);
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="admin-container" style={{ marginLeft: "250px" }}>
      <Sidebar />
      <div className="admin-content">
        <h1>Gestion des Categories</h1>

        <div className="category-actions">
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddCategory}
          >
            Ajouter une catégorie
          </Button>
        </div>
        <br />

        {showForm && (
          <Dialog
            open={showForm}
            onClose={handleCloseForm}
            fullWidth
            maxWidth="sm"
          >
            <DialogTitle>
              {currentCategory
                ? "Modifier la catégorie"
                : "Ajouter une catégorie"}
            </DialogTitle>
            <DialogContent>
              <form onSubmit={handleSubmit}>
                <TextField
                  label="Titre"
                  variant="outlined"
                  name="title"
                  value={category.title}
                  onChange={handleChange}
                  fullWidth
                  required
                  margin="normal"
                />
                <TextField
                  label="Description"
                  variant="outlined"
                  name="description"
                  value={category.description}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  multiline
                  rows={3}
                />

                {currentCategory && currentCategory.image && (
                  <div style={{ margin: "1rem 0" }}>
                    <h4>Image actuelle</h4>
                    <img
                      src={`http://127.0.0.1:8000/storage/${currentCategory.image}`}
                      alt="Current Category"
                      width="100"
                      height="100"
                    />
                  </div>
                )}

                <input
                  type="file"
                  name="image"
                  onChange={handleChange}
                  style={{ margin: "1rem 0" }}
                />
              </form>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseForm} color="secondary">
                Annuler
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={loadingSubmit}
              >
                {loadingSubmit
                  ? "Chargement..."
                  : currentCategory
                  ? "Modifier"
                  : "Ajouter"}
              </Button>
            </DialogActions>
          </Dialog>
        )}

        {showDeleteConfirmation && (
          <Dialog
            open={showDeleteConfirmation}
            onClose={closeDeleteConfirmation}
          >
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogContent>
              <p>Êtes-vous sûr de vouloir supprimer cette catégorie ?</p>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDelete} color="primary">
                Oui
              </Button>
              <Button onClick={closeDeleteConfirmation} color="secondary">
                Non
              </Button>
            </DialogActions>
          </Dialog>
        )}

        {successMessage && (
          <Snackbar
            open={true}
            autoHideDuration={6000}
            message={successMessage}
            onClose={() => setSuccessMessage("")}
          />
        )}

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Titre</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.id}</TableCell>
                  <TableCell>{category.title}</TableCell>
                  <TableCell>{category.description}</TableCell>
                  <TableCell>
                    {category.image && (
                      <img
                        src={`http://127.0.0.1:8000/storage/${category.image}`}
                        alt={category.title}
                        width="50"
                        height="50"
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleEditCategory(category)}
                    >
                      Modifier
                    </Button>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => openDeleteConfirmation(category)}
                    >
                      Supprimer
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default CategoryManagement;
