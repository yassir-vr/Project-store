import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import "./CategoryProducts.css";
import axios from "axios";
import Header from "./../Header/Header";
import Footer from "../Footer/Footer";

const CategoryProducts = () => {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // État pour la recherche
  const [priceRange, setPriceRange] = useState(100); // État pour le filtre par prix
  const [categories, setCategories] = useState([]); // État pour les catégories
  const [selectedCategory, setSelectedCategory] = useState(""); // État pour la catégorie sélectionnée

  useEffect(() => {
    // Récupérer les produits de la catégorie
    axios
      .get(`${process.env.REACT_APP_API_URL}/categories/${id}/products`)
      .then((response) => {
        setProducts(response.data.filter((product) => product.is_active));
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des produits :", error);
      });

    // Récupérer les catégories
    axios
      .get(`${process.env.REACT_APP_API_URL}/categories`)
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des catégories :", error);
      });
  }, [id]);

  const handleProductClick = (product) => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/categories/${id}/products`)
      .then((response) => {
        const similar = response.data.filter(
          (p) => p.is_active && p.id !== product.id
        );
        setSimilarProducts(similar.slice(0, 3));

        Swal.fire({
          title: product.title,
          html: `
            <img src="http://127.0.0.1:8000/storage/${product.image}" alt="${product.title}" style="width: 350px; height:200px"/>
            <div class="product-info">
              <p><strong>Description:</strong> ${product.description}</p>
              <p><strong>Price:</strong> ${product.price} DH</p>
              <p><strong>Quantity:</strong> <input id="product-quantity" type="number" min="1" max="1000" value="1" style="width: 50px;" /> /kg</p>
              <br/><br/>
            </div>
            <h4>Similar Products:</h4>
            <div class="similar-products" id="similar-products-container"> 
              ${similar
                .slice(0, 4)
                .map(
                  (similarProduct) => `
                    <div class="similar-product">
                      <div class="similar-product-image">
                        <img src="http://127.0.0.1:8000/storage/${similarProduct.image}" alt="${similarProduct.title}" style="width: 100px;"/>
                        <a href="javascript:void(0);" class="eye-icon" data-product-id="${similarProduct.id}">
                          <i class="fas fa-eye"></i>
                        </a>
                      </div>
                      <h5>${similarProduct.title}</h5>
                    </div>
                  `
                )
                .join("")}
            </div>
          `,
          showCancelButton: true,
          cancelButtonText: "Close",
          confirmButtonText: "Add to Cart",
          confirmButtonColor: "#4CAF50",
          cancelButtonColor: "#d33",
          focusConfirm: false,
          customClass: {
            popup: 'large-swal-popup', 
            title: 'large-swal-title',
            htmlContainer: 'large-swal-html',
          },
          didOpen: () => {
            // Ajout des gestionnaires d'événements après le rendu du HTML
            document.querySelectorAll('.eye-icon').forEach((icon) => {
              icon.addEventListener('click', () => {
                const productId = icon.getAttribute('data-product-id');
                const similarProduct = similar.find(p => p.id == productId);
                if (similarProduct) {
                  handleProductClick(similarProduct);
                }
              });
            });
          },
          preConfirm: () => {
            const quantity = document.getElementById("product-quantity").value;
            addToCart(product, quantity);
          },
        });
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des produits similaires :", error);
      });
  };

  const addToCart = (product, quantity) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += parseInt(quantity);
    } else {
      cart.push({ ...product, quantity: parseInt(quantity) });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));

    Swal.fire({
      icon: "success",
      title: "Added to Cart!",
      text: `${product.title} x${quantity} added to your cart.`,
    });
  };

  // Fonction pour filtrer les produits par recherche, prix et catégorie
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrice = product.price <= priceRange;
    const matchesCategory = selectedCategory ? product.category_id === parseInt(selectedCategory) : true;
    return matchesSearch && matchesPrice && matchesCategory;
  });

  return (
    <>
      <Header />
      <section className="category-products">
        <h1 className="heading">Produits de la catégorie</h1>

        <div className="main-container">
          {/* Section des filtres à gauche */}
          <div className="filters-section">
            {/* Barre de recherche */}
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="search-button">Search Now</button>
            </div>


            {/* Filtre par prix */}
            <div className="price-filter">
              <h3>Filter by Price</h3>
              <input
                type="range"
                min="0"
                max="100"
                value={priceRange}
                onChange={(e) => setPriceRange(parseInt(e.target.value))}
              />
              <p>{priceRange} DH</p>
            </div>
          </div>

          {/* Section des produits à droite */}
          <div className="products-section">
            <div className="products-container">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <div className="product-card" key={product.id}>
                    <div className="product-image-container">
                      <img
                        src={`http://127.0.0.1:8000/storage/${product.image}`}
                        alt={product.title}
                        onError={(e) => {
                          e.target.src = "/images/default.jpg";
                        }}
                      />
                    </div>
                    <div className="product-info">
                      <span className="discount">{product.sale_attribute}</span>
                      <div className="icons">
                        <a
                          className="fas fa-eye"
                          onClick={() => handleProductClick(product)}
                        ></a>
                      </div>
                      <h3>{product.title}</h3>
                      <div className="pric">{product.price} DH</div>
                      <div className="quantity">
                        <span>Quantity: </span>
                        <input
                          type="number"
                          min="1"
                          max="1000"
                          defaultValue="1"
                          id={`quantity-${product.id}`}
                        />
                        <span> / {product.sale_attribute}</span>
                      </div>
                      <button
                        className="btn a"
                        onClick={() =>
                          addToCart(
                            product,
                            parseInt(
                              document.getElementById(`quantity-${product.id}`)
                                .value
                            )
                          )
                        }
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p>Aucun produit trouvé pour cette catégorie.</p>
              )}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default CategoryProducts;