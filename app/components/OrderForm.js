// === FINAL, COMPLETE FILE WITH ALL FIELDS AND CANCEL BUTTON ===
import React, { useState, useContext } from "react";
// Import 'Link' from react-router-dom to handle the cancel navigation
import { useLocation, useNavigate, Link } from "react-router-dom";
import Page from "./Page";
import DispatchContext from "../context/DispatchContext";
import { createOrder } from "../services/api";

function OrderForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { product } = location.state || {};
  const appDispatch = useContext(DispatchContext);

  // State variables for all form fields are present
  const [shipping_address_line1, setAddress1] = useState("");
  const [shipping_address_line2, setAddress2] = useState("");
  const [shipping_city, setCity] = useState("");
  const [shipping_state, setState] = useState("");
  const [shipping_postal_code, setZip] = useState("");
  const [shipping_country, setCountry] = useState("USA");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Safety check: if there's no product data, redirect to the homepage.
  if (!product) {
    navigate("/");
    return null;
  }

  // Handles form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
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

      const orderResponse = await createOrder(orderPayload);
      const { order_id } = orderResponse.data.order;

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

        <div className="form__group">
          <label htmlFor="address2" className="form__label">
            Address Line 2 (Optional)
          </label>
          <input
            id="address2"
            type="text"
            className="form__input"
            value={shipping_address_line2}
            onChange={(e) => setAddress2(e.target.value)}
            autoComplete="shipping address-line2"
          />
        </div>

        <div className="form__group">
          <label htmlFor="city" className="form__label">
            City
          </label>
          <input
            id="city"
            type="text"
            className="form__input"
            value={shipping_city}
            onChange={(e) => setCity(e.target.value)}
            required
            autoComplete="shipping address-level2"
          />
        </div>

        <div className="form__group">
          <label htmlFor="state" className="form__label">
            State / Province
          </label>
          <input
            id="state"
            type="text"
            className="form__input"
            value={shipping_state}
            onChange={(e) => setState(e.target.value)}
            required
            autoComplete="shipping address-level1"
          />
        </div>

        <div className="form__group">
          <label htmlFor="zip" className="form__label">
            ZIP / Postal Code
          </label>
          <input
            id="zip"
            type="text"
            className="form__input"
            value={shipping_postal_code}
            onChange={(e) => setZip(e.target.value)}
            required
            autoComplete="shipping postal-code"
          />
        </div>

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

        {/* --- BUTTON CONTAINER FOR CANCEL AND SUBMIT --- */}
        <div
          className="form__button-group"
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "1rem",
            alignItems: "center",
          }}
        >
          {/* The new "Cancel" button, implemented as a styled Link */}
          <Link
            to="/"
            className="form__button"
            style={{
              backgroundColor: "#6c757d", // A neutral grey color
              textAlign: "center", // Ensures text is centered like a button
              flex: 1, // Allows it to share space equally
            }}
          >
            Cancel
          </Link>

          {/* The existing "Proceed" button */}
          <button
            type="submit"
            className="form__button"
            disabled={isSubmitting}
            style={{ flex: 1 }} // Allows it to share space equally
          >
            {isSubmitting ? "Saving..." : "Proceed to Payment"}
          </button>
        </div>
      </form>
    </Page>
  );
}

export default OrderForm;
