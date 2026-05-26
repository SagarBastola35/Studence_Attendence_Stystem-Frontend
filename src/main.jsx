import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import axios from 'axios';
import App from "./App.js;

const API_URL = "https://studence-attendence-stystem-backend-3.onrender.com/api";
axios.defaults.baseURL = API_URL;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
