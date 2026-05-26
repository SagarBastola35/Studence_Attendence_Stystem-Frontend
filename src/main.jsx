import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import axios from 'axios';
import App from "./App.jsx";
axios.defaults.baseURL = 'http://localhost:5000/api';

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
