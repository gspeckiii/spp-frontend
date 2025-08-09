// === CHANGED FILE ===
import React, { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Page from "./Page";
import DispatchContext from "../context/DispatchContext";
import { createOrder } from "../services/api";

function OrderForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { product } = location.state || {};
  const appDispatch = useContext(DispatchContext);

  // State for the form fields
  const [shipping_address_line1, setAddress1] = useState("");
  const [shipping_address_line2, setAddress2] = useState("");
  const [shipping_city, setCity] = useState("");
  const [shipping_state, setState] = useState("");
  const [shipping_postal_code, setZip] = useState("");
  const [shipping_country, setCountry] = useState("USA");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!product) {
    navigate("/");
    return null;
  }

  // === THIS IS THE ONLY PART THAT CHANGES ===
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Step 1: Create a single payload with all order and fulfillment details.
      // This matches the structure the backend now expects.
      const orderPayload = {
        items: [{ product_id: product.id, quantity: 1 }],
        total_amount: product.prod_cost,
        fulfillmentDetails: {
          shipping_address_line1,
          shipping_address_line2,
          shipping_city,
          shipping_state,
          shipping_postal_code,
          shipping_country,
        },
      };

      // Step 2: Make ONE API call. The backend now handles creating both the
      // order and the fulfillment record.
      const orderResponse = await createOrder(orderPayload);
      const { order_id } = orderResponse.data.order;

      // Step 3: Navigate to the PaymentForm for the newly created order
      appDispatch({
        type: "flashMessage",
        value: "Shipping details saved. Please complete your payment.",
      });
      navigate(`/payment/${order_id}`);
    } catch (error) {
      console.error(
        "Error creating order:",
        error.response ? error.response.data : error.message
      );
      appDispatch({
        type: "flashMessage",
        value: "There was a problem saving your order. Please try again.",
      });
      setIsSubmitting(false);
    }
  };

  // The JSX for the form remains exactly the same.
  return (
    <Page title="Shipping Information">
      <form onSubmit={handleSubmit} className="form">
        <h2 className="form__heading">Shipping Details</h2>
        <div
          style={{
            textAlign: "center",
            marginBottom: "2rem",
            padding: "1rem",
            background: "rgba(0,0,0,0.1)",
            borderRadius: "4px",
          }}
        >
          <p>
            Ordering: <strong>{product.prod_name}</strong> for{" "}
            <strong>${parseFloat(product.prod_cost).toFixed(2)}</strong>
          </p>
        </div>
        <div className="form__group">
          <label htmlFor="address1" className="form__label">
            Address Line 1
          </label>
          <input
            id="address1"
            type="text"
            className="form__input"
            value={shipping_address_line1}
            onChange={(e) => setAddress1(e.target.value)}
            required
            autoComplete="shipping street-address"
          />
        </div>
        {/* ... (all your other form inputs) ... */}
        <div className="form__group">
          <label htmlFor="country" className="form__label">
            Country
          </label>
          <input
            id="country"
            type="text"
            className="form__input"
            value={shipping_country}
            onChange={(e) => setCountry(e.target.value)}
            required
            autoComplete="shipping country"
          />
        </div>
        <button type="submit" className="form__button" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Proceed to Payment"}
        </button>
      </form>
    </Page>
  );
}

export default OrderForm;
