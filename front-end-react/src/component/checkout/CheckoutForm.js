import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Swal from 'sweetalert2';
import './Payment.css';

const CheckoutForm = () => {
  const [loading, setLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);

    const cardElement = elements.getElement(CardElement);

    const { token, error } = await stripe.createToken(cardElement);

    if (error) {
      Swal.fire({
        title: 'Payment Error',
        text: error.message,
        icon: 'error',
        confirmButtonText: 'Try Again',
      });
      setLoading(false);
    } else {
      fetch('/api/payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: token.id,
          amount: 1000, // Montant en centimes
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            Swal.fire({
              title: 'Payment Successful!',
              text: 'Your order has been confirmed!',
              icon: 'success',
              confirmButtonText: 'Go to Order Confirmation',
            }).then(() => {
              window.location.href = "/order-confirmation";
            });
          } else {
            Swal.fire({
              title: 'Payment Failed',
              text: 'An error occurred while processing your payment.',
              icon: 'error',
              confirmButtonText: 'Try Again',
            });
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
        });
    }
  };

  return (
    <div className="payment-box">
      <h2 className="payment-title">Secure Payment</h2>
      <form onSubmit={handleSubmit} className="payment-form">
        <div className="form-group">
          <label htmlFor="card-element">Credit or Debit Card</label>
          <div className="card-input">
            <CardElement 
              id="card-element"
              options={{
                style: {
                  base: {
                    fontSize: '18px',
                    color: '#424770',
                    letterSpacing: '0.025em',
                    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                    padding: '12px',
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                    border: '1px solid #ccc',
                    boxSizing: 'border-box',
                  },
                  invalid: {
                    color: '#9e2146',
                  },
                }
              }}
            />
          </div>
        </div>

        <button type="submit" disabled={loading || !stripe} className="payment-button">
          {loading ? 'Processing...' : 'Pay Now'}
        </button>
      </form>
    </div>
  );
};

export default CheckoutForm;
