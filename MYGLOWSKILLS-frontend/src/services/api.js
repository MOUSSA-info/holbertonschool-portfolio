// src/services/api.js
import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api/v1",
});

// Intercepteur pour ajouter automatiquement le token JWT
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/* ------------------ Sécurité ------------------ */
export const getOverview = () => API.get("/security/overview");
export const analyzeSecurity = () => API.post("/security/analyze");

export const encryptFile = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return API.post("/security/encrypt", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const backupFile = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return API.post("/security/backup", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const generatePassword = () => API.get("/security/password-generator");

/* ------------------ Authentification ------------------ */
export const login = (email, password) => API.post("/auth/login", { email, password });
export const register = (name, email, password) => API.post("/auth/register", { name, email, password });

/* ------------------ Profil ------------------ */
export const updateProfile = (data) => API.put("/users/me", data);
export const getUsers = () => API.get("/users");
export const updateUserRole = (userId, role) => API.put(`/users/${userId}/role`, { role });

/* ------------------ Support ------------------ */
export const sendContactMessage = (data) => API.post("/support/contact", data);

export default API;
