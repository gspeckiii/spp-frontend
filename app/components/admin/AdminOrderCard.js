import React, { useContext } from "react";
import StateContext from "../../context/StateContext";

// --- HELPER FUNCTION to generate the correct tracking URL ---
const getTrackingUrl = (carrier, trackingNumber) => {
  if (!carrier || !trackingNumber) return null;

  // Normalize the carrier name for reliable matching
  const carrierKey = carrier.trim().toLowerCase();

  // Add more carriers here as needed in the future
  switch (carrierKey) {
    case "usps":
      return `https://tools.usps.com/go/TrackConfirmAction?qtc_tLabels1=${trackingNumber}`;
    case "ups":
      return `https://www.ups.com/track?tracknum=${trackingNumber}`;
    case "fedex":
      return `https://www.fedex.com/apps/fedextrack/?tracknumbers=${trackingNumber}`;
    case "dhl":
      return `https://www.dhl.com/en/express/tracking.html?AWB=${trackingNumber}`;
    default:
      // Return a generic Google search link as a fallback if the carrier is unknown
      return `https://www.google.com/search?q=${carrier}+${trackingNumber}+tracking`;
  }
};

function AdminOrderCard({ order, onAdminUpdate }) {
  const { urls } = useContext(StateContext);

  const getStatusClass = (status) => {
    const cleanStatus = status ? status.trim() : "";
    const defaultClass = "default";
    const statusMap = {
      pending_payment: "pending_payment",
      unfulfilled: "unfulfilled",
      processing: "processing",
      shipped: "shipped",
      delivered: "delivered",
      completed: "completed",
      cancelled: "cancelled",
      succeeded: "succeeded",
      failed: "failed",
      declined: "declined",
    };
    return `order-card__status--${statusMap[cleanStatus] || defaultClass}`;
  };

  const getPaymentInfo = () => {
    if (!order.payments || order.payments.length === 0) {
      return {
        text: "Awaiting Payment",
        class: getStatusClass("pending_payment"),
      };
    }
    const latestPayment = order.payments.sort(
      (a, b) => new Date(b.payment_date) - new Date(a.payment_date)
    )[0];
    const statusText = latestPayment.payment_status
      ? latestPayment.payment_status.trim()
      : "Unknown";
    return {
      text: statusText,
      class: getStatusClass(latestPayment.payment_status),
    };
  };

  const paymentInfo = getPaymentInfo();

  // Generate the tracking URL using the helper function
  const trackingUrl = getTrackingUrl(
    order.fulfillment?.shipping_provider,
    order.fulfillment?.tracking_number
  );

  return (
    // We use the base .order-card class and add our admin-specific modifier class
    <div className="order-card admin-order-card">
      {/* Admin-only header for customer info */}
      {order.username && (
        <div className="admin-order-card__customer-header">
          <p className="admin-order-card__customer-text">
            <strong>Customer:</strong> {order.username} (User ID:{" "}
            {order.user_id})
          </p>
        </div>
      )}

      {/* The rest of the card structure is identical to OrderCard */}
      <div className="order-card__header">
        <div>
          <h5 className="order-card__id">Order #{order.order_id}</h5>
          <p className="order-card__date">
            Placed on: {new Date(order.created_at).toLocaleDateString()}
          </p>
        </div>
        <span
          className={`order-card__status ${getStatusClass(order.order_status)}`}
        >
          {order.order_status?.trim().replace("_", " ")}
        </span>
      </div>

      <div className="order-card__body">
        {order.items.map((item) => (
          <div key={item.order_item_id} className="order-card__item">
            <img
              src={urls.images + item.product_image_path}
              alt={item.prod_name}
              className="order-card__item-image"
            />
            <div className="order-card__item-details">
              <h6 className="order-card__item-name">{item.prod_name}</h6>
              <p className="order-card__item-info">
                Quantity: {item.quantity} × $
                {parseFloat(item.price_at_purchase).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
        <hr className="order-card__divider" />
        <div className="order-card__details-section">
          <div className="order-card__shipping">
            <h6 className="order-card__subheading">Shipping Details</h6>
            {order.fulfillment ? (
              <>
                <p className="order-card__detail-text">
                  {order.fulfillment.shipping_address_line1}
                </p>
                {order.fulfillment.shipping_address_line2 && (
                  <p className="order-card__detail-text">
                    {order.fulfillment.shipping_address_line2}
                  </p>
                )}
                <p className="order-card__detail-text">
                  {order.fulfillment.shipping_city},{" "}
                  {order.fulfillment.shipping_state}{" "}
                  {order.fulfillment.shipping_postal_code}
                </p>
                <p className="order-card__detail-text">
                  Status:{" "}
                  <span
                    className={`order-card__status ${getStatusClass(
                      order.fulfillment.fulfillment_status
                    )}`}
                  >
                    {order.fulfillment.fulfillment_status.trim()}
                  </span>
                </p>
                {/* This is the corrected link implementation */}
                {trackingUrl && (
                  <p className="order-card__detail-text">
                    Tracking:{" "}
                    <a
                      href={trackingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {order.fulfillment.tracking_number}
                    </a>
                  </p>
                )}
              </>
            ) : (
              <p>Address not provided.</p>
            )}
          </div>
          <div className="order-card__payment">
            <h6 className="order-card__subheading">Payment</h6>
            <p className="order-card__detail-text">
              Total:{" "}
              <strong>${parseFloat(order.total_amount).toFixed(2)}</strong>
            </p>
            <p className="order-card__detail-text">
              Status:{" "}
              <span className={`order-card__status ${paymentInfo.class}`}>
                {paymentInfo.text}
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="order-card__footer">
        {/* The footer only contains the admin button */}
        <button
          onClick={() => onAdminUpdate(order)}
          className="form__button form__button--primary"
        >
          Update Fulfillment
        </button>
      </div>
    </div>
  );
}

export default AdminOrderCard;
