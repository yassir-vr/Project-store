import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import { Button, TextField, Select, MenuItem, FormControl, InputLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogActions, DialogContent, DialogTitle, CircularProgress, Snackbar } from "@mui/material";
import { styled } from "@mui/system";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [product, setProduct] = useState({
    title: "",
    description: "",
    price: "",
    category_id: "",
    sale_attribute: "",
    image: null,
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  useEffect(() => {
    // Charger les catégories
    axios
      .get("http://127.0.0.1:8000/api/categories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Erreur lors du chargement des catégories:", err));

    // Charger les produits sans filtrer sur is_active
    axios
      .get("http://127.0.0.1:8000/api/products")
      .then((res) => {
        if (res.data && Array.isArray(res.data)) {
          setProducts(res.data); // Afficher tous les produits sans filtrage
        } else if (res.data && Array.isArray(res.data.data)) {
          setProducts(res.data.data); // Cas où les données sont dans un objet "data"
        } else {
          setError("Les données retournées ne sont pas dans le format attendu.");
        }
        setLoading(false);
      })
      .catch((err) => {
        setError("Erreur lors de la récupération des produits.");
        setLoading(false);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!product.title || !product.description || !product.price || !product.category_id) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    const formData = new FormData();
    formData.append("title", product.title);
    formData.append("description", product.description);
    formData.append("price", product.price);
    formData.append("category_id", product.category_id);
    formData.append("sale_attribute", product.sale_attribute || "default_value");

    if (product.image && product.image instanceof File) {
      formData.append("image", product.image);
    }

    if (currentProduct) {
      formData.append("_method", "PUT");
    }

    const url = currentProduct
      ? `http://127.0.0.1:8000/api/products/${currentProduct.id}`
      : "http://127.0.0.1:8000/api/products";

    setLoadingSubmit(true);

    axios({
      method: "post",
      url,
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then((res) => {
        setProducts((prevProducts) =>
          currentProduct
            ? prevProducts.map((p) => (p.id === currentProduct.id ? res.data.product : p))
            : [...prevProducts, res.data.product]
        );

        setSuccessMessage(currentProduct ? "Produit modifié avec succès !" : "Produit ajouté avec succès !");
        setLoadingSubmit(false);

        setTimeout(() => {
          window.location.reload();
        }, 1500);
      })
      .catch((error) => {
        console.error("Erreur lors de la soumission du formulaire:", error.response?.data || error);
        alert("Erreur lors de la modification du produit.");
        setLoadingSubmit(false);
      });
  };

  useEffect(() => {
    if (currentProduct) {
      setProduct({
        title: currentProduct.title,
        description: currentProduct.description,
        price: currentProduct.price,
        category_id: currentProduct.category_id,
        sale_attribute: currentProduct.sale_attribute,
        image: null,
      });
    }
  }, [currentProduct]);

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setProduct({ ...product, image: e.target.files[0] });
    } else {
      setProduct({ ...product, [e.target.name]: e.target.value });
    }
  };

  const handleDelete = () => {
    axios
      .delete(`http://127.0.0.1:8000/api/products/${productToDelete.id}`)
      .then(() => {
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product.id !== productToDelete.id)
        );
        setShowDeleteConfirmation(false);
      })
      .catch((err) => {
        console.error("Erreur lors de la suppression du produit:", err);
        setError("Erreur lors de la suppression du produit.");
      });
  };

  const handleToggleActive = (id) => {
    axios
      .post(`http://127.0.0.1:8000/api/products/${id}/toggle`)
      .then(() => {
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.id === id ? { ...product, is_active: !product.is_active } : product
          )
        );
      })
      .catch((err) => {
        console.error("Erreur lors de la mise à jour du statut du produit:", err);
        setError("Erreur lors de la mise à jour du statut du produit.");
      });
  };

  const handleAddProduct = () => {
    setCurrentProduct(null);
    setProduct({
      title: "",
      description: "",
      price: "",
      category_id: "",
      sale_attribute: "",
      image: null,
    });
    setShowForm(true);
  };

  const handleEditProduct = (product) => {
    setCurrentProduct(product);
    setProduct({
      title: product.title,
      description: product.description,
      price: product.price,
      category_id: product.category_id,
      sale_attribute: product.sale_attribute,
      image: null,
    });
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setCurrentProduct(null);
  };

  const openDeleteConfirmation = (product) => {
    setProductToDelete(product);
    setShowDeleteConfirmation(true);
  };

  const closeDeleteConfirmation = () => {
    setShowDeleteConfirmation(false);
    setProductToDelete(null);
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
        <h1>Gestion des Produits</h1>

        <div className="product-actions">
          <Button variant="contained" color="primary" onClick={handleAddProduct}>
            Ajouter un produit
          </Button>
        </div> <br/>

        {showForm && (
          <Dialog open={showForm} onClose={() => setShowForm(false)}>
            <DialogTitle>{currentProduct ? "Modifier le produit" : "Ajouter un produit"}</DialogTitle>
            <DialogContent>
              <form onSubmit={handleSubmit}>
                <TextField label="Titre" name="title" value={product.title} onChange={handleChange} fullWidth required margin="normal" />
                <TextField label="Description" name="description" value={product.description} onChange={handleChange} fullWidth required margin="normal" multiline rows={3} />
                <TextField label="Prix" name="price" value={product.price} onChange={handleChange} fullWidth required margin="normal" />
                <FormControl fullWidth required margin="normal">
                  <InputLabel>Catégorie</InputLabel>
                  <Select name="category_id" value={product.category_id} onChange={handleChange}>
                    {categories.map((category) => (<MenuItem key={category.id} value={category.id}>{category.title}</MenuItem>))}
                  </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
                <InputLabel>Attribut de vente</InputLabel>
                <Select
                  name="sale_attribute"
                  value={product.sale_attribute}
                  onChange={handleChange}
                >
                  <MenuItem value="">Sélectionner un attribut</MenuItem>
                  <MenuItem value="1kg">1kg</MenuItem>
                  <MenuItem value="500g">500g</MenuItem>
                  <MenuItem value="piece">Pièce</MenuItem>
                </Select>
              </FormControl>
                <input type="file" name="image" onChange={handleChange} style={{ margin: "1rem 0" }} />
                {product.previewImage && <img src={product.previewImage} alt="Prévisualisation" width="100" style={{ marginTop: "10px" }} />}
                <Button variant="contained" color="primary" type="submit" fullWidth disabled={loadingSubmit}>{loadingSubmit ? "Chargement..." : "Enregistrer"}</Button>
              </form>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowForm(false)}>Annuler</Button>
            </DialogActions>
          </Dialog>
        )}

        {showDeleteConfirmation && (
          <Dialog open={showDeleteConfirmation} onClose={closeDeleteConfirmation}>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogContent>
              <p>Êtes-vous sûr de vouloir supprimer ce produit ?</p>
            </DialogContent>
            <DialogActions>
              <Button onClick={closeDeleteConfirmation} color="primary">
                Annuler
              </Button>
              <Button
                onClick={handleDelete}
                color="error"
                variant="contained"
              >
                Supprimer
              </Button>
            </DialogActions>
          </Dialog>
        )}

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Titre</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Prix</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell>Catégorie</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.id}</TableCell>
                  <TableCell>
                    {product.image && (
                      <img
                        src={`http://127.0.0.1:8000/storage/${product.image}`}
                        alt={product.title}
                        width="50"
                        height="50"
                      />
                    )}
                  </TableCell>
                  <TableCell>{product.title}</TableCell>
                  <TableCell>{product.description}</TableCell>
                  <TableCell>{product.price}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color={product.is_active ? "success" : "error"}
                      onClick={() => handleToggleActive(product.id)}
                    >
                      {product.is_active ? "Actif" : "Inactif"}
                    </Button>
                  </TableCell>
                  
                  <TableCell>{product.category ? product.category.title : "N/A"}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleEditProduct(product)}
                    >
                      Modifier
                    </Button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => openDeleteConfirmation(product)}
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

export default ProductManagement;
