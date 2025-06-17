import axios from "axios"

const API_URL = "http://localhost:8080/api"

const api = axios.create({
  baseURL: API_URL
})

// Set default Authorization header if token exists
api.interceptors.request.use(config => {
  const token = localStorage.getItem("SPPtoken")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const getUsers = () => api.get("/users")
export const getUserById = id => api.get(`/users/${id}`)
export const createUser = user => api.post("/users", user)
export const updateUser = (id, user) => api.put(`/users/${id}`, user)
export const deleteUser = id => api.delete(`/users/${id}`)
export const login = credentials => api.post("/login", credentials)
export const refreshToken = () => api.post("/refresh")

export default api
