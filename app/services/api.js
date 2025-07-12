import axios from "axios";

const API_URL = "http://localhost:8080/api";

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

// --- User & Authentication Functions ---
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

// --- Registration Functions ---
export const createUser = (user) => api.post("/users", user);
export const checkUsernameAvailability = (username) =>
  api.post("/users/checkRegUsername", { username });
export const checkEmailAvailability = (email) =>
  api.post("/users/checkRegEmail", { email });

// --- Category Functions ---
export const getCategoryById = (categoryId) =>
  api.get(`/categories/${categoryId}`);
export const createCategory = (categoryData) =>
  api.post("/categories", categoryData);
export const updateCategory = (categoryId, categoryData) =>
  api.put(`/categories/${categoryId}`, categoryData);
export const deleteCategory = (categoryId) =>
  api.delete(`/categories/${categoryId}`);

// --- Product & Image Functions ---
export const getProductById = (productId) => api.get(`/products/${productId}`);
export const createProduct = (productData) =>
  api.post("/products", productData);
export const updateProduct = (productId, productData) =>
  api.put(`/products/${productId}`, productData);
/**
 * Deletes a product by its ID.
 * @param {number} productId - The ID of the product to delete.
 */
export const deleteProduct = (productId) =>
  api.delete(`/products/${productId}`);
/**
 * Fetches all products belonging to a specific category.
 * @param {number} categoryId - The ID of the category.
 */
export const getProductsByCategory = (categoryId) =>
  api.get(`/products/category/${categoryId}`);
export const getImageById = (imageId) => api.get(`/images/${imageId}`);
export const updateImage = (imageId, imageData) =>
  api.put(`/images/${imageId}`, imageData);
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
export const getProductImages = (productId) =>
  api.get(`/images/product/${productId}`);
export const deleteImage = (imageId) => api.delete(`/images/${imageId}`);

// --- Order Functions ---
export const createOrder = (orderData) => api.post("/orders", orderData);
export const getAllOrders = () => api.get("/orders");
export const getOrderById = (orderId) => api.get(`/orders/${orderId}`);

// --- Payment Functions ---
export const createPayment = (orderId, paymentData) =>
  api.post(`/orders/${orderId}/payments`, paymentData);

// --- Fulfillment Functions ---
export const createFulfillment = (orderId, fulfillmentData) =>
  api.post(`/orders/${orderId}/fulfillment`, fulfillmentData);

export default api;
