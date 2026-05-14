// src/api/axios.js

import axios from "axios";

const API = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// const API = axios.create({
//   baseURL: "https://diligent-optimism-backend.up.railway.app/api",
//   withCredentials: true,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });
// Request interceptor - attach token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor - handle 401
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      const pathname = window.location.pathname;
      if (pathname !== "/login" && pathname !== "/register") {
        window.location.replace("/login");
      }
    }
    return Promise.reject(error);
  },
);

export default API;
