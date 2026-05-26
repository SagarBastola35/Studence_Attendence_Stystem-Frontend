import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import axios from 'axios';
import App from "./App.js;
// TEMPORARY: Hardcode the production URL
const API_URL = 'https://studence-attendence-stystem-backend-3.onrender.com/api';
axios.defaults.baseURL = API_URL;

console.log('🚀 API URL:', API_URL);

// Add token to all requests
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`📤 ${config.method.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('📥 Response Error:', error.response?.status, error.config?.url);
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
