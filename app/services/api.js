import axios from "axios";
import { API_URL } from "../config";

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("SPPtoken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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
export const getAllCategories = () => api.get("/categories"); // Added for completeness
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
// ... (keep all your existing functions)

// --- Payments, Orders, Fulfillments ---
export const createOrder = (orderData) => api.post("/orders", orderData);
export const getAllOrders = () => api.get("/orders");
export const getOrderById = (orderId) => api.get(`/orders/${orderId}`);

// === NEW/MODIFIED FUNCTION ===
// This function calls the new endpoint we created on the backend.
export const createPaymentIntentForOrder = (orderId) =>
  api.post(`/orders/${orderId}/create-payment-intent`);

// This old function is now deprecated and can be removed or commented out.
// The webhook on the backend handles creating the payment record.
// export const createPayment = (orderId, paymentData) => ...

export const createFulfillment = (orderId, fulfillmentData) =>
  api.post(`/orders/${orderId}/fulfillment`, fulfillmentData);

export default api;
