import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import "./Product.css";
import { Navigation, Autoplay } from "swiper/modules";
import Swal from "sweetalert2";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";

AOS.init();

const Products = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/products-by-category")
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) =>
        console.error(
          "Erreur lors de la récupération des produits par catégorie :",
          error
        )
      );
  }, []);

  const handleProductClick = (product) => {
    Swal.fire({
      title: product.title,
      html: `
                <img src="http://127.0.0.1:8000/storage/${product.image}" alt="${product.title}" style="width: 250px; height: 200px; margin-bottom: 20px;" />
                <p><strong>Description:</strong> ${product.description}</p>
                <p><strong>Price:</strong> ${product.price} DH</p>
                <p><strong>Quantity:</strong> <input id="product-quantity" type="number" min="1" max="1000" value="1" style="width: 50px;" /> /kg</p>
            `,
      showCancelButton: true,
      cancelButtonText: "Close",
      confirmButtonText: "Add to Cart",
      confirmButtonColor: "#4CAF50",
      cancelButtonColor: "#d33",
      focusConfirm: false,
      preConfirm: () => {
        const quantity = document.getElementById("product-quantity").value;
        addToCart(product, quantity);
      },
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

  return (
    <>
        <section className="products" id="Products" data-aos-duration="2000" data-aos="zoom-in-down">
            {categories.length > 0 ? (
                categories.map((category) => (
                    <div key={category.id}>
                        <h1 className="heading">
                           <span>{category.title}</span> 
                        </h1>
                        <Swiper
                            modules={[Autoplay]}
                            spaceBetween={10}
                            loop={true}
                            autoplay={{
                                delay: 4500,
                                disableOnInteraction: false,
                            }}
                            breakpoints={{
                                0: {
                                    slidesPerView: 1,
                                },
                                768: {
                                    slidesPerView: 2,
                                },
                                1024: {
                                    slidesPerView: 4,
                                },
                            }}
                        >
                            {category.products.length > 0 ? (
                                category.products.map((product) => (
                                    <SwiperSlide key={product.id}>
                                        <div className='product-slider'>
                                            <div className="swiper-slide box">
                                                <span className="discount">{product.sale_attribute}</span>
                                                <div className="icons">
                                                    <a className="fas fa-eye" onClick={() => handleProductClick(product)}></a>
                                                </div>
                                                <img src={`http://127.0.0.1:8000/storage/${product.image}`} alt={product.title} />
                                                <h3>{product.title}</h3>
                                                <div className="price">
                                                    {product.price} DH
                                                </div>
                                                <div className="quantity">
                                                    <span>Quantity: </span>
                                                    <input type="number" min="1" max="1000" defaultValue="1" id={`quantity-${product.id}`} />
                                                    <span> / {product.sale_attribute}</span>
                                                </div>
                                                <button className="btn a" onClick={() => addToCart(product, parseInt(document.getElementById(`quantity-${product.id}`).value))}>
                                                    Add to Cart
                                                </button>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                ))
                            ) : (
                                <p className="no-products">No active products in this category.</p>
                            )}
                        </Swiper>
                    </div>
                ))
            ) : (
                <p className="no-products">No categories available.</p>
            )}
        </section>
    </>
);

};

export default Products;
