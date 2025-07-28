// app/components/OrderCard.js
import React, { useContext } from "react";
import StateContext from "../context/StateContext";
import { Link } from "react-router-dom";

function OrderCard({ order, onCancel, onEditAddress }) {
  const { urls } = useContext(StateContext);

  const getStatusClass = (status) => {
    // Trim the status string to remove whitespace before checking it
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
    // Use the safe getStatusClass function here as well
    const statusText = latestPayment.payment_status
      ? latestPayment.payment_status.trim()
      : "Unknown";
    return {
      text: statusText,
      class: getStatusClass(latestPayment.payment_status),
    };
  };

  const paymentInfo = getPaymentInfo();

  // The logic to trim whitespace is correct. The component was just crashing before it could run.
  const isAddressEditable =
    order.fulfillment?.fulfillment_status?.trim() === "unfulfilled";
  const isCancellable =
    isAddressEditable &&
    ["pending_payment", "processing"].includes(order.order_status?.trim());
  const needsPaymentRetry =
    paymentInfo.text === "failed" ||
    paymentInfo.text === "declined" ||
    paymentInfo.text === "Awaiting Payment";

  return (
    <div className="order-card">
      <div className="order-card__header">
        <div>
          <h5 className="order-card__id">Order #{order.order_id}</h5>
          {/* --- THE FIX IS HERE: toLocaleDateString() --- */}
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
                {order.fulfillment.tracking_number && (
                  <p className="order-card__detail-text">
                    Tracking:{" "}
                    <a href={`#tracking-${order.fulfillment.tracking_number}`}>
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
        {isAddressEditable && (
          <button
            onClick={() => onEditAddress(order)}
            className="form__button"
            style={{ backgroundColor: "#5bc0de" }}
          >
            Edit Address
          </button>
        )}
        {needsPaymentRetry && (
          <Link
            to={`/payment/${order.order_id}`}
            className="form__button"
            style={{ backgroundColor: "#f0ad4e" }}
          >
            {paymentInfo.text === "Awaiting Payment"
              ? "Pay Now"
              : "Retry Payment"}
          </Link>
        )}
        {isCancellable && (
          <button
            onClick={() => onCancel(order.order_id)}
            className="form__button"
            style={{ backgroundColor: "#d9534f" }}
          >
            Cancel Order
          </button>
        )}
      </div>
    </div>
  );
}

export default OrderCard;
