// app/components/PaymentForm.js

import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Page from "./Page";
import DispatchContext from "../context/DispatchContext";
import LoadingDotsIcon from "./LoadingDotsIcon";
import { getOrderById, createPayment } from "../services/api";

function PaymentForm() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const appDispatch = useContext(DispatchContext);

  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const response = await getOrderById(orderId);
        setOrder(response.data);
        setIsLoading(false);
      } catch (e) {
        console.error("Could not fetch order for payment.", e);
        appDispatch({
          type: "flashMessage",
          value: "Could not find order details.",
        });
        navigate("/");
      }
    }
    fetchOrder();
  }, [orderId, navigate, appDispatch]);

  const handlePaymentSubmit = async () => {
    setIsProcessing(true);
    try {
      await createPayment(orderId, {
        payment_method_token: "tok_visa_payment_form_simulated",
      });

      appDispatch({
        type: "flashMessage",
        value: "Payment successful! Your order is being processed.",
      });
      navigate("/");
    } catch (error) {
      console.error(
        "Payment failed.",
        error.response ? error.response.data : error.message
      );
      appDispatch({
        type: "flashMessage",
        value: "Payment failed. Please try again.",
      });
      setIsProcessing(false);
    }
  };

  if (isLoading || !order) {
    return (
      <Page title="Loading...">
        <LoadingDotsIcon />
      </Page>
    );
  }

  return (
    <Page title="Complete Payment">
      {/* Use the .form class as the main container */}
      <div className="form">
        <h2 className="form__heading">Confirm & Pay</h2>

        {/* Order Summary Section */}
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

        {/* Payment Method Section */}
        <div>
          <h4
            style={{ borderBottom: "1px solid #444", paddingBottom: "0.5rem" }}
          >
            Payment Method
          </h4>
          <div className="form__group">
            <p style={{ color: "#ccc" }}>
              This is a simulated payment gateway. Clicking "Pay" will complete
              the order.
            </p>
            {/* In a real app, Stripe Elements or another payment UI would go here */}
            <div
              style={{
                background: "#fff",
                color: "#333",
                padding: "1.5rem",
                borderRadius: "8px",
              }}
            >
               Using saved card ending in 4242
            </div>
          </div>
          <button
            onClick={handlePaymentSubmit}
            disabled={isProcessing}
            className="form__button"
          >
            {isProcessing
              ? "Processing..."
              : `Pay $${parseFloat(order.total_amount).toFixed(2)}`}
          </button>
        </div>
      </div>
    </Page>
  );
}

export default PaymentForm;
