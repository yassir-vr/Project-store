import React from "react";
import { useParams } from "react-router-dom";
import './OrderConfirmation.css';

const OrderConfirmation = () => {
  const { orderId } = useParams();

  console.log("Order ID:", orderId); // Debugging statement

  return (
    <div className="confirmation-container">
      <h2>Your Order is Confirmed!</h2>
      <p>Thank you for your purchase. You can download your invoice below:</p>

      <div className="button-container">
        <a href={`http://127.0.0.1:8000/api/download-invoice/${orderId}`} className="btn-download">
          Download Invoice
        </a>
        <a href="/" className="btn-home">
          Go to Home
        </a>
      </div>
    </div>
  );
};

export default OrderConfirmation;