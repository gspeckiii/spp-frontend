// app/components/AddressModal.js
import React, { useState } from "react";

function AddressModal({ order, onClose, onSubmit }) {
  const initialAddress = order.fulfillment || {};
  const [address1, setAddress1] = useState(
    initialAddress.shipping_address_line1 || ""
  );
  const [address2, setAddress2] = useState(
    initialAddress.shipping_address_line2 || ""
  );
  const [city, setCity] = useState(initialAddress.shipping_city || "");
  const [state, setState] = useState(initialAddress.shipping_state || "");
  const [zip, setZip] = useState(initialAddress.shipping_postal_code || "");
  const [country, setCountry] = useState(
    initialAddress.shipping_country || "USA"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSubmit({
      shipping_address_line1: address1,
      shipping_address_line2: address2,
      shipping_city: city,
      shipping_state: state,
      shipping_postal_code: zip,
      shipping_country: country,
    });
    setIsSubmitting(false);
  };

  return (
    // Note: The outer 'modal' classes are kept as a custom modal CSS was not provided.
    // The inner form is refactored to use the new BEM-style classes.
    <div
      className="modal"
      tabIndex="-1"
      role="dialog"
      style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-lg" role="document">
        <div
          className="modal-content"
          style={{ backgroundColor: "#2d2d2d", color: "white" }}
        >
          {/* We apply our custom 'form' class here */}
          <form
            onSubmit={handleSubmit}
            className="form"
            style={{ border: "none" }}
          >
            <div
              className="modal-header"
              style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.2)" }}
            >
              <h5 className="modal-title">
                Edit Shipping Address for Order #{order.order_id}
              </h5>
              <button
                type="button"
                className="close"
                style={{ color: "white" }}
                onClick={onClose}
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="form__group">
                <label htmlFor="address1" className="form__label">
                  Address Line 1
                </label>
                <input
                  id="address1"
                  type="text"
                  className="form__input"
                  value={address1}
                  onChange={(e) => setAddress1(e.target.value)}
                  required
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
                  value={address2}
                  onChange={(e) => setAddress2(e.target.value)}
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
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
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
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  required
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
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  required
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
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
                />
              </div>
            </div>
            <div
              className="modal-footer"
              style={{ borderTop: "1px solid rgba(255, 255, 255, 0.2)" }}
            >
              <button
                type="button"
                className="form__button"
                onClick={onClose}
                disabled={isSubmitting}
                style={{ backgroundColor: "#6c757d" }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="form__button"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Address"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddressModal;
