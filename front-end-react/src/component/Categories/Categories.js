import React, { useEffect, useState } from "react";
import "./Categories.css";
import AOS from "aos";
import "aos/dist/aos.css";
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate } from "react-router-dom";

AOS.init();

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/categories`)
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) =>
        console.error("Erreur lors de la récupération des catégories :", error)
      );
  }, []);

  // Fonction pour ajouter un produit au panier
  const addToCart = (product, quantity) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      existingItem.quantity += parseInt(quantity);
    } else {
      cart.push({ ...product, quantity: parseInt(quantity) });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    // Envoyer un événement personnalisé pour mettre à jour le panier
    window.dispatchEvent(new Event("cartUpdated"));

    Swal.fire({
      icon: "success",
      title: "Ajouté au panier !",
      text: `${product.title} x${quantity} a été ajouté à votre panier.`,
    });
  };

  const handleShopNowClick = (categoryId) => {
    navigate(`/category/${categoryId}`);
  };

  return (
    <section className="categories" id="Categories">
      <h1 className="heading" data-aos-duration="2000" data-aos="zoom-in-down">
        product <span>categories</span>
      </h1>

      <div className="box-container">
        {categories.length > 0 ? (
          categories.map((category) => (
            <div
              className="box"
              key={category.id}
              data-aos-duration="2000"
              data-aos="zoom-in-down"
            >
              <img
                src={`http://127.0.0.1:8000/storage/${category.image}`}
                alt={category.title}
                onError={(e) => {
                  e.target.src = "/images/default.jpg";
                }}
              />

              <h3>{category.title}</h3>
              <p>{category.description}</p>
              <button
                className="btn"
                onClick={() => handleShopNowClick(category.id)}
              >
                Shop Now
              </button>
            </div>
          ))
        ) : (
          <p>No categories found</p>
        )}
      </div>
    </section>
  );
};

export default Categories;
