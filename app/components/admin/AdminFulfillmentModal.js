import React, { useState } from "react";

function AdminFulfillmentModal({ order, onClose, onSubmit }) {
  const initial = order.fulfillment || {};
  const [status, setStatus] = useState(
    initial.fulfillment_status?.trim() || "unfulfilled"
  );
  const [provider, setProvider] = useState(initial.shipping_provider || "");
  const [tracking, setTracking] = useState(initial.tracking_number || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSubmit({
      fulfillment_status: status,
      shipping_provider: provider,
      tracking_number: tracking,
    });
    // The parent component will handle closing and isSubmitting state reset on success
    // but we'll reset it here in case of failure.
    setIsSubmitting(false);
  };

  const fulfillmentStatuses = [
    "unfulfilled",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];

  return (
    <div className="modal-shell" role="dialog" aria-modal="true">
      <div className="modal-shell__dialog">
        <form onSubmit={handleSubmit} className="form modal-shell__content">
          <div className="modal-shell__header">
            <h5 className="modal-shell__title">
              Update Fulfillment for Order #{order.order_id}
            </h5>
            <button
              type="button"
              className="modal-shell__close-button"
              onClick={onClose}
              aria-label="Close"
            >
              ×
            </button>
          </div>
          <div className="modal-shell__body">
            <div className="form__group">
              <label htmlFor="status" className="form__label">
                Fulfillment Status
              </label>
              <select
                id="status"
                className="form__input"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                {fulfillmentStatuses.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="form__group">
              <label htmlFor="provider" className="form__label">
                Shipping Provider
              </label>
              <input
                id="provider"
                type="text"
                className="form__input"
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                placeholder="e.g., USPS, FedEx, UPS"
              />
            </div>
            <div className="form__group">
              <label htmlFor="tracking" className="form__label">
                Tracking Number
              </label>
              <input
                id="tracking"
                type="text"
                className="form__input"
                value={tracking}
                onChange={(e) => setTracking(e.target.value)}
              />
            </div>
          </div>
          <div className="modal-shell__footer">
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
              className="form__button form__button--primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminFulfillmentModal;
