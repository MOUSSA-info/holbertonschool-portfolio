// src/services/api.js
import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "",
});

// Intercepteur pour ajouter automatiquement le token JWT
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/* ------------------ Sécurité ------------------ */
export const getOverview = () => API.get("/api/security/overview");
export const analyzeSecurity = () => API.post("/api/security/analyze");

export const encryptFile = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return API.post("/api/security/encrypt", formData);
};

export const decryptFile = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return API.post("/api/security/decrypt", formData);
};

export const backupFile = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return API.post("/api/security/backup", formData);
};

export const generatePassword = () => {
  return API.get("/api/security/password-generator");
};
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
