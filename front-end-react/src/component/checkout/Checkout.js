import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./Checkout.css";
import axios from "axios"; // Importez axios pour faire des requêtes HTTP

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    payment_method: "cash",
    card_number: "",
    expiry_date: "",
    cvc: "",
  });

  const navigate = useNavigate();
  const [showCardForm, setShowCardForm] = useState(false);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCart);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "payment_method") {
      setShowCardForm(value === "card");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const orderData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      payment_method: formData.payment_method,
      items: cartItems.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
        sale_attribute: item.sale_attribute || null,
      })),
      total_price: cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      ),
    };

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/orders",
        orderData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Include the token
          },
        }
      );
      if (response.status === 201) {
        // Vider le panier
        localStorage.removeItem("cart"); // Supprimer le panier du localStorage
        setCartItems([]); // Réinitialiser l'état cartItems

        Swal.fire({
          title: "Order Confirmed!",
          text: "Your order has been confirmed. You can download your invoice.",
          icon: "success",
          confirmButtonText: "Go to Confirmation",
        }).then(() => {
          navigate(`/order-confirmation/${response.data.order.id}`);
        });
      }
    } catch (error) {
      console.error(
        "Error placing order:",
        error.response?.data || error.message
      );
      Swal.fire({
        title: "Error!",
        text:
          error.response?.data?.error ||
          "There was an issue placing your order. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      <div className="checkout-main">
        <div className="order-summary">
          <h3>Order Summary</h3>
          {cartItems.length > 0 ? (
            cartItems.map((item, index) => (
              <div className="order-item" key={index}>
                <img
                  src={`http://127.0.0.1:8000/storage/${item.image}`}
                  alt={item.title}
                  width={50}
                />
                <div>
                  <h4>{item.title}</h4>
                  <span>{item.price} DH</span>
                  <p>Qty: {item.quantity}</p>
                </div>
              </div>
            ))
          ) : (
            <p>Your cart is empty.</p>
          )}
          <div className="order-total">
            Total:{" "}
            {cartItems.reduce(
              (acc, item) => acc + item.price * item.quantity,
              0
            )}{" "}
            DH
          </div>
        </div>

        <div className="checkout-form">
          <h3>Billing Information</h3>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone"
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              onChange={handleChange}
              required
            />

            <select name="payment_method" onChange={handleChange} required>
              <option value="cash">Cash on Delivery</option>
              <option value="card">Credit Card</option>
            </select>

            {showCardForm && (
              <div className="payment-details">
                <h3>Payment Details</h3>
                <input
                  type="text"
                  name="card_number"
                  placeholder="Card Number"
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="expiry_date"
                  placeholder="MM/YY"
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="cvc"
                  placeholder="CVC"
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            <button type="submit" className="btn-confirm">
              Confirm Order
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;