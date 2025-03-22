// Payment.js

import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm'; // Importons un formulaire de paiement personnalisé
import './Payment.css';

// Charge la clé publique Stripe
const stripePromise = loadStripe("pk_test_51Qzzz0Rs8SxkDf3PFP6Nm7xwBoOMaEdka71rUv643ydzAfyhpLlYPB9eopFncR63weAl1IZFCbGLIssA7qHWG2hy00ZaJFHgeu");

const Payment = () => {
  return (
    <div className="payment-container">
      <h2>Payment</h2>
      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </div>
  );
};

export default Payment;
