import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import axios from 'axios';
import App from "./App.js;

// DIRECT HARDCODE - NO VARIABLES
const API_URL = 'https://studence-attendence-stystem-backend-3.onrender.com/api';
axios.defaults.baseURL = API_URL;

console.log('🔴 HARDCODED API URL:', API_URL);

// Force axios to use this URL for all requests
axios.interceptors.request.use(
  (config) => {
    config.baseURL = API_URL; // Force override
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`📤 ${config.method.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
