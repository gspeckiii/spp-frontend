// app/components/ProfileOrder.js

import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Page from "./Page";
import StateContext from "../context/StateContext";
import DispatchContext from "../context/DispatchContext";
import { getAllOrders, cancelOrder, updateFulfillment } from "../services/api";
import LoadingDotsIcon from "./LoadingDotsIcon";
import AddressModal from "./AddressModal";
import OrderCard from "./OrderCard";

function ProfileOrder() {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [view, setView] = useState("open"); // 'open' or 'closed'
  const [error, setError] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);

  useEffect(() => {
    async function fetchOrders() {
      if (!appState.loggedIn) {
        navigate("/");
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const response = await getAllOrders(view);
        setOrders(response.data);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Could not load your orders. Please try again later.");
        appDispatch({ type: "flashMessage", value: "Failed to load orders." });
      } finally {
        setIsLoading(false);
      }
    }
    fetchOrders();
  }, [view, appState.loggedIn, navigate, appDispatch]);

  const handleCancelOrder = async (orderId) => {
    if (
      window.confirm(
        "Are you sure you want to cancel this order? This action cannot be undone."
      )
    ) {
      try {
        await cancelOrder(orderId);
        appDispatch({
          type: "flashMessage",
          value: "Order cancelled successfully.",
        });
        setOrders((prevOrders) =>
          prevOrders.filter((order) => order.order_id !== orderId)
        );
      } catch (err) {
        const errorMessage =
          err.response?.data?.error || "Failed to cancel the order.";
        appDispatch({ type: "flashMessage", value: errorMessage });
      }
    }
  };

  const handleOpenAddressModal = (order) => {
    setEditingOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingOrder(null);
  };

  const handleUpdateAddress = async (addressData) => {
    try {
      const updatedFulfillment = await updateFulfillment(
        editingOrder.order_id,
        addressData
      );
      appDispatch({
        type: "flashMessage",
        value: "Address updated successfully!",
      });
      setOrders((prevOrders) =>
        prevOrders.map((order) => {
          if (order.order_id === editingOrder.order_id) {
            return { ...order, fulfillment: updatedFulfillment.data };
          }
          return order;
        })
      );
      handleCloseModal();
    } catch (err) {
      console.error("Error updating address:", err);
      appDispatch({
        type: "flashMessage",
        value: "Failed to update address. Please check your details.",
      });
    }
  };

  return (
    <Page title="My Orders">
      <div className="profile-orders">
        <h2 className="container__heading-main">Your Orders</h2>
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
            Order History
          </button>
        </div>

        {isLoading && <LoadingDotsIcon />}
        {error && <div className="profile-orders__status-message">{error}</div>}

        {!isLoading && !error && orders.length === 0 && (
          <p className="profile-orders__status-message">
            You have no {view} orders.
          </p>
        )}

        {!isLoading && !error && orders.length > 0 && (
          <div className="profile-orders__list">
            {orders.map((order) => (
              <OrderCard
                key={order.order_id}
                order={order}
                onCancel={handleCancelOrder}
                onEditAddress={handleOpenAddressModal}
              />
            ))}
          </div>
        )}

        {isModalOpen && editingOrder && (
          <AddressModal
            order={editingOrder}
            onClose={handleCloseModal}
            onSubmit={handleUpdateAddress}
          />
        )}
      </div>
    </Page>
  );
}

export default ProfileOrder;
