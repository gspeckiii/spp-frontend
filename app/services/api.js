import axios from "axios";
import { API_URL } from "../config";

const api = axios.create({
  baseURL: API_URL,
});

// ==========================================================
// === REQUEST INTERCEPTOR (No Changes) =====================
// ==========================================================
// This interceptor adds the token to every outgoing request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("SPPtoken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ==========================================================
// === NEW: RESPONSE INTERCEPTOR FOR GLOBAL ERROR HANDLING ===
// ==========================================================
// This interceptor will check every API response for errors.
api.interceptors.response.use(
  // The first function handles successful responses - we just pass them through.
  (response) => response,

  // The second function handles all API errors.
  (error) => {
    // Check if the error is specifically for an expired token.
    // This relies on the backend sending a 401 status and a specific error message.
    if (
      error.response &&
      error.response.status === 401 &&
      error.response.data.error === "Token expired"
    ) {
      console.log("Axios Interceptor: Detected expired token. Forcing logout.");

      // Perform a clean logout by removing all user data from localStorage.
      // This is crucial to prevent the app from being in a broken state.
      localStorage.removeItem("SPPtoken");
      localStorage.removeItem("SPPusername");
      localStorage.removeItem("SPPavatar");
      localStorage.removeItem("SPPbio");
      localStorage.removeItem("SPPadmin");
      localStorage.removeItem("SPPuser_id");

      // Redirect to the homepage. The GlobalStateProvider will re-initialize
      // on page load and see that the user is no longer logged in.
      // We add a query parameter to show a helpful message on the homepage.
      window.location.href = "/?session_expired=true";
    }

    // For all other errors (like 404, 500, etc.), we don't handle them globally.
    // We let them continue to the component's .catch() block so they can be
    // handled on a case-by-case basis (e.g., showing a "Not Found" message).
    return Promise.reject(error);
  }
);

// ==========================================================
// === ALL API SERVICE FUNCTIONS (No Changes) =================
// ==========================================================

// --- User & Authentication ---
export const getUsers = () => api.get("/users");
export const getUserById = (id) => api.get(`/users/${id}`);
export const updateUser = (id, user) => api.put(`/users/${id}`, user);
export const deleteUser = (id) => api.delete(`/users/${id}`);
export const login = (credentials) => api.post("/users/login", credentials);
export const refreshToken = () => api.post("/refresh");
export const requestPasswordReset = (email) =>
  api.post("/users/request-password-reset", { email });
export const resetPassword = (token, newPassword) =>
  api.post("/users/reset-password", { token, newPassword });
export const setRefreshInterval = (userId, refreshInterval) =>
  api.put(`/users/${userId}/refresh-interval`, { refreshInterval });

// --- Registration ---
export const createUser = (user) => api.post("/users", user);
export const checkUsernameAvailability = (username) =>
  api.post("/users/checkRegUsername", { username });
export const checkEmailAvailability = (email) =>
  api.post("/users/checkRegEmail", { email });

// --- Categories ---
export const getAllCategories = () => api.get("/categories");
export const getCategoryById = (categoryId) =>
  api.get(`/categories/${categoryId}`);
export const createCategory = (categoryData) =>
  api.post("/categories", categoryData);
export const updateCategory = (categoryId, categoryData) =>
  api.put(`/categories/${categoryId}`, categoryData);
export const deleteCategory = (categoryId) =>
  api.delete(`/categories/${categoryId}`);

// --- Products ---
export const getProductsByCategory = (categoryId, filter = "current") =>
  api.get(`/products/category/${categoryId}?filter=${filter}`);
export const getProductById = (productId) => api.get(`/products/${productId}`);
export const createProduct = (productData) =>
  api.post("/products", productData);
export const updateProduct = (productId, productData) =>
  api.put(`/products/${productId}`, productData);
export const deleteProduct = (productId) =>
  api.delete(`/products/${productId}`);

// --- Images ---
export const getProductImages = (productId) =>
  api.get(`/images/product/${productId}`);
export const getImageById = (imageId) => api.get(`/images/${imageId}`);
export const updateImage = (imageId, imageData) =>
  api.put(`/images/${imageId}`, imageData);
export const deleteImage = (imageId) => api.delete(`/images/${imageId}`);
export const updateCategoryImage = (categoryId, formData) => {
  return api.put(`/images/category/${categoryId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
export const addProductImages = (productId, formData) => {
  return api.post(`/images/product/${productId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// --- Orders, Payments, Fulfillments ---
export const createOrder = (orderData) => api.post("/orders", orderData);
export const getOrderById = (orderId) => api.get(`/orders/${orderId}`);
export const createPaymentIntentForOrder = (orderId) =>
  api.post(`/orders/${orderId}/create-payment-intent`);
export const createFulfillment = (orderId, fulfillmentData) =>
  api.post(`/orders/${orderId}/fulfillment`, fulfillmentData);
export const getAllOrders = (statusFilter = "open") =>
  api.get(`/orders?status=${statusFilter}`);
export const cancelOrder = (orderId) => api.put(`/orders/${orderId}/cancel`);
export const updateFulfillment = (orderId, fulfillmentData) =>
  api.put(`/orders/${orderId}/fulfillment`, fulfillmentData);

// --- Admin ---
export const adminGetAllOrders = (statusFilter = "open") =>
  api.get(`/admin/orders?status=${statusFilter}`);
export const adminUpdateFulfillment = (orderId, fulfillmentData) =>
  api.put(`/admin/orders/${orderId}/fulfillment`, fulfillmentData);

export default api;
