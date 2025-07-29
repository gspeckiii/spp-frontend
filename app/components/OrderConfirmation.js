import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Page from "./Page";
import LoadingDotsIcon from "./LoadingDotsIcon";
import { getOrderById } from "../services/api";

function OrderConfirmation() {
  const { orderId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const response = await getOrderById(orderId);
        setOrder(response.data);
      } catch (e) {
        console.error("Failed to fetch order details for confirmation page", e);
        setError(
          "Could not load your order details. Please check your order history."
        );
      } finally {
        setIsLoading(false);
      }
    }
    fetchOrder();
  }, [orderId]);

  if (isLoading) {
    return (
      <Page title="Loading...">
        <LoadingDotsIcon />
      </Page>
    );
  }

  if (error) {
    return (
      <Page title="Error">
        <p className="text-center text-danger">{error}</p>
      </Page>
    );
  }

  return (
    <Page title={`Order #${order.order_id} Confirmed`}>
      <div className="order-confirmation">
        <div className="order-confirmation__icon">✅</div>
        <h1 className="order-confirmation__heading">
          Thank You For Your Order!
        </h1>
        <p className="order-confirmation__lead">
          A confirmation email has been sent to <strong>{order.email}</strong>.
        </p>
        <p className="order-confirmation__text">
          Your order number is <strong>#{order.order_id}</strong>. We've
          received it and will begin processing it shortly.
        </p>

        <div className="order-confirmation__summary-box">
          <h3 className="order-confirmation__summary-title">Order Summary</h3>
          <ul className="order-confirmation__summary-list">
            {order.items.map((item) => (
              <li
                key={item.product_id}
                className="order-confirmation__summary-item"
              >
                <span>
                  {item.prod_name} (x{item.quantity})
                </span>
                <span>${parseFloat(item.price_at_purchase).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="order-confirmation__summary-total">
            <span>Total:</span>
            <span>${parseFloat(order.total_amount).toFixed(2)}</span>
          </div>
        </div>

        <div className="order-confirmation__actions">
          {/* Using Bootstrap's utility classes for the button is perfectly fine and often recommended */}
          <Link to="/profile-orders" className="form__button">
            View All My Orders
          </Link>
        </div>
      </div>
    </Page>
  );
}

export default OrderConfirmation;
