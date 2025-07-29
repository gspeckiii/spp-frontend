import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

import Page from "./Page";
import DispatchContext from "../context/DispatchContext";
import LoadingDotsIcon from "./LoadingDotsIcon";
// Import the new function from your api service
import { getOrderById, createPaymentIntentForOrder } from "../services/api";

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(process.env.STRIPE_PUBLISHABLE_KEY);

// --- A new, small component for the actual form ---
// It MUST be a child of the <Elements> provider to use Stripe hooks.
const CheckoutForm = ({ order }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const appDispatch = useContext(DispatchContext);

  const [message, setMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      // We handle the success case here manually, so we use `if_required`
      // to avoid an unnecessary redirect for standard card payments.
      redirect: "if_required",
    });

    if (error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(error.message);
      } else {
        setMessage("An unexpected error occurred.");
      }
    } else {
      // Payment was successful! The webhook on your server will handle updating
      // the database. The frontend's job is done.
      appDispatch({
        type: "flashMessage",
        value: "Payment successful! Your order is being processed.",
      });
      // Redirect to a user dashboard, order history, or home page.
      navigate(`/order-confirmation/${order.order_id}`);
    }

    setIsProcessing(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      {/* This is the magic component from Stripe that renders the entire payment form */}
      <PaymentElement id="payment-element" />

      <button
        disabled={isProcessing || !stripe || !elements}
        id="submit"
        className="form__button"
        style={{ marginTop: "1.5rem" }}
      >
        <span id="button-text">
          {isProcessing
            ? "Processing..."
            : `Pay $${parseFloat(order.total_amount).toFixed(2)}`}
        </span>
      </button>

      {/* Show any error or success messages */}
      {message && (
        <div id="payment-message" style={{ color: "red", marginTop: "1rem" }}>
          {message}
        </div>
      )}
    </form>
  );
};

// --- The main PaymentForm component ---
function PaymentForm() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const appDispatch = useContext(DispatchContext);

  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    async function fetchOrderAndCreateIntent() {
      try {
        // 1. Fetch order details from your server
        const orderResponse = await getOrderById(orderId);
        setOrder(orderResponse.data);

        // 2. Create the Payment Intent on your server and get the client secret
        const intentResponse = await createPaymentIntentForOrder(orderId);
        setClientSecret(intentResponse.data.clientSecret);
      } catch (e) {
        console.error("Could not fetch order or create payment intent.", e);
        appDispatch({
          type: "flashMessage",
          value:
            "Could not initialize payment. Please try again or contact support.",
        });
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    }
    fetchOrderAndCreateIntent();
  }, [orderId, navigate, appDispatch]);

  // Options for the Stripe Elements provider
  const appearance = {
    theme: "stripe", // or 'night', 'flat'
  };
  const options = {
    clientSecret,
    appearance,
  };

  if (isLoading || !order) {
    return (
      <Page title="Loading Payment...">
        <LoadingDotsIcon />
      </Page>
    );
  }

  return (
    <Page title="Complete Payment">
      <div className="form">
        <h2 className="form__heading">Confirm & Pay</h2>

        {/* Your existing Order Summary JSX remains the same */}
        <div className="payment-summary" style={{ marginBottom: "2rem" }}>
          <h4
            style={{ borderBottom: "1px solid #444", paddingBottom: "0.5rem" }}
          >
            Order Summary
          </h4>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {order.items.map((item) => (
              <li
                key={item.product_id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "0.5rem 0",
                }}
              >
                <span>
                  {item.prod_name} (x{item.quantity})
                </span>
                <span>${parseFloat(item.price_at_purchase).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <hr style={{ border: "1px solid #444" }} />
          <p
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "1.2rem",
              fontWeight: "bold",
            }}
          >
            <span>Total:</span>
            <span>${parseFloat(order.total_amount).toFixed(2)}</span>
          </p>
        </div>

        <h4
          style={{
            borderBottom: "1px solid #444",
            paddingBottom: "0.5rem",
            marginBottom: "1.5rem",
          }}
        >
          Payment Method
        </h4>

        {/* Render the Stripe Elements form only when the clientSecret is available */}
        {clientSecret && (
          <Elements options={options} stripe={stripePromise}>
            <CheckoutForm order={order} />
          </Elements>
        )}
      </div>
    </Page>
  );
}

export default PaymentForm;
