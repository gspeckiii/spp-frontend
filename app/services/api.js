// /services/api.js

import axios from "axios";

const API_URL = "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_URL,
});

// Your existing interceptor is perfect and will handle auth for all requests.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("SPPtoken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- Existing User Functions ---
export const getUsers = () => api.get("/users");
export const getUserById = (id) => api.get(`/users/${id}`);
export const createUser = (user) => api.post("/users", user);
export const updateUser = (id, user) => api.put(`/users/${id}`, user);
export const deleteUser = (id) => api.delete(`/users/${id}`);
export const login = (credentials) => api.post("/users/login", credentials);
export const refreshToken = () => api.post("/refresh");

// === NEW ORDER-RELATED FUNCTIONS ===

/**
 * Creates the main order record.
 * @param {object} orderData - e.g., { items: [...], total_amount: ... }
 */
export const createOrder = (orderData) => api.post("/orders", orderData);

/**
 * Creates a payment for a specific order.
 * @param {number} orderId - The ID of the order.
 * @param {object} paymentData - e.g., { payment_method_token: "..." }
 */
export const createPayment = (orderId, paymentData) =>
  api.post(`/orders/${orderId}/payments`, paymentData);

/**
 * Creates the fulfillment/shipping record for an order.
 * @param {number} orderId - The ID of the order.
 * @param {object} fulfillmentData - The shipping address object.
 */
export const createFulfillment = (orderId, fulfillmentData) =>
  api.post(`/orders/${orderId}/fulfillment`, fulfillmentData);

/**
 * Fetches all details for a single order, including its items.
 * @param {number} orderId - The ID of the order.
 */
export const getOrderById = (orderId) => api.get(`/orders/${orderId}`);

/**
 * Fetches all orders for the currently logged-in user.
 */
export const getAllOrders = () => api.get("/orders");

// The default export is the configured axios instance, which is fine.
export default api;
