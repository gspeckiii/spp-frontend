// app/components/OrderForm.js

import React, { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Axios from "axios";
import Page from "./Page";
import StateContext from "../context/StateContext";
import DispatchContext from "../context/DispatchContext";

function OrderForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { product } = location.state || {}; // Get the product from the route state

  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);

  // State for the form inputs
  const [shipping_address_line1, setAddress1] = useState("");
  const [shipping_address_line2, setAddress2] = useState("");
  const [shipping_city, setCity] = useState("");
  const [shipping_state, setState] = useState("");
  const [shipping_postal_code, setZip] = useState("");
  const [shipping_country, setCountry] = useState("USA"); // Default to USA

  // State for submission process
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if no product data is passed
  if (!product) {
    navigate("/");
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Step 1: Create the Order
      const orderResponse = await Axios.post(
        "/orders",
        {
          items: [{ product_id: product.id, quantity: 1 }], // Assuming quantity is always 1 for this form
          total_amount: product.prod_cost,
        },
        { headers: { Authorization: `Bearer ${appState.user.token}` } }
      );
      const { order_id } = orderResponse.data.order;
      console.log(`Order created with ID: ${order_id}`);

      // Step 2: Create the Payment (simulated)
      await Axios.post(
        `/orders/${order_id}/payments`,
        { payment_method_token: "tok_visa_simulated" }, // Using a simulated token
        { headers: { Authorization: `Bearer ${appState.user.token}` } }
      );
      console.log(`Payment processed for order ID: ${order_id}`);

      // Step 3: Create the Fulfillment
      await Axios.post(
        `/orders/${order_id}/fulfillment`,
        {
          shipping_address_line1,
          shipping_address_line2,
          shipping_city,
          shipping_state,
          shipping_postal_code,
          shipping_country,
        },
        { headers: { Authorization: `Bearer ${appState.user.token}` } }
      );
      console.log(`Fulfillment created for order ID: ${order_id}`);

      // Success!
      appDispatch({
        type: "flashMessage",
        value: "Your order has been placed successfully!",
      });
      navigate("/"); // Redirect to home page after successful order
    } catch (error) {
      console.error("There was a problem placing the order.", error);
      appDispatch({
        type: "flashMessage",
        value: "There was a problem placing your order. Please try again.",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <Page title="Place Your Order">
      <div className="form-container">
        <h2>Complete Your Order</h2>
        <div className="order-summary-mini">
          <p>
            You are ordering: <strong>{product.prod_name}</strong>
          </p>
          <p>
            Total: <strong>${parseFloat(product.prod_cost).toFixed(2)}</strong>
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <h3>Shipping Address</h3>
          <div className="form-group">
            <label htmlFor="address1">Address Line 1</label>
            <input
              id="address1"
              type="text"
              value={shipping_address_line1}
              onChange={(e) => setAddress1(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="address2">Address Line 2 (Optional)</label>
            <input
              id="address2"
              type="text"
              value={shipping_address_line2}
              onChange={(e) => setAddress2(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="city">City</label>
            <input
              id="city"
              type="text"
              value={shipping_city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="state">State</label>
            <input
              id="state"
              type="text"
              value={shipping_state}
              onChange={(e) => setState(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="zip">ZIP / Postal Code</label>
            <input
              id="zip"
              type="text"
              value={shipping_postal_code}
              onChange={(e) => setZip(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="country">Country</label>
            <input
              id="country"
              type="text"
              value={shipping_country}
              onChange={(e) => setCountry(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Placing Order..." : "Place Order"}
          </button>
        </form>
      </div>
    </Page>
  );
}

export default OrderForm;
