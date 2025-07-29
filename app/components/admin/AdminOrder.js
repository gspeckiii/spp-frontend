import React, { useState, useEffect, useContext } from "react";
import Page from "../Page";
import DispatchContext from "../../context/DispatchContext";
import { adminGetAllOrders, adminUpdateFulfillment } from "../../services/api";
import LoadingDotsIcon from "../LoadingDotsIcon";
// Import the new AdminOrderCard component
import AdminOrderCard from "./AdminOrderCard";
import AdminFulfillmentModal from "./AdminFulfillmentModal";

function AdminOrder() {
  const appDispatch = useContext(DispatchContext);

  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [view, setView] = useState("open");
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);

  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await adminGetAllOrders(view);
      setOrders(response.data);
    } catch (err) {
      console.error("Admin error fetching orders:", err);
      setError("Could not load orders. Please try again later.");
      appDispatch({ type: "flashMessage", value: "Failed to load orders." });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [view]);

  const handleOpenModal = (order) => {
    setEditingOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingOrder(null);
  };

  const handleModalSubmit = async (fulfillmentData) => {
    try {
      await adminUpdateFulfillment(editingOrder.order_id, fulfillmentData);
      appDispatch({
        type: "flashMessage",
        value: `Order #${editingOrder.order_id} updated successfully!`,
      });
      handleCloseModal();
      fetchOrders();
    } catch (err) {
      console.error("Error updating fulfillment:", err);
      appDispatch({
        type: "flashMessage",
        value: "Failed to update order. Please try again.",
      });
    }
  };

  return (
    <Page title="Manage Orders">
      <div className="profile-orders">
        <h2 className="container__heading-main">Manage All Orders</h2>
        <div className="profile-orders__view-toggle">
          <button
            onClick={() => setView("open")}
            className={`profile-orders__view-button ${
              view === "open" ? "profile-orders__view-button--active" : ""
            }`}
          >
            Open Orders
          </button>
          <button
            onClick={() => setView("closed")}
            className={`profile-orders__view-button ${
              view === "closed" ? "profile-orders__view-button--active" : ""
            }`}
          >
            Closed Orders
          </button>
        </div>

        {isLoading && <LoadingDotsIcon />}
        {error && <div className="profile-orders__status-message">{error}</div>}

        {!isLoading && !error && orders.length === 0 && (
          <p className="profile-orders__status-message">
            There are no {view} orders.
          </p>
        )}

        {!isLoading && !error && orders.length > 0 && (
          <div className="profile-orders__list">
            {/* Use the new AdminOrderCard component */}
            {orders.map((order) => (
              <AdminOrderCard
                key={order.order_id}
                order={order}
                onAdminUpdate={handleOpenModal}
              />
            ))}
          </div>
        )}

        {isModalOpen && editingOrder && (
          <AdminFulfillmentModal
            order={editingOrder}
            onClose={handleCloseModal}
            onSubmit={handleModalSubmit}
          />
        )}
      </div>
    </Page>
  );
}

export default AdminOrder;
